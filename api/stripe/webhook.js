import Stripe from "stripe"
import { buffer } from "micro"
import { Resend } from "resend"

export const config = { api: { bodyParser: false } }

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function parseItems(metadata) {
  if (metadata.items_count) {
    const count = Number.parseInt(metadata.items_count, 10) || 0
    const all = []
    for (let i = 1; i <= count; i++) {
      try {
        const chunk = JSON.parse(metadata[`items_${i}`] || "[]")
        if (Array.isArray(chunk)) all.push(...chunk)
      } catch {}
    }
    return all
  }
  if (metadata.items) {
    try {
      const items = JSON.parse(metadata.items)
      if (Array.isArray(items)) return items
    } catch {}
  }
  return []
}

function supabaseEnv() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return { url, key }
}

function supabaseHeaders(env) {
  return {
    apikey: env.key,
    Authorization: `Bearer ${env.key}`,
    "Content-Type": "application/json",
  }
}

// Best-effort Ops-Event fuer den Health-Hub (P2-1). Blockiert nie und wirft nie —
// ein fehlgeschlagenes Logging darf Bestellung/Mail nicht gefaehrden. Die Tabelle
// ops_events wird separat angelegt (sql/bestell-db/ops_events_und_grants.sql im
// Health-Hub-Repo); bis dahin laeuft der Insert ins Leere (gefangen).
async function logOpsEvent(eventType, detail) {
  const env = supabaseEnv()
  if (!env) return
  try {
    await fetch(`${env.url}/rest/v1/ops_events`, {
      method: "POST",
      headers: { ...supabaseHeaders(env), Prefer: "return=minimal" },
      body: JSON.stringify({
        source: "website-webhook",
        event_type: eventType,
        detail: detail ?? {},
      }),
    })
  } catch (err) {
    console.error("[ops_events] Logging fehlgeschlagen:", err?.message ?? err)
  }
}

// Echte Bestellnummer aus Supabase holen (von n8n via order_counter erzeugt
// und nach orders.order_number geschrieben — dieselbe Quelle wie die
// Success-Seite). Kurzes Polling, weil n8n die Zeile erst ~Sekunden nach dem
// checkout.session.completed-Event schreibt. Bewusst deutlich unter Stripes
// ~10s Webhook-Timeout. Gibt null zurueck, wenn (noch) nicht vorhanden — dann
// wird KEINE (falsche) Nummer in die Mail geschrieben.
async function fetchOrderNumber(sessionId, attempts = 5, delayMs = 1200) {
  const env = supabaseEnv()
  if (!env) {
    console.warn("[order_number] Supabase env fehlt — kann Nummer nicht lesen")
    return null
  }
  const endpoint = `${env.url}/rest/v1/orders?stripe_session_id=eq.${encodeURIComponent(
    sessionId,
  )}&select=order_number`
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(endpoint, {
        headers: { apikey: env.key, Authorization: `Bearer ${env.key}` },
      })
      if (res.ok) {
        const rows = await res.json()
        const num = Array.isArray(rows) ? rows[0]?.order_number : null
        if (num !== undefined && num !== null && num !== "") return String(num)
      }
    } catch (err) {
      console.error("[order_number] fetch error:", err?.message ?? err)
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
  console.warn("[order_number] nicht rechtzeitig gefunden fuer session", sessionId)
  return null
}

// Nummernvergabe wie alle anderen Kanaele: dieselbe RPC, nie selbst zaehlen.
// Live-RPC liefert eine Zeile { order_number } (der n8n-BNR-Knoten liest genau
// das) — zur Sicherheit auch Skalar/current_number akzeptieren.
async function drawOrderNumber(env) {
  const res = await fetch(`${env.url}/rest/v1/rpc/next_order_number`, {
    method: "POST",
    headers: supabaseHeaders(env),
    body: "{}",
  })
  if (!res.ok) throw new Error(`next_order_number RPC ${res.status}`)
  const data = await res.json()
  const row = Array.isArray(data) ? data[0] : data
  const num =
    typeof row === "number" ? row : (row?.order_number ?? row?.current_number)
  if (num === undefined || num === null) {
    throw new Error("next_order_number: keine Nummer in der Antwort")
  }
  return num
}

// P0-2-Fallback: n8n (/stripe-order-paid) hat die Bestellung nicht angelegt —
// ohne diesen Insert waere Geld eingezogen, aber die Kueche blind. Spalten
// exakt wie der n8n-Website-Insert. Idempotent ueber den partiellen
// Unique-Index orders_stripe_session_id_unique: verliert dieser Insert das
// Rennen gegen ein spaetes n8n, antwortet PostgREST 409 und die n8n-Zeile gilt.
async function createFallbackOrder(session) {
  const env = supabaseEnv()
  if (!env) {
    // Misskonfiguration, kein transienter Fehler — kein Stripe-Retry-Sturm.
    console.error("[reconciler] Supabase env fehlt — Fallback-Insert unmoeglich")
    return { orderNumber: null }
  }
  try {
    const orderNumber = await drawOrderNumber(env)
    const items = parseItems(session.metadata || {})
    const res = await fetch(`${env.url}/rest/v1/orders`, {
      method: "POST",
      headers: { ...supabaseHeaders(env), Prefer: "return=minimal" },
      body: JSON.stringify({
        order_number: orderNumber,
        items: JSON.stringify(items),
        pickup_time: session.metadata?.pickup_time || "",
        status: "neu",
        source: "website",
        stripe_session_id: session.id,
      }),
    })
    if (res.status === 409) {
      console.log("[reconciler] n8n war schneller — Duplikat ignoriert:", session.id)
      return { orderNumber: await fetchOrderNumber(session.id, 1, 0) }
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`orders-Insert ${res.status}: ${text.slice(0, 300)}`)
    }
    console.warn(
      "[reconciler] n8n-Ausfall ueberbrueckt — Fallback-Order angelegt:",
      orderNumber,
      session.id,
    )
    await logOpsEvent("n8n_fallback_used", { session: session.id, orderNumber: String(orderNumber) })
    return { orderNumber: String(orderNumber) }
  } catch (err) {
    console.error("[reconciler] Fallback-Insert fehlgeschlagen:", err?.message ?? err)
    return { retry: true }
  }
}

function formatEuros(cents) {
  const value = ((cents || 0) / 100).toFixed(2).replace(".", ",")
  return `${value} €`
}

function renderEmailHtml({ orderNumber, name, items, total, note, receiptUrl }) {
  const itemRows = items.length
    ? items
        .map(
          (it) =>
            `<tr><td style="padding:10px 0;color:#3b2f24;font-size:15px;border-bottom:1px solid rgba(150,120,80,0.18);">${escapeHtml(it.quantity)}× ${escapeHtml(it.name)}</td></tr>`,
        )
        .join("")
    : `<tr><td style="padding:10px 0;color:#6b5947;font-size:14px;font-style:italic;">(Bestelldetails siehe Stripe-Bestätigung)</td></tr>`

  const noteBlock = note
    ? `<tr><td style="padding-top:18px;font-size:13px;color:#6b5947;line-height:1.5;"><strong style="color:#3b2f24;">Anmerkung:</strong> ${escapeHtml(note)}</td></tr>`
    : ""

  const receiptBlock = receiptUrl
    ? `<tr><td align="center" style="padding-top:24px;"><a href="${escapeHtml(receiptUrl)}" target="_blank" style="display:inline-block;background:#a87146;color:#fbf3e1;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.5px;padding:13px 28px;border-radius:999px;">Stripe-Zahlungsbeleg ansehen</a></td></tr>`
    : ""

  const orderNumberBlock = orderNumber
    ? `<tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#3b2f24;padding-bottom:24px;">${escapeHtml(orderNumber)}</td></tr>`
    : `<tr><td style="font-size:14px;color:#6b5947;line-height:1.5;padding-bottom:24px;">Deine Bestellnummer wird dir auf dem Bestätigungsbildschirm angezeigt.</td></tr>`

  return `<!doctype html>
<html lang="de">
  <body style="margin:0;padding:0;background:#e9ddc7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#e9ddc7;padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fbf3e1;border-radius:20px;padding:40px 32px;">
            <tr>
              <td align="center" style="font-family:Georgia,'Times New Roman',serif;font-size:36px;letter-spacing:4px;color:#3b2f24;padding-bottom:4px;">LYS</td>
            </tr>
            <tr>
              <td align="center" style="font-size:11px;letter-spacing:6px;color:#7a6a55;padding-bottom:32px;">NOODLE BOX</td>
            </tr>
            <tr>
              <td style="font-size:11px;letter-spacing:3px;color:#a87146;text-transform:uppercase;padding-bottom:6px;">Bestellbestätigung</td>
            </tr>
            ${orderNumberBlock}
            <tr>
              <td style="font-size:15px;color:#3b2f24;padding-bottom:8px;">Hallo ${escapeHtml(name || "")},</td>
            </tr>
            <tr>
              <td style="font-size:15px;color:#3b2f24;line-height:1.6;padding-bottom:24px;">vielen Dank für deine Bestellung bei LYS Noodle Box. Hier ist deine Bestellübersicht:</td>
            </tr>
            <tr>
              <td style="padding:6px 0 0 0;border-top:1px solid rgba(150,120,80,0.25);">
                <table width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>
              </td>
            </tr>
            <tr>
              <td style="padding-top:18px;padding-bottom:28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:15px;font-weight:600;color:#3b2f24;">Gesamt</td>
                    <td align="right" style="font-size:16px;font-weight:700;color:#3b2f24;">${escapeHtml(total)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#3b2f24;color:#e9ddc7;border-radius:14px;padding:20px 22px;">
                <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9b89b;">Abholung</p>
                <p style="margin:0;font-size:15px;line-height:1.5;">Kappelgasse 2<br>73525 Schwäbisch Gmünd</p>
              </td>
            </tr>
            ${noteBlock}
            ${receiptBlock}
            <tr>
              <td style="padding-top:32px;font-size:13px;color:#7a6a55;line-height:1.6;text-align:center;">Bei Fragen einfach auf diese E-Mail antworten.<br>Wir freuen uns auf dich!</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = req.headers["stripe-signature"]
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    const rawBody = await buffer(req)
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    return res.status(400).json({ error: "Invalid signature" })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    console.log("Payment confirmed:", session.id)

    // P0-2: Erst sicherstellen, dass die Bestellung existiert — VOR der Mail.
    // Normalfall: n8n legt sie an, wir finden sie per Polling. Faellt n8n aus,
    // legen wir sie selbst an. Nur Website-Sessions (metadata.app) — der
    // geteilte Stripe-Account liefert hier auch Terminal-Events an.
    let orderNumber = await fetchOrderNumber(session.id, 4, 1000)
    if (!orderNumber && session.metadata?.app === "lys-website") {
      const fallback = await createFallbackOrder(session)
      if (fallback.retry) {
        // Transienter Fehler (Supabase/RPC nicht erreichbar): 500 → Stripe
        // stellt den Event erneut zu (bis zu 3 Tage). Mail wurde noch nicht
        // verschickt, es doppelt sich also nichts.
        await logOpsEvent("order_reconcile_failed", { session: session.id })
        return res
          .status(500)
          .json({ error: "Order-Reconciliation fehlgeschlagen — bitte Retry" })
      }
      orderNumber = fallback.orderNumber
    }

    const email = session.customer_details?.email || session.customer_email
    const apiKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.RESEND_FROM_EMAIL

    if (!email) {
      console.warn("No customer email on session — skipping confirmation mail", session.id)
    } else if (!apiKey || !fromAddress) {
      console.warn(
        "RESEND_API_KEY or RESEND_FROM_EMAIL missing — confirmation mail not sent",
        session.id,
      )
    } else {
      try {
        const metadata = session.metadata || {}
        const items = parseItems(metadata)
        const total = formatEuros(session.amount_total)
        const name = metadata.customerName || session.customer_details?.name || ""
        const note = metadata.note || ""

        // Stripe-Zahlungsbeleg (gehostete Quittung) holen — best effort.
        // receipt_url haengt am Charge, nicht an der Session; daher den
        // PaymentIntent mit latest_charge expanden. Schlaegt das fehl, geht
        // die Mail trotzdem raus, nur ohne Beleg-Link.
        let receiptUrl = null
        try {
          const piId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id
          if (piId) {
            const pi = await stripe.paymentIntents.retrieve(piId, {
              expand: ["latest_charge"],
            })
            receiptUrl = pi.latest_charge?.receipt_url ?? null
          }
        } catch (err) {
          console.error("Could not fetch Stripe receipt_url:", err?.message ?? err)
        }

        const resend = new Resend(apiKey)
        await resend.emails.send({
          from: fromAddress,
          to: email,
          subject: orderNumber
            ? `Deine Bestellung bei LYS Noodle Box — ${orderNumber}`
            : "Deine Bestellung bei LYS Noodle Box",
          html: renderEmailHtml({ orderNumber, name, items, total, note, receiptUrl }),
        })
        console.log("Confirmation email sent to", email, "order", orderNumber)
      } catch (err) {
        // Don't fail the webhook on mail-send error — Stripe would retry the whole event
        console.error("Failed to send confirmation email:", err)
        await logOpsEvent("resend_failed", {
          session: session.id,
          error: String(err?.message ?? err),
        })
      }
    }
  }

  res.json({ received: true })
}
