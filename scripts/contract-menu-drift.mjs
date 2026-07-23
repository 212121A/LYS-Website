// Contract-Test: Menü × Stripe-PRODUCTS × Öffnungszeiten (Roadmap #11).
//
// Fängt genau die zwei Drift-Klassen, die live Incidents ausgelöst haben:
//   • P0-4: Öffnungszeiten liefen zwischen Frontend-openingHours.ts und
//     Server-create-checkout-session.js auseinander.
//   • P0-3: Ein Bowl-Topping-Token (schoko/kokos) existierte im Frontend,
//     aber nicht in der Server-Preistabelle → 400 beim Checkout.
//
// Vergleicht die Frontend-Autorität (orderItemCode.ts, menu.ts, openingHours.ts)
// gegen die Server-Preisautorität (api/stripe/create-checkout-session.js).
// Preise: Frontend in EUR (Float), Server in Cent (Int) → EUR*100 === Cent.
//
// Ausführen:  npx tsx scripts/contract-menu-drift.mjs

import { menuCategories } from "../artifacts/ly-restaurant/src/data/menu.ts";
import {
  BOWL_TOPPING_SURCHARGE,
  MATCHA_MILK_SURCHARGE as FE_MATCHA_MILK,
  MATCHA_STYLE_SURCHARGE as FE_MATCHA_STYLE,
} from "../artifacts/ly-restaurant/src/lib/orderItemCode.ts";
import {
  OPENING_HOURS as FE_HOURS,
  LAST_ORDER_OFFSET_MINUTES as FE_LAST_ORDER,
  PRE_ORDER_LEAD_MINUTES as FE_PRE_ORDER,
} from "../artifacts/ly-restaurant/src/lib/openingHours.ts";
import {
  PRODUCTS,
  STANDARD_RATE_IDS,
  resolveProduct,
  OPENING_HOURS as SRV_HOURS,
  LAST_ORDER_OFFSET_MINUTES as SRV_LAST_ORDER,
  PRE_ORDER_LEAD_MINUTES as SRV_PRE_ORDER,
  BOWL_TOPPING_PRICE,
  MATCHA_MILK_SURCHARGE as SRV_MATCHA_MILK,
  MATCHA_STYLE_SURCHARGE as SRV_MATCHA_STYLE,
} from "../api/stripe/create-checkout-session.js";

const failures = [];
let checks = 0;
function expect(cond, msg) {
  checks += 1;
  if (!cond) failures.push(msg);
}
const eur = (n) => Math.round(n * 100);

// ── 1) Öffnungszeiten-Parität (P0-4) ────────────────────────────────────────
for (let day = 0; day <= 6; day += 1) {
  const fe = FE_HOURS[day];
  const srv = SRV_HOURS[day];
  expect(fe && srv, `Öffnungszeiten: Tag ${day} fehlt (fe=${!!fe} srv=${!!srv})`);
  if (fe && srv) {
    expect(
      fe.open === srv.open && fe.close === srv.close,
      `Öffnungszeiten Tag ${day}: FE ${fe.open}-${fe.close} ≠ Server ${srv.open}-${srv.close}`
    );
  }
}
expect(
  FE_LAST_ORDER === SRV_LAST_ORDER,
  `Annahmeschluss-Offset: FE ${FE_LAST_ORDER} ≠ Server ${SRV_LAST_ORDER}`
);
expect(
  FE_PRE_ORDER === SRV_PRE_ORDER,
  `Vorbestell-Offset: FE ${FE_PRE_ORDER} ≠ Server ${SRV_PRE_ORDER}`
);

// ── 2) Menü ↔ PRODUCTS: Preis/Code-Parität ──────────────────────────────────
const BOX_VARIANTS = [
  { key: "large-nudel", priceField: "price" },
  { key: "large-reis", priceField: "price" },
  { key: "small-nudel", priceField: "priceSmall" },
  { key: "small-reis", priceField: "priceSmall" },
];

for (const cat of menuCategories) {
  for (const item of cat.items) {
    const isBox = !item.number && item.id.startsWith("box-");
    if (isBox) {
      for (const variant of BOX_VARIANTS) {
        const eurPrice = item[variant.priceField];
        if (eurPrice == null) continue; // z.B. keine kleine Größe
        const cartId = `${item.id}-${variant.key}`;
        const prod = PRODUCTS[cartId];
        expect(prod, `Box fehlt in PRODUCTS: ${cartId} (Menü ${item.id})`);
        if (prod) {
          expect(
            prod.price === eur(eurPrice),
            `Box-Preis-Drift ${cartId}: Menü ${eur(eurPrice)}¢ ≠ PRODUCTS ${prod.price}¢`
          );
        }
      }
      continue;
    }
    // Nicht-Box: PRODUCTS ist per Menü-id gekeyt.
    const prod = PRODUCTS[item.id];
    expect(prod, `Menü-Item fehlt in PRODUCTS: ${item.id} (Nr. ${item.number})`);
    if (prod) {
      expect(
        prod.number === item.number,
        `Code-Drift ${item.id}: Menü number "${item.number}" ≠ PRODUCTS "${prod.number}"`
      );
      expect(
        prod.price === eur(item.price),
        `Preis-Drift ${item.id} (Nr. ${item.number}): Menü ${eur(item.price)}¢ ≠ PRODUCTS ${prod.price}¢`
      );
    }
  }
}

// ── 3) Modifikator-Parität (P0-3): FE-Token ⊆ Server + Preis gleich ─────────
function checkSurcharges(label, feMap, srvMap) {
  for (const [token, feEur] of Object.entries(feMap)) {
    const srvCents = srvMap[token];
    expect(
      srvCents !== undefined,
      `${label}: Token "${token}" fehlt serverseitig (FE-only → 400-Risiko wie P0-3)`
    );
    if (srvCents !== undefined) {
      expect(
        srvCents === eur(feEur),
        `${label}-Aufpreis-Drift "${token}": FE ${eur(feEur)}¢ ≠ Server ${srvCents}¢`
      );
    }
  }
}
checkSurcharges("Bowl-Topping", BOWL_TOPPING_SURCHARGE, BOWL_TOPPING_PRICE);
checkSurcharges("Matcha-Milch", FE_MATCHA_MILK, SRV_MATCHA_MILK);
checkSurcharges("Matcha-Style", FE_MATCHA_STYLE, SRV_MATCHA_STYLE);

// ── 4) USt-Klassifikation: nur GD1/GD2 mit 19 %, Rest der Karte 7 % ─────────
// Vorgabe Alex (2026-07-24). Der Regelsatz gilt ausschliesslich fuer die
// Kategorie "getraenke" (Softgetränke GD1, Wasser GD2). Kommt dort ein Artikel
// dazu, muss er in STANDARD_RATE_IDS — sonst liefe er still mit 7 %.
const STANDARD_RATE_CATEGORY = "getraenke";

for (const cat of menuCategories) {
  const shouldBeStandard = cat.id === STANDARD_RATE_CATEGORY;
  for (const item of cat.items) {
    const isStandard = STANDARD_RATE_IDS.has(item.id);
    expect(
      isStandard === shouldBeStandard,
      shouldBeStandard
        ? `USt: "${item.id}" (${cat.id}, Nr. ${item.number}) gehoert zum Regelsatz, fehlt aber in STANDARD_RATE_IDS → liefe mit 7 % statt 19 %`
        : `USt: "${item.id}" (${cat.id}, Nr. ${item.number}) steht in STANDARD_RATE_IDS, gehoert aber zum ermaessigten Satz → liefe mit 19 % statt 7 %`
    );
  }
}

for (const id of STANDARD_RATE_IDS) {
  expect(
    PRODUCTS[id] !== undefined,
    `USt: STANDARD_RATE_IDS-Eintrag "${id}" existiert nicht in PRODUCTS (tote Zeile)`
  );
}

// Cart-IDs mit Modifikatoren muessen auf dieselbe Basis (und damit denselben
// Steuersatz) zurueckfallen wie das nackte Item. Kritisch: "m8…m14" sind
// Speisen (Mango-Soße), "m-latte…" sind Getränke — reines Präfix-Matching
// wuerde hier falsch besteuern.
const VAT_CASES = [
  ["v1", 7],
  ["c2-nudel-keinesosse-ohnegemuese", 7],
  ["m8", 7],
  ["m8-reis", 7],
  ["m14-nudel-ohnegemuese", 7],
  ["a3-curry-ohnegemuese", 7],
  ["box-gemuse-large-nudel-soja", 7],
  ["box-huehnchen-small-reis", 7],
  ["bowl-acai", 7],
  ["bowl-acai-banane-ohne-topping", 7],
  ["m-latte", 7],
  ["m-latte-hafermilch", 7],
  ["m-dua-cloud-sojamilch", 7],
  ["cp-den-da", 7],
  ["cp-nau-da-hafermilch", 7],
  ["t-dao", 7],
  ["soda-chanh", 7],
  ["smoothie-all-banane-kokosmilch-honig", 7],
  ["smoothie-all-banane-kokosmilch-honig-protein", 7],
  ["kem-matcha-hafermilch", 7],
  ["kids-schoko", 7],
  ["g-soft", 19],
  ["g-wasser", 19],
];

for (const [cartId, expected] of VAT_CASES) {
  let resolved = null;
  try {
    resolved = resolveProduct(cartId);
  } catch (err) {
    expect(false, `USt: resolveProduct("${cartId}") wirft: ${err.message}`);
    continue;
  }
  expect(resolved, `USt: Cart-ID "${cartId}" nicht aufloesbar (400-Risiko)`);
  if (!resolved) continue;
  const actual = STANDARD_RATE_IDS.has(resolved.baseId) ? 19 : 7;
  expect(
    actual === expected,
    `USt: "${cartId}" → Basis "${resolved.baseId}" = ${actual} %, erwartet ${expected} %`
  );
}

// ── Ergebnis ────────────────────────────────────────────────────────────────
if (failures.length === 0) {
  console.log(`✓ Contract-Test grün — ${checks} Checks, kein Menü/Preis/Öffnungszeiten-Drift.`);
  process.exit(0);
}
console.error(`✗ Contract-Test: ${failures.length}/${checks} Checks fehlgeschlagen:\n`);
for (const f of failures) console.error(`  • ${f}`);
process.exit(1);
