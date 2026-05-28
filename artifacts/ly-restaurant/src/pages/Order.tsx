import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, Plus, Minus, Trash2, Phone, ArrowRight, X, Flame, Leaf, Download } from "lucide-react";
import { menuCategories, formatPrice, MenuItem } from "@/data/menu";
import { useLanguage } from "@/i18n/LanguageContext";
import menuT from "@/i18n/menuTranslations";
import {
  boxCartId,
  boxCode,
  boxDisplayName,
  bowlCartId,
  bowlCode,
  bowlDisplayName,
  BOWL_FRUIT_LABEL,
  BOWL_FRUITS,
  BOWL_TOPPING_LABEL,
  BOWL_TOPPING_SURCHARGE,
  BOWL_TOPPINGS,
  bowlToppingTotal,
  isBoxBaseId,
  BOX_SAUCE_LABEL,
  BOX_SAUCES,
  friedRiceCartId,
  friedRiceCode,
  friedRiceDisplayName,
  isCoffeeMilkBaseId,
  isBowlBaseId,
  isMatchaMilkBaseId,
  isRiceNoodleMainDishBaseId,
  isSmoothieBaseId,
  isFriedRiceBaseId,
  MATCHA_MILK_SURCHARGE,
  MATCHA_STYLE_LABEL,
  MATCHA_STYLE_SURCHARGE,
  MATCHA_STYLES,
  MENU_MILK_LABEL,
  MENU_MILKS,
  milkOptionCartId,
  milkOptionCode,
  milkOptionDisplayName,
  riceNoodleMainDishCartId,
  riceNoodleMainDishCode,
  riceNoodleMainDishDisplayName,
  SMOOTHIE_PROTEIN_SURCHARGE,
  SMOOTHIE_FRUIT_LABEL,
  SMOOTHIE_FRUITS,
  SMOOTHIE_MILK_LABEL,
  SMOOTHIE_MILKS,
  SMOOTHIE_SWEETENER_LABEL,
  SMOOTHIE_SWEETENER_SURCHARGE,
  SMOOTHIE_SWEETENERS,
  smoothieCartId,
  smoothieCode,
  smoothieDisplayName,
  type BoxSauce,
  type BoxSize,
  type BoxType,
  type BowlFruit,
  type BowlTopping,
  type MatchaStyle,
  type MenuMilk,
  type SmoothieFruit,
  type SmoothieMilk,
  type SmoothieSweetener,
} from "@/lib/orderItemCode";

interface CartItem extends MenuItem {
  quantity: number;
  size?: BoxSize;
  sauce?: BoxSauce;
  riceNoodleType?: BoxType;
  toppings?: BowlTopping[];
  fruits?: Array<BowlFruit | SmoothieFruit>;
  milk?: SmoothieMilk | MenuMilk;
  sweetener?: SmoothieSweetener;
  withProtein?: boolean;
}

interface PendingBox {
  item: MenuItem;
  size: BoxSize;
  type: BoxType;
}

interface PendingFriedRice {
  item: MenuItem;
}

interface PendingBowl {
  item: MenuItem;
}

interface PendingMilkOption {
  item: MenuItem;
  kind: "matcha" | "coffee";
}

interface PendingSmoothie {
  item: MenuItem;
}

export default function Order() {
  const { t, lang } = useLanguage();
  const mt = menuT[lang];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [boxTypeChoice, setBoxTypeChoice] = useState<Record<string, BoxType>>({});
  const [pendingBox, setPendingBox] = useState<PendingBox | null>(null);
  const [pendingFriedRice, setPendingFriedRice] = useState<PendingFriedRice | null>(null);
  const [sauceChoice, setSauceChoice] = useState<BoxSauce | null>(null);
  const [pendingBowl, setPendingBowl] = useState<PendingBowl | null>(null);
  const [bowlFruitChoice, setBowlFruitChoice] = useState<BowlFruit[]>([]);
  const [bowlToppingChoice, setBowlToppingChoice] = useState<BowlTopping[]>([]);
  const [pendingMilkOption, setPendingMilkOption] = useState<PendingMilkOption | null>(null);
  const [menuMilkChoice, setMenuMilkChoice] = useState<MenuMilk | null>(null);
  const [matchaStyleChoice, setMatchaStyleChoice] = useState<MatchaStyle>("classic");
  const [pendingSmoothie, setPendingSmoothie] = useState<PendingSmoothie | null>(null);
  const [smoothieFruitChoice, setSmoothieFruitChoice] = useState<SmoothieFruit[]>([]);
  const [smoothieMilkChoice, setSmoothieMilkChoice] = useState<SmoothieMilk | null>(null);
  const [smoothieSweetenerChoice, setSmoothieSweetenerChoice] =
    useState<SmoothieSweetener>("none");
  const [smoothieProteinChoice, setSmoothieProteinChoice] = useState(false);
  const [, navigate] = useLocation();

  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: t.menu.filterAll },
    { id: "vorspeisen", label: mt.catStarters },
    { id: "thaicurry", label: mt.catThaiCurry },
    { id: "suesssauer", label: mt.catSweetSour },
    { id: "soja", label: mt.catSoy },
    { id: "erdnuss", label: mt.catPeanut },
    { id: "matcha-sosse", label: mt.catMatchaSauce },
    { id: "mango-sosse", label: mt.catMangoSauce },
    { id: "gebratener-reis", label: mt.catFriedRice },
    { id: "nudel-reisboxen", label: mt.catBoxes },
    { id: "getraenke", label: mt.catDrinks },
    { id: "matcha", label: mt.catMatcha },
    { id: "ca-phe", label: mt.catCoffee },
    { id: "tra-eistee", label: mt.catTea },
    { id: "soda", label: mt.catSoda },
    { id: "sinh-to", label: mt.catSmoothie },
    { id: "bowls", label: mt.catBowls },
    { id: "kem", label: mt.catIceCream },
    { id: "kids", label: mt.catKids },
  ];

  const orderable = activeCategory === "all"
    ? menuCategories
    : menuCategories.filter((category) => category.id === activeCategory);

  const getBoxType = (baseId: string): BoxType => boxTypeChoice[baseId] ?? "nudel";

  const addRiceNoodleMainDishToCart = (item: MenuItem, type: BoxType) => {
    const translatedName = mt[item.nameKey as keyof typeof mt] || item.name;
    const code = riceNoodleMainDishCode(item.number, type);
    const displayName = riceNoodleMainDishDisplayName(translatedName, type);
    const cartId = riceNoodleMainDishCartId(item.id, type);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => (i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          id: cartId,
          name: displayName,
          number: code ?? item.number,
          quantity: 1,
          riceNoodleType: type,
        },
      ];
    });
  };

  const addBoxToCart = (
    item: MenuItem,
    size: BoxSize,
    type: BoxType,
    sauce: BoxSauce,
  ) => {
    const priceForSize =
      size === "small" && item.priceSmall !== undefined ? item.priceSmall : item.price;
    const code = boxCode(item.id, size, type, sauce);
    const displayName = boxDisplayName(item.id, size, type, sauce) ?? item.name;
    const cartId = boxCartId(item.id, size, type, sauce);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => (i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          id: cartId,
          name: displayName,
          number: code ?? undefined,
          price: priceForSize,
          quantity: 1,
          size,
          sauce,
        },
      ];
    });
  };

  const addFriedRiceToCart = (item: MenuItem, sauce: BoxSauce) => {
    const translatedName = mt[item.nameKey as keyof typeof mt] || item.name;
    const code = friedRiceCode(item.number, sauce);
    const displayName = friedRiceDisplayName(translatedName, sauce);
    const cartId = friedRiceCartId(item.id, sauce);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => (i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          id: cartId,
          name: displayName,
          number: code ?? item.number,
          quantity: 1,
          sauce,
        },
      ];
    });
  };

  const addBowlToCart = (
    item: MenuItem,
    fruits: BowlFruit[],
    toppings: BowlTopping[],
  ) => {
    const translatedName = mt[item.nameKey as keyof typeof mt] || item.name;
    const code = bowlCode(item.number, fruits, toppings);
    const displayName = bowlDisplayName(translatedName, fruits, toppings);
    const cartId = bowlCartId(item.id, fruits, toppings);
    const surcharge = bowlToppingTotal(toppings);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => (i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          id: cartId,
          name: displayName,
          number: code ?? item.number,
          price: item.price + surcharge,
          quantity: 1,
          fruits,
          toppings,
        },
      ];
    });
  };

  const addMilkOptionToCart = (
    item: MenuItem,
    milk: MenuMilk,
    kind: PendingMilkOption["kind"],
    style: MatchaStyle = "classic",
  ) => {
    const translatedName = mt[item.nameKey as keyof typeof mt] || item.name;
    const effectiveStyle = kind === "matcha" ? style : undefined;
    const code = milkOptionCode(item.number, milk, effectiveStyle);
    const displayName = milkOptionDisplayName(translatedName, milk, effectiveStyle);
    const cartId = milkOptionCartId(item.id, milk, effectiveStyle);
    const surcharge =
      kind === "matcha" ? MATCHA_MILK_SURCHARGE[milk] + MATCHA_STYLE_SURCHARGE[style] : 0;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => (i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          id: cartId,
          name: displayName,
          number: code ?? item.number,
          price: item.price + surcharge,
          quantity: 1,
          milk,
        },
      ];
    });
  };

  const addSmoothieToCart = (
    item: MenuItem,
    fruits: SmoothieFruit[],
    milk: SmoothieMilk,
    sweetener: SmoothieSweetener,
    withProtein: boolean,
  ) => {
    const code = smoothieCode(fruits, milk, sweetener, withProtein);
    const displayName = smoothieDisplayName(fruits, milk, sweetener, withProtein);
    const cartId = smoothieCartId(item.id, fruits, milk, sweetener, withProtein);
    const surcharge =
      SMOOTHIE_SWEETENER_SURCHARGE[sweetener] +
      (withProtein ? SMOOTHIE_PROTEIN_SURCHARGE : 0);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => (i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          id: cartId,
          name: displayName,
          number: code,
          price: item.price + surcharge,
          quantity: 1,
          fruits,
          milk,
          sweetener,
          withProtein,
        },
      ];
    });
  };

  const addToCart = (item: MenuItem, size?: BoxSize) => {
    if (isBoxBaseId(item.id)) {
      const effectiveSize: BoxSize = size ?? "large";
      const type = getBoxType(item.id);
      setPendingBox({ item, size: effectiveSize, type });
      setSauceChoice(null);
      return;
    }

    if (isRiceNoodleMainDishBaseId(item.id)) {
      addRiceNoodleMainDishToCart(item, getBoxType(item.id));
      return;
    }

    if (isFriedRiceBaseId(item.id)) {
      setPendingFriedRice({ item });
      setSauceChoice(null);
      return;
    }

    if (isBowlBaseId(item.id)) {
      setPendingBowl({ item });
      setBowlFruitChoice([]);
      setBowlToppingChoice([]);
      return;
    }

    if (isMatchaMilkBaseId(item.id)) {
      setPendingMilkOption({ item, kind: "matcha" });
      setMenuMilkChoice(null);
      setMatchaStyleChoice("classic");
      return;
    }

    if (isCoffeeMilkBaseId(item.id)) {
      setPendingMilkOption({ item, kind: "coffee" });
      setMenuMilkChoice(null);
      setMatchaStyleChoice("classic");
      return;
    }

    if (isSmoothieBaseId(item.id)) {
      setPendingSmoothie({ item });
      setSmoothieFruitChoice([]);
      setSmoothieMilkChoice(null);
      setSmoothieSweetenerChoice("none");
      setSmoothieProteinChoice(false);
      return;
    }

    const priceForSize =
      size === "small" && item.priceSmall !== undefined ? item.priceSmall : item.price;
    const cartId = size ? `${item.id}-${size}` : item.id;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => (i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, id: cartId, price: priceForSize, quantity: 1, size }];
    });
  };

  const confirmSauce = () => {
    if (!sauceChoice) return;
    if (pendingBox) {
      addBoxToCart(pendingBox.item, pendingBox.size, pendingBox.type, sauceChoice);
    } else if (pendingFriedRice) {
      addFriedRiceToCart(pendingFriedRice.item, sauceChoice);
    } else {
      return;
    }
    setPendingBox(null);
    setPendingFriedRice(null);
    setSauceChoice(null);
  };

  const confirmMilkOption = () => {
    if (!pendingMilkOption || !menuMilkChoice) return;
    addMilkOptionToCart(
      pendingMilkOption.item,
      menuMilkChoice,
      pendingMilkOption.kind,
      matchaStyleChoice,
    );
    setPendingMilkOption(null);
    setMenuMilkChoice(null);
    setMatchaStyleChoice("classic");
  };

  const confirmBowl = () => {
    if (!pendingBowl || bowlFruitChoice.length === 0) return;
    addBowlToCart(pendingBowl.item, bowlFruitChoice, bowlToppingChoice);
    setPendingBowl(null);
    setBowlFruitChoice([]);
    setBowlToppingChoice([]);
  };

  const confirmSmoothie = () => {
    if (!pendingSmoothie || smoothieFruitChoice.length === 0 || !smoothieMilkChoice) return;
    addSmoothieToCart(
      pendingSmoothie.item,
      smoothieFruitChoice,
      smoothieMilkChoice,
      smoothieSweetenerChoice,
      smoothieProteinChoice,
    );
    setPendingSmoothie(null);
    setSmoothieFruitChoice([]);
    setSmoothieMilkChoice(null);
    setSmoothieSweetenerChoice("none");
    setSmoothieProteinChoice(false);
  };

  const cancelSmoothie = () => {
    setPendingSmoothie(null);
    setSmoothieFruitChoice([]);
    setSmoothieMilkChoice(null);
    setSmoothieSweetenerChoice("none");
    setSmoothieProteinChoice(false);
  };

  const cancelMilkOption = () => {
    setPendingMilkOption(null);
    setMenuMilkChoice(null);
    setMatchaStyleChoice("classic");
  };

  const cancelBowl = () => {
    setPendingBowl(null);
    setBowlFruitChoice([]);
    setBowlToppingChoice([]);
  };

  const cancelSauce = () => {
    setPendingBox(null);
    setPendingFriedRice(null);
    setSauceChoice(null);
  };

  const sauceHeading =
    pendingBox
      ? `${mt[pendingBox.item.nameKey as keyof typeof mt] || pendingBox.item.name} · ${
          pendingBox.type === "nudel" ? "Nudel" : "Reis"
        } ${pendingBox.size === "small" ? t.order.small : t.order.large}`
      : pendingFriedRice
        ? mt[pendingFriedRice.item.nameKey as keyof typeof mt] || pendingFriedRice.item.name
        : null;
  const smoothieHeading =
    pendingSmoothie &&
    (mt[pendingSmoothie.item.nameKey as keyof typeof mt] || pendingSmoothie.item.name);
  const milkOptionHeading =
    pendingMilkOption &&
    (mt[pendingMilkOption.item.nameKey as keyof typeof mt] || pendingMilkOption.item.name);
  const bowlHeading =
    pendingBowl && (mt[pendingBowl.item.nameKey as keyof typeof mt] || pendingBowl.item.name);

  const updateQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.id === cartId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getItemLabel = (item: MenuItem) => {
    const translatedName = mt[item.nameKey as keyof typeof mt] || item.name;
    return item.number ? `${item.number} ${translatedName}` : translatedName;
  };

  /**
   * Kürzel-Anzeige im Warenkorb – identisch zum Voice-Agent-Format:
   * `{quantity}x {number}` (z.B. "1x GN2"). Ohne `number` Fallback auf Name.
   */
  const getCartPrimaryLabel = (item: CartItem): string => {
    if (item.number) return item.number;
    return mt[item.nameKey as keyof typeof mt] || item.name;
  };

  const goToCheckout = () => {
    if (cart.length === 0) return;
    localStorage.setItem("lys_cart", JSON.stringify(cart));
    navigate("/checkout");
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-card border-b border-border py-16 pattern-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">LYS</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{t.order.title}</h1>
          <p className="text-muted-foreground max-w-lg">{t.order.subtitle}</p>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Flame size={12} className="text-orange-500" /> {t.menu.spicy}</span>
            <span className="flex items-center gap-1.5"><Leaf size={12} className="text-primary" /> {t.menu.vegetarian}</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="/menus/Speisekarte.pdf"
              download="LYS-Speisekarte.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="download-speisekarte-order"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
            >
              <Download size={14} />
              Speisekarte (PDF)
            </a>
            <a
              href="/menus/Getraenkekarte.pdf"
              download="LYS-Getraenkekarte.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="download-getraenkekarte-order"
              className="inline-flex items-center gap-2 bg-background border border-border text-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent hover:-translate-y-0.5 transition-all"
            >
              <Download size={14} />
              Getränkekarte (PDF)
            </a>
          </div>
          <div className="mt-6 max-w-3xl rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-red-900">
            <p className="text-sm md:text-base font-semibold">
              Wichtiger Hinweis: Wir öffnen erst im Mai. Aktuell werden keine Bestellungen angenommen - bitte nicht bestellen.
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                data-testid={`filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[86rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-8">
          {/* Menu selection */}
          <div className="space-y-16">
            {orderable.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-8 lg:items-start"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={mt[category.nameKey as keyof typeof mt] || category.name}
                    loading="lazy"
                    className="hidden lg:block w-full aspect-[9/16] rounded-2xl object-cover border border-border shadow-md"
                  />
                ) : (
                  <div className="hidden lg:block" aria-hidden="true" />
                )}

                <div className="min-w-0">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    {mt[category.nameKey as keyof typeof mt] || category.name}
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {(category.subtitleKey || category.subtitle) && (
                  <p className="text-sm text-muted-foreground mb-6 -mt-2 whitespace-pre-line italic">
                    {mt[category.subtitleKey as keyof typeof mt] || category.subtitle}
                  </p>
                )}

                {category.id === "nudel-reisboxen" && (
                  <p className="text-xs text-muted-foreground mb-4 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2">
                    {t.order.sauceNote}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => {
                    const isBox = isBoxBaseId(item.id);
                    const activeBoxType = getBoxType(item.id);
                    return (
                    <div
                      key={item.id}
                      data-testid={`order-item-${item.id}`}
                      className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {item.number && (
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {item.number}
                              </span>
                            )}
                            <div className="flex items-center gap-1.5">
                              {item.spicy && <Flame size={12} className="text-orange-500 shrink-0" />}
                              {item.vegetarian && <Leaf size={12} className="text-primary shrink-0" />}
                            </div>
                          </div>
                          <h3 className="font-medium text-foreground text-sm leading-snug">
                            {mt[item.nameKey as keyof typeof mt] || item.name}
                          </h3>
                          {(item.descKey || item.description) && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {mt[item.descKey as keyof typeof mt] || item.description}
                            </p>
                          )}
                          {(isBox || isRiceNoodleMainDishBaseId(item.id)) && (
                            <div
                              role="group"
                              aria-label="Nudel oder Reis"
                              className="mt-2 inline-flex rounded-full border border-border bg-background p-0.5 text-[11px] font-medium"
                            >
                              {(["nudel", "reis"] as BoxType[]).map((typeOpt) => (
                                <button
                                  key={typeOpt}
                                  type="button"
                                  onClick={() =>
                                    setBoxTypeChoice((prev) => ({ ...prev, [item.id]: typeOpt }))
                                  }
                                  data-testid={`button-boxtype-${item.id}-${typeOpt}`}
                                  aria-pressed={activeBoxType === typeOpt}
                                  className={`px-3 py-1 rounded-full transition-colors ${
                                    activeBoxType === typeOpt
                                      ? "bg-primary text-primary-foreground"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {typeOpt === "nudel" ? "Nudel" : "Reis"}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 text-right">
                          {item.priceSmall !== undefined ? (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => addToCart(item, "small")}
                                data-testid={`button-add-${item.id}-small`}
                                className="flex items-center justify-end gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-primary/20"
                              >
                                <Plus size={10} />
                                {t.order.small} {formatPrice(item.priceSmall)}
                              </button>
                              <button
                                onClick={() => addToCart(item, "large")}
                                data-testid={`button-add-${item.id}-large`}
                                className="flex items-center justify-end gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-primary/20"
                              >
                                <Plus size={10} />
                                {t.order.large} {formatPrice(item.price)}
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end gap-2">
                              <span className="font-semibold text-foreground text-sm">{formatPrice(item.price)}</span>
                              <button
                                onClick={() => addToCart(item)}
                                data-testid={`button-add-${item.id}`}
                                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all hover:shadow-md active:scale-95"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart sidebar */}
          <div>
            <div className="sticky top-32">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-primary/5 border-b border-border px-5 py-4 flex items-center gap-2">
                  <ShoppingCart size={16} className="text-primary" />
                  <h3 className="font-semibold text-foreground">{t.order.cartTitle}</h3>
                  {cart.length > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">{t.order.cartEmpty}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.order.cartEmptyHint}</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {cart.map((item) => {
                        const primary = getCartPrimaryLabel(item);
                        const details = item.number
                          ? item.sauce || item.riceNoodleType || item.toppings || item.milk || item.fruits
                            ? item.name
                            : mt[item.nameKey as keyof typeof mt] || item.name
                          : item.size
                            ? item.size === "small"
                              ? t.order.small
                              : t.order.large
                            : null;
                        return (
                        <div key={item.id} className="flex items-center gap-3" data-testid={`cart-item-${item.id}`}>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground leading-snug truncate font-mono">
                              {item.quantity}x {primary}
                            </p>
                            {details && (
                              <p className="text-[10px] text-muted-foreground truncate">
                                {details}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              data-testid={`button-decrease-${item.id}`}
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              {item.quantity === 1 ? <Trash2 size={10} className="text-destructive" /> : <Minus size={10} />}
                            </button>
                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              data-testid={`button-increase-${item.id}`}
                              className="w-6 h-6 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                            >
                              <Plus size={10} className="text-primary" />
                            </button>
                          </div>
                          <span className="text-xs font-semibold text-foreground shrink-0 w-14 text-right">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                        );
                      })}
                    </div>
                  )}

                  {cart.length > 0 && (
                    <>
                      <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{t.order.total}</span>
                        <span className="font-bold text-foreground" data-testid="text-total">{formatPrice(total)}</span>
                      </div>

                      <button
                        onClick={goToCheckout}
                        data-testid="button-submit-order"
                        className="mt-4 w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        {t.order.checkout} <ArrowRight size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Phone alternative */}
              <div className="mt-4 bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">{t.order.phoneAlt}</p>
                <a
                  href="tel:xxxxxx"
                  data-testid="link-phone-order"
                  className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
                >
                  <Phone size={14} />
                  xxxxxx
                </a>
              </div>

              <div className="mt-4 bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-foreground">
                  🌍 Wir sprechen Ihre Sprache!
                </p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Bestellen Sie auch auf Englisch, Turkisch, Vietnamesisch oder
                  einer anderen Sprache - einfach anrufen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(pendingBox || pendingFriedRice) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sauce-dialog-title"
          className="fixed inset-0 z-50 flex items-end justify-center px-3 py-4 sm:items-center sm:px-4"
          onClick={cancelSauce}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div
            className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="sauce-dialog"
          >
            <div className="relative shrink-0 px-6 pt-6 pb-4">
              <button
                type="button"
                onClick={cancelSauce}
                aria-label="Schließen"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                data-testid="button-sauce-close"
              >
                <X size={18} />
              </button>
              <h2
                id="sauce-dialog-title"
                className="font-serif text-2xl font-bold text-foreground"
              >
                Soße auswählen
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Welche Soße möchtest du dazu?
              </p>
              {sauceHeading && (
                <p className="mt-2 text-sm font-medium text-foreground">
                  {sauceHeading}
                </p>
              )}
            </div>
            <div className="border-t border-border" />
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-5">
              {BOX_SAUCES.map((s) => {
                const active = sauceChoice === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSauceChoice(s)}
                    aria-pressed={active}
                    data-testid={`button-sauce-${s}`}
                    className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3.5 transition-colors ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        active ? "border-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {active && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </span>
                    <span className="text-base font-medium text-foreground">
                      {BOX_SAUCE_LABEL[s]}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex shrink-0 items-stretch border-t border-border bg-card">
              <button
                type="button"
                onClick={cancelSauce}
                className="flex-1 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                data-testid="button-sauce-cancel"
              >
                Abbrechen
              </button>
              <div className="w-px bg-border" />
              <button
                type="button"
                onClick={confirmSauce}
                disabled={!sauceChoice}
                className="flex-1 py-4 text-base font-semibold text-primary hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-sauce-confirm"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingBowl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bowl-dialog-title"
          className="fixed inset-0 z-50 flex items-end justify-center px-3 py-4 sm:items-center sm:px-4"
          onClick={cancelBowl}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div
            className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="bowl-dialog"
          >
            <div className="relative shrink-0 px-6 pt-6 pb-4">
              <button
                type="button"
                onClick={cancelBowl}
                aria-label="Schließen"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                data-testid="button-bowl-close"
              >
                <X size={18} />
              </button>
              <h2
                id="bowl-dialog-title"
                className="font-serif text-2xl font-bold text-foreground"
              >
                Früchte & Toppings auswählen
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Wähle deine Früchte inklusive und optional Extra-Toppings.
              </p>
              {bowlHeading && (
                <p className="mt-2 text-sm font-medium text-foreground">
                  {bowlHeading}
                </p>
              )}
            </div>
            <div className="border-t border-border" />
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Früchte inklusive
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {BOWL_FRUITS.map((fruit) => {
                    const active = bowlFruitChoice.includes(fruit);
                    return (
                      <button
                        key={fruit}
                        type="button"
                        onClick={() =>
                          setBowlFruitChoice((prev) =>
                            prev.includes(fruit)
                              ? prev.filter((selected) => selected !== fruit)
                              : [...prev, fruit],
                          )
                        }
                        aria-pressed={active}
                        data-testid={`button-bowl-fruit-${fruit}`}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {BOWL_FRUIT_LABEL[fruit]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Extra-Toppings
                </p>
                {BOWL_TOPPINGS.map((topping) => {
                  const active = bowlToppingChoice.includes(topping);
                  const surcharge = BOWL_TOPPING_SURCHARGE[topping];
                  return (
                    <button
                      key={topping}
                      type="button"
                      onClick={() =>
                        setBowlToppingChoice((prev) =>
                          prev.includes(topping)
                            ? prev.filter((selected) => selected !== topping)
                            : [...prev, topping],
                        )
                      }
                      aria-pressed={active}
                      data-testid={`button-bowl-topping-${topping}`}
                      className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3.5 transition-colors ${
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          active ? "border-primary bg-primary" : "border-muted-foreground/40"
                        }`}
                      >
                        {active && (
                          <span className="w-2 h-2 rounded-sm bg-primary-foreground" />
                        )}
                      </span>
                      <span className="flex-1 text-base font-medium text-foreground">
                        {BOWL_TOPPING_LABEL[topping]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        +{formatPrice(surcharge)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex shrink-0 items-stretch border-t border-border bg-card">
              <button
                type="button"
                onClick={cancelBowl}
                className="flex-1 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                data-testid="button-bowl-cancel"
              >
                Abbrechen
              </button>
              <div className="w-px bg-border" />
              <button
                type="button"
                onClick={confirmBowl}
                disabled={bowlFruitChoice.length === 0}
                className="flex-1 py-4 text-base font-semibold text-primary hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-bowl-confirm"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingMilkOption && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="milk-dialog-title"
          className="fixed inset-0 z-50 flex items-end justify-center px-3 py-4 sm:items-center sm:px-4"
          onClick={cancelMilkOption}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div
            className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="milk-dialog"
          >
            <div className="relative shrink-0 px-6 pt-6 pb-4">
              <button
                type="button"
                onClick={cancelMilkOption}
                aria-label="Schließen"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                data-testid="button-milk-close"
              >
                <X size={18} />
              </button>
              <h2
                id="milk-dialog-title"
                className="font-serif text-2xl font-bold text-foreground"
              >
                Milch auswählen
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Welche Milch möchtest du dazu?
              </p>
              {milkOptionHeading && (
                <p className="mt-2 text-sm font-medium text-foreground">
                  {milkOptionHeading}
                </p>
              )}
            </div>
            <div className="border-t border-border" />
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5">
              {pendingMilkOption.kind === "matcha" && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Zubereitung
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {MATCHA_STYLES.map((style) => {
                      const active = matchaStyleChoice === style;
                      const surcharge = MATCHA_STYLE_SURCHARGE[style];
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setMatchaStyleChoice(style)}
                          aria-pressed={active}
                          data-testid={`button-matcha-style-${style}`}
                          className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-colors ${
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          <span className="flex-1 text-sm font-medium text-foreground">
                            {MATCHA_STYLE_LABEL[style]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {surcharge > 0 ? `+${formatPrice(surcharge)}` : "inkl."}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Milch
                </p>
                <div className="space-y-3">
                  {MENU_MILKS.map((milk) => {
                    const active = menuMilkChoice === milk;
                    const surcharge =
                      pendingMilkOption.kind === "matcha" ? MATCHA_MILK_SURCHARGE[milk] : 0;
                    return (
                      <button
                        key={milk}
                        type="button"
                        onClick={() => setMenuMilkChoice(milk)}
                        aria-pressed={active}
                        data-testid={`button-milk-${milk}`}
                        className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3.5 transition-colors ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            active ? "border-primary" : "border-muted-foreground/40"
                          }`}
                        >
                          {active && (
                            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </span>
                        <span className="flex-1 text-base font-medium text-foreground">
                          {MENU_MILK_LABEL[milk]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {surcharge > 0 ? `+${formatPrice(surcharge)}` : "inkl."}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-stretch border-t border-border bg-card">
              <button
                type="button"
                onClick={cancelMilkOption}
                className="flex-1 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                data-testid="button-milk-cancel"
              >
                Abbrechen
              </button>
              <div className="w-px bg-border" />
              <button
                type="button"
                onClick={confirmMilkOption}
                disabled={!menuMilkChoice}
                className="flex-1 py-4 text-base font-semibold text-primary hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-milk-confirm"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingSmoothie && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="smoothie-dialog-title"
          className="fixed inset-0 z-50 flex items-end justify-center px-3 py-4 sm:items-center sm:px-4"
          onClick={cancelSmoothie}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div
            className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="smoothie-dialog"
          >
            <div className="relative shrink-0 px-6 pt-6 pb-4">
              <button
                type="button"
                onClick={cancelSmoothie}
                aria-label="Schließen"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                data-testid="button-smoothie-close"
              >
                <X size={18} />
              </button>
              <h2
                id="smoothie-dialog-title"
                className="font-serif text-2xl font-bold text-foreground"
              >
                Smoothie auswählen
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Welche Frucht und welche Milch möchtest du?
              </p>
              {smoothieHeading && (
                <p className="mt-2 text-sm font-medium text-foreground">
                  {smoothieHeading}
                </p>
              )}
            </div>
            <div className="border-t border-border" />
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Frucht
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SMOOTHIE_FRUITS.map((fruit) => {
                    const active = smoothieFruitChoice.includes(fruit);
                    return (
                      <button
                        key={fruit}
                        type="button"
                        onClick={() =>
                          setSmoothieFruitChoice((prev) =>
                            prev.includes(fruit)
                              ? prev.filter((selected) => selected !== fruit)
                              : [...prev, fruit],
                          )
                        }
                        aria-pressed={active}
                        data-testid={`button-smoothie-fruit-${fruit}`}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {SMOOTHIE_FRUIT_LABEL[fruit]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Milch
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SMOOTHIE_MILKS.map((milk) => {
                    const active = smoothieMilkChoice === milk;
                    return (
                      <button
                        key={milk}
                        type="button"
                        onClick={() => setSmoothieMilkChoice(milk)}
                        aria-pressed={active}
                        data-testid={`button-smoothie-milk-${milk}`}
                        className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-colors ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            active ? "border-primary" : "border-muted-foreground/40"
                          }`}
                        >
                          {active && (
                            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </span>
                        <span className="text-base font-medium text-foreground">
                          {SMOOTHIE_MILK_LABEL[milk]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Süße
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SMOOTHIE_SWEETENERS.map((sweetener) => {
                    const active = smoothieSweetenerChoice === sweetener;
                    const surcharge = SMOOTHIE_SWEETENER_SURCHARGE[sweetener];
                    return (
                      <button
                        key={sweetener}
                        type="button"
                        onClick={() => setSmoothieSweetenerChoice(sweetener)}
                        aria-pressed={active}
                        data-testid={`button-smoothie-sweetener-${sweetener}`}
                        className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-colors ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        <span className="flex-1 text-base font-medium text-foreground">
                          {SMOOTHIE_SWEETENER_LABEL[sweetener]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {surcharge > 0 ? `+${formatPrice(surcharge)}` : "inkl."}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSmoothieProteinChoice((prev) => !prev)}
                aria-pressed={smoothieProteinChoice}
                data-testid="button-smoothie-protein"
                className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-colors ${
                  smoothieProteinChoice
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <span className="flex-1 text-base font-medium text-foreground">
                  Als Proteinsmoothie
                </span>
                <span className="text-xs text-muted-foreground">
                  +{formatPrice(SMOOTHIE_PROTEIN_SURCHARGE)}
                </span>
              </button>
            </div>
            <div className="flex shrink-0 items-stretch border-t border-border bg-card">
              <button
                type="button"
                onClick={cancelSmoothie}
                className="flex-1 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                data-testid="button-smoothie-cancel"
              >
                Abbrechen
              </button>
              <div className="w-px bg-border" />
              <button
                type="button"
                onClick={confirmSmoothie}
                disabled={smoothieFruitChoice.length === 0 || !smoothieMilkChoice}
                className="flex-1 py-4 text-base font-semibold text-primary hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-smoothie-confirm"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
