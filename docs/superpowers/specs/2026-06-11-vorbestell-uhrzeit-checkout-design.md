# Design: Vorbestell-Uhrzeit im Checkout

**Datum:** 2026-06-11
**Status:** Genehmigt (Brainstorming abgeschlossen)

## Problem

Im Bestellvorgang der Website soll der Kunde eine **Abholzeit** wählen können
(„So schnell wie möglich" oder eine konkrete Uhrzeit), **nur für den heutigen
Tag**. Die gewählte Zeit soll im Küchen-Dashboard angezeigt werden — **genauso
wie bei Voiceagent-Bestellungen**.

## Recherche-Ergebnis (Quelle der Wahrheit)

Der Datenfluss ist bereits vollständig vorverdrahtet — bestätigt durch Inspektion
von Supabase (`Bestellungen LYS`, Projekt `jandskwzlzyjsvpmdhls`) und dem n8n-Flow
`LYS Bestellsystem (VoiceAgent+Website)` (`DSOzo9VXO9zzsAlZ`, aktiv):

- Tabelle `public.orders` (Kommentar: *„Phone / external orders for kitchen
  dashboard"*) hat eine Spalte **`pickup_time text`** (Freitext, default `''`).
- Voiceagent-Bestellungen schreiben dort z.B. `"20 Minuten"` (Freitext, `source = "voiceagent"`).
- Der **Website-Zweig** des n8n-Flows liest `pickup_time` direkt aus der
  Stripe-Session-Metadata und schreibt es in dieselbe Spalte:
  - Extract-Node: `pickup_time: metadata.pickup_time || ""`, `source: "website"`
  - Insert-Node (`WEB - Bestellung in Supabase speichern`): `"pickup_time": "{{ $json.pickup_time }}"`
- Das Backend `api/stripe/create-checkout-session.js` reicht `pickup_time` bereits
  durch: `pickup_time: requestMetadata.pickup_time ?? ""` (Zeile 788).

**Konsequenz:** Es ist **keine** Änderung an Backend, n8n oder Supabase nötig.
Das Frontend muss `pickup_time` lediglich in der Stripe-Request-Metadata mitsenden.
Das Dashboard zeigt den String dann automatisch an — exakt wie bei Voiceagent.

## Datenfluss

```
Checkout.tsx (UI: Abholzeit-Auswahl)
  └─ POST /api/stripe/create-checkout-session
       body.metadata.pickup_time = "13:15" | "So schnell wie möglich"
  └─ Stripe Checkout Session (metadata.pickup_time)
  └─ Stripe Webhook checkout.session.completed
  └─ n8n WEB-Zweig: metadata.pickup_time → orders.pickup_time
  └─ Küchen-Dashboard zeigt orders.pickup_time (wie Voiceagent)
```

## Scope

### In Scope (nur Frontend, `artifacts/ly-restaurant`)

1. **Neue Datei `src/lib/openingHours.ts`** — Öffnungszeiten-Logik (Europe/Berlin):
   - Öffnungszeiten je Wochentag:
     - Mo–Do (1–4): `11:00–21:30`
     - Fr–Sa (5,6): `11:00–22:00`
     - So (0): `13:00–20:00`
   - `isOpenNow(now): boolean` — ist der Laden jetzt (Berlin-Zeit) geöffnet?
   - `getPickupSlots(now): string[]` — Liste von `"HH:MM"`-Slots:
     - frühester Slot = `max(Öffnungszeit, jetzt + 20 Min)`, aufgerundet auf nächste
       Viertelstunde (`:00/:15/:30/:45`)
     - Schrittweite 15 Min bis Ladenschluss (inkl.)
     - falls `jetzt + 20 Min > Ladenschluss` → leeres Array (nur ASAP möglich)
   - Berlin-Wallclock via `Intl.DateTimeFormat(..., { timeZone: "Europe/Berlin" })`
     (Wochentag + Minuten seit Mitternacht), damit Slots unabhängig von der
     Browser-Zeitzone des Nutzers korrekt sind.

2. **`src/pages/Checkout.tsx`** — Abholzeit-Auswahl + Geschlossen-Sperre:
   - **Geschlossen-Zustand:** Ist `isOpenNow()` false, ersetzt ein
     Geschlossen-Hinweis das Formular (analog zum bestehenden „Warenkorb leer"-State):
     „Wir haben gerade geschlossen" + Öffnungszeiten. Checkout/Zahlung nicht möglich
     (Stripe **und** PayPal unerreichbar).
   - **Geöffnet-Zustand:** Neuer Block „Abholzeit" im Schritt `details`:
     - Radio/Toggle: **„So schnell wie möglich"** (Default) ODER **„Feste Uhrzeit"**
     - Bei „Feste Uhrzeit": `<select>` mit den `getPickupSlots()`-Werten
     - Gewählter Wert in State `pickupTime` (string)
   - **Wert (`pickup_time`):**
     - ASAP → `"So schnell wie möglich"` (fester deutscher String, **nicht** lokalisiert —
       die Küche liest Deutsch; konsistent mit Voiceagent)
     - Slot → `"13:15"` (HH:MM)
   - **Durchreichen:** im Stripe-Request-Body `metadata: { pickup_time }` ergänzen.
   - **localStorage-Context** (`CHECKOUT_CONTEXT_KEY`): Feld `pickupTime` ergänzen
     (für Anzeige auf der Success-Seite). Gilt für Stripe- **und** PayPal-Pfad.

3. **`src/pages/CheckoutSuccess.tsx`** — gewählte Abholzeit anzeigen (kleines Plus,
   aus localStorage-Context).

4. **`src/i18n/translations.ts`** — neue Keys im `checkout`-Block in **allen 24
   Sprachen** (DE/EN korrekt, übrige pragmatisch übersetzt):
   - `pickupTimeLabel` („Abholzeit")
   - `pickupAsap` („So schnell wie möglich")
   - `pickupSpecificTime` („Feste Uhrzeit")
   - `pickupTimeHint` (kurzer Hinweis, z.B. „Heute, innerhalb der Öffnungszeiten")
   - `closedTitle` („Wir haben gerade geschlossen")
   - `closedHours` / Hinweis-Text mit Öffnungszeiten
   - (Anzeige-Label für Success-Seite, z.B. `pickupTimeSummary`)

### Out of Scope (dokumentierte Einschränkungen)

- **Backend / n8n / Supabase:** keine Änderung nötig (siehe Recherche).
- **PayPal → Dashboard:** Der PayPal-Pfad erzeugt **keine** `orders`-Zeile
  (n8n triggert ausschließlich auf das Stripe-Webhook `checkout.session.completed`).
  PayPal-Bestellungen erscheinen ohnehin nicht im Dashboard — `pickup_time` greift
  dort also nicht. Vorbestehende Lücke, hier **nicht** behoben. (Die Abholzeit wird
  für PayPal nur im Success-Context lokal angezeigt.)
- **Feiertage:** Werden nicht erkannt (kein Feiertagskalender). An Feiertagen gelten
  die normalen Wochentags-Öffnungszeiten. Bekannte Einschränkung.
- **Express-Variante** `artifacts/api-server/src/routes/stripe.ts`: reicht
  `pickup_time` ebenfalls bereits durch; wird für die Live-Website (Vercel) nicht
  deployt. Keine Änderung.

## Verifikation / Test

- `pnpm run typecheck` muss grün sein (neue i18n-Keys in allen Sprachen, sonst TS-Fehler).
- Manuell: `getPickupSlots()` für verschiedene Uhrzeiten/Wochentage prüfen
  (Öffnung, kurz vor Schluss, So-Zeiten).
- Manuell: Checkout während Öffnungszeit → Abholzeit wählbar; außerhalb → Geschlossen-Sperre.
- E2E-Smoke (optional): Stripe-Testbestellung mit gewählter Uhrzeit → in Supabase
  `orders.pickup_time` prüfen, dass `"13:15"` ankommt.

## Offene Punkte

Keine. Entscheidungen getroffen: ASAP+15-Min-Slots, +20 Min Vorlauf, Geschlossen →
Checkout blocken, i18n in allen Sprachen.
