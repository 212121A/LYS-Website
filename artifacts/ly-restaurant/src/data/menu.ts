export interface MenuItem {
  id: string;
  number?: string;
  name: string;
  nameKey: string;
  description?: string;
  descKey?: string;
  price: number;
  priceSmall?: number;
  spicy?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  category: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameKey: string;
  subtitle?: string;
  subtitleKey?: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "vorspeisen",
    name: "Vorspeisen",
    nameKey: "catStarters",
    items: [
      { id: "v1", number: "1", name: "Nem Ran", nameKey: "nemRan", price: 4, category: "vorspeisen" },
      { id: "v2", number: "2", name: "Mini Frühlingsrollen (vegan)", nameKey: "miniRolls", price: 2, vegan: true, vegetarian: true, category: "vorspeisen" },
    ],
  },
  {
    id: "thaicurry",
    name: "Thai Curry",
    nameKey: "catThaiCurry",
    subtitle: "Kokosmilch, leicht scharf · Wahlweise mit Reis oder Nudeln",
    subtitleKey: "subtitleThaiCurry",
    items: [
      { id: "c1", number: "c1", name: "Gemüse", nameKey: "itemGemuse", price: 7, vegetarian: true, spicy: true, category: "thaicurry" },
      { id: "c2", number: "c2", name: "Hähnchenfleisch mit Gemüse", nameKey: "itemHuhn", price: 9, spicy: true, category: "thaicurry" },
      { id: "c3", number: "c3", name: "Paniertes Hähnchenfleisch mit Gemüse", nameKey: "itemHuhnPaniert", price: 10.5, spicy: true, category: "thaicurry" },
      { id: "c4", number: "c4", name: "Fisch mit Gemüse", nameKey: "itemFisch", price: 10.5, spicy: true, category: "thaicurry" },
      { id: "c5", number: "c5", name: "Ente mit Gemüse", nameKey: "itemEnte", price: 11.5, spicy: true, category: "thaicurry" },
      { id: "c6", number: "c6", name: "Garnelen mit Gemüse", nameKey: "itemGarnelen", price: 11.5, spicy: true, category: "thaicurry" },
      { id: "c7", number: "c7", name: "Tofu mit Gemüse", nameKey: "itemTofu", price: 8.5, vegetarian: true, spicy: true, category: "thaicurry" },
    ],
  },
  {
    id: "suesssauer",
    name: "Süß-Sauer Soße",
    nameKey: "catSweetSour",
    subtitle: "Wahlweise mit Reis oder Nudeln",
    subtitleKey: "subtitleRiceNoodles",
    items: [
      { id: "s1", number: "s1", name: "Gemüse", nameKey: "itemGemuse", price: 7, vegetarian: true, category: "suesssauer" },
      { id: "s2", number: "s2", name: "Hähnchenfleisch mit Gemüse & Ananas", nameKey: "itemHuhnAnanas", price: 9, category: "suesssauer" },
      { id: "s3", number: "s3", name: "Paniertes Hähnchenfleisch mit Gemüse & Ananas", nameKey: "itemHuhnPaniertAnanas", price: 10.5, category: "suesssauer" },
      { id: "s4", number: "s4", name: "Fisch mit Gemüse", nameKey: "itemFisch", price: 10.5, category: "suesssauer" },
      { id: "s5", number: "s5", name: "Ente mit Gemüse & Ananas", nameKey: "itemEnteAnanas", price: 11.5, category: "suesssauer" },
      { id: "s6", number: "s6", name: "Garnelen mit Gemüse & Ananas", nameKey: "itemGarnelenAnanas", price: 11.5, category: "suesssauer" },
      { id: "s7", number: "s7", name: "Tofu mit Gemüse & Ananas", nameKey: "itemTofuAnanas", price: 8.5, vegetarian: true, category: "suesssauer" },
    ],
  },
  {
    id: "soja",
    name: "Soja Soße",
    nameKey: "catSoy",
    subtitle: "Wahlweise mit Reis oder Nudeln",
    subtitleKey: "subtitleRiceNoodles",
    items: [
      { id: "b1", number: "b1", name: "Gemüse", nameKey: "itemGemuse", price: 7, vegetarian: true, category: "soja" },
      { id: "b2", number: "b2", name: "Hähnchenfleisch mit Gemüse", nameKey: "itemHuhn", price: 9, category: "soja" },
      { id: "b3", number: "b3", name: "Paniertes Hähnchenfleisch mit Gemüse", nameKey: "itemHuhnPaniert", price: 10.5, category: "soja" },
      { id: "b4", number: "b4", name: "Fisch mit Gemüse", nameKey: "itemFisch", price: 10.5, category: "soja" },
      { id: "b5", number: "b5", name: "Ente mit Gemüse", nameKey: "itemEnte", price: 11.5, category: "soja" },
      { id: "b6", number: "b6", name: "Garnelen mit Gemüse", nameKey: "itemGarnelen", price: 11.5, category: "soja" },
      { id: "b7", number: "b7", name: "Tofu mit Gemüse", nameKey: "itemTofu", price: 8.5, vegetarian: true, category: "soja" },
    ],
  },
  {
    id: "erdnuss",
    name: "Erdnuss Soße",
    nameKey: "catPeanut",
    subtitle: "Leicht scharf · Wahlweise mit Reis oder Nudeln",
    subtitleKey: "subtitlePeanut",
    items: [
      { id: "e1", number: "e1", name: "Gemüse", nameKey: "itemGemuse", price: 7, vegetarian: true, spicy: true, category: "erdnuss" },
      { id: "e2", number: "e2", name: "Hähnchenfleisch mit Gemüse", nameKey: "itemHuhn", price: 9, spicy: true, category: "erdnuss" },
      { id: "e3", number: "e3", name: "Paniertes Hähnchenfleisch mit Gemüse", nameKey: "itemHuhnPaniert", price: 10.5, spicy: true, category: "erdnuss" },
      { id: "e4", number: "e4", name: "Fisch mit Gemüse", nameKey: "itemFisch", price: 10.5, spicy: true, category: "erdnuss" },
      { id: "e5", number: "e5", name: "Ente mit Gemüse", nameKey: "itemEnte", price: 11.5, spicy: true, category: "erdnuss" },
      { id: "e6", number: "e6", name: "Garnelen mit Gemüse", nameKey: "itemGarnelen", price: 11.5, spicy: true, category: "erdnuss" },
      { id: "e7", number: "e7", name: "Tofu mit Gemüse", nameKey: "itemTofu", price: 8.5, vegetarian: true, spicy: true, category: "erdnuss" },
    ],
  },
  {
    id: "matcha-sosse",
    name: "LYS Special: Matcha Soße",
    nameKey: "catMatchaSauce",
    subtitle: "Wahlweise mit Reis oder Nudeln",
    subtitleKey: "subtitleRiceNoodles",
    items: [
      { id: "m1", number: "m1", name: "Gemüse", nameKey: "itemGemuse", price: 7, vegetarian: true, category: "matcha-sosse" },
      { id: "m2", number: "m2", name: "Hähnchenfleisch mit Gemüse", nameKey: "itemHuhn", price: 9, category: "matcha-sosse" },
      { id: "m3", number: "m3", name: "Paniertes Hähnchenfleisch mit Gemüse", nameKey: "itemHuhnPaniert", price: 10.5, category: "matcha-sosse" },
      { id: "m4", number: "m4", name: "Fisch mit Gemüse", nameKey: "itemFisch", price: 10.5, category: "matcha-sosse" },
      { id: "m5", number: "m5", name: "Ente mit Gemüse", nameKey: "itemEnte", price: 11.5, category: "matcha-sosse" },
      { id: "m6", number: "m6", name: "Garnelen mit Gemüse", nameKey: "itemGarnelen", price: 11.5, category: "matcha-sosse" },
      { id: "m7", number: "m7", name: "Tofu mit Gemüse", nameKey: "itemTofu", price: 8.5, vegetarian: true, category: "matcha-sosse" },
    ],
  },
  {
    id: "mango-sosse",
    name: "LYS Special: Mango Soße",
    nameKey: "catMangoSauce",
    subtitle: "Wahlweise mit Reis oder Nudeln",
    subtitleKey: "subtitleRiceNoodles",
    items: [
      { id: "m8", number: "m8", name: "Gemüse", nameKey: "itemGemuse", price: 7, vegetarian: true, category: "mango-sosse" },
      { id: "m9", number: "m9", name: "Hähnchenfleisch mit Gemüse", nameKey: "itemHuhn", price: 9, category: "mango-sosse" },
      { id: "m10", number: "m10", name: "Paniertes Hähnchenfleisch mit Gemüse", nameKey: "itemHuhnPaniert", price: 10.5, category: "mango-sosse" },
      { id: "m11", number: "m11", name: "Fisch mit Gemüse", nameKey: "itemFisch", price: 10.5, category: "mango-sosse" },
      { id: "m12", number: "m12", name: "Ente mit Gemüse", nameKey: "itemEnte", price: 11.5, category: "mango-sosse" },
      { id: "m13", number: "m13", name: "Garnelen mit Gemüse", nameKey: "itemGarnelen", price: 11.5, category: "mango-sosse" },
      { id: "m14", number: "m14", name: "Tofu mit Gemüse", nameKey: "itemTofu", price: 8.5, vegetarian: true, category: "mango-sosse" },
    ],
  },
  {
    id: "gebratener-reis",
    name: "Gebratener Reis",
    nameKey: "catFriedRice",
    subtitle: "Soßen frei wählbar: Thai Curry, Süß-Sauer, Soja, Erdnuss, Matcha, Mango",
    subtitleKey: "subtitleFriedRice",
    items: [
      { id: "a1", number: "a1", name: "Mit Ei & Gemüse", nameKey: "reisMitEi", price: 7, vegetarian: true, category: "gebratener-reis" },
      { id: "a2", number: "a2", name: "Hähnchenfleisch mit Gemüse", nameKey: "itemHuhn", price: 8.5, category: "gebratener-reis" },
      { id: "a3", number: "a3", name: "Paniertes Hähnchenfleisch mit Gemüse", nameKey: "itemHuhnPaniert", price: 10.5, category: "gebratener-reis" },
      { id: "a4", number: "a4", name: "Fisch mit Gemüse", nameKey: "itemFisch", price: 10.5, category: "gebratener-reis" },
      { id: "a5", number: "a5", name: "Ente mit Gemüse", nameKey: "itemEnte", price: 11.5, category: "gebratener-reis" },
      { id: "a6", number: "a6", name: "Garnelen mit Gemüse", nameKey: "itemGarnelen", price: 10, category: "gebratener-reis" },
      { id: "a7", number: "a7", name: "Tofu mit Gemüse", nameKey: "itemTofu", price: 8.5, vegetarian: true, category: "gebratener-reis" },
    ],
  },
  {
    id: "nudel-reisboxen",
    name: "Nudel- & Reisboxen",
    nameKey: "catBoxes",
    subtitle: "Soßen frei wählbar: Thai Curry, Süß-Sauer, Soja, Erdnuss, Matcha, Mango · Soßen kombinierbar",
    subtitleKey: "subtitleBoxes",
    items: [
      { id: "box-gemuse", name: "Gemüse", nameKey: "boxGemuse", price: 5, priceSmall: 4, vegetarian: true, category: "nudel-reisboxen" },
      { id: "box-huehnchen", name: "Hähnchen", nameKey: "boxHuehnchen", price: 6, priceSmall: 4.5, category: "nudel-reisboxen" },
      { id: "box-pan-huehnchen", name: "Paniertes Hähnchen", nameKey: "boxHuhnPaniert", price: 6, category: "nudel-reisboxen" },
      { id: "box-fisch", name: "Fisch", nameKey: "boxFisch", price: 6, category: "nudel-reisboxen" },
      { id: "box-fruehlingsrollen", name: "Vegetarische Frühlingsrollen", nameKey: "boxFruehlingsrollen", price: 6, vegetarian: true, vegan: true, category: "nudel-reisboxen" },
      { id: "box-tofu", name: "Tofu", nameKey: "boxTofu", price: 8, vegetarian: true, category: "nudel-reisboxen" },
      { id: "box-garnelen", name: "Garnelen", nameKey: "boxGarnelen", price: 10, category: "nudel-reisboxen" },
    ],
  },
  {
    id: "getraenke",
    name: "Getränke",
    nameKey: "catDrinks",
    items: [
      { id: "g-soft", number: "g1", name: "Softgetränke (inkl. Pfand)", nameKey: "softDrinks", price: 3, category: "getraenke" },
      { id: "g-wasser", number: "g2", name: "Wasser (inkl. Pfand)", nameKey: "water", price: 2, category: "getraenke" },
    ],
  },
  {
    id: "matcha",
    name: "Matcha",
    nameKey: "catMatcha",
    items: [
      { id: "m-latte", number: "01", name: "Matcha Latte (warm/kalt)", nameKey: "matchaLatte", price: 4.5, vegetarian: true, category: "matcha" },
      { id: "m-dau", number: "02", name: "Matcha dâu (Erdbeere)", nameKey: "matchaDau", price: 5, vegetarian: true, category: "matcha" },
      { id: "m-xoai", number: "03", name: "Matcha xoài (Mango)", nameKey: "matchaXoai", price: 5, vegetarian: true, category: "matcha" },
      { id: "m-rasp", number: "04", name: "Matcha Raspberry (Himbeere)", nameKey: "matchaRaspberry", price: 5, vegetarian: true, category: "matcha" },
      { id: "m-vietquat", number: "05", name: "Matcha việt quất (Blaubeere)", nameKey: "matchaVietQuat", price: 5, vegetarian: true, category: "matcha" },
      { id: "m-dua-ananas", number: "06", name: "Matcha dứa (Ananas)", nameKey: "matchaDuaAnanas", price: 5, vegetarian: true, category: "matcha" },
      { id: "m-vani", number: "07", name: "Matcha vani (Vanille)", nameKey: "matchaVani", price: 5, vegetarian: true, category: "matcha" },
      { id: "m-dua-cloud", number: "08", name: "Matcha dừa (Coconut Cloud)", nameKey: "matchaDuaCloud", price: 5.5, vegetarian: true, category: "matcha" },
    ],
  },
  {
    id: "ca-phe",
    name: "Cà Phê Việt Nam",
    nameKey: "catCoffee",
    items: [
      { id: "cp-den", number: "09", name: "Cà phê đen", nameKey: "caPheDen", price: 4.5, category: "ca-phe" },
      { id: "cp-sua-da", number: "10", name: "Cà phê sữa đá", nameKey: "caPheSuaDa", price: 5, category: "ca-phe" },
      { id: "cp-den-da", number: "11", name: "Cà phê đen đá", nameKey: "caPheDenDa", price: 4.5, category: "ca-phe" },
      { id: "cp-nau-da", number: "12", name: "Cà phê nâu đá", nameKey: "caPheNauDa", price: 5, category: "ca-phe" },
      { id: "cp-dua", number: "13", name: "Cà phê dừa", nameKey: "caPheDua", price: 5, category: "ca-phe" },
      { id: "cp-bac-xiu", number: "14", name: "Bạc xỉu", nameKey: "bacXiu", price: 6, category: "ca-phe" },
    ],
  },
  {
    id: "tra-eistee",
    name: "Trà (Hausgemachter Eistee)",
    nameKey: "catTea",
    items: [
      { id: "t-chanh-leo", number: "15", name: "Chanh leo (Passionsfrucht)", nameKey: "traChanh", price: 6, vegetarian: true, category: "tra-eistee" },
      { id: "t-vai", number: "16", name: "Trà vải (Lychee Tee)", nameKey: "traVai", price: 6, vegetarian: true, category: "tra-eistee" },
      { id: "t-dao", number: "17", name: "Trà đào cam sả", nameKey: "traDao", price: 6, vegetarian: true, category: "tra-eistee" },
      { id: "t-chanh-simple", number: "18", name: "Trà chanh (Zitronentee)", nameKey: "traChanhSimple", price: 6, vegetarian: true, category: "tra-eistee" },
    ],
  },
  {
    id: "soda",
    name: "Soda",
    nameKey: "catSoda",
    items: [
      { id: "soda-chanh", number: "19", name: "Soda chanh (Zitrone)", nameKey: "sodaChanh", price: 6, vegetarian: true, category: "soda" },
      { id: "soda-dao", number: "20", name: "Soda đào (Pfirsich)", nameKey: "sodaDao", price: 6, vegetarian: true, category: "soda" },
      { id: "soda-vai", number: "21", name: "Soda vải (Lychee)", nameKey: "sodaVai", price: 6, vegetarian: true, category: "soda" },
      { id: "soda-dua", number: "22", name: "Soda dứa (Ananas)", nameKey: "sodaDua", price: 6, vegetarian: true, category: "soda" },
    ],
  },
  {
    id: "sinh-to",
    name: "Sinh Tố (Smoothies)",
    nameKey: "catSmoothie",
    items: [
      { id: "smoothie-all", number: "23", name: "Alle Smoothies", nameKey: "smoothieAll", description: "Banane · Erdbeere · Mango · Ananas · Himbeere · Blaubeere", descKey: "smoothieDesc", price: 6.5, vegetarian: true, category: "sinh-to" },
    ],
  },
  {
    id: "bowls",
    name: "Bowls",
    nameKey: "catBowls",
    subtitle: "Frische saisonale Früchte inklusive",
    subtitleKey: "bowlFreshFruits",
    items: [
      { id: "bowl-oats1", number: "24", name: "Overnight Oats mit Haferflocken & Milch", nameKey: "bowlOats1", price: 6.5, vegetarian: true, category: "bowls" },
      { id: "bowl-oats2", number: "25", name: "Overnight Oats mit Haferflocken, Milch und Chiapudding", nameKey: "bowlOats2", price: 6.5, vegetarian: true, category: "bowls" },
      { id: "bowl-chia", number: "29", name: "Chia Pudding", nameKey: "bowlChia", price: 6.5, vegetarian: true, description: "Toppings: Honig (+0,5) · Agavendicksaft (+0,5) · Matcha (+2) · Granola (+2) · Schoko/Kokos (+1)", descKey: "bowlToppings", category: "bowls" },
    ],
  },
  {
    id: "kem",
    name: "Kem",
    nameKey: "catIceCream",
    items: [
      { id: "kem-matcha", number: "30", name: "Matcha Latte với kem Matcha", nameKey: "kemMatchaIce", price: 6.5, vegetarian: true, category: "kem" },
      { id: "kem-vani", number: "31", name: "Matcha Latte với kem vani", nameKey: "kemVanilleIce", price: 6.5, vegetarian: true, category: "kem" },
    ],
  },
  {
    id: "kids",
    name: "Für die Kids",
    nameKey: "catKids",
    items: [
      { id: "kids-schoko", number: "32", name: "Schoko Latte (warm/kalt)", nameKey: "kidsSchoko", price: 4.5, vegetarian: true, category: "kids" },
    ],
  },
];

export function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",") + " €";
}
