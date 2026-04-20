import Stripe from "stripe";

// Server-seitige Preisautoritaet: alle Preise sind in Cent (EUR).
// Cart-IDs aus dem Frontend werden gegen diese Whitelist validiert.
// number = Menue-Abkuerzung (wird ans Kitchen-Dashboard durchgereicht).
const PRODUCTS = {
  v1: { number: "1", name: "Nem Ran", price: 400 },
  v2: { number: "2", name: "Mini Frühlingsrollen (vegan)", price: 200 },

  c1: { number: "c1", name: "Gemüse Thai Curry", price: 700 },
  c2: { number: "c2", name: "Hähnchenfleisch Thai Curry", price: 900 },
  c3: { number: "c3", name: "Paniertes Hähnchenfleisch Thai Curry", price: 1050 },
  c4: { number: "c4", name: "Fisch Thai Curry", price: 1050 },
  c5: { number: "c5", name: "Ente Thai Curry", price: 1150 },
  c6: { number: "c6", name: "Garnelen Thai Curry", price: 1150 },
  c7: { number: "c7", name: "Tofu Thai Curry", price: 850 },

  s1: { number: "s1", name: "Gemüse Süß-Sauer", price: 700 },
  s2: { number: "s2", name: "Hähnchenfleisch Süß-Sauer", price: 900 },
  s3: { number: "s3", name: "Paniertes Hähnchenfleisch Süß-Sauer", price: 1050 },
  s4: { number: "s4", name: "Fisch Süß-Sauer", price: 1050 },
  s5: { number: "s5", name: "Ente Süß-Sauer", price: 1150 },
  s6: { number: "s6", name: "Garnelen Süß-Sauer", price: 1150 },
  s7: { number: "s7", name: "Tofu Süß-Sauer", price: 850 },

  b1: { number: "b1", name: "Gemüse Soja", price: 700 },
  b2: { number: "b2", name: "Hähnchenfleisch Soja", price: 900 },
  b3: { number: "b3", name: "Paniertes Hähnchenfleisch Soja", price: 1050 },
  b4: { number: "b4", name: "Fisch Soja", price: 1050 },
  b5: { number: "b5", name: "Ente Soja", price: 1150 },
  b6: { number: "b6", name: "Garnelen Soja", price: 1150 },
  b7: { number: "b7", name: "Tofu Soja", price: 850 },

  e1: { number: "e1", name: "Gemüse Erdnuss", price: 700 },
  e2: { number: "e2", name: "Hähnchenfleisch Erdnuss", price: 900 },
  e3: { number: "e3", name: "Paniertes Hähnchenfleisch Erdnuss", price: 1050 },
  e4: { number: "e4", name: "Fisch Erdnuss", price: 1050 },
  e5: { number: "e5", name: "Ente Erdnuss", price: 1150 },
  e6: { number: "e6", name: "Garnelen Erdnuss", price: 1150 },
  e7: { number: "e7", name: "Tofu Erdnuss", price: 850 },

  m1: { number: "m1", name: "Gemüse Matcha Soße", price: 700 },
  m2: { number: "m2", name: "Hähnchenfleisch Matcha Soße", price: 900 },
  m3: { number: "m3", name: "Paniertes Hähnchenfleisch Matcha Soße", price: 1050 },
  m4: { number: "m4", name: "Fisch Matcha Soße", price: 1050 },
  m5: { number: "m5", name: "Ente Matcha Soße", price: 1150 },
  m6: { number: "m6", name: "Garnelen Matcha Soße", price: 1150 },
  m7: { number: "m7", name: "Tofu Matcha Soße", price: 850 },

  m8: { number: "m8", name: "Gemüse Mango Soße", price: 700 },
  m9: { number: "m9", name: "Hähnchenfleisch Mango Soße", price: 900 },
  m10: { number: "m10", name: "Paniertes Hähnchenfleisch Mango Soße", price: 1050 },
  m11: { number: "m11", name: "Fisch Mango Soße", price: 1050 },
  m12: { number: "m12", name: "Ente Mango Soße", price: 1150 },
  m13: { number: "m13", name: "Garnelen Mango Soße", price: 1150 },
  m14: { number: "m14", name: "Tofu Mango Soße", price: 850 },

  a1: { number: "a1", name: "Gebratener Reis mit Ei & Gemüse", price: 700 },
  a2: { number: "a2", name: "Gebratener Reis Hähnchenfleisch", price: 850 },
  a3: { number: "a3", name: "Gebratener Reis Paniertes Hähnchenfleisch", price: 1050 },
  a4: { number: "a4", name: "Gebratener Reis Fisch", price: 1050 },
  a5: { number: "a5", name: "Gebratener Reis Ente", price: 1150 },
  a6: { number: "a6", name: "Gebratener Reis Garnelen", price: 1000 },
  a7: { number: "a7", name: "Gebratener Reis Tofu", price: 850 },

  // Nudel-/Reisboxen: Cart-IDs im Format `<baseId>-<size>-<type>`.
  // `number` = Kurzcode fuer Kitchen-Dashboard (z.B. GN2 = Grosse Nudelbox Haehnchen).
  "box-gemuse-small-nudel": { number: "KN1", name: "Kleine Nudelbox Gemüse", price: 400 },
  "box-gemuse-small-reis": { number: "KR1", name: "Kleine Reisbox Gemüse", price: 400 },
  "box-gemuse-large-nudel": { number: "GN1", name: "Große Nudelbox Gemüse", price: 500 },
  "box-gemuse-large-reis": { number: "GR1", name: "Große Reisbox Gemüse", price: 500 },
  "box-huehnchen-small-nudel": { number: "KN2", name: "Kleine Nudelbox Hähnchen", price: 450 },
  "box-huehnchen-small-reis": { number: "KR2", name: "Kleine Reisbox Hähnchen", price: 450 },
  "box-huehnchen-large-nudel": { number: "GN2", name: "Große Nudelbox Hähnchen", price: 600 },
  "box-huehnchen-large-reis": { number: "GR2", name: "Große Reisbox Hähnchen", price: 600 },
  "box-pan-huehnchen-large-nudel": { number: "GN3", name: "Große Nudelbox Paniertes Hähnchen", price: 600 },
  "box-pan-huehnchen-large-reis": { number: "GR3", name: "Große Reisbox Paniertes Hähnchen", price: 600 },
  "box-fisch-large-nudel": { number: "GN4", name: "Große Nudelbox Fisch", price: 600 },
  "box-fisch-large-reis": { number: "GR4", name: "Große Reisbox Fisch", price: 600 },
  "box-fruehlingsrollen-large-nudel": { number: "GN5", name: "Große Nudelbox Vegetarische Frühlingsrollen", price: 600 },
  "box-fruehlingsrollen-large-reis": { number: "GR5", name: "Große Reisbox Vegetarische Frühlingsrollen", price: 600 },
  "box-tofu-large-nudel": { number: "GN6", name: "Große Nudelbox Tofu", price: 800 },
  "box-tofu-large-reis": { number: "GR6", name: "Große Reisbox Tofu", price: 800 },
  "box-garnelen-large-nudel": { number: "GN7", name: "Große Nudelbox Garnelen", price: 1000 },
  "box-garnelen-large-reis": { number: "GR7", name: "Große Reisbox Garnelen", price: 1000 },

  "g-soft": { number: "GD1", name: "Softgetränke", price: 300 },
  "g-wasser": { number: "GD2", name: "Wasser", price: 200 },

  "m-latte": { number: "01", name: "Matcha Latte (warm/kalt)", price: 450 },
  "m-dau": { number: "02", name: "Matcha dâu (Erdbeere)", price: 500 },
  "m-xoai": { number: "03", name: "Matcha xoài (Mango)", price: 500 },
  "m-rasp": { number: "04", name: "Matcha Raspberry (Himbeere)", price: 500 },
  "m-vietquat": { number: "05", name: "Matcha việt quất (Blaubeere)", price: 500 },
  "m-dua-ananas": { number: "06", name: "Matcha dứa (Ananas)", price: 500 },
  "m-vani": { number: "07", name: "Matcha vani (Vanille)", price: 500 },
  "m-dua-cloud": { number: "08", name: "Matcha dừa (Coconut Cloud)", price: 550 },

  "cp-den": { number: "09", name: "Cà phê đen", price: 450 },
  "cp-sua-da": { number: "10", name: "Cà phê sữa đá", price: 500 },
  "cp-den-da": { number: "11", name: "Cà phê đen đá", price: 450 },
  "cp-nau-da": { number: "12", name: "Cà phê nâu đá", price: 500 },
  "cp-dua": { number: "13", name: "Cà phê dừa", price: 500 },
  "cp-bac-xiu": { number: "14", name: "Bạc xỉu", price: 600 },

  "t-chanh-leo": { number: "15", name: "Trà chanh leo", price: 600 },
  "t-vai": { number: "16", name: "Trà vải", price: 600 },
  "t-dao": { number: "17", name: "Trà đào cam sả", price: 600 },
  "t-chanh-simple": { number: "18", name: "Trà chanh", price: 600 },

  "soda-chanh": { number: "19", name: "Soda chanh", price: 600 },
  "soda-dao": { number: "20", name: "Soda đào", price: 600 },
  "soda-vai": { number: "21", name: "Soda vải", price: 600 },
  "soda-dua": { number: "22", name: "Soda dứa", price: 600 },

  "smoothie-all": { number: "23", name: "Smoothie", price: 650 },

  "bowl-oats1": { number: "24", name: "Overnight Oats", price: 650 },
  "bowl-oats2": { number: "25", name: "Overnight Oats mit Chia", price: 650 },
  "bowl-chia": { number: "29", name: "Chia Pudding", price: 650 },

  "kem-matcha": { number: "30", name: "Matcha Latte mit Matcha Eis", price: 650 },
  "kem-vani": { number: "31", name: "Matcha Latte mit Vanilleeis", price: 650 },

  "kids-schoko": { number: "32", name: "Schoko Latte", price: 450 },
};

// Box-Soßen: Cart-IDs wie `box-huehnchen-large-nudel-soja` werden auf die
// Basis-Box gemappt. Preis bleibt identisch (Soßen sind inklusive), Name und
// Kitchen-Dashboard-Kürzel bekommen ein Suffix mit der gewählten Soße.
// Soßen-Suffix wird 1:1 an den Kitchen-Dashboard-Code angehaengt
// (z.B. "GN4-Sojasoße"), damit keine Kurzcodes (S/SS/C) missverstanden
// werden koennen.
const BOX_SAUCE_SUFFIXES = {
  "-soja": { code: "Sojasoße", label: "Sojasoße" },
  "-suesssauer": { code: "Süßsauersoße", label: "Süßsauersoße" },
  "-curry": { code: "Thaicurry mit Kokosmilch", label: "Thaicurry mit Kokosmilch" },
};

function resolveProduct(id) {
  if (typeof id !== "string" || id.length === 0) return null;
  const direct = PRODUCTS[id];
  if (direct) return { product: direct, sauce: null };

  for (const [suffix, sauce] of Object.entries(BOX_SAUCE_SUFFIXES)) {
    if (id.endsWith(suffix)) {
      const baseId = id.slice(0, -suffix.length);
      if (!baseId.startsWith("box-")) continue;
      const base = PRODUCTS[baseId];
      if (!base) continue;
      return {
        product: {
          number: `${base.number}-${sauce.code}`,
          name: `${base.name} • ${sauce.label}`,
          price: base.price,
        },
        sauce,
      };
    }
  }

  return null;
}

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
        const resolved = resolveProduct(id);
        if (!resolved) {
          invalidItemIds.push(id || "unknown");
          return null;
        }

        const { product } = resolved;
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
      const resolved = resolveProduct(id);
      const product = resolved?.product;
      const number =
        (typeof item?.number === "string" && item.number.trim()) ||
        product?.number ||
        "";
      const baseName =
        (typeof item?.name === "string" && item.name.trim()) ||
        product?.name ||
        id;
      // Abkuerzung ans Kitchen-Dashboard durchreichen: einerseits als
      // eigenes Feld `number`, andererseits dem Display-Name voranstellen
      // (z.B. "01 Matcha Latte (warm/kalt)"), damit sie auch dann sichtbar
      // ist, wenn das Dashboard nur `name` rendert.
      const displayName = number ? `${number} ${baseName}` : baseName;
      return {
        id,
        number,
        name: displayName,
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
