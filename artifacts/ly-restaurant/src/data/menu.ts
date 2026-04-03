export interface MenuItem {
  id: string;
  number?: string;
  name: string;
  description?: string;
  price: number;
  priceSmall?: number;
  spicy?: boolean;
  vegetarian?: boolean;
  category: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "vorspeisen",
    name: "Vorspeisen",
    items: [
      {
        id: "v1",
        number: "V1",
        name: "Nem Ran",
        description: "Drei knusprig gebackene Frühlingsrollen gefüllt mit Hackfleisch, Gemüse & Vietnam. Kräutern",
        price: 4,
        category: "vorspeisen",
      },
      {
        id: "v3",
        number: "03",
        name: "Thai-Suppe",
        description: "",
        price: 3.5,
        category: "vorspeisen",
      },
      {
        id: "v4",
        number: "04",
        name: "Veget. Minifühlingsrollen",
        description: "",
        price: 2,
        vegetarian: true,
        category: "vorspeisen",
      },
    ],
  },
  {
    id: "reis-gebraten",
    name: "Reis gebraten",
    items: [
      {
        id: "r06",
        number: "06",
        name: "Mit Ei & Gemüse",
        description: "",
        price: 7,
        vegetarian: true,
        category: "reis-gebraten",
      },
      {
        id: "r07",
        number: "07",
        name: "Mit Ei, Hühnerfleisch & Gemüse",
        description: "",
        price: 8.5,
        category: "reis-gebraten",
      },
      {
        id: "r08",
        number: "08",
        name: "Mit Ei, Pan. Hühnerfleisch & Gemüse",
        description: "",
        price: 10.5,
        category: "reis-gebraten",
      },
      {
        id: "r09",
        number: "09",
        name: "Mit Ei, Gebr. Entenfleisch & Gemüse",
        description: "",
        price: 11.5,
        category: "reis-gebraten",
      },
    ],
  },
  {
    id: "nudel-gebraten",
    name: "Nudel gebraten",
    items: [
      {
        id: "n10",
        number: "10",
        name: "Mit Gemüse",
        description: "",
        price: 7,
        vegetarian: true,
        category: "nudel-gebraten",
      },
      {
        id: "n11",
        number: "11",
        name: "Mit Hühnerfleisch & Gemüse",
        description: "",
        price: 8.5,
        category: "nudel-gebraten",
      },
      {
        id: "n12",
        number: "12",
        name: "Mit Pan. Hühnerfleisch & Gemüse",
        description: "",
        price: 10.5,
        category: "nudel-gebraten",
      },
      {
        id: "n13",
        number: "13",
        name: "Mit Gebr. Entenfleisch & Gemüse",
        description: "",
        price: 11.5,
        category: "nudel-gebraten",
      },
    ],
  },
  {
    id: "huhnerfleisch-gebraten",
    name: "Gebratenes Hühnerfleisch mit Nudeln/Reis",
    items: [
      {
        id: "h14",
        number: "14",
        name: "Mit versch. Gemüse und Sojasoße",
        description: "",
        price: 9,
        category: "huhnerfleisch-gebraten",
      },
      {
        id: "h15",
        number: "15",
        name: "Mit Süßsauersoße, Ananas & Gemüse",
        description: "",
        price: 9,
        category: "huhnerfleisch-gebraten",
      },
      {
        id: "h16",
        number: "16",
        name: "Mit Erdnusssoße und Gemüse",
        description: "Leicht scharf",
        price: 9,
        spicy: true,
        category: "huhnerfleisch-gebraten",
      },
    ],
  },
  {
    id: "huhnerfleisch-paniert",
    name: "Hühnerfleisch paniert",
    items: [
      {
        id: "hp14p",
        number: "14P",
        name: "Mit versch. Gemüse und Sojasoße",
        description: "",
        price: 10.5,
        category: "huhnerfleisch-paniert",
      },
      {
        id: "hp15p",
        number: "15P",
        name: "Mit Süßsauersoße, Ananas & Gemüse",
        description: "",
        price: 10.5,
        category: "huhnerfleisch-paniert",
      },
      {
        id: "hp16p",
        number: "16P",
        name: "Mit Erdnusssoße und Gemüse",
        description: "Leicht scharf",
        price: 10.5,
        spicy: true,
        category: "huhnerfleisch-paniert",
      },
    ],
  },
  {
    id: "ente",
    name: "Entenfleisch (gebraten) mit Nudeln/Reis",
    items: [
      {
        id: "e19",
        number: "19",
        name: "Mit versch. Gemüse und Sojasoße",
        description: "",
        price: 11.5,
        category: "ente",
      },
      {
        id: "e20",
        number: "20",
        name: "Mit Süßsauersoße, Ananas & Gemüse",
        description: "",
        price: 11.5,
        category: "ente",
      },
      {
        id: "e21",
        number: "21",
        name: "Mit Erdnusssoße und Gemüse",
        description: "Leicht scharf",
        price: 11.5,
        spicy: true,
        category: "ente",
      },
    ],
  },
  {
    id: "thaicurry",
    name: "Thailändische Gerichte mit Nudeln/Reis in Thaicurry & Kokosmilch",
    items: [
      {
        id: "t1",
        number: "T1",
        name: "Hühnerfleisch mit Gemüse",
        description: "Leicht scharf",
        price: 9,
        spicy: true,
        category: "thaicurry",
      },
      {
        id: "t2",
        number: "T2",
        name: "Pan. Hühnerfleisch mit Gemüse",
        description: "Leicht scharf",
        price: 10.5,
        spicy: true,
        category: "thaicurry",
      },
      {
        id: "t4",
        number: "T4",
        name: "Gebr. Ente",
        description: "Leicht scharf",
        price: 11.5,
        spicy: true,
        category: "thaicurry",
      },
      {
        id: "t5",
        number: "T5",
        name: "Garnelen mit Gemüse",
        description: "Leicht scharf",
        price: 11.5,
        spicy: true,
        category: "thaicurry",
      },
      {
        id: "t6",
        number: "T6",
        name: "Tofu mit Gemüse",
        description: "Leicht scharf",
        price: 8.5,
        spicy: true,
        vegetarian: true,
        category: "thaicurry",
      },
    ],
  },
  {
    id: "nudel-reisboxen",
    name: "Nudel- & Reisboxen",
    items: [
      {
        id: "box-gemuese",
        name: "Mit Gemüse",
        description: "Inkl. Soße nach Wahl: Sojasoße, Süßsauersoße oder Thaicurry mit Kokosmilch",
        price: 5,
        priceSmall: 4,
        vegetarian: true,
        category: "nudel-reisboxen",
      },
      {
        id: "box-huehnerfleisch",
        name: "Mit Hühnerfleisch und Gemüse",
        description: "Inkl. Soße nach Wahl: Sojasoße, Süßsauersoße oder Thaicurry mit Kokosmilch",
        price: 6,
        priceSmall: 4.5,
        category: "nudel-reisboxen",
      },
      {
        id: "box-pan-huehnerfleisch",
        name: "Mit Pan. Hühnerfleisch und Gemüse",
        description: "Inkl. Soße nach Wahl",
        price: 6,
        category: "nudel-reisboxen",
      },
      {
        id: "box-fisch",
        name: "Mit Pan. Fisch und Gemüse",
        description: "Inkl. Soße nach Wahl",
        price: 6,
        category: "nudel-reisboxen",
      },
      {
        id: "box-fruehlingsrollen",
        name: "Mit 4 Veg. Frühlingsrollen und Gemüse",
        description: "Inkl. Soße nach Wahl",
        price: 6,
        vegetarian: true,
        category: "nudel-reisboxen",
      },
    ],
  },
  {
    id: "getraenke",
    name: "Getränke",
    items: [
      {
        id: "g-soft",
        name: "Softgetränke",
        description: "",
        price: 3,
        category: "getraenke",
      },
      {
        id: "g-wasser",
        name: "Wasser mit o. ohne Kohlensäure",
        description: "",
        price: 2,
        category: "getraenke",
      },
    ],
  },
];

export function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",") + " €";
}
