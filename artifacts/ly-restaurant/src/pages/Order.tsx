import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, Plus, Minus, Trash2, Phone, ArrowRight, X } from "lucide-react";
import { menuCategories, formatPrice, MenuItem } from "@/data/menu";
import { useLanguage } from "@/i18n/LanguageContext";
import menuT from "@/i18n/menuTranslations";
import {
  boxCartId,
  boxCode,
  boxDisplayName,
  isBoxBaseId,
  BOX_SAUCE_LABEL,
  BOX_SAUCES,
  type BoxSauce,
  type BoxSize,
  type BoxType,
} from "@/lib/orderItemCode";

interface CartItem extends MenuItem {
  quantity: number;
  size?: BoxSize;
  sauce?: BoxSauce;
}

interface PendingBox {
  item: MenuItem;
  size: BoxSize;
  type: BoxType;
}

export default function Order() {
  const { t, lang } = useLanguage();
  const mt = menuT[lang];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [boxTypeChoice, setBoxTypeChoice] = useState<Record<string, BoxType>>({});
  const [pendingBox, setPendingBox] = useState<PendingBox | null>(null);
  const [sauceChoice, setSauceChoice] = useState<BoxSauce | null>(null);
  const [, navigate] = useLocation();

  const orderable = menuCategories;

  const getBoxType = (baseId: string): BoxType => boxTypeChoice[baseId] ?? "nudel";

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

  const addToCart = (item: MenuItem, size?: BoxSize) => {
    if (isBoxBaseId(item.id)) {
      const effectiveSize: BoxSize = size ?? "large";
      const type = getBoxType(item.id);
      setPendingBox({ item, size: effectiveSize, type });
      setSauceChoice(null);
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
    if (!pendingBox || !sauceChoice) return;
    addBoxToCart(pendingBox.item, pendingBox.size, pendingBox.type, sauceChoice);
    setPendingBox(null);
    setSauceChoice(null);
  };

  const cancelSauce = () => {
    setPendingBox(null);
    setSauceChoice(null);
  };

  const sauceHeading =
    pendingBox &&
    `${mt[pendingBox.item.nameKey as keyof typeof mt] || pendingBox.item.name} · ${
      pendingBox.type === "nudel" ? "Nudel" : "Reis"
    } ${pendingBox.size === "small" ? t.order.small : t.order.large}`;

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
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Online</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{t.order.title}</h1>
          <div className="max-w-3xl rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-red-900">
            <p className="text-sm md:text-base font-semibold">
              Wichtiger Hinweis: Wir öffnen erst im Mai. Aktuell werden keine Bestellungen angenommen - bitte nicht bestellen.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu selection */}
          <div className="lg:col-span-2 space-y-10">
            {orderable.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-4 mb-5">
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    {mt[category.nameKey as keyof typeof mt] || category.name}
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {category.id === "nudel-reisboxen" && (
                  <p className="text-xs text-muted-foreground mb-4 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2">
                    {t.order.sauceNote}
                  </p>
                )}

                <div className="space-y-3">
                  {category.items.map((item) => {
                    const isBox = isBoxBaseId(item.id);
                    const activeBoxType = getBoxType(item.id);
                    return (
                    <div
                      key={item.id}
                      data-testid={`order-item-${item.id}`}
                      className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {item.number && (
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.number}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {getItemLabel(item)}
                        </p>
                        {item.descKey && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {mt[item.descKey as keyof typeof mt] || item.description}
                          </p>
                        )}
                        {isBox && (
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

                      {/* Price & Add button */}
                      {item.priceSmall !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => addToCart(item, "small")}
                              data-testid={`button-add-${item.id}-small`}
                              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-primary/20"
                            >
                              <Plus size={10} />
                              {t.order.small} {formatPrice(item.priceSmall)}
                            </button>
                            <button
                              onClick={() => addToCart(item, "large")}
                              data-testid={`button-add-${item.id}-large`}
                              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-primary/20"
                            >
                              <Plus size={10} />
                              {t.order.large} {formatPrice(item.price)}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm text-foreground whitespace-nowrap">{formatPrice(item.price)}</span>
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
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Cart sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
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
                          ? mt[item.nameKey as keyof typeof mt] || item.name
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

      {pendingBox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sauce-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={cancelSauce}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            data-testid="sauce-dialog"
          >
            <div className="px-6 pt-6 pb-4 relative">
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
                Welche Soße möchtest du zu deiner Box?
              </p>
              {sauceHeading && (
                <p className="mt-2 text-sm font-medium text-foreground">
                  {sauceHeading}
                </p>
              )}
            </div>
            <div className="border-t border-border" />
            <div className="p-5 space-y-3">
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
            <div className="flex items-stretch border-t border-border">
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
    </div>
  );
}
