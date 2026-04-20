import Stripe from "stripe";

// Server-seitige Preisautoritaet: alle Preise sind in Cent (EUR).
// Cart-IDs aus dem Frontend werden gegen diese Whitelist validiert.
const PRODUCTS = {
  v1: { name: "Nem Ran", price: 400 },
  v2: { name: "Mini Frühlingsrollen (vegan)", price: 200 },

  c1: { name: "Gemüse Thai Curry", price: 700 },
  c2: { name: "Hähnchenfleisch Thai Curry", price: 900 },
  c3: { name: "Paniertes Hähnchenfleisch Thai Curry", price: 1050 },
  c4: { name: "Fisch Thai Curry", price: 1050 },
  c5: { name: "Ente Thai Curry", price: 1150 },
  c6: { name: "Garnelen Thai Curry", price: 1150 },
  c7: { name: "Tofu Thai Curry", price: 850 },

  s1: { name: "Gemüse Süß-Sauer", price: 700 },
  s2: { name: "Hähnchenfleisch Süß-Sauer", price: 900 },
  s3: { name: "Paniertes Hähnchenfleisch Süß-Sauer", price: 1050 },
  s4: { name: "Fisch Süß-Sauer", price: 1050 },
  s5: { name: "Ente Süß-Sauer", price: 1150 },
  s6: { name: "Garnelen Süß-Sauer", price: 1150 },
  s7: { name: "Tofu Süß-Sauer", price: 850 },

  b1: { name: "Gemüse Soja", price: 700 },
  b2: { name: "Hähnchenfleisch Soja", price: 900 },
  b3: { name: "Paniertes Hähnchenfleisch Soja", price: 1050 },
  b4: { name: "Fisch Soja", price: 1050 },
  b5: { name: "Ente Soja", price: 1150 },
  b6: { name: "Garnelen Soja", price: 1150 },
  b7: { name: "Tofu Soja", price: 850 },

  e1: { name: "Gemüse Erdnuss", price: 700 },
  e2: { name: "Hähnchenfleisch Erdnuss", price: 900 },
  e3: { name: "Paniertes Hähnchenfleisch Erdnuss", price: 1050 },
  e4: { name: "Fisch Erdnuss", price: 1050 },
  e5: { name: "Ente Erdnuss", price: 1150 },
  e6: { name: "Garnelen Erdnuss", price: 1150 },
  e7: { name: "Tofu Erdnuss", price: 850 },

  m1: { name: "Gemüse Matcha Soße", price: 700 },
  m2: { name: "Hähnchenfleisch Matcha Soße", price: 900 },
  m3: { name: "Paniertes Hähnchenfleisch Matcha Soße", price: 1050 },
  m4: { name: "Fisch Matcha Soße", price: 1050 },
  m5: { name: "Ente Matcha Soße", price: 1150 },
  m6: { name: "Garnelen Matcha Soße", price: 1150 },
  m7: { name: "Tofu Matcha Soße", price: 850 },

  m8: { name: "Gemüse Mango Soße", price: 700 },
  m9: { name: "Hähnchenfleisch Mango Soße", price: 900 },
  m10: { name: "Paniertes Hähnchenfleisch Mango Soße", price: 1050 },
  m11: { name: "Fisch Mango Soße", price: 1050 },
  m12: { name: "Ente Mango Soße", price: 1150 },
  m13: { name: "Garnelen Mango Soße", price: 1150 },
  m14: { name: "Tofu Mango Soße", price: 850 },

  a1: { name: "Gebratener Reis mit Ei & Gemüse", price: 700 },
  a2: { name: "Gebratener Reis Hähnchenfleisch", price: 850 },
  a3: { name: "Gebratener Reis Paniertes Hähnchenfleisch", price: 1050 },
  a4: { name: "Gebratener Reis Fisch", price: 1050 },
  a5: { name: "Gebratener Reis Ente", price: 1150 },
  a6: { name: "Gebratener Reis Garnelen", price: 1000 },
  a7: { name: "Gebratener Reis Tofu", price: 850 },

  "box-gemuse-small": { name: "Nudel-/Reisbox Gemüse (klein)", price: 400 },
  "box-gemuse-large": { name: "Nudel-/Reisbox Gemüse (groß)", price: 500 },
  "box-huehnchen-small": { name: "Nudel-/Reisbox Hähnchen (klein)", price: 450 },
  "box-huehnchen-large": { name: "Nudel-/Reisbox Hähnchen (groß)", price: 600 },
  "box-pan-huehnchen": { name: "Nudel-/Reisbox Paniertes Hähnchen", price: 600 },
  "box-fisch": { name: "Nudel-/Reisbox Fisch", price: 600 },
  "box-fruehlingsrollen": { name: "Nudel-/Reisbox Frühlingsrollen", price: 600 },
  "box-tofu": { name: "Nudel-/Reisbox Tofu", price: 800 },
  "box-garnelen": { name: "Nudel-/Reisbox Garnelen", price: 1000 },

  "g-soft": { name: "Softgetränke", price: 300 },
  "g-wasser": { name: "Wasser", price: 200 },
  "m-latte": { name: "Matcha Latte (warm/kalt)", price: 450 },
  "m-dau": { name: "Matcha dâu (Erdbeere)", price: 500 },
  "m-xoai": { name: "Matcha xoài (Mango)", price: 500 },
  "m-rasp": { name: "Matcha Raspberry (Himbeere)", price: 500 },
  "m-vietquat": { name: "Matcha việt quất (Blaubeere)", price: 500 },
  "m-dua-ananas": { name: "Matcha dứa (Ananas)", price: 500 },
  "m-vani": { name: "Matcha vani (Vanille)", price: 500 },
  "m-dua-cloud": { name: "Matcha dừa (Coconut Cloud)", price: 550 },
  "cp-den": { name: "Cà phê đen", price: 450 },
  "cp-sua-da": { name: "Cà phê sữa đá", price: 500 },
  "cp-den-da": { name: "Cà phê đen đá", price: 450 },
  "cp-nau-da": { name: "Cà phê nâu đá", price: 500 },
  "cp-dua": { name: "Cà phê dừa", price: 500 },
  "cp-bac-xiu": { name: "Bạc xỉu", price: 600 },
  "t-chanh-leo": { name: "Trà chanh leo", price: 600 },
  "t-vai": { name: "Trà vải", price: 600 },
  "t-dao": { name: "Trà đào cam sả", price: 600 },
  "t-chanh-simple": { name: "Trà chanh", price: 600 },
  "soda-chanh": { name: "Soda chanh", price: 600 },
  "soda-dao": { name: "Soda đào", price: 600 },
  "soda-vai": { name: "Soda vải", price: 600 },
  "soda-dua": { name: "Soda dứa", price: 600 },
  "smoothie-all": { name: "Smoothie", price: 650 },
  "bowl-oats1": { name: "Overnight Oats", price: 650 },
  "bowl-oats2": { name: "Overnight Oats mit Chia", price: 650 },
  "bowl-chia": { name: "Chia Pudding", price: 650 },
  "kem-matcha": { name: "Matcha Latte mit Matcha Eis", price: 650 },
  "kem-vani": { name: "Matcha Latte mit Vanilleeis", price: 650 },
  "kids-schoko": { name: "Schoko Latte", price: 450 },
};

// In-Memory Rate Limit (pro Function-Instance / pro Vercel-Region).
// Vercel KV waere robuster, vermeidet aber zusaetzliches Setup.
// Limit: max 20 Requests pro 60 Sekunden pro IP.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateLimitBuckets = new Map();

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  if (Array.isArray(fwd) && fwd.length > 0) {
    return String(fwd[0]).split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function checkRateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    cleanupExpiredBuckets(now);
    return { allowed: true };
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true };
}

function cleanupExpiredBuckets(now) {
  if (rateLimitBuckets.size < 1000) return;
  for (const [ip, bucket] of rateLimitBuckets) {
    if (now >= bucket.resetAt) rateLimitBuckets.delete(ip);
  }
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY not set");
  }
  return new Stripe(key, { apiVersion: "2025-03-31.basil" });
}

// Supabase ist optional. Wenn ENV-Vars fehlen oder das Paket nicht
// geladen werden kann, wird der Insert uebersprungen statt zu crashen.
// Dynamic import verhindert, dass ein Modul-Loading-Fehler die ganze
// Vercel Function killt (FUNCTION_INVOCATION_FAILED beim Cold Start).
// Gibt { client, status } zurueck, damit der Aufrufer weiss warum es
// evtl. nicht klappt.
async function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "[supabase] missing env vars:",
      !url ? "SUPABASE_URL" : "",
      !key ? "SUPABASE_SERVICE_ROLE_KEY" : "",
    );
    return { client: null, status: "missing_env" };
  }
  try {
    const mod = await import("@supabase/supabase-js");
    return { client: mod.createClient(url, key), status: "ok" };
  } catch (err) {
    console.error("[supabase] import/createClient failed:", err?.message ?? err);
    return { client: null, status: "import_failed" };
  }
}

function normalizeQuantity(value) {
  const qty = Math.floor(Number(value));
  if (!Number.isFinite(qty)) return 1;
  return Math.min(20, Math.max(1, qty));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const rate = checkRateLimit(req);
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfterSec));
    return res.status(429).json({ error: "Zu viele Anfragen. Bitte warte kurz." });
  }

  try {
    const stripe = getStripe();
    const {
      cartItems,
      currency = "eur",
      customer = {},
      orderType = "pickup",
      address = {},
      note = "",
      origin,
      metadata: requestMetadata = {},
    } = req.body ?? {};

    const itemsFromBody = Array.isArray(cartItems)
      ? cartItems
      : Array.isArray(req.body?.items)
        ? req.body.items
        : [];

    if (itemsFromBody.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const normalizedOrigin =
      typeof origin === "string" && /^https?:\/\//.test(origin)
        ? origin
        : `https://${req.headers.host}`;

    const invalidItemIds = [];
    const lineItems = itemsFromBody
      .map((item) => {
        const id = typeof item?.id === "string" ? item.id : "";
        const product = PRODUCTS[id];
        if (!product) {
          invalidItemIds.push(id || "unknown");
          return null;
        }

        return {
          price_data: {
            currency,
            unit_amount: product.price,
            product_data: { name: product.name },
          },
          quantity: normalizeQuantity(item?.quantity),
        };
      })
      .filter(Boolean);

    if (invalidItemIds.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid item id(s): ${invalidItemIds.join(", ")}` });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "No valid items" });
    }

    if (orderType === "delivery") {
      lineItems.push({
        price_data: {
          currency,
          unit_amount: 200,
          product_data: { name: "Delivery fee" },
        },
        quantity: 1,
      });
    }

    const normalizedItems = itemsFromBody.map((item) => {
      const id = typeof item?.id === "string" ? item.id : "";
      const product = PRODUCTS[id];
      return {
        id,
        name:
          (typeof item?.name === "string" && item.name.trim()) ||
          product?.name ||
          id,
        quantity: normalizeQuantity(item?.quantity),
      };
    });

    const sessionMetadata = {
      ...requestMetadata,
      customerName:
        requestMetadata.customerName ??
        (typeof customer.name === "string" ? customer.name : "unknown"),
      customerPhone:
        requestMetadata.customerPhone ??
        (typeof customer.phone === "string" ? customer.phone : "unknown"),
      orderType: requestMetadata.orderType ?? String(orderType),
      note: requestMetadata.note ?? (typeof note === "string" ? note : ""),
      address:
        requestMetadata.address ??
        (orderType === "delivery"
          ? JSON.stringify({
              street: address?.street ?? "",
              zip: address?.zip ?? "",
              city: address?.city ?? "",
            })
          : ""),
      pickup_time: requestMetadata.pickup_time ?? "",
      app: requestMetadata.app ?? "lys-website",
    };

    // Stripe-Metadata erlaubt max 500 Zeichen pro Wert (und max 50 Keys).
    // Items als JSON-Array speichern, damit das Kitchen Dashboard sie
    // direkt parsen kann ([{id,name,quantity}, ...]). Wenn der JSON-String
    // > 500 Zeichen ist, auf items_1, items_2, ... aufteilen. Jedes Chunk
    // ist selbst ein gueltiges JSON-Array, damit Konsumenten die Chunks
    // einzeln parsen und zusammenfuehren koennen.
    if (requestMetadata.items) {
      sessionMetadata.items = String(requestMetadata.items).slice(0, 500);
    } else {
      const fullJson = JSON.stringify(normalizedItems);
      if (fullJson.length <= 500) {
        sessionMetadata.items = fullJson;
      } else {
        const chunks = [];
        let currentChunk = [];
        for (const item of normalizedItems) {
          const candidate = JSON.stringify([...currentChunk, item]);
          if (candidate.length > 500 && currentChunk.length > 0) {
            chunks.push(JSON.stringify(currentChunk));
            currentChunk = [item];
          } else {
            currentChunk.push(item);
          }
        }
        if (currentChunk.length > 0) {
          chunks.push(JSON.stringify(currentChunk));
        }

        if (chunks.length === 1) {
          sessionMetadata.items = chunks[0];
        } else {
          sessionMetadata.items_count = String(chunks.length);
          chunks.forEach((chunk, i) => {
            sessionMetadata[`items_${i + 1}`] = chunk;
          });
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${normalizedOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${normalizedOrigin}/cancel`,
      customer_email:
        typeof customer.email === "string" ? customer.email : undefined,
      metadata: sessionMetadata,
    });

    // Pending Order in Supabase loggen. Best-effort: Checkout-Flow
    // wird nicht blockiert, wenn der Insert scheitert. Errors werden
    // IMMER geloggt (auch in Production), damit wir sie in den Vercel
    // Function Logs sehen koennen.
    let pendingOrderStatus = "skipped";
    let pendingOrderError = null;
    const { client: supabase, status: supaStatus } = await getSupabase();
    if (supabase) {
      try {
        const { error: insertErr } = await supabase
          .from("pending_orders")
          .insert({
            session_id: session.id,
            items: JSON.stringify(normalizedItems),
          });
        if (insertErr) {
          pendingOrderStatus = "insert_error";
          pendingOrderError = insertErr.message;
          console.error(
            "[pending_orders] insert failed:",
            insertErr.message,
            insertErr.details ?? "",
            insertErr.hint ?? "",
          );
        } else {
          pendingOrderStatus = "saved";
          console.log(
            "[pending_orders] saved session_id=",
            session.id,
            "items=",
            normalizedItems.length,
          );
        }
      } catch (err) {
        pendingOrderStatus = "insert_threw";
        pendingOrderError = err?.message ?? String(err);
        console.error("[pending_orders] insert threw:", err?.message ?? err);
      }
    } else {
      pendingOrderStatus = supaStatus;
      console.error(
        "[pending_orders] skipped (supabase unavailable):",
        supaStatus,
      );
    }

    return res.status(200).json({
      url: session.url,
      pending_order: {
        status: pendingOrderStatus,
        error: pendingOrderError,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message ?? "Stripe error" });
  }
}
