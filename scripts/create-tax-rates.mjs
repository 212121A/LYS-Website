// Einmal-Setup: legt die beiden USt-Saetze als Stripe Tax Rates an und gibt die
// IDs aus, die als STRIPE_TAX_RATE_REDUCED / STRIPE_TAX_RATE_STANDARD nach
// Vercel gehoeren (siehe .env.example).
//
// Warum ein Script statt Dashboard-Klicken: `inclusive: true` ist der Schalter,
// der bei falscher Wahl ("Zusaetzlich") alle Menuepreise um 7 bzw. 19 % erhoeht.
// Hier steht er fest.
//
// Bewusst NICHT in package.json verdrahtet — das hier laeuft manuell, einmal:
//   export STRIPE_SECRET_KEY=sk_live_...
//   node scripts/create-tax-rates.mjs
//
// Idempotent: existiert bereits eine aktive Rate mit demselben Satz + inclusive
// + DE, wird deren ID ausgegeben statt eine Dublette anzulegen.

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY nicht gesetzt.");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2025-03-31.basil" });

const RATES = [
  {
    envVar: "STRIPE_TAX_RATE_REDUCED",
    percentage: 7,
    description: "Speisen 7 % (ermaessigt, § 12 Abs. 2 UStG)",
  },
  {
    envVar: "STRIPE_TAX_RATE_STANDARD",
    percentage: 19,
    description: "Getraenke 19 % (Regelsatz)",
  },
];

const existing = await stripe.taxRates.list({ limit: 100, active: true });

const results = [];
for (const rate of RATES) {
  const match = existing.data.find(
    (r) =>
      Number(r.percentage) === rate.percentage &&
      r.inclusive === true &&
      r.country === "DE",
  );

  if (match) {
    results.push({ ...rate, id: match.id, reused: true });
    continue;
  }

  const created = await stripe.taxRates.create({
    display_name: "USt",
    description: rate.description,
    percentage: rate.percentage,
    inclusive: true,
    country: "DE",
    tax_type: "vat",
    active: true,
  });
  results.push({ ...rate, id: created.id, reused: false });
}

console.log(`\nStripe-Modus: ${key.startsWith("sk_live_") ? "LIVE" : "TEST"}\n`);
for (const r of results) {
  console.log(
    `${r.percentage} % ${r.reused ? "(vorhanden)" : "(neu angelegt)"} — ${r.description}`,
  );
  console.log(`${r.envVar}=${r.id}\n`);
}
console.log(
  "Beide Zeilen in Vercel -> lys-website -> Settings -> Environment Variables\n" +
    "(Production UND Preview) eintragen, dann Redeploy.",
);
