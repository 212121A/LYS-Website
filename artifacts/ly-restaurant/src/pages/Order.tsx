import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Phone, CheckCircle, X } from "lucide-react";
import { menuCategories, formatPrice, MenuItem } from "@/data/menu";

interface CartItem extends MenuItem {
  quantity: number;
  size?: "small" | "large";
}

export default function Order() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  const orderable = menuCategories.filter((c) => c.id !== "getraenke");

  const addToCart = (item: MenuItem, size?: "small" | "large") => {
    const price = size === "small" && item.priceSmall !== undefined ? item.priceSmall : item.price;
    const cartId = `${item.id}-${size ?? "regular"}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, id: cartId, price, quantity: 1, size }];
    });
  };

  const updateQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.id === cartId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Bestellung eingegangen!</h2>
          <p className="text-muted-foreground mb-2">
            Danke, <strong>{name}</strong>! Wir rufen Sie zurück, um die Bestellung zu bestätigen.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Oder rufen Sie uns direkt an:{" "}
            <a href="tel:071719994828" className="text-primary font-medium hover:underline">
              07171 / 9994828
            </a>
          </p>
          <button
            onClick={() => { setSubmitted(false); setCart([]); setName(""); setNote(""); }}
            data-testid="button-new-order"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all"
          >
            Neue Bestellung
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-card border-b border-border py-16 pattern-bg relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-[0.04] select-none pointer-events-none pr-8">
          <span className="font-serif text-[20rem] leading-none text-foreground">注</span>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Online</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Bestellen</h1>
          <p className="text-muted-foreground">
            Wählen Sie Ihre Gerichte und wir melden uns telefonisch zur Bestätigung.
          </p>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <Phone size={14} className="text-primary" />
            Direkt anrufen: <a href="tel:071719994828" className="text-primary font-medium hover:underline">07171 / 9994828</a>
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu selection */}
          <div className="lg:col-span-2 space-y-10">
            {orderable.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-4 mb-5">
                  <h2 className="font-serif text-xl font-bold text-foreground">{category.name}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {category.id === "nudel-reisboxen" && (
                  <p className="text-xs text-muted-foreground mb-4 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2">
                    Inkl. Soße: Sojasoße, Süßsauersoße oder Thaicurry mit Kokosmilch
                  </p>
                )}

                <div className="space-y-3">
                  {category.items.map((item) => (
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
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
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
                              Klein {formatPrice(item.priceSmall)}
                            </button>
                            <button
                              onClick={() => addToCart(item, "large")}
                              data-testid={`button-add-${item.id}-large`}
                              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-primary/20"
                            >
                              <Plus size={10} />
                              Groß {formatPrice(item.price)}
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
                  ))}
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
                  <h3 className="font-semibold text-foreground">Warenkorb</h3>
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
                      <p className="text-sm text-muted-foreground">Noch nichts im Warenkorb</p>
                      <p className="text-xs text-muted-foreground mt-1">Wählen Sie Gerichte aus</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3" data-testid={`cart-item-${item.id}`}>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground leading-snug truncate">{item.name}</p>
                            {item.size && (
                              <p className="text-[10px] text-muted-foreground capitalize">{item.size === "small" ? "Klein" : "Groß"}</p>
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
                      ))}
                    </div>
                  )}

                  {cart.length > 0 && (
                    <>
                      <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Gesamt</span>
                        <span className="font-bold text-foreground" data-testid="text-total">{formatPrice(total)}</span>
                      </div>

                      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                        <div>
                          <label htmlFor="order-name" className="text-xs font-medium text-foreground mb-1 block">Ihr Name *</label>
                          <input
                            id="order-name"
                            data-testid="input-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Max Mustermann"
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="order-note" className="text-xs font-medium text-foreground mb-1 block">Anmerkungen</label>
                          <textarea
                            id="order-note"
                            data-testid="input-note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="z.B. ohne Schärfe, extra Soße..."
                            rows={2}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          data-testid="button-submit-order"
                          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
                        >
                          Bestellung absenden
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Phone alternative */}
              <div className="mt-4 bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">Lieber telefonisch bestellen?</p>
                <a
                  href="tel:071719994828"
                  data-testid="link-phone-order"
                  className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
                >
                  <Phone size={14} />
                  07171 / 9994828
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
