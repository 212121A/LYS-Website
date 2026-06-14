/**
 * Bestellannahme-Fenster (Europe/Berlin) — spiegelt
 * artifacts/ly-restaurant/src/lib/openingHours.ts. Der Server hat Autoritaet:
 * Annahme nur innerhalb der Oeffnungszeiten und bis 30 Min vor Ladenschluss;
 * gesetzliche Feiertage (Baden-Wuerttemberg) gelten wie Sonntag.
 */

const LAST_ORDER_OFFSET_MINUTES = 30;

interface OpeningWindow {
  open: number; // Minuten seit Mitternacht
  close: number;
}

const OPENING_HOURS: Record<number, OpeningWindow> = {
  0: { open: 13 * 60, close: 20 * 60 }, // So
  1: { open: 11 * 60, close: 21 * 60 + 30 }, // Mo
  2: { open: 11 * 60, close: 21 * 60 + 30 }, // Di
  3: { open: 11 * 60, close: 21 * 60 + 30 }, // Mi
  4: { open: 11 * 60, close: 21 * 60 + 30 }, // Do
  5: { open: 11 * 60, close: 22 * 60 }, // Fr
  6: { open: 11 * 60, close: 22 * 60 }, // Sa
};

interface BerlinParts {
  weekday: number;
  minutes: number;
  year: number;
  month: number;
  day: number;
}

function berlinParts(now: Date): BerlinParts {
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
  const hour = Number(get("hour")) % 24;
  return {
    weekday: weekdayMap[get("weekday")] ?? 0,
    minutes: hour * 60 + Number(get("minute")),
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
  };
}

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
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function isHolidayBW(year: number, month: number, day: number): boolean {
  const key = (mo: number, d: number) => `${mo}-${d}`;
  const days = new Set<string>([
    key(1, 1), key(1, 6), key(5, 1), key(10, 3),
    key(11, 1), key(12, 25), key(12, 26),
  ]);
  const easter = easterSunday(year);
  const relativeToEaster = (offsetDays: number) => {
    const x = new Date(easter.getTime());
    x.setUTCDate(x.getUTCDate() + offsetDays);
    return key(x.getUTCMonth() + 1, x.getUTCDate());
  };
  [-2, 1, 39, 50, 60].forEach((off) => days.add(relativeToEaster(off)));
  return days.has(key(month, day));
}

/** Nimmt der Laden gerade Bestellungen an? (Annahmeschluss 30 Min vor Schluss.) */
export function isOrderingOpen(now: Date = new Date()): boolean {
  const p = berlinParts(now);
  const window = isHolidayBW(p.year, p.month, p.day)
    ? OPENING_HOURS[0]
    : OPENING_HOURS[p.weekday];
  if (!window) return false;
  return (
    p.minutes >= window.open &&
    p.minutes < window.close - LAST_ORDER_OFFSET_MINUTES
  );
}
