/**
 * Öffnungszeiten & Abhol-Slots für den Checkout.
 *
 * Alle Berechnungen erfolgen in Europe/Berlin (nicht in der Browser-Zeitzone
 * des Nutzers), damit die Slots für den Laden in Schwäbisch Gmünd korrekt sind.
 *
 * Feiertage werden NICHT erkannt (kein Kalender) — an Feiertagen gelten die
 * normalen Wochentags-Öffnungszeiten. Bewusste Einschränkung.
 */

/** Fester, zeitzonen-/sprachunabhängiger Wert für „ASAP" (so liest ihn die Küche). */
export const ASAP_PICKUP_VALUE = "So schnell wie möglich";

/** Vorlauf für die Küche: frühester wählbarer Slot = jetzt + 20 Min. */
const LEAD_MINUTES = 20;

/** Slot-Abstand in Minuten. */
const SLOT_STEP_MINUTES = 15;

interface OpeningWindow {
  open: number; // Minuten seit Mitternacht
  close: number;
}

/**
 * Bestellannahme-Zeitfenster je Wochentag (0 = So … 6 = Sa) — identisch zu den
 * Öffnungszeiten: Mo–Do 11:00–21:30, Fr–Sa 11:00–22:00, So 13:00–20:00.
 *
 * Feiertage gelten laut Aushang wie Sonntag (13:00–20:00), werden hier aber
 * mangels Kalender NICHT erkannt — an Feiertagen greifen die Wochentags-Zeiten.
 */
const OPENING_HOURS: Record<number, OpeningWindow> = {
  0: { open: 13 * 60, close: 20 * 60 }, // So
  1: { open: 11 * 60, close: 21 * 60 + 30 }, // Mo
  2: { open: 11 * 60, close: 21 * 60 + 30 }, // Di
  3: { open: 11 * 60, close: 21 * 60 + 30 }, // Mi
  4: { open: 11 * 60, close: 21 * 60 + 30 }, // Do
  5: { open: 11 * 60, close: 22 * 60 }, // Fr
  6: { open: 11 * 60, close: 22 * 60 }, // Sa
};

/** Wochentag (0–6) und Minuten seit Mitternacht in Europe/Berlin. */
function berlinNow(now: Date): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const weekday = weekdayMap[get("weekday")] ?? 0;
  // hour kann bei Mitternacht "24" liefern — auf 0 normalisieren.
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  return { weekday, minutes: hour * 60 + minute };
}

function formatHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Ist der Laden zur gegebenen Zeit (default: jetzt) geöffnet? */
export function isOpenNow(now: Date = new Date()): boolean {
  const { weekday, minutes } = berlinNow(now);
  const window = OPENING_HOURS[weekday];
  if (!window) return false;
  return minutes >= window.open && minutes < window.close;
}

/**
 * Liste wählbarer Abhol-Slots ("HH:MM") für HEUTE.
 * Frühester Slot = max(Öffnung, jetzt + 20 Min), aufgerundet auf die nächste
 * Viertelstunde; Schrittweite 15 Min bis Ladenschluss (inkl.).
 * Leer, wenn (jetzt + 20 Min) bereits nach Ladenschluss liegt.
 */
export function getPickupSlots(now: Date = new Date()): string[] {
  const { weekday, minutes } = berlinNow(now);
  const window = OPENING_HOURS[weekday];
  if (!window) return [];

  const earliestRaw = Math.max(window.open, minutes + LEAD_MINUTES);
  const earliest =
    Math.ceil(earliestRaw / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES;

  const slots: string[] = [];
  for (let t = earliest; t <= window.close; t += SLOT_STEP_MINUTES) {
    slots.push(formatHHMM(t));
  }
  return slots;
}
