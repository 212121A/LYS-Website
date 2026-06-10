// Allergene & Zusatzstoffe – extrahiert aus der internen Kennzeichnungsliste
// (Allergene_Zusatzstoffe). Quelle der Wahrheit für die /allergene-Seite.
// Codes pro Gericht entsprechen den Menü-Nummern (C1–C7, S1–S7, … = Gemüse,
// Hähnchen, Paniertes Hähnchen, Fisch, Ente, Garnelen, Tofu).

export interface LegendEntry {
  code: string;
  label: string;
}

export interface DishEntry {
  /** Menü-Nummer bzw. Kennung (z.B. "C3", "01", "Nudel"). */
  ref: string;
  /** Klartext-Bezeichnung des Gerichts. */
  name?: string;
  /** Allergen-/Zusatzstoff-Codes laut Liste. */
  codes: string[];
  /** Sonderfall-Hinweis (z.B. bedingte Kennzeichnung). */
  note?: string;
}

export interface DishGroup {
  title: string;
  note?: string;
  items: DishEntry[];
}

export const ALLERGENS: LegendEntry[] = [
  { code: "1", label: "Glutenhaltiges Getreide und daraus gewonnene Erzeugnisse" },
  { code: "1a", label: "Weizen" },
  { code: "1b", label: "Gerste" },
  { code: "2", label: "Krebstiere und daraus gewonnene Erzeugnisse" },
  { code: "3", label: "Eier von Geflügel und daraus gewonnene Erzeugnisse" },
  { code: "4", label: "Fisch und daraus gewonnene Erzeugnisse (außer Fischgelatine)" },
  { code: "5", label: "Erdnüsse und daraus gewonnene Erzeugnisse" },
  { code: "6", label: "Sojabohnen und daraus gewonnene Erzeugnisse" },
  { code: "7", label: "Milch von Säugetieren und Milcherzeugnisse" },
  { code: "8", label: "Schalenfrüchte und daraus gewonnene Erzeugnisse" },
  { code: "9", label: "Sellerie und daraus gewonnene Erzeugnisse" },
  { code: "10", label: "Senf und daraus gewonnene Erzeugnisse" },
  { code: "11", label: "Sesamsamen und daraus gewonnene Erzeugnisse" },
  { code: "12", label: "Schwefeldioxid und Sulfite" },
  { code: "13", label: "Lupinen und daraus gewonnene Erzeugnisse" },
  { code: "14", label: "Weichtiere (z.B. Schnecken, Muscheln, Tintenfische) und daraus gewonnene Erzeugnisse" },
  { code: "15", label: "Laktose" },
  { code: "16", label: "Chili und Zitronengras" },
];

export const ADDITIVES: LegendEntry[] = [
  { code: "a", label: "Mit Farbstoff" },
  { code: "b", label: "Mit Konservierungsstoff" },
  { code: "c", label: "Mit Antioxidationsmittel" },
  { code: "d", label: "Mit Süßungsmitteln" },
  { code: "e", label: "Coffeinhaltig" },
  { code: "f", label: "Chininhaltig" },
  { code: "g", label: "Mit Geschmacksverstärker (E621)" },
];

export const DISH_GROUPS: DishGroup[] = [
  {
    title: "Vorspeisen",
    items: [
      { ref: "Nr. 1", name: "Nem Ran", codes: ["1", "1a", "3", "11"] },
      { ref: "Nr. 2", name: "Mini Frühlingsrollen (vegan)", codes: ["1", "1a", "11"] },
    ],
  },
  {
    title: "Thai Curry",
    note: "Thai-Curry-Soße: 7, 15, 16, g",
    items: [
      { ref: "C1", name: "Gemüse", codes: ["7", "15", "16", "g"] },
      { ref: "C2", name: "Hähnchenfleisch", codes: ["7", "15", "16", "g"] },
      { ref: "C3", name: "Paniertes Hähnchenfleisch", codes: ["1", "1a", "7", "15", "16", "g"] },
      { ref: "C4", name: "Fisch", codes: ["1", "1a", "4", "7", "15", "16", "g"] },
      { ref: "C5", name: "Ente", codes: ["1", "1a", "7", "15", "16", "g"] },
      { ref: "C6", name: "Garnelen", codes: ["4", "7", "15", "16", "g"] },
      { ref: "C7", name: "Tofu", codes: ["6", "7", "15", "16", "g"] },
    ],
  },
  {
    title: "Süß-Sauer",
    note: "Süßsauersoße: d",
    items: [
      { ref: "S1", name: "Gemüse", codes: ["d"] },
      { ref: "S2", name: "Hähnchenfleisch", codes: ["d"] },
      { ref: "S3", name: "Paniertes Hähnchenfleisch", codes: ["1", "1a", "d"] },
      { ref: "S4", name: "Fisch", codes: ["1", "1a", "4", "d"] },
      { ref: "S5", name: "Ente", codes: ["1", "1a", "d"] },
      { ref: "S6", name: "Garnelen", codes: ["4", "d"] },
      { ref: "S7", name: "Tofu", codes: ["6", "d"] },
    ],
  },
  {
    title: "Soja",
    note: "Sojasoße: 6, a, g",
    items: [
      { ref: "B1", name: "Gemüse", codes: ["6", "a", "g"] },
      { ref: "B2", name: "Hähnchenfleisch", codes: ["6", "a", "g"] },
      { ref: "B3", name: "Paniertes Hähnchenfleisch", codes: ["1", "1a", "6", "a", "g"] },
      { ref: "B4", name: "Fisch", codes: ["1", "4", "6", "a", "g"] },
      { ref: "B5", name: "Ente", codes: ["1", "1a", "6", "a", "g"] },
      { ref: "B6", name: "Garnelen", codes: ["4", "6", "a", "g"] },
      { ref: "B7", name: "Tofu", codes: ["6", "a", "g"] },
    ],
  },
  {
    title: "Erdnuss",
    note: "Erdnusssoße: 5, 7, 15, 16, g",
    items: [
      { ref: "E1", name: "Gemüse", codes: ["5", "7", "15", "16", "g"] },
      { ref: "E2", name: "Hähnchenfleisch", codes: ["5", "7", "15", "16", "g"] },
      { ref: "E3", name: "Paniertes Hähnchenfleisch", codes: ["1", "1a", "5", "7", "15", "16", "g"] },
      { ref: "E4", name: "Fisch", codes: ["1", "1a", "4", "5", "7", "15", "16", "g"] },
      { ref: "E5", name: "Ente", codes: ["1", "1a", "5", "7", "15", "16", "g"] },
      { ref: "E6", name: "Garnelen", codes: ["4", "5", "7", "15", "16", "g"] },
      { ref: "E7", name: "Tofu", codes: ["5", "6", "7", "15", "16", "g"] },
    ],
  },
  {
    title: "LYS Special – Matcha-Soße",
    note: "Matcha-Soße: 7, 15, 16, e, g",
    items: [
      { ref: "M1", name: "Gemüse", codes: ["7", "15", "16", "e", "g"] },
      { ref: "M2", name: "Hähnchenfleisch", codes: ["7", "15", "16", "e", "g"] },
      { ref: "M3", name: "Paniertes Hähnchenfleisch", codes: ["1", "1a", "7", "15", "16", "e", "g"] },
      { ref: "M4", name: "Fisch", codes: ["1", "1a", "4", "7", "15", "16", "e", "g"] },
      { ref: "M5", name: "Ente", codes: ["1", "1a", "7", "15", "16", "e", "g"] },
      { ref: "M6", name: "Garnelen", codes: ["4", "7", "15", "16", "e", "g"] },
      { ref: "M7", name: "Tofu", codes: ["6", "7", "15", "16", "e", "g"] },
    ],
  },
  {
    title: "LYS Special – Mango-Soße",
    note: "Mango-Soße: 7, 15, 16, g",
    items: [
      { ref: "M8", name: "Gemüse", codes: ["7", "15", "16", "g"] },
      { ref: "M9", name: "Hähnchenfleisch", codes: ["7", "15", "16", "g"] },
      { ref: "M10", name: "Paniertes Hähnchenfleisch", codes: ["1", "1a", "7", "15", "16", "g"] },
      { ref: "M11", name: "Fisch", codes: ["1", "1a", "4", "7", "15", "16", "g"] },
      { ref: "M12", name: "Ente", codes: ["1", "1a", "7", "15", "16", "g"] },
      { ref: "M13", name: "Garnelen", codes: ["4", "7", "15", "16", "g"] },
      { ref: "M14", name: "Tofu", codes: ["6", "7", "15", "16", "g"] },
    ],
  },
  {
    title: "Gebratener Reis",
    items: [
      { ref: "A1", name: "Mit Ei & Gemüse", codes: ["3", "g"] },
      { ref: "A2", name: "Hähnchenfleisch", codes: ["1", "1a", "3", "g"] },
      { ref: "A3", name: "Paniertes Hähnchenfleisch", codes: ["1", "1a", "3", "g"] },
      { ref: "A4", name: "Fisch", codes: ["1", "1a", "3", "4", "g"] },
      { ref: "A5", name: "Ente", codes: ["1", "1a", "3", "g"] },
      { ref: "A6", name: "Garnelen", codes: ["3", "4", "g"] },
      { ref: "A7", name: "Tofu", codes: ["3", "6", "g"] },
    ],
  },
  {
    title: "Nudel-/Reisbox – Basis & Einlagen",
    note: "In der Nudel ist E621 (g) enthalten, im Reis nicht.",
    items: [
      { ref: "Nudel", codes: ["g"] },
      { ref: "Reis", codes: [] },
      { ref: "Gemüse", codes: [] },
      { ref: "Hähnchen", codes: [] },
      { ref: "Paniertes Hähnchen", codes: ["1", "1a"] },
      { ref: "Fisch", codes: ["1", "1a", "4"] },
      { ref: "Veg. Frühlingsrollen", codes: ["1", "1a", "11"] },
      { ref: "Tofu", codes: ["6"] },
      { ref: "Garnelen", codes: ["4"] },
    ],
  },
  {
    title: "Matcha",
    items: [
      { ref: "01", name: "Matcha Latte", codes: ["7", "e"] },
      { ref: "02", name: "Matcha dâu (Erdbeere)", codes: ["7", "e"] },
      { ref: "03", name: "Matcha xoài (Mango)", codes: ["7", "e"] },
      { ref: "04", name: "Matcha Raspberry (Himbeere)", codes: ["7", "e"] },
      { ref: "05", name: "Matcha việt quất (Blaubeere)", codes: ["7", "e"] },
      { ref: "06", name: "Matcha dứa (Ananas)", codes: ["7", "e"] },
      { ref: "07", name: "Matcha vani (Vanille)", codes: ["7", "e"] },
      { ref: "08", name: "Matcha dừa (Coconut Cloud)", codes: ["7", "15", "e"] },
    ],
  },
  {
    title: "Cà Phê Việt Nam – Kaffee",
    items: [
      { ref: "09", name: "Schwarzer Kaffee", codes: ["e"] },
      { ref: "10", name: "Kaffee mit Kondensmilch", codes: ["7", "e"] },
      { ref: "11", name: "Schwarzer Kaffee mit Eis", codes: ["e"] },
      { ref: "12", name: "Kaffee mit Milch", codes: ["7", "e"] },
      { ref: "13", name: "Kaffee mit Kokosmilch", codes: ["15", "e"] },
      { ref: "14", name: "Kaffee mit Kondensmilch & Kokosmilch", codes: ["7", "15", "e"] },
    ],
  },
  {
    title: "Trà – Hausgemachter Eistee",
    items: [
      { ref: "15", name: "Trà chanh leo", codes: [] },
      { ref: "16", name: "Trà vải", codes: [] },
      { ref: "17", name: "Trà đào cam sả", codes: [] },
      { ref: "18", name: "Trà chanh", codes: [] },
    ],
  },
  {
    title: "Soda",
    items: [
      { ref: "19", name: "Soda chanh", codes: [] },
      { ref: "20", name: "Soda đào", codes: [] },
      { ref: "21", name: "Soda vải", codes: [] },
      { ref: "22", name: "Soda dứa", codes: [] },
    ],
  },
  {
    title: "Sinh Tố – Smoothies",
    note: "Optionaler Matcha-Zusatz: e",
    items: [
      { ref: "23", name: "Alle Smoothies", codes: [] },
    ],
  },
  {
    title: "Bowls",
    items: [
      { ref: "24", name: "Overnight Oats", codes: ["1", "7"] },
      { ref: "25", name: "Joghurt Bowl", codes: ["7"] },
      { ref: "26", name: "Protein Bowl", codes: [] },
      { ref: "27", name: "Acai Bowl", codes: [], note: "ggf. 1 (bei Granola)" },
      { ref: "28", name: "Smoothie Bowl", codes: [], note: "ggf. 1 (bei Granola)" },
      { ref: "29", name: "Chia Pudding", codes: ["7"] },
    ],
  },
  {
    title: "Kem – Eis-Variationen",
    items: [
      { ref: "30", name: "Matcha Latte mit Matcha-Eis", codes: ["7", "e"] },
      { ref: "31", name: "Matcha Latte mit Vanilleeis", codes: ["7", "e"] },
    ],
  },
  {
    title: "Für die Kids",
    items: [
      { ref: "32", name: "Schoko Latte", codes: ["7"] },
    ],
  },
];
