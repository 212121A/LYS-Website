/**
 * Geschaeftsregeln fuer Online-Bestellungen.
 *
 * Mindestbestellwert: gilt fuer die Warenkorb-Summe (ohne etwaige
 * Liefergebuehr). Der Server spiegelt diesen Wert in Cent
 * (api/stripe/create-checkout-session.js) und erzwingt ihn autoritativ.
 */
export const MIN_ORDER_VALUE_EUR = 20;
