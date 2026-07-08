// P1-7: Server-Endpoint für die Bestellnummer der Success-Seite.
//
// Vorher pollte Success.tsx die orders-Tabelle direkt mit dem anon-Key auf
// status='neu' — was die RLS (anon nur für 'in_zubereitung'/'abholbereit')
// blockiert, sodass die Nummer nie erschien. Dieser Endpoint liest die Nummer
// serverseitig mit dem service_role-Key (RLS-unabhängig) und macht damit auch
// den Weg frei, den anon-Lockdown (Migration 006) scharf zu schalten.

import { checkRateLimitDistributed, clientIpOf } from "./_rateLimit.js";

// Nur cs_-Session-IDs zulassen (cs_test_/cs_live_/cs_counter_...).
const SESSION_ID_RE = /^cs_[A-Za-z0-9_]{8,200}$/;

// Rate Limit: 30 Requests / 60 s / IP (Poll ≈ 15/Session → normal ok, bremst
// Enumeration). Verteilt über Upstash, sonst In-Memory (siehe ./_rateLimit.js).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rl = await checkRateLimitDistributed(`order-number:${clientIpOf(req)}`, {
    max: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });
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
