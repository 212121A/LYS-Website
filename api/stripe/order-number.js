// P1-7: Server-Endpoint für die Bestellnummer der Success-Seite.
//
// Vorher pollte Success.tsx die orders-Tabelle direkt mit dem anon-Key auf
// status='neu' — was die RLS (anon nur für 'in_zubereitung'/'abholbereit')
// blockiert, sodass die Nummer nie erschien. Dieser Endpoint liest die Nummer
// serverseitig mit dem service_role-Key (RLS-unabhängig) und macht damit auch
// den Weg frei, den anon-Lockdown (Migration 006) scharf zu schalten.

// Nur cs_-Session-IDs zulassen (cs_test_/cs_live_/cs_counter_...).
const SESSION_ID_RE = /^cs_[A-Za-z0-9_]{8,200}$/;

// In-Memory Rate Limit (pro Function-Instance). Poll = 15 Requests/Session →
// 30/min lässt normalen Betrieb durch, bremst Enumeration.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitBuckets = new Map();

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0].trim();
  if (Array.isArray(fwd) && fwd.length > 0) return String(fwd[0]).split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function checkRateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    if (rateLimitBuckets.size > 5000) {
      for (const [k, b] of rateLimitBuckets) if (now >= b.resetAt) rateLimitBuckets.delete(k);
    }
    return { allowed: true };
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { allowed: true };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rl = checkRateLimit(req);
  if (!rl.allowed) {
    res.setHeader("Retry-After", String(rl.retryAfterSec));
    return res.status(429).json({ order_number: null });
  }

  const sessionId = typeof req.query?.session_id === "string" ? req.query.session_id : "";
  if (!SESSION_ID_RE.test(sessionId)) {
    return res.status(400).json({ order_number: null, error: "Invalid session_id" });
  }

  res.setHeader("Cache-Control", "no-store");

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn("[order-number] Supabase env fehlt");
    return res.status(200).json({ order_number: null });
  }

  try {
    const endpoint = `${url}/rest/v1/orders?stripe_session_id=eq.${encodeURIComponent(
      sessionId,
    )}&select=order_number&limit=1`;
    const r = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (r.ok) {
      const rows = await r.json();
      const num = Array.isArray(rows) ? rows[0]?.order_number : null;
      if (num !== undefined && num !== null && num !== "") {
        return res.status(200).json({ order_number: String(num) });
      }
    }
  } catch (err) {
    // Poll-freundlich: transienter Fehler → null statt 500, Client pollt weiter.
    console.error("[order-number] fetch error:", err?.message ?? err);
  }

  return res.status(200).json({ order_number: null });
}
