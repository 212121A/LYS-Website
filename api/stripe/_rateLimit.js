// Verteiltes Rate-Limit für die Website-Serverless-Functions (P2-3).
//
// Der bisherige In-Memory-Zähler gilt pro Function-Instanz/Region — bei mehreren
// warmen Instanzen verwässert das Limit. Mit `UPSTASH_REDIS_REST_URL/_TOKEN`
// zählt ein zentraler Redis (INCR + EXPIRE NX = fixes Fenster, TTL → Retry-After);
// ohne ENV bleibt exakt das bisherige In-Memory-Verhalten. Upstash-Netz-/HTTP-
// Fehler → fail-open (lieber ein Request durch als Checkout blockiert).
//
// Rückgabe wie das alte checkRateLimit: { allowed, retryAfterSec }.
// (Dateiname mit `_` → Vercel behandelt sie nicht als eigene Route.)

const memoryBuckets = new Map();

function memoryCheck(key, now, max, windowMs) {
  const bucket = memoryBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    if (memoryBuckets.size > 5000) {
      for (const [k, b] of memoryBuckets) if (now >= b.resetAt) memoryBuckets.delete(k);
    }
    return { allowed: true, retryAfterSec: 0 };
  }
  if (bucket.count >= max) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

async function upstashCheck(restUrl, token, key, max, windowMs, fetchImpl) {
  const redisKey = `rl:${key}`;
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const res = await fetchImpl(`${restUrl.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["EXPIRE", redisKey, String(windowSec), "NX"],
      ["TTL", redisKey],
    ]),
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const parsed = await res.json();
  const count = Number(parsed?.[0]?.result);
  if (!Number.isFinite(count)) throw new Error("Upstash: unerwartete Antwort");
  if (count <= max) return { allowed: true, retryAfterSec: 0 };
  const ttl = Number(parsed?.[2]?.result);
  return { allowed: false, retryAfterSec: Number.isFinite(ttl) && ttl > 0 ? ttl : windowSec };
}

/**
 * @param {string} key  eindeutig pro Endpoint+IP, z. B. `checkout:1.2.3.4`
 * @param {{ max:number, windowMs:number, now?:number, env?:object, fetchImpl?:Function }} opts
 * @returns {Promise<{ allowed:boolean, retryAfterSec:number }>}
 */
export async function checkRateLimitDistributed(
  key,
  { max, windowMs, now = Date.now(), env = process.env, fetchImpl } = {}
) {
  const doFetch = fetchImpl || fetch;
  const restUrl = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!restUrl || !token) return memoryCheck(key, now, max, windowMs);
  try {
    return await upstashCheck(restUrl, token, key, max, windowMs, doFetch);
  } catch {
    return { allowed: true, retryAfterSec: 0 };
  }
}

/** Client-IP hinter Vercel: erster Eintrag in x-forwarded-for. */
export function clientIpOf(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0].trim();
  if (Array.isArray(fwd) && fwd.length > 0) return String(fwd[0]).split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}
