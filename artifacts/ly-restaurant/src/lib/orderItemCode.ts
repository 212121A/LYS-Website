/**
 * Kürzel-Mapping für Küchen-Dashboard.
 *
 * Boxen: Größe (K/G) + Typ (N/R) + Zutat (1..7) → z.B. "KN1", "GR7".
 * Andere Menü-Items behalten ihren bestehenden `number`-Code (c1, 01, GD2, …).
 *
 * Zentrale Quelle für die Anzeige "1x GN2" sowie für den an das
 * Kitchen-Dashboard gesendeten `number`-Wert.
 */

export type BoxSize = "small" | "large";
export type BoxType = "nudel" | "reis";
export type BoxSauce = "soja" | "suesssauer" | "curry";

/** Lesbare deutsche Bezeichnung einer Box-Soße. */
export const BOX_SAUCE_LABEL: Record<BoxSauce, string> = {
  soja: "Sojasoße",
  suesssauer: "Süßsauersoße",
  curry: "Thaicurry mit Kokosmilch",
};

/** Kurzcode für das Kitchen-Dashboard (z.B. GN2-S für Sojasoße). */
export const BOX_SAUCE_CODE: Record<BoxSauce, string> = {
  soja: "S",
  suesssauer: "SS",
  curry: "C",
};

/** Auswahl-Reihenfolge im Dialog (stabile Reihenfolge). */
export const BOX_SAUCES: BoxSauce[] = ["soja", "suesssauer", "curry"];

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
