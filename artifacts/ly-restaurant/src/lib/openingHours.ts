/**
 * Öffnungszeiten & Abhol-Slots für den Checkout.
 *
 * Alle Berechnungen erfolgen in Europe/Berlin (nicht in der Browser-Zeitzone
 * des Nutzers), damit die Slots für den Laden in Schwäbisch Gmünd korrekt sind.
 *
 * Gesetzliche Feiertage in Baden-Württemberg werden automatisch erkannt; an
 * Feiertagen gelten die Sonntags-Zeiten (16:00–21:00).
 */

/** Fester, zeitzonen-/sprachunabhängiger Wert für „ASAP" (so liest ihn die Küche). */
export const ASAP_PICKUP_VALUE = "So schnell wie möglich";

/** Vorlauf für die Küche: frühester wählbarer Slot = jetzt + 20 Min. */
const LEAD_MINUTES = 20;

/** Slot-Abstand in Minuten. */
const SLOT_STEP_MINUTES = 15;

/** Annahmeschluss: letzte Bestellung 30 Min vor Ladenschluss. */
export const LAST_ORDER_OFFSET_MINUTES = 30;

/** Vorbestellung: Annahme startet bereits 2 Std vor Öffnung. */
export const PRE_ORDER_LEAD_MINUTES = 120;

/** Frühester wählbarer Abhol-Slot ab Öffnung + 30 Min (11:30 bzw. 13:30). */
const PICKUP_OPEN_OFFSET_MINUTES = 30;

interface OpeningWindow {
  open: number; // Minuten seit Mitternacht
  close: number;
}

/**
 * Bestellannahme-Zeitfenster je Wochentag (0 = So … 6 = Sa) — identisch zu den
 * Öffnungszeiten: Mo–Do 11:00–21:30, Fr–Sa 11:00–22:00, So 16:00–21:00.
 * An Feiertagen gilt das Sonntags-Fenster (siehe windowFor).
 */
export const OPENING_HOURS: Record<number, OpeningWindow> = {
  0: { open: 16 * 60, close: 21 * 60 }, // So
  1: { open: 11 * 60, close: 21 * 60 + 30 }, // Mo
  2: { open: 11 * 60, close: 21 * 60 + 30 }, // Di
  3: { open: 11 * 60, close: 21 * 60 + 30 }, // Mi
  4: { open: 11 * 60, close: 21 * 60 + 30 }, // Do
  5: { open: 11 * 60, close: 22 * 60 }, // Fr
  6: { open: 11 * 60, close: 22 * 60 }, // Sa
};

interface BerlinNow {
  weekday: number; // 0 = So … 6 = Sa
  minutes: number; // Minuten seit Mitternacht
  year: number;
  month: number; // 1–12
  day: number; // 1–31
}

/** Datum/Uhrzeit in Europe/Berlin, unabhängig von der Browser-Zeitzone. */
function berlinNow(now: Date): BerlinNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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
  return {
    weekday,
    minutes: hour * 60 + minute,
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
  };
}

/** Ostersonntag (Gauß/Meeus-Algorithmus) als UTC-Datum — Basis der beweglichen Feiertage. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = März, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/** Gesetzliche Feiertage in Baden-Württemberg für ein Jahr, als Set von "Monat-Tag". */
function holidaysBW(year: number): Set<string> {
  const key = (month: number, day: number) => `${month}-${day}`;
  const days = new Set<string>([
    key(1, 1), // Neujahr
    key(1, 6), // Heilige Drei Könige
    key(5, 1), // Tag der Arbeit
    key(10, 3), // Tag der Deutschen Einheit
    key(11, 1), // Allerheiligen
    key(12, 25), // 1. Weihnachtstag
    key(12, 26), // 2. Weihnachtstag
  ]);

  const easter = easterSunday(year);
  const relativeToEaster = (offsetDays: number) => {
    const d = new Date(easter.getTime());
    d.setUTCDate(d.getUTCDate() + offsetDays);
    return key(d.getUTCMonth() + 1, d.getUTCDate());
  };
  days.add(relativeToEaster(-2)); // Karfreitag
  days.add(relativeToEaster(1)); // Ostermontag
  days.add(relativeToEaster(39)); // Christi Himmelfahrt
  days.add(relativeToEaster(50)); // Pfingstmontag
  days.add(relativeToEaster(60)); // Fronleichnam
  return days;
}

function isHoliday(year: number, month: number, day: number): boolean {
  return holidaysBW(year).has(`${month}-${day}`);
}

/** Gültiges Zeitfenster für den Tag: an Feiertagen die Sonntags-Zeiten. */
function windowFor(parts: BerlinNow): OpeningWindow | undefined {
  if (isHoliday(parts.year, parts.month, parts.day)) return OPENING_HOURS[0];
  return OPENING_HOURS[parts.weekday];
}

function formatHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Bestellannahme-Status für den Checkout:
 * - "open": Bestellungen werden angenommen (inkl. Vorbestellung ab 2 Std vor Öffnung).
 * - "ordering-closed": Laden noch offen, aber Annahmeschluss erreicht (letzte 30 Min).
 * - "closed": außerhalb des Annahmefensters.
 */
export type OrderingStatus = "open" | "ordering-closed" | "closed";

export function getOrderingStatus(now: Date = new Date()): OrderingStatus {
  const parts = berlinNow(now);
  const window = windowFor(parts);
  if (!window) return "closed";
  if (
    parts.minutes < window.open - PRE_ORDER_LEAD_MINUTES ||
    parts.minutes >= window.close
  ) {
    return "closed";
  }
  if (parts.minutes >= window.close - LAST_ORDER_OFFSET_MINUTES) {
    return "ordering-closed";
  }
  return "open";
}

/**
 * Liste wählbarer Abhol-Slots ("HH:MM") für HEUTE.
 * Frühester Slot = max(Öffnung + 30 Min, jetzt + 20 Min), aufgerundet auf die
 * nächste Viertelstunde; Schrittweite 15 Min bis Ladenschluss (inkl.).
 * Leer, wenn (jetzt + 20 Min) bereits nach Ladenschluss liegt.
 */
export function getPickupSlots(now: Date = new Date()): string[] {
  const parts = berlinNow(now);
  const window = windowFor(parts);
  if (!window) return [];

  const earliestRaw = Math.max(
    window.open + PICKUP_OPEN_OFFSET_MINUTES,
    parts.minutes + LEAD_MINUTES,
  );
  const earliest =
    Math.ceil(earliestRaw / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES;

  const slots: string[] = [];
  for (let t = earliest; t <= window.close; t += SLOT_STEP_MINUTES) {
    slots.push(formatHHMM(t));
  }
  return slots;
}
