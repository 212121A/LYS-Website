import type { LangCode } from "./translations";

/**
 * Allergene & Zusatzstoffe pro Gericht (Quelle: Allergene_Zusatzstoffe.pdf der Kuche).
 * Keys = MenuItem.id. Nur Gerichte, die in der Liste stehen, haben Eintrage –
 * Boxen und Getranke sind in der PDF nicht aufgefuhrt und bekommen daher kein (i).
 * Codes folgen der Legende in `allergenLabels` (kanonisch sortiert).
 */
export const ALLERGEN_CODES_BY_ITEM: Record<string, string[]> = {
  // Vorspeisen
  v1: ["1", "1a", "3", "11"],
  v2: ["1", "3", "11"],
  // Thai Curry
  c1: ["7", "15", "16", "g"],
  c2: ["7", "15", "16", "g"],
  c3: ["1", "1a", "7", "15", "16", "g"],
  c4: ["1", "3", "4", "7", "15", "16", "g"],
  c5: ["1", "1a", "7", "15", "16", "g"],
  c6: ["7", "15", "16", "g"],
  c7: ["6", "7", "15", "16", "g"],
  // Suss-Sauer
  s1: ["d"],
  s2: ["d"],
  s3: ["1", "1a", "d"],
  s4: ["4", "d"],
  s5: ["1", "1a", "d"],
  s6: ["d"],
  s7: ["6", "d"],
  // Soja
  b1: ["6", "a", "g"],
  b2: ["6", "a", "g"],
  b3: ["1", "1a", "6", "a", "g"],
  b4: ["1", "4", "6", "a", "g"],
  b5: ["1", "1a", "6", "a", "g"],
  b6: ["6", "a", "g"],
  b7: ["6", "a", "g"],
  // Erdnuss
  e1: ["5", "7", "15", "16", "g"],
  e2: ["5", "7", "15", "16", "g"],
  e3: ["1", "1a", "5", "7", "15", "16", "g"],
  e4: ["1", "4", "5", "7", "15", "16", "g"],
  e5: ["1", "1a", "5", "7", "15", "16", "g"],
  e6: ["5", "7", "15", "16", "g"],
  e7: ["5", "6", "7", "15", "16", "g"],
  // Matcha Sosse
  m1: ["7", "15", "16", "e", "g"],
  m2: ["7", "15", "16", "e", "g"],
  m3: ["1", "1a", "7", "15", "16", "e", "g"],
  m4: ["1", "4", "7", "15", "16", "e", "g"],
  m5: ["1", "1a", "7", "15", "16", "e", "g"],
  m6: ["7", "15", "16", "e", "g"],
  m7: ["6", "7", "15", "16", "e", "g"],
  // Mango Sosse
  m8: ["7", "15", "16", "g"],
  m9: ["7", "15", "16", "g"],
  m10: ["1", "1a", "7", "15", "16", "g"],
  m11: ["1", "1a", "4", "7", "15", "16", "g"],
  m12: ["1", "1a", "7", "15", "16", "g"],
  m13: ["7", "15", "16", "g"],
  m14: ["6", "7", "15", "16", "g"],
  // Gebratener Reis
  a1: ["3", "g"],
  a2: ["1", "1a", "3", "g"],
  a3: ["1", "1a", "3", "g"],
  a4: ["1", "1a", "3", "4", "g"],
  a5: ["1", "1a", "3", "g"],
  a6: ["3", "g"],
  a7: ["3", "6", "g"],
};

export function hasAllergenInfo(itemId: string): boolean {
  return itemId in ALLERGEN_CODES_BY_ITEM;
}

/** Code -> lesbares Label je Sprache. Nur die in der Speisekarte verwendeten Codes. */
export const allergenLabels: Record<LangCode, Record<string, string>> = {
  de: { "1": "Glutenhaltiges Getreide", "1a": "Weizen", "3": "Eier", "4": "Fisch", "5": "Erdnusse", "6": "Sojabohnen", "7": "Milch / Laktose", "11": "Sesam", "15": "Kokosmilch", "16": "Roter Curry", a: "Farbstoff", d: "Sussungsmittel", e: "Coffein", g: "Geschmacksverstarker (E621)" },
  vi: { "1": "Ngu coc chua gluten", "1a": "Lua mi", "3": "Trung", "4": "Ca", "5": "Dau phong", "6": "Dau nanh", "7": "Sua / Lactose", "11": "Vung (me)", "15": "Nuoc cot dua", "16": "Ca ri do", a: "Pham mau", d: "Chat tao ngot", e: "Caffeine", g: "Chat dieu vi (E621)" },
  en: { "1": "Cereals containing gluten", "1a": "Wheat", "3": "Egg", "4": "Fish", "5": "Peanuts", "6": "Soybeans", "7": "Milk / Lactose", "11": "Sesame", "15": "Coconut milk", "16": "Red curry", a: "Colourant", d: "Sweetener", e: "Caffeine", g: "Flavour enhancer (E621)" },
  fr: { "1": "Cereales contenant du gluten", "1a": "Ble", "3": "Oeuf", "4": "Poisson", "5": "Arachides", "6": "Soja", "7": "Lait / Lactose", "11": "Sesame", "15": "Lait de coco", "16": "Curry rouge", a: "Colorant", d: "Edulcorant", e: "Cafeine", g: "Exhausteur de gout (E621)" },
  es: { "1": "Cereales con gluten", "1a": "Trigo", "3": "Huevo", "4": "Pescado", "5": "Cacahuetes", "6": "Soja", "7": "Leche / Lactosa", "11": "Sesamo", "15": "Leche de coco", "16": "Curry rojo", a: "Colorante", d: "Edulcorante", e: "Cafeina", g: "Potenciador del sabor (E621)" },
  it: { "1": "Cereali contenenti glutine", "1a": "Frumento", "3": "Uova", "4": "Pesce", "5": "Arachidi", "6": "Soia", "7": "Latte / Lattosio", "11": "Sesamo", "15": "Latte di cocco", "16": "Curry rosso", a: "Colorante", d: "Dolcificante", e: "Caffeina", g: "Esaltatore di sapidita (E621)" },
  pt: { "1": "Cereais com gluten", "1a": "Trigo", "3": "Ovo", "4": "Peixe", "5": "Amendoim", "6": "Soja", "7": "Leite / Lactose", "11": "Sesamo", "15": "Leite de coco", "16": "Caril vermelho", a: "Corante", d: "Edulcorante", e: "Cafeina", g: "Intensificador de sabor (E621)" },
  pl: { "1": "Zboza zawierajace gluten", "1a": "Pszenica", "3": "Jaja", "4": "Ryby", "5": "Orzeszki ziemne", "6": "Soja", "7": "Mleko / Laktoza", "11": "Sezam", "15": "Mleko kokosowe", "16": "Czerwone curry", a: "Barwnik", d: "Substancja slodzaca", e: "Kofeina", g: "Wzmacniacz smaku (E621)" },
  ru: { "1": "Злаки с глютеном", "1a": "Пшеница", "3": "Яйца", "4": "Рыба", "5": "Арахис", "6": "Соя", "7": "Молоко / лактоза", "11": "Кунжут", "15": "Кокосовое молоко", "16": "Красный карри", a: "Краситель", d: "Подсластитель", e: "Кофеин", g: "Усилитель вкуса (E621)" },
  tr: { "1": "Gluten iceren tahillar", "1a": "Bugday", "3": "Yumurta", "4": "Balik", "5": "Yer fistigi", "6": "Soya", "7": "Sut / Laktoz", "11": "Susam", "15": "Hindistan cevizi sutu", "16": "Kirmizi kori", a: "Renklendirici", d: "Tatlandirici", e: "Kafein", g: "Lezzet artirici (E621)" },
  ar: { "1": "حبوب تحتوي على الغلوتين", "1a": "القمح", "3": "البيض", "4": "السمك", "5": "الفول السوداني", "6": "فول الصويا", "7": "الحليب / اللاكتوز", "11": "السمسم", "15": "حليب جوز الهند", "16": "الكاري الأحمر", a: "مادة ملونة", d: "محلٍّ", e: "الكافيين", g: "معزز نكهة (E621)" },
  zh: { "1": "含麸质谷物", "1a": "小麦", "3": "蛋", "4": "鱼", "5": "花生", "6": "大豆", "7": "奶 / 乳糖", "11": "芝麻", "15": "椰奶", "16": "红咖喱", a: "着色剂", d: "甜味剂", e: "咖啡因", g: "增味剂 (E621)" },
  ja: { "1": "グルテンを含む穀物", "1a": "小麦", "3": "卵", "4": "魚", "5": "ピーナッツ", "6": "大豆", "7": "乳 / 乳糖", "11": "ごま", "15": "ココナッツミルク", "16": "レッドカレー", a: "着色料", d: "甘味料", e: "カフェイン", g: "うま味調味料 (E621)" },
  ko: { "1": "글루텐 함유 곡물", "1a": "밀", "3": "달걀", "4": "생선", "5": "땅콩", "6": "대두", "7": "우유 / 유당", "11": "참깨", "15": "코코넛 밀크", "16": "레드 커리", a: "착색료", d: "감미료", e: "카페인", g: "향미증진제 (E621)" },
  nl: { "1": "Glutenbevattende granen", "1a": "Tarwe", "3": "Ei", "4": "Vis", "5": "Pinda's", "6": "Soja", "7": "Melk / Lactose", "11": "Sesam", "15": "Kokosmelk", "16": "Rode curry", a: "Kleurstof", d: "Zoetstof", e: "Cafeine", g: "Smaakversterker (E621)" },
  ro: { "1": "Cereale cu gluten", "1a": "Grau", "3": "Ou", "4": "Peste", "5": "Arahide", "6": "Soia", "7": "Lapte / Lactoza", "11": "Susan", "15": "Lapte de cocos", "16": "Curry rosu", a: "Colorant", d: "Indulcitor", e: "Cofeina", g: "Potentiator de aroma (E621)" },
  hu: { "1": "Gluten tartalmu gabona", "1a": "Buza", "3": "Tojas", "4": "Hal", "5": "Foldimogyoro", "6": "Szoja", "7": "Tej / Laktoz", "11": "Szezam", "15": "Kokusztej", "16": "Voros curry", a: "Szinezek", d: "Edesitoszer", e: "Koffein", g: "Izfokozo (E621)" },
  cs: { "1": "Obiloviny obsahujici lepek", "1a": "Psenice", "3": "Vejce", "4": "Ryby", "5": "Arasidy", "6": "Soja", "7": "Mleko / Laktoza", "11": "Sezam", "15": "Kokosove mleko", "16": "Cervene curry", a: "Barvivo", d: "Sladidlo", e: "Kofein", g: "Zvyraznovac chuti (E621)" },
  el: { "1": "Δημητριακά με γλουτένη", "1a": "Σιτάρι", "3": "Αυγό", "4": "Ψάρι", "5": "Φιστίκια", "6": "Σόγια", "7": "Γάλα / Λακτόζη", "11": "Σουσάμι", "15": "Γάλα καρύδας", "16": "Κόκκινο κάρι", a: "Χρωστική", d: "Γλυκαντικό", e: "Καφεΐνη", g: "Ενισχυτικό γεύσης (E621)" },
  hi: { "1": "ग्लूटेन युक्त अनाज", "1a": "गेहूँ", "3": "अंडा", "4": "मछली", "5": "मूंगफली", "6": "सोयाबीन", "7": "दूध / लैक्टोज़", "11": "तिल", "15": "नारियल का दूध", "16": "लाल करी", a: "रंजक", d: "मिठास कारक", e: "कैफ़ीन", g: "स्वाद वर्धक (E621)" },
  uk: { "1": "Злаки з глютеном", "1a": "Пшениця", "3": "Яйця", "4": "Риба", "5": "Арахіс", "6": "Соя", "7": "Молоко / лактоза", "11": "Кунжут", "15": "Кокосове молоко", "16": "Червоний карі", a: "Барвник", d: "Підсолоджувач", e: "Кофеїн", g: "Підсилювач смаку (E621)" },
};

/** Kurze UI-Strings rund um die Allergen-Anzeige. */
export const allergenUi: Record<LangCode, { title: string; show: string }> = {
  de: { title: "Allergene & Zusatzstoffe", show: "Allergene anzeigen" },
  vi: { title: "Chat gay di ung & phu gia", show: "Xem chat gay di ung" },
  en: { title: "Allergens & additives", show: "Show allergens" },
  fr: { title: "Allergenes & additifs", show: "Afficher les allergenes" },
  es: { title: "Alergenos y aditivos", show: "Mostrar alergenos" },
  it: { title: "Allergeni e additivi", show: "Mostra allergeni" },
  pt: { title: "Alergenos e aditivos", show: "Mostrar alergenos" },
  pl: { title: "Alergeny i dodatki", show: "Pokaz alergeny" },
  ru: { title: "Аллергены и добавки", show: "Показать аллергены" },
  tr: { title: "Alerjenler ve katki maddeleri", show: "Alerjenleri goster" },
  ar: { title: "مسببات الحساسية والإضافات", show: "عرض مسببات الحساسية" },
  zh: { title: "过敏原及添加剂", show: "显示过敏原" },
  ja: { title: "アレルゲン・添加物", show: "アレルゲンを表示" },
  ko: { title: "알레르기 유발물질 및 첨가물", show: "알레르기 정보 보기" },
  nl: { title: "Allergenen & additieven", show: "Allergenen tonen" },
  ro: { title: "Alergeni si aditivi", show: "Afiseaza alergenii" },
  hu: { title: "Allergenek es adalekanyagok", show: "Allergenek megjelenitese" },
  cs: { title: "Alergeny a pridatne latky", show: "Zobrazit alergeny" },
  el: { title: "Αλλεργιογόνα & πρόσθετα", show: "Εμφάνιση αλλεργιογόνων" },
  hi: { title: "एलर्जन और योजक", show: "एलर्जन दिखाएं" },
  uk: { title: "Алергени та добавки", show: "Показати алергени" },
};
