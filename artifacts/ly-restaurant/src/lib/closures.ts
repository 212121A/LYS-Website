/**
 * Temporäre Schließungen (z. B. Renovierung, Betriebsferien) — eine Wahrheit für
 * Hinweis-Banner, Checkout-Sperre und Abhol-Slots.
 *
 * Alle Zeitpunkte sind Ortszeit Europe/Berlin im Format "YYYY-MM-DDTHH:MM".
 * Sie werden als String lexikografisch verglichen — das funktioniert nur wegen
 * der festen Feldbreite (führende Nullen sind Pflicht).
 *
 * ⚠️ Der Server ist die Autorität: `api/stripe/create-checkout-session.js`
 * spiegelt dieselben Zeitpunkte und muss bei jeder Änderung mitgezogen werden.
 * Der Voice-Agent (ElevenLabs-Prompt + n8n-Knoten `VA - Bestelldaten
 * zusammenbauen`) kennt das Fenster ebenfalls separat.
 */

export interface Closure {
  /** Ab hier erscheint der Hinweis auf der Website. */
  announceFrom: string;
  /** Ab hier werden keine Bestellungen mehr angenommen. */
  orderStopAt: string;
  /** Ab hier läuft alles wieder normal (= 2 Std vor Öffnung, Vorbestellfenster). */
  orderResumeAt: string;
  /** Tage ohne Betrieb, "YYYY-MM-DD" — nur für die Anzeige. */
  closedDays: string[];
  /** Erster Tag mit regulärem Betrieb, "YYYY-MM-DD" — nur für die Anzeige. */
  reopenDay: string;
}

/**
 * Aktuell keine Schließung. Zuletzt: Arbeiten an den Stromleitungen, Mo 31.08.
 * und Di 01.09.2026, vorzeitig aufgehoben.
 *
 * Für die nächste Schließung hier einen Eintrag ergänzen und die drei anderen
 * Stellen mitziehen: api/stripe/create-checkout-session.js (Server-Autorität),
 * ElevenLabs-Agent-Prompt und die beiden n8n-Knoten (siehe Datei-Kopf).
 * Laufen die Kanäle absichtlich zu unterschiedlichen Zeiten, darf der Text in
 * `bannerOrders` nur noch über die Website sprechen, nicht über das Telefon.
 */
export const CLOSURES: Closure[] = [];

/** Aktueller Zeitpunkt in Europe/Berlin als "YYYY-MM-DDTHH:MM". */
export function berlinStamp(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  // hour kann bei Mitternacht "24" liefern — auf "00" normalisieren.
  const hour = String(Number(get("hour")) % 24).padStart(2, "0");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}`;
}

/** Schließung, während der gerade keine Bestellungen angenommen werden. */
export function activeClosure(now: Date = new Date()): Closure | undefined {
  const stamp = berlinStamp(now);
  return CLOSURES.find((c) => stamp >= c.orderStopAt && stamp < c.orderResumeAt);
}

/** Schließung, auf die gerade hingewiesen wird (Banner) — inkl. Vorlauf. */
export function announcedClosure(now: Date = new Date()): Closure | undefined {
  const stamp = berlinStamp(now);
  return CLOSURES.find((c) => stamp >= c.announceFrom && stamp < c.orderResumeAt);
}

/** "2026-08-24" → z. B. "Montag, 24. August" in der aktiven Sprache. */
export function formatClosureDay(isoDay: string, locale: string): string {
  const [year, month, day] = isoDay.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** "2026-08-23T21:00" → z. B. "Sonntag, 23. August um 21:00". */
export function formatClosureMoment(stamp: string, locale: string): string {
  const [isoDay, time] = stamp.split("T");
  const [year, month, day] = isoDay.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  // Als UTC bauen und in UTC formatieren: die Wanduhrzeit bleibt exakt die
  // angegebene, und Intl setzt Trennzeichen und Wortstellung sprachrichtig.
  return new Intl.DateTimeFormat(locale, {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, hour, minute)));
}
