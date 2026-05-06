/**
 * Kürzel-Mapping für Küchen-Dashboard.
 *
 * Boxen: Größe (K/G) + Typ (N/R) + Zutat (1..7) → z.B. "KN1", "GR7".
 * Gebratener Reis: bestehender Artikelcode (a1..a7) + Soße.
 * Andere Menü-Items behalten ihren bestehenden `number`-Code (c1, 01, GD2, …).
 *
 * Zentrale Quelle für die Anzeige "1x GN2" sowie für den an das
 * Kitchen-Dashboard gesendeten `number`-Wert.
 */

export type BoxSize = "small" | "large";
export type BoxType = "nudel" | "reis";
export type BoxSauce = "soja" | "suesssauer" | "curry" | "matcha" | "mango";
export type BowlFruit = "banane" | "erdbeere" | "blaubeere" | "himbeere" | "mango";
export type BowlTopping = "honig" | "agave" | "matcha" | "granola" | "schoko-kokos";
export type MenuMilk = "kuhmilch" | "sojamilch" | "hafermilch" | "kokosmilch";
export type MatchaStyle = "classic" | "frappe" | "protein";
export type SmoothieFruit =
  | "banane"
  | "erdbeere"
  | "mango"
  | "ananas"
  | "himbeere"
  | "blaubeere";
export type SmoothieMilk = "kokosmilch" | "hafermilch" | "sojamilch";
export type SmoothieSweetener = "none" | "agave" | "honig";

export const MENU_MILK_LABEL: Record<MenuMilk, string> = {
  kuhmilch: "Kuhmilch",
  sojamilch: "Sojamilch",
  hafermilch: "Hafermilch",
  kokosmilch: "Kokosmilch",
};

export const MENU_MILKS: MenuMilk[] = ["kuhmilch", "sojamilch", "hafermilch", "kokosmilch"];

export const MATCHA_MILK_SURCHARGE: Record<MenuMilk, number> = {
  kuhmilch: 0,
  sojamilch: 0.5,
  hafermilch: 0.5,
  kokosmilch: 0.5,
};

export const MATCHA_STYLE_LABEL: Record<MatchaStyle, string> = {
  classic: "Classic",
  frappe: "Frappe",
  protein: "Proteinmatcha",
};

export const MATCHA_STYLE_SURCHARGE: Record<MatchaStyle, number> = {
  classic: 0,
  frappe: 1,
  protein: 2,
};

export const MATCHA_STYLES: MatchaStyle[] = ["classic", "frappe", "protein"];

export const BOWL_TOPPING_LABEL: Record<BowlTopping, string> = {
  honig: "Honig",
  agave: "Agavendicksaft",
  matcha: "Matcha",
  granola: "Granola",
  "schoko-kokos": "Schoko/Kokos",
};

export const BOWL_TOPPING_SURCHARGE: Record<BowlTopping, number> = {
  honig: 0.5,
  agave: 0.5,
  matcha: 2,
  granola: 2,
  "schoko-kokos": 1,
};

export const BOWL_TOPPINGS: BowlTopping[] = [
  "honig",
  "agave",
  "matcha",
  "granola",
  "schoko-kokos",
];

export const BOWL_FRUIT_LABEL: Record<BowlFruit, string> = {
  banane: "Banane",
  erdbeere: "Erdbeere",
  blaubeere: "Blaubeere",
  himbeere: "Himbeere",
  mango: "Mango",
};

export const BOWL_FRUITS: BowlFruit[] = [
  "banane",
  "erdbeere",
  "blaubeere",
  "himbeere",
  "mango",
];

/** Lesbare deutsche Bezeichnung einer Box-Soße. */
export const BOX_SAUCE_LABEL: Record<BoxSauce, string> = {
  soja: "Sojasoße",
  suesssauer: "Süßsauersoße",
  curry: "Thaicurry mit Kokosmilch",
  matcha: "Matcha Soße",
  mango: "Mango Soße",
};

/**
 * Soßen-Suffix für das Kitchen-Dashboard. Vollständig ausgeschrieben,
 * damit das Dashboard konsistent "GN2-Sojasoße" statt eines uneinheitlichen
 * Buchstabencodes (S/SS/C) rendert.
 */
export const BOX_SAUCE_CODE: Record<BoxSauce, string> = {
  soja: "Sojasoße",
  suesssauer: "Süßsauersoße",
  curry: "Thaicurry mit Kokosmilch",
  matcha: "Matcha Soße",
  mango: "Mango Soße",
};

/** Auswahl-Reihenfolge im Dialog (stabile Reihenfolge). */
export const BOX_SAUCES: BoxSauce[] = ["soja", "suesssauer", "curry", "matcha", "mango"];

/** Basis-IDs der Box-Items (aus `src/data/menu.ts`, Kategorie "nudel-reisboxen"). */
const BOX_INGREDIENT_DIGIT: Record<string, 1 | 2 | 3 | 4 | 5 | 6 | 7> = {
  "box-gemuse": 1,
  "box-huehnchen": 2,
  "box-pan-huehnchen": 3,
  "box-fisch": 4,
  "box-fruehlingsrollen": 5,
  "box-tofu": 6,
  "box-garnelen": 7,
};

const BOX_INGREDIENT_LABEL: Record<number, string> = {
  1: "Gemüse",
  2: "Hähnchen",
  3: "Paniertes Hähnchen",
  4: "Fisch",
  5: "Vegetarische Frühlingsrollen",
  6: "Tofu",
  7: "Garnelen",
};

/** Prüft anhand der Basis-ID, ob das Item eine Nudel-/Reisbox ist. */
export function isBoxBaseId(baseId: string): boolean {
  return Object.prototype.hasOwnProperty.call(BOX_INGREDIENT_DIGIT, baseId);
}

/** Liefert das Kürzel (z. B. "KN1", "GR7") für eine Box-Variante. */
export function boxCode(
  baseId: string,
  size: BoxSize,
  type: BoxType,
  sauce?: BoxSauce,
): string | null {
  const digit = BOX_INGREDIENT_DIGIT[baseId];
  if (!digit) return null;
  const sizePrefix = size === "small" ? "K" : "G";
  const typePrefix = type === "nudel" ? "N" : "R";
  const base = `${sizePrefix}${typePrefix}${digit}`;
  return sauce ? `${base}-${BOX_SAUCE_CODE[sauce]}` : base;
}

/** Menschenlesbarer Name der Box-Variante (deutsch, für Rechnung/Dashboard). */
export function boxDisplayName(
  baseId: string,
  size: BoxSize,
  type: BoxType,
  sauce?: BoxSauce,
): string | null {
  const digit = BOX_INGREDIENT_DIGIT[baseId];
  if (!digit) return null;
  const sizeLabel = size === "small" ? "Kleine" : "Große";
  const typeLabel = type === "nudel" ? "Nudelbox" : "Reisbox";
  const base = `${sizeLabel} ${typeLabel} ${BOX_INGREDIENT_LABEL[digit]}`;
  return sauce ? `${base} • ${BOX_SAUCE_LABEL[sauce]}` : base;
}

/** Eindeutige Cart-ID über Varianten: id + size + type (+ sauce). */
export function boxCartId(
  baseId: string,
  size: BoxSize,
  type: BoxType,
  sauce?: BoxSauce,
): string {
  const base = `${baseId}-${size}-${type}`;
  return sauce ? `${base}-${sauce}` : base;
}

const RICE_NOODLE_MAIN_DISH_BASE_IDS = new Set([
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "e1",
  "e2",
  "e3",
  "e4",
  "e5",
  "e6",
  "e7",
  "m1",
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "m8",
  "m9",
  "m10",
  "m11",
  "m12",
  "m13",
  "m14",
]);

export function isRiceNoodleMainDishBaseId(baseId: string): boolean {
  return RICE_NOODLE_MAIN_DISH_BASE_IDS.has(baseId);
}

export function riceNoodleMainDishCode(
  itemNumber: string | undefined,
  type: BoxType,
): string | null {
  if (!itemNumber) return null;
  return `${itemNumber}-${type === "nudel" ? "Nudel" : "Reis"}`;
}

export function riceNoodleMainDishDisplayName(itemName: string, type: BoxType): string {
  return `${itemName} • ${type === "nudel" ? "Nudel" : "Reis"}`;
}

export function riceNoodleMainDishCartId(baseId: string, type: BoxType): string {
  return `${baseId}-${type}`;
}

const FRIED_RICE_BASE_IDS = new Set([
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
]);

/** Prüft anhand der Basis-ID, ob das Item aus der Kategorie "Gebratener Reis" ist. */
export function isFriedRiceBaseId(baseId: string): boolean {
  return FRIED_RICE_BASE_IDS.has(baseId);
}

export function friedRiceCode(itemNumber: string | undefined, sauce: BoxSauce): string | null {
  if (!itemNumber) return null;
  return `${itemNumber}-${BOX_SAUCE_CODE[sauce]}`;
}

export function friedRiceDisplayName(itemName: string, sauce: BoxSauce): string {
  return `${itemName} • ${BOX_SAUCE_LABEL[sauce]}`;
}

export function friedRiceCartId(baseId: string, sauce: BoxSauce): string {
  return `${baseId}-${sauce}`;
}

const BOWL_BASE_IDS = new Set([
  "bowl-oats1",
  "bowl-joghurt",
  "bowl-protein",
  "bowl-acai",
  "bowl-smoothie",
  "bowl-chia",
]);

export function isBowlBaseId(baseId: string): boolean {
  return BOWL_BASE_IDS.has(baseId);
}

function bowlFruitLabel(fruits: BowlFruit[]): string {
  return fruits.map((fruit) => BOWL_FRUIT_LABEL[fruit]).join("+");
}

function bowlToppingLabel(toppings: BowlTopping[]): string {
  return toppings.map((topping) => BOWL_TOPPING_LABEL[topping]).join("+");
}

export function bowlCode(
  itemNumber: string | undefined,
  fruits: BowlFruit[],
  toppings: BowlTopping[],
): string | null {
  if (!itemNumber) return null;
  const fruitSuffix = fruits.length > 0 ? `-${bowlFruitLabel(fruits)}` : "";
  const toppingSuffix = toppings.length > 0 ? `-${bowlToppingLabel(toppings)}` : "";
  return `${itemNumber}${fruitSuffix}${toppingSuffix}`;
}

export function bowlDisplayName(
  itemName: string,
  fruits: BowlFruit[],
  toppings: BowlTopping[],
): string {
  const parts = [
    fruits.length > 0
      ? `Früchte: ${fruits.map((fruit) => BOWL_FRUIT_LABEL[fruit]).join(", ")}`
      : "Früchte: keine Auswahl",
    toppings.length > 0
      ? `Toppings: ${toppings.map((topping) => BOWL_TOPPING_LABEL[topping]).join(", ")}`
      : "ohne Extra-Topping",
  ];
  return `${itemName} • ${parts.join(" • ")}`;
}

export function bowlCartId(
  baseId: string,
  fruits: BowlFruit[],
  toppings: BowlTopping[],
): string {
  const fruitKey = fruits.length > 0 ? fruits.slice().sort().join("-") : "keine-frucht";
  const toppingKey = toppings.length > 0 ? toppings.slice().sort().join("-") : "ohne-topping";
  return `${baseId}-${fruitKey}-${toppingKey}`;
}

export function bowlToppingTotal(toppings: BowlTopping[]): number {
  return toppings.reduce((sum, topping) => sum + BOWL_TOPPING_SURCHARGE[topping], 0);
}

const MATCHA_MILK_BASE_IDS = new Set([
  "m-latte",
  "m-dau",
  "m-xoai",
  "m-rasp",
  "m-vietquat",
  "m-dua-ananas",
  "m-vani",
  "m-dua-cloud",
  "kem-matcha",
  "kem-vani",
]);

export const COFFEE_MILK_BASE_ID = "cp-nau-da";

export function isMatchaMilkBaseId(baseId: string): boolean {
  return MATCHA_MILK_BASE_IDS.has(baseId);
}

export function isCoffeeMilkBaseId(baseId: string): boolean {
  return baseId === COFFEE_MILK_BASE_ID;
}

export function milkOptionCode(
  itemNumber: string | undefined,
  milk: MenuMilk,
  style?: MatchaStyle,
): string | null {
  if (!itemNumber) return null;
  const styleSuffix = style && style !== "classic" ? `-${MATCHA_STYLE_LABEL[style]}` : "";
  return `${itemNumber}-${MENU_MILK_LABEL[milk]}${styleSuffix}`;
}

export function milkOptionDisplayName(
  itemName: string,
  milk: MenuMilk,
  style?: MatchaStyle,
): string {
  const styleSuffix = style && style !== "classic" ? ` • ${MATCHA_STYLE_LABEL[style]}` : "";
  return `${itemName} • ${MENU_MILK_LABEL[milk]}${styleSuffix}`;
}

export function milkOptionCartId(
  baseId: string,
  milk: MenuMilk,
  style?: MatchaStyle,
): string {
  return style ? `${baseId}-${milk}-${style}` : `${baseId}-${milk}`;
}

export const SMOOTHIE_BASE_ID = "smoothie-all";

export const SMOOTHIE_FRUIT_LABEL: Record<SmoothieFruit, string> = {
  banane: "Banane",
  erdbeere: "Erdbeere",
  mango: "Mango",
  ananas: "Ananas",
  himbeere: "Himbeere",
  blaubeere: "Blaubeere",
};

export const SMOOTHIE_MILK_LABEL: Record<SmoothieMilk, string> = {
  kokosmilch: "Kokosmilch",
  hafermilch: "Hafermilch",
  sojamilch: "Sojamilch",
};

export const SMOOTHIE_SWEETENER_LABEL: Record<SmoothieSweetener, string> = {
  none: "Ohne Süße",
  agave: "Agavendicksaft",
  honig: "Honig",
};

export const SMOOTHIE_SWEETENER_SURCHARGE: Record<SmoothieSweetener, number> = {
  none: 0,
  agave: 0.5,
  honig: 0.5,
};

export const SMOOTHIE_SWEETENERS: SmoothieSweetener[] = ["none", "agave", "honig"];
export const SMOOTHIE_PROTEIN_SURCHARGE = 2;

export const SMOOTHIE_FRUITS: SmoothieFruit[] = [
  "banane",
  "erdbeere",
  "mango",
  "ananas",
  "himbeere",
  "blaubeere",
];

export const SMOOTHIE_MILKS: SmoothieMilk[] = [
  "kokosmilch",
  "hafermilch",
  "sojamilch",
];

export function isSmoothieBaseId(baseId: string): boolean {
  return baseId === SMOOTHIE_BASE_ID;
}

export function smoothieCode(
  fruits: SmoothieFruit[],
  milk: SmoothieMilk,
  sweetener: SmoothieSweetener,
  withProtein: boolean,
): string {
  const fruitLabel = fruits.map((fruit) => SMOOTHIE_FRUIT_LABEL[fruit]).join("+");
  const sweetenerLabel =
    sweetener === "none" ? "" : `-${SMOOTHIE_SWEETENER_LABEL[sweetener]}`;
  const proteinLabel = withProtein ? "-Protein" : "";
  return `23-${fruitLabel}-${SMOOTHIE_MILK_LABEL[milk]}${sweetenerLabel}${proteinLabel}`;
}

export function smoothieDisplayName(
  fruits: SmoothieFruit[],
  milk: SmoothieMilk,
  sweetener: SmoothieSweetener,
  withProtein: boolean,
): string {
  const fruitLabel = fruits.map((fruit) => SMOOTHIE_FRUIT_LABEL[fruit]).join(" + ");
  const extras = [
    SMOOTHIE_MILK_LABEL[milk],
    sweetener === "none" ? null : SMOOTHIE_SWEETENER_LABEL[sweetener],
    withProtein ? "Protein" : null,
  ].filter(Boolean);
  return `Smoothie ${fruitLabel} • ${extras.join(" • ")}`;
}

export function smoothieCartId(
  baseId: string,
  fruits: SmoothieFruit[],
  milk: SmoothieMilk,
  sweetener: SmoothieSweetener,
  withProtein: boolean,
): string {
  const fruitKey = fruits.slice().sort().join("-");
  return `${baseId}-${fruitKey}-${milk}-${sweetener}${withProtein ? "-protein" : ""}`;
}
