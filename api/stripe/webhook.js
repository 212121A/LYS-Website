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

function shortOrderNumber(sessionId) {
  const tail = String(sessionId || "").slice(-6).toUpperCase()
  return `LYS-${tail || "000000"}`
}

function formatEuros(cents) {
  const value = ((cents || 0) / 100).toFixed(2).replace(".", ",")
  return `${value} €`
}

function renderEmailHtml({ orderNumber, name, items, total, note }) {
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
            <tr>
              <td style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#3b2f24;padding-bottom:24px;">${escapeHtml(orderNumber)}</td>
            </tr>
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
        const orderNumber = shortOrderNumber(session.id)
        const total = formatEuros(session.amount_total)
        const name = metadata.customerName || session.customer_details?.name || ""
        const note = metadata.note || ""

        const resend = new Resend(apiKey)
        await resend.emails.send({
          from: fromAddress,
          to: email,
          subject: `Deine Bestellung bei LYS Noodle Box — ${orderNumber}`,
          html: renderEmailHtml({ orderNumber, name, items, total, note }),
        })
        console.log("Confirmation email sent to", email, "order", orderNumber)
      } catch (err) {
        // Don't fail the webhook on mail-send error — Stripe would retry the whole event
        console.error("Failed to send confirmation email:", err)
      }
    }
  }

  res.json({ received: true })
}
