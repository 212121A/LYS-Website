// Eröffnungsaktion: 20 % Rabatt auf alle Bestellungen bis einschließlich
// 14.06.2026 (23:59:59 Europe/Berlin, CEST = UTC+2). Danach automatisch aus.
//
// WICHTIG: Stichtag und Prozentsatz sind serverseitig in
// api/stripe/create-checkout-session.js gespiegelt (Preishoheit liegt beim
// Server). Bei Änderung beide Stellen anpassen.

export const PROMO_PERCENT = 20;

// Anzeige-Label für Banner/Hinweise.
export const PROMO_END_LABEL = "14.06.";

const PROMO_END_MS = Date.parse("2026-06-14T23:59:59+02:00");

export function isPromoActive(now: number = Date.now()): boolean {
  return now <= PROMO_END_MS;
}

// Menüpreise liegen im Frontend in Euro vor. Alle Preise sind Vielfache von
// 0,50 € → ×0,8 ergibt immer volle Cent; Math.round ist nur FP-Absicherung.
export function applyPromo(euros: number, now: number = Date.now()): number {
  if (!isPromoActive(now)) return euros;
  return Math.round(euros * (100 - PROMO_PERCENT)) / 100;
}
