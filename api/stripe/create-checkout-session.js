import Stripe from "stripe";

// Bestellannahme-Fenster (Europe/Berlin) — spiegelt
// artifacts/ly-restaurant/src/lib/openingHours.ts. Server hat Autoritaet:
// Annahme ab 2 Std vor Oeffnung (Vorbestellung) bis 30 Min vor Ladenschluss;
// gesetzliche Feiertage (Baden-Wuerttemberg) gelten wie Sonntag.
export const LAST_ORDER_OFFSET_MINUTES = 30;
export const PRE_ORDER_LEAD_MINUTES = 120;
export const OPENING_HOURS = {
  0: { open: 16 * 60, close: 21 * 60 }, // So
  1: { open: 11 * 60, close: 21 * 60 + 30 }, // Mo
  2: { open: 11 * 60, close: 21 * 60 + 30 }, // Di
  3: { open: 11 * 60, close: 21 * 60 + 30 }, // Mi
  4: { open: 11 * 60, close: 21 * 60 + 30 }, // Do
  5: { open: 11 * 60, close: 22 * 60 }, // Fr
  6: { open: 11 * 60, close: 22 * 60 }, // Sa
};
function berlinParts(now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    weekday: "short", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const hour = Number(get("hour")) % 24;
  return {
    weekday: weekdayMap[get("weekday")] ?? 0,
    minutes: hour * 60 + Number(get("minute")),
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
  };
}
function easterSunday(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}
function isHolidayBW(year, month, day) {
  const key = (mo, d) => `${mo}-${d}`;
  const days = new Set([
    key(1, 1), key(1, 6), key(5, 1), key(10, 3),
    key(11, 1), key(12, 25), key(12, 26),
  ]);
  const easter = easterSunday(year);
  const rel = (off) => {
    const x = new Date(easter.getTime());
    x.setUTCDate(x.getUTCDate() + off);
    return key(x.getUTCMonth() + 1, x.getUTCDate());
  };
  [-2, 1, 39, 50, 60].forEach((off) => days.add(rel(off)));
  return days.has(key(month, day));
}
function isOrderingOpen(now = new Date()) {
  const p = berlinParts(now);
  const win = isHolidayBW(p.year, p.month, p.day)
    ? OPENING_HOURS[0]
    : OPENING_HOURS[p.weekday];
  if (!win) return false;
  return (
    p.minutes >= win.open - PRE_ORDER_LEAD_MINUTES &&
    p.minutes < win.close - LAST_ORDER_OFFSET_MINUTES
  );
}

// Mindestbestellwert (Cent). Spiegelt MIN_ORDER_VALUE_EUR im Frontend
// (artifacts/ly-restaurant/src/lib/orderRules.ts). Server erzwingt autoritativ.
const MIN_ORDER_CENTS = 1000;

// Server-seitige Preisautoritaet: alle Preise sind in Cent (EUR).
// Cart-IDs aus dem Frontend werden gegen diese Whitelist validiert.
// number = Menue-Abkuerzung (wird ans Kitchen-Dashboard durchgereicht).
export const PRODUCTS = {
  v1: { number: "1", name: "Nem Ran", price: 400 },
  v2: { number: "2", name: "Mini Frühlingsrollen (vegan)", price: 200 },

  c1: { number: "c1", name: "Gemüse Thai Curry", price: 700 },
  c2: { number: "c2", name: "Hähnchenfleisch Thai Curry", price: 900 },
  c3: { number: "c3", name: "Paniertes Hähnchenfleisch Thai Curry", price: 1050 },
  c4: { number: "c4", name: "Fisch Thai Curry", price: 1050 },
  c5: { number: "c5", name: "Ente Thai Curry", price: 1150 },
  c6: { number: "c6", name: "Garnelen Thai Curry", price: 1150 },
  c7: { number: "c7", name: "Tofu Thai Curry", price: 850 },

  s1: { number: "s1", name: "Gemüse Süß-Sauer", price: 700 },
  s2: { number: "s2", name: "Hähnchenfleisch Süß-Sauer", price: 900 },
  s3: { number: "s3", name: "Paniertes Hähnchenfleisch Süß-Sauer", price: 1050 },
  s4: { number: "s4", name: "Fisch Süß-Sauer", price: 1050 },
  s5: { number: "s5", name: "Ente Süß-Sauer", price: 1150 },
  s6: { number: "s6", name: "Garnelen Süß-Sauer", price: 1150 },
  s7: { number: "s7", name: "Tofu Süß-Sauer", price: 850 },

  b1: { number: "b1", name: "Gemüse Soja", price: 700 },
  b2: { number: "b2", name: "Hähnchenfleisch Soja", price: 900 },
  b3: { number: "b3", name: "Paniertes Hähnchenfleisch Soja", price: 1050 },
  b4: { number: "b4", name: "Fisch Soja", price: 1050 },
  b5: { number: "b5", name: "Ente Soja", price: 1150 },
  b6: { number: "b6", name: "Garnelen Soja", price: 1150 },
  b7: { number: "b7", name: "Tofu Soja", price: 850 },

  e1: { number: "e1", name: "Gemüse Erdnuss", price: 700 },
  e2: { number: "e2", name: "Hähnchenfleisch Erdnuss", price: 900 },
  e3: { number: "e3", name: "Paniertes Hähnchenfleisch Erdnuss", price: 1050 },
  e4: { number: "e4", name: "Fisch Erdnuss", price: 1050 },
  e5: { number: "e5", name: "Ente Erdnuss", price: 1150 },
  e6: { number: "e6", name: "Garnelen Erdnuss", price: 1150 },
  e7: { number: "e7", name: "Tofu Erdnuss", price: 850 },

  m1: { number: "m1", name: "Gemüse Matcha Soße", price: 700 },
  m2: { number: "m2", name: "Hähnchenfleisch Matcha Soße", price: 900 },
  m3: { number: "m3", name: "Paniertes Hähnchenfleisch Matcha Soße", price: 1050 },
  m4: { number: "m4", name: "Fisch Matcha Soße", price: 1050 },
  m5: { number: "m5", name: "Ente Matcha Soße", price: 1150 },
  m6: { number: "m6", name: "Garnelen Matcha Soße", price: 1150 },
  m7: { number: "m7", name: "Tofu Matcha Soße", price: 850 },

  m8: { number: "m8", name: "Gemüse Mango Soße", price: 700 },
  m9: { number: "m9", name: "Hähnchenfleisch Mango Soße", price: 900 },
  m10: { number: "m10", name: "Paniertes Hähnchenfleisch Mango Soße", price: 1050 },
  m11: { number: "m11", name: "Fisch Mango Soße", price: 1050 },
  m12: { number: "m12", name: "Ente Mango Soße", price: 1150 },
  m13: { number: "m13", name: "Garnelen Mango Soße", price: 1150 },
  m14: { number: "m14", name: "Tofu Mango Soße", price: 850 },

  a1: { number: "a1", name: "Gebratener Reis mit Ei & Gemüse", price: 700 },
  a2: { number: "a2", name: "Gebratener Reis Hähnchenfleisch", price: 850 },
  a3: { number: "a3", name: "Gebratener Reis Paniertes Hähnchenfleisch", price: 1050 },
  a4: { number: "a4", name: "Gebratener Reis Fisch", price: 1050 },
  a5: { number: "a5", name: "Gebratener Reis Ente", price: 1150 },
  a6: { number: "a6", name: "Gebratener Reis Garnelen", price: 1000 },
  a7: { number: "a7", name: "Gebratener Reis Tofu", price: 850 },

  // Nudel-/Reisboxen: Cart-IDs im Format `<baseId>-<size>-<type>`.
  // `number` = Kurzcode fuer Kitchen-Dashboard (z.B. GN2 = Grosse Nudelbox Haehnchen).
  "box-gemuse-small-nudel": { number: "KN1", name: "Kleine Nudelbox Gemüse", price: 400 },
  "box-gemuse-small-reis": { number: "KR1", name: "Kleine Reisbox Gemüse", price: 400 },
  "box-gemuse-large-nudel": { number: "GN1", name: "Große Nudelbox Gemüse", price: 500 },
  "box-gemuse-large-reis": { number: "GR1", name: "Große Reisbox Gemüse", price: 500 },
  "box-huehnchen-small-nudel": { number: "KN2", name: "Kleine Nudelbox Hähnchen", price: 450 },
  "box-huehnchen-small-reis": { number: "KR2", name: "Kleine Reisbox Hähnchen", price: 450 },
  "box-huehnchen-large-nudel": { number: "GN2", name: "Große Nudelbox Hähnchen", price: 600 },
  "box-huehnchen-large-reis": { number: "GR2", name: "Große Reisbox Hähnchen", price: 600 },
  "box-pan-huehnchen-large-nudel": { number: "GN3", name: "Große Nudelbox Paniertes Hähnchen", price: 600 },
  "box-pan-huehnchen-large-reis": { number: "GR3", name: "Große Reisbox Paniertes Hähnchen", price: 600 },
  "box-fisch-large-nudel": { number: "GN4", name: "Große Nudelbox Fisch", price: 600 },
  "box-fisch-large-reis": { number: "GR4", name: "Große Reisbox Fisch", price: 600 },
  "box-fruehlingsrollen-large-nudel": { number: "GN5", name: "Große Nudelbox Vegetarische Frühlingsrollen", price: 600 },
  "box-fruehlingsrollen-large-reis": { number: "GR5", name: "Große Reisbox Vegetarische Frühlingsrollen", price: 600 },
  "box-tofu-large-nudel": { number: "GN6", name: "Große Nudelbox Tofu", price: 800 },
  "box-tofu-large-reis": { number: "GR6", name: "Große Reisbox Tofu", price: 800 },
  "box-garnelen-large-nudel": { number: "GN7", name: "Große Nudelbox Garnelen", price: 1000 },
  "box-garnelen-large-reis": { number: "GR7", name: "Große Reisbox Garnelen", price: 1000 },

  "g-soft": { number: "GD1", name: "Softgetränke", price: 300 },
  "g-wasser": { number: "GD2", name: "Wasser", price: 200 },

  "m-latte": { number: "01", name: "Matcha Latte (warm/kalt)", price: 450 },
  "m-dau": { number: "02", name: "Matcha dâu (Erdbeere)", price: 500 },
  "m-xoai": { number: "03", name: "Matcha xoài (Mango)", price: 500 },
  "m-rasp": { number: "04", name: "Matcha Raspberry (Himbeere)", price: 500 },
  "m-vietquat": { number: "05", name: "Matcha việt quất (Blaubeere)", price: 500 },
  "m-dua-ananas": { number: "06", name: "Matcha dứa (Ananas)", price: 500 },
  "m-vani": { number: "07", name: "Matcha vani (Vanille)", price: 500 },
  "m-dua-cloud": { number: "08", name: "Matcha dừa (Coconut Cloud)", price: 550 },

  "cp-den": { number: "09", name: "Cà phê đen", price: 450 },
  "cp-sua-da": { number: "10", name: "Cà phê sữa đá", price: 500 },
  "cp-den-da": { number: "11", name: "Cà phê đen đá", price: 450 },
  "cp-nau-da": { number: "12", name: "Cà phê nâu đá", price: 500 },
  "cp-dua": { number: "13", name: "Cà phê dừa", price: 500 },
  "cp-bac-xiu": { number: "14", name: "Bạc xỉu", price: 600 },

  "t-chanh-leo": { number: "15", name: "Trà chanh leo", price: 600 },
  "t-vai": { number: "16", name: "Trà vải", price: 600 },
  "t-dao": { number: "17", name: "Trà đào cam sả", price: 600 },
  "t-chanh-simple": { number: "18", name: "Trà chanh", price: 600 },

  "soda-chanh": { number: "19", name: "Soda chanh", price: 600 },
  "soda-dao": { number: "20", name: "Soda đào", price: 600 },
  "soda-vai": { number: "21", name: "Soda vải", price: 600 },
  "soda-dua": { number: "22", name: "Soda dứa", price: 600 },

  "smoothie-all": { number: "23", name: "Smoothie", price: 650 },

  "bowl-oats1": { number: "24", name: "Overnight Oats mit Haferflocken & Milch", price: 650 },
  "bowl-joghurt": { number: "25", name: "Joghurt Bowl", price: 650 },
  "bowl-protein": { number: "26", name: "Protein Bowl", price: 650 },
  "bowl-acai": { number: "27", name: "Acai Bowl", price: 650 },
  "bowl-smoothie": { number: "28", name: "Smoothie Bowl", price: 650 },
  "bowl-chia": { number: "29", name: "Chia Pudding", price: 650 },

  "kem-matcha": { number: "30", name: "Matcha Latte mit Matcha Eis", price: 650 },
  "kem-vani": { number: "31", name: "Matcha Latte mit Vanilleeis", price: 650 },

  "kids-schoko": { number: "32", name: "Schoko Latte", price: 450 },
};

// Soßen + Modifikatoren: Cart-IDs wie `box-huehnchen-large-nudel-soja` oder
// `c2-nudel-keinesosse-ohnegemuese` werden auf die Basis gemappt. Preis bleibt
// identisch (Soßen sind inklusive, "ohne" kostet nichts), Name und
// Kitchen-Dashboard-Kürzel bekommen ein 1:1 angehaengtes Suffix
// (z.B. "GN4-Sojasoße", "c2-Nudel-Ohne Soße-Ohne Gemüse").
const NO_SAUCE_LABEL = "Ohne Soße";
const NO_VEGGIES_LABEL = "Ohne Gemüse";
const NO_VEGGIES_SUFFIX = "-ohnegemuese";
const NO_SAUCE_SUFFIX = "-keinesosse";

/** Soßen-Token (Box + Gebratener Reis) → Kitchen-Code/Label. */
const SAUCE_BY_TOKEN = {
  soja: { code: "Sojasoße", label: "Sojasoße" },
  suesssauer: { code: "Süßsauersoße", label: "Süßsauersoße" },
  curry: { code: "Thaicurry mit Kokosmilch", label: "Thaicurry mit Kokosmilch" },
  matcha: { code: "Matcha Soße", label: "Matcha Soße" },
  mango: { code: "Mango Soße", label: "Mango Soße" },
  keine: { code: NO_SAUCE_LABEL, label: NO_SAUCE_LABEL },
};

const NO_VEGGIES_MOD = { code: NO_VEGGIES_LABEL, label: NO_VEGGIES_LABEL };
const NO_SAUCE_MOD = { code: NO_SAUCE_LABEL, label: NO_SAUCE_LABEL };

/** Haengt Code-/Namens-Suffixe an ein Basisprodukt an (Soße, "ohne ..."). */
function withSuffixes(base, suffixes) {
  return {
    number: `${base.number}${suffixes.map((s) => `-${s.code}`).join("")}`,
    name: `${base.name}${suffixes.map((s) => ` • ${s.label}`).join("")}`,
    price: base.price,
  };
}

const BOWL_FRUITS = {
  banane: "Banane",
  erdbeere: "Erdbeere",
  blaubeere: "Blaubeere",
  himbeere: "Himbeere",
  mango: "Mango",
};

const BOWL_TOPPINGS = {
  honig: "Honig",
  agave: "Agavendicksaft",
  matcha: "Matcha",
  granola: "Granola",
  schoko: "Schoko",
  kokos: "Kokos",
  // Legacy: früher ein kombiniertes Topping; bleibt für alte Warenkörbe
  // (localStorage) bestellbar, das Frontend erzeugt es nicht mehr.
  "schoko-kokos": "Schoko/Kokos",
};

export const BOWL_TOPPING_PRICE = {
  honig: 50,
  agave: 50,
  matcha: 200,
  granola: 200,
  schoko: 100,
  kokos: 100,
  "schoko-kokos": 100,
};

const MENU_MILKS = {
  kuhmilch: "Kuhmilch",
  sojamilch: "Sojamilch",
  hafermilch: "Hafermilch",
  kokosmilch: "Kokosmilch",
};

export const MATCHA_MILK_SURCHARGE = {
  kuhmilch: 0,
  sojamilch: 50,
  hafermilch: 50,
  kokosmilch: 50,
};

const MATCHA_STYLE_LABEL = {
  classic: "Classic",
  frappe: "Frappe",
  protein: "Proteinmatcha",
};

export const MATCHA_STYLE_SURCHARGE = {
  classic: 0,
  frappe: 100,
  protein: 200,
};

const MILK_OPTION_MATCHA_BASES = [
  "m-dua-cloud",
  "m-dua-ananas",
  "m-vietquat",
  "m-rasp",
  "m-xoai",
  "m-dau",
  "m-latte",
  "m-vani",
  "kem-matcha",
  "kem-vani",
];

const SMOOTHIE_FRUITS = {
  banane: "Banane",
  erdbeere: "Erdbeere",
  mango: "Mango",
  ananas: "Ananas",
  himbeere: "Himbeere",
  blaubeere: "Blaubeere",
};

const SMOOTHIE_MILKS = {
  kokosmilch: "Kokosmilch",
  hafermilch: "Hafermilch",
  sojamilch: "Sojamilch",
};

function resolveSmoothieProduct(id) {
  const prefix = "smoothie-all-";
  if (!id.startsWith(prefix)) return null;

  let rest = id.slice(prefix.length);
  let withProtein = false;
  if (rest.endsWith("-protein")) {
    withProtein = true;
    rest = rest.slice(0, -"-protein".length);
  }

  const milkKeys = Object.keys(SMOOTHIE_MILKS).sort((a, b) => b.length - a.length);
  const sweetOrder = ["honig", "agave", "none"];

  let sweetener = null;
  for (const s of sweetOrder) {
    if (rest.endsWith(`-${s}`)) {
      sweetener = s;
      rest = rest.slice(0, -(s.length + 1));
      break;
    }
  }
  if (!sweetener) return null;

  let milkKey = null;
  for (const m of milkKeys) {
    if (rest.endsWith(`-${m}`)) {
      milkKey = m;
      rest = rest.slice(0, -(m.length + 1));
      break;
    }
  }
  if (!milkKey || !rest) return null;

  const fruitKeys = rest.split("-").filter(Boolean);
  const labels = [];
  for (const fk of fruitKeys) {
    const lbl = SMOOTHIE_FRUITS[fk];
    if (!lbl) return null;
    labels.push(lbl);
  }

  let price = 650;
  if (sweetener === "agave" || sweetener === "honig") price += 50;
  if (withProtein) price += 200;

  const milkLabel = SMOOTHIE_MILKS[milkKey];
  const sweetLabels = { none: "", agave: "Agavendicksaft", honig: "Honig" };
  const sweetSuffix =
    sweetener === "none" ? "" : `-${sweetLabels[sweetener]}`;
  const proteinSuffix = withProtein ? "-Protein" : "";
  const fruitJoinPlus = labels.join("+");

  const number = `23-${fruitJoinPlus}-${milkLabel}${sweetSuffix}${proteinSuffix}`;
  const extras = [milkLabel];
  if (sweetener !== "none") extras.push(sweetLabels[sweetener]);
  if (withProtein) extras.push("Protein");
  const name = `Smoothie ${labels.join(" + ")} • ${extras.join(" • ")}`;

  return { number, name, price };
}

function bowlVocabKeys() {
  return Object.keys({
    ...BOWL_FRUITS,
    ...BOWL_TOPPINGS,
    "keine-frucht": true,
    "ohne-topping": true,
  }).sort((a, b) => b.length - a.length);
}

function tokenizeBowlSegment(segment) {
  const vocab = bowlVocabKeys();
  const tokens = [];
  let i = 0;
  while (i < segment.length) {
    if (segment[i] === "-") {
      i += 1;
      continue;
    }
    let matched = null;
    for (const k of vocab) {
      if (
        segment.startsWith(k, i) &&
        (i + k.length === segment.length || segment[i + k.length] === "-")
      ) {
        matched = k;
        break;
      }
    }
    if (!matched) return null;
    tokens.push(matched);
    i += matched.length;
  }
  return tokens;
}

function parseBowlRest(rest) {
  const tokens = tokenizeBowlSegment(rest);
  if (!tokens) return null;

  const fruitKeys = new Set([...Object.keys(BOWL_FRUITS), "keine-frucht"]);
  const topKeys = new Set([...Object.keys(BOWL_TOPPINGS), "ohne-topping"]);

  const splitIdx = tokens.findIndex((t) => topKeys.has(t));
  if (splitIdx === -1) return null;

  const fruitToks = tokens.slice(0, splitIdx);
  const topToks = tokens.slice(splitIdx);

  if (!fruitToks.every((t) => fruitKeys.has(t))) return null;
  if (!topToks.every((t) => topKeys.has(t))) return null;
  if (fruitToks.includes("keine-frucht") && fruitToks.length > 1) return null;
  if (topToks.includes("ohne-topping") && topToks.length > 1) return null;

  const fruits = fruitToks.filter((t) => t !== "keine-frucht");
  const toppings = topToks.filter((t) => t !== "ohne-topping");

  return { fruits, toppings };
}

function resolveBowlProduct(id) {
  const bases = [
    "bowl-smoothie",
    "bowl-oats1",
    "bowl-joghurt",
    "bowl-protein",
    "bowl-acai",
    "bowl-chia",
  ].sort((a, b) => b.length - a.length);

  let baseId = null;
  for (const b of bases) {
    if (id === b || id.startsWith(`${b}-`)) {
      baseId = b;
      break;
    }
  }
  if (!baseId) return null;

  const base = PRODUCTS[baseId];
  if (!base) return null;

  if (id === baseId) return { product: base, sauce: null };

  const parsed = parseBowlRest(id.slice(baseId.length + 1));
  if (!parsed) return null;

  const fruitLabels = parsed.fruits.map((f) => BOWL_FRUITS[f]);
  const topLabels = parsed.toppings.map((t) => BOWL_TOPPINGS[t]);
  const toppingCents = parsed.toppings.reduce(
    (sum, t) => sum + (BOWL_TOPPING_PRICE[t] ?? 0),
    0,
  );

  const fruitSuffix = fruitLabels.length ? `-${fruitLabels.join("+")}` : "";
  const topSuffix = topLabels.length ? `-${topLabels.join("+")}` : "";
  const number = `${base.number}${fruitSuffix}${topSuffix}`;
  const fruitPart =
    fruitLabels.length > 0
      ? `Früchte: ${fruitLabels.join(", ")}`
      : "Früchte: keine Auswahl";
  const topPart =
    topLabels.length > 0
      ? `Toppings: ${topLabels.join(", ")}`
      : "ohne Extra-Topping";
  const name = `${base.name} • ${fruitPart} • ${topPart}`;

  return {
    product: {
      number,
      name,
      price: base.price + toppingCents,
    },
    sauce: null,
  };
}

function resolveMilkOptionProduct(id) {
  const sortedMatchaBases = [...MILK_OPTION_MATCHA_BASES].sort(
    (a, b) => b.length - a.length,
  );

  for (const baseId of sortedMatchaBases) {
    if (!id.startsWith(`${baseId}-`)) continue;

    const rest = id.slice(baseId.length + 1);
    const parts = rest.split("-");
    const styleKeys = Object.keys(MATCHA_STYLE_LABEL).sort(
      (a, b) => b.length - a.length,
    );

    let styleKey = "classic";
    let milkParts = parts;

    const last = parts[parts.length - 1];
    if (last && MATCHA_STYLE_LABEL[last]) {
      styleKey = last;
      milkParts = parts.slice(0, -1);
    }

    const milkKey = milkParts.join("-");
    if (!MENU_MILKS[milkKey]) continue;

    const base = PRODUCTS[baseId];
    if (!base) continue;

    const milkLabel = MENU_MILKS[milkKey];
    const surcharge =
      MATCHA_MILK_SURCHARGE[milkKey] + MATCHA_STYLE_SURCHARGE[styleKey];

    const styleSuffix =
      styleKey !== "classic" ? `-${MATCHA_STYLE_LABEL[styleKey]}` : "";
    const number = `${base.number}-${milkLabel}${styleSuffix}`;
    const displayStyle =
      styleKey !== "classic" ? ` • ${MATCHA_STYLE_LABEL[styleKey]}` : "";
    const name = `${base.name} • ${milkLabel}${displayStyle}`;

    return {
      product: {
        number,
        name,
        price: base.price + surcharge,
      },
      sauce: null,
    };
  }

  const coffeeBase = "cp-nau-da";
  if (id.startsWith(`${coffeeBase}-`)) {
    const milkKey = id.slice(coffeeBase.length + 1);
    if (!MENU_MILKS[milkKey]) return null;
    const base = PRODUCTS[coffeeBase];
    if (!base) return null;
    const milkLabel = MENU_MILKS[milkKey];
    return {
      product: {
        number: `${base.number}-${milkLabel}`,
        name: `${base.name} • ${milkLabel}`,
        price: base.price,
      },
      sauce: null,
    };
  }

  return null;
}

function resolveFriedRice(id) {
  let rest = id;
  let noVeggies = false;
  if (rest.endsWith(NO_VEGGIES_SUFFIX)) {
    noVeggies = true;
    rest = rest.slice(0, -NO_VEGGIES_SUFFIX.length);
  }
  const m = rest.match(/^a([1-7])-(soja|suesssauer|curry|matcha|mango|keine)$/);
  if (!m) return null;
  const baseId = `a${m[1]}`;
  const sauce = SAUCE_BY_TOKEN[m[2]];
  const base = PRODUCTS[baseId];
  if (!base || !sauce) return null;
  const suffixes = [sauce];
  if (noVeggies) suffixes.push(NO_VEGGIES_MOD);
  return { product: withSuffixes(base, suffixes), sauce: null };
}

function resolveRiceNoodleMain(id) {
  // Modifikatoren vom Ende abtrennen (Reihenfolge: ...-keinesosse-ohnegemuese).
  let rest = id;
  let noVeggies = false;
  let noSauce = false;
  if (rest.endsWith(NO_VEGGIES_SUFFIX)) {
    noVeggies = true;
    rest = rest.slice(0, -NO_VEGGIES_SUFFIX.length);
  }
  if (rest.endsWith(NO_SAUCE_SUFFIX)) {
    noSauce = true;
    rest = rest.slice(0, -NO_SAUCE_SUFFIX.length);
  }

  if (!rest.endsWith("-nudel") && !rest.endsWith("-reis")) return null;
  const type = rest.endsWith("-nudel") ? "nudel" : "reis";
  const baseId = rest.slice(0, -(type.length + 1));
  if (!baseId || baseId.startsWith("box-")) return null;
  if (/^a[1-7]$/.test(baseId)) return null;

  const base = PRODUCTS[baseId];
  if (!base) return null;

  const typeLabel = type === "nudel" ? "Nudel" : "Reis";
  const suffixes = [{ code: typeLabel, label: typeLabel }];
  if (noSauce) suffixes.push(NO_SAUCE_MOD);
  if (noVeggies) suffixes.push(NO_VEGGIES_MOD);
  return { product: withSuffixes(base, suffixes), sauce: null };
}

/** Box mit optionaler Soße (inkl. "keine") und optionalem "ohne Gemüse". */
function resolveBox(id) {
  if (!id.startsWith("box-")) return null;
  let rest = id;
  let noVeggies = false;
  if (rest.endsWith(NO_VEGGIES_SUFFIX)) {
    noVeggies = true;
    rest = rest.slice(0, -NO_VEGGIES_SUFFIX.length);
  }
  let sauce = null;
  const tokens = Object.keys(SAUCE_BY_TOKEN).sort((a, b) => b.length - a.length);
  for (const token of tokens) {
    if (rest.endsWith(`-${token}`)) {
      sauce = SAUCE_BY_TOKEN[token];
      rest = rest.slice(0, -(token.length + 1));
      break;
    }
  }
  const base = PRODUCTS[rest];
  if (!base) return null;
  const suffixes = [];
  if (sauce) suffixes.push(sauce);
  if (noVeggies) suffixes.push(NO_VEGGIES_MOD);
  return { product: withSuffixes(base, suffixes), sauce: null };
}

function resolveProduct(id) {
  if (typeof id !== "string" || id.length === 0) return null;
  const direct = PRODUCTS[id];
  if (direct) return { product: direct, sauce: null };

  const box = resolveBox(id);
  if (box) return box;

  const smoothie = resolveSmoothieProduct(id);
  if (smoothie) return { product: smoothie, sauce: null };

  const bowl = resolveBowlProduct(id);
  if (bowl) return bowl;

  const milkOpt = resolveMilkOptionProduct(id);
  if (milkOpt) return milkOpt;

  const fried = resolveFriedRice(id);
  if (fried) return fried;

  const riceNoodle = resolveRiceNoodleMain(id);
  if (riceNoodle) return riceNoodle;

  return null;
}

// In-Memory Rate Limit (pro Function-Instance / pro Vercel-Region).
// Vercel KV waere robuster, vermeidet aber zusaetzliches Setup.
// Limit: max 20 Requests pro 60 Sekunden pro IP.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateLimitBuckets = new Map();

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  if (Array.isArray(fwd) && fwd.length > 0) {
    return String(fwd[0]).split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function checkRateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    cleanupExpiredBuckets(now);
    return { allowed: true };
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true };
}

function cleanupExpiredBuckets(now) {
  if (rateLimitBuckets.size < 1000) return;
  for (const [ip, bucket] of rateLimitBuckets) {
    if (now >= bucket.resetAt) rateLimitBuckets.delete(ip);
  }
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY not set");
  }
  return new Stripe(key, { apiVersion: "2025-03-31.basil" });
}

// Supabase ist optional. Wenn ENV-Vars fehlen oder das Paket nicht
// geladen werden kann, wird der Insert uebersprungen statt zu crashen.
// Dynamic import verhindert, dass ein Modul-Loading-Fehler die ganze
// Vercel Function killt (FUNCTION_INVOCATION_FAILED beim Cold Start).
// Gibt { client, status } zurueck, damit der Aufrufer weiss warum es
// evtl. nicht klappt.
async function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "[supabase] missing env vars:",
      !url ? "SUPABASE_URL" : "",
      !key ? "SUPABASE_SERVICE_ROLE_KEY" : "",
    );
    return { client: null, status: "missing_env" };
  }
  try {
    const mod = await import("@supabase/supabase-js");
    return { client: mod.createClient(url, key), status: "ok" };
  } catch (err) {
    console.error("[supabase] import/createClient failed:", err?.message ?? err);
    return { client: null, status: "import_failed" };
  }
}

function normalizeQuantity(value) {
  const qty = Math.floor(Number(value));
  if (!Number.isFinite(qty)) return 1;
  return Math.min(20, Math.max(1, qty));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const rate = checkRateLimit(req);
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfterSec));
    return res.status(429).json({ error: "Zu viele Anfragen. Bitte warte kurz." });
  }

  try {
    const stripe = getStripe();
    const {
      cartItems,
      currency = "eur",
      customer = {},
      orderType = "pickup",
      address = {},
      note = "",
      origin,
      metadata: requestMetadata = {},
    } = req.body ?? {};

    const itemsFromBody = Array.isArray(cartItems)
      ? cartItems
      : Array.isArray(req.body?.items)
        ? req.body.items
        : [];

    if (itemsFromBody.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!isOrderingOpen()) {
      return res.status(409).json({
        error:
          "Online-Bestellannahme ist aktuell geschlossen (Annahmeschluss 30 Min vor Ladenschluss).",
      });
    }

    const normalizedOrigin =
      typeof origin === "string" && /^https?:\/\//.test(origin)
        ? origin
        : `https://${req.headers.host}`;

    const invalidItemIds = [];
    const lineItems = itemsFromBody
      .map((item) => {
        const id = typeof item?.id === "string" ? item.id : "";
        const resolved = resolveProduct(id);
        if (!resolved) {
          invalidItemIds.push(id || "unknown");
          return null;
        }

        const { product } = resolved;
        return {
          price_data: {
            currency,
            unit_amount: product.price,
            product_data: { name: product.name },
          },
          quantity: normalizeQuantity(item?.quantity),
        };
      })
      .filter(Boolean);

    if (invalidItemIds.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid item id(s): ${invalidItemIds.join(", ")}` });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "No valid items" });
    }

    // Mindestbestellwert auf die Waren-Summe (ohne Liefergebuehr) erzwingen.
    const subtotalCents = lineItems.reduce(
      (sum, li) => sum + li.price_data.unit_amount * li.quantity,
      0,
    );
    if (subtotalCents < MIN_ORDER_CENTS) {
      const minEur = (MIN_ORDER_CENTS / 100).toFixed(2).replace(".", ",");
      return res
        .status(400)
        .json({ error: `Mindestbestellwert ${minEur} € nicht erreicht.` });
    }

    if (orderType === "delivery") {
      lineItems.push({
        price_data: {
          currency,
          unit_amount: 200,
          product_data: { name: "Delivery fee" },
        },
        quantity: 1,
      });
    }

    const normalizedItems = itemsFromBody.map((item) => {
      const id = typeof item?.id === "string" ? item.id : "";
      const resolved = resolveProduct(id);
      const product = resolved?.product;
      const number =
        (typeof item?.number === "string" && item.number.trim()) ||
        product?.number ||
        "";
      const baseName =
        (typeof item?.name === "string" && item.name.trim()) ||
        product?.name ||
        id;
      // Abkuerzung ans Kitchen-Dashboard durchreichen: einerseits als
      // eigenes Feld `number`, andererseits dem Display-Name voranstellen
      // (z.B. "01 Matcha Latte (warm/kalt)"), damit sie auch dann sichtbar
      // ist, wenn das Dashboard nur `name` rendert.
      const displayName = number ? `${number} ${baseName}` : baseName;
      return {
        id,
        number,
        name: displayName,
        quantity: normalizeQuantity(item?.quantity),
      };
    });

    const sessionMetadata = {
      ...requestMetadata,
      customerName:
        requestMetadata.customerName ??
        (typeof customer.name === "string" ? customer.name : "unknown"),
      customerPhone:
        requestMetadata.customerPhone ??
        (typeof customer.phone === "string" ? customer.phone : "unknown"),
      orderType: requestMetadata.orderType ?? String(orderType),
      note: requestMetadata.note ?? (typeof note === "string" ? note : ""),
      address:
        requestMetadata.address ??
        (orderType === "delivery"
          ? JSON.stringify({
              street: address?.street ?? "",
              zip: address?.zip ?? "",
              city: address?.city ?? "",
            })
          : ""),
      pickup_time: requestMetadata.pickup_time ?? "",
      app: requestMetadata.app ?? "lys-website",
    };

    // Stripe-Metadata erlaubt max 500 Zeichen pro Wert (und max 50 Keys).
    // Items als JSON-Array speichern, damit das Kitchen Dashboard sie
    // direkt parsen kann ([{id,name,quantity}, ...]). Wenn der JSON-String
    // > 500 Zeichen ist, auf items_1, items_2, ... aufteilen. Jedes Chunk
    // ist selbst ein gueltiges JSON-Array, damit Konsumenten die Chunks
    // einzeln parsen und zusammenfuehren koennen.
    if (requestMetadata.items) {
      sessionMetadata.items = String(requestMetadata.items).slice(0, 500);
    } else {
      const fullJson = JSON.stringify(normalizedItems);
      if (fullJson.length <= 500) {
        sessionMetadata.items = fullJson;
      } else {
        const chunks = [];
        let currentChunk = [];
        for (const item of normalizedItems) {
          const candidate = JSON.stringify([...currentChunk, item]);
          if (candidate.length > 500 && currentChunk.length > 0) {
            chunks.push(JSON.stringify(currentChunk));
            currentChunk = [item];
          } else {
            currentChunk.push(item);
          }
        }
        if (currentChunk.length > 0) {
          chunks.push(JSON.stringify(currentChunk));
        }

        if (chunks.length === 1) {
          sessionMetadata.items = chunks[0];
        } else {
          sessionMetadata.items_count = String(chunks.length);
          chunks.forEach((chunk, i) => {
            sessionMetadata[`items_${i + 1}`] = chunk;
          });
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      // Embedded Checkout laeuft auf unserer Domain. Nach Abschluss leitet
      // Stripe das Top-Window auf return_url um (ersetzt success_url).
      // cancel_url ist im embedded-Modus nicht erlaubt — Abbruch bedeutet, der
      // Kunde bleibt einfach auf /checkout.
      return_url: `${normalizedOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email:
        typeof customer.email === "string" ? customer.email : undefined,
      metadata: sessionMetadata,
    });

    // Pending Order in Supabase loggen. Best-effort: Checkout-Flow
    // wird nicht blockiert, wenn der Insert scheitert. Errors werden
    // IMMER geloggt (auch in Production), damit wir sie in den Vercel
    // Function Logs sehen koennen.
    let pendingOrderStatus = "skipped";
    let pendingOrderError = null;
    const { client: supabase, status: supaStatus } = await getSupabase();
    if (supabase) {
      try {
        const { error: insertErr } = await supabase
          .from("pending_orders")
          .insert({
            session_id: session.id,
            items: JSON.stringify(normalizedItems),
          });
        if (insertErr) {
          pendingOrderStatus = "insert_error";
          pendingOrderError = insertErr.message;
          console.error(
            "[pending_orders] insert failed:",
            insertErr.message,
            insertErr.details ?? "",
            insertErr.hint ?? "",
          );
        } else {
          pendingOrderStatus = "saved";
          console.log(
            "[pending_orders] saved session_id=",
            session.id,
            "items=",
            normalizedItems.length,
          );
        }
      } catch (err) {
        pendingOrderStatus = "insert_threw";
        pendingOrderError = err?.message ?? String(err);
        console.error("[pending_orders] insert threw:", err?.message ?? err);
      }
    } else {
      pendingOrderStatus = supaStatus;
      console.error(
        "[pending_orders] skipped (supabase unavailable):",
        supaStatus,
      );
    }

    return res.status(200).json({
      client_secret: session.client_secret,
      session_id: session.id,
      pending_order: {
        status: pendingOrderStatus,
        error: pendingOrderError,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message ?? "Stripe error" });
  }
}
