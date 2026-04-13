import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ArrowLeft, Lock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: "small" | "large";
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? ""
).replace(/\/$/, "");
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID ?? "sb";
const CHECKOUT_CONTEXT_KEY = "lys_checkout_context";

export default function Checkout() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", note: "" });
  const [step, setStep] = useState<"details" | "payment">("details");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">(
    "stripe",
  );
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lys_cart");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch {}
    }

    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get("status");

    if (status === "success") {
      navigate("/checkout/success", { replace: true });
      return;
    }

    if (status === "cancel") {
      setStep("payment");
      setCheckoutError("Zahlung wurde abgebrochen. Bitte versuchen Sie es erneut.");
    }
  }, [navigate]);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const grandTotal = subtotal;

  const fmt = (v: number) => v.toFixed(2).replace(".", ",") + " €";

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) return;
    setStep("payment");
  };

  const handleStripeCheckout = async () => {
    if (isRedirectingToStripe) return;
    setCheckoutError(null);
    setIsRedirectingToStripe(true);
    localStorage.setItem(
      CHECKOUT_CONTEXT_KEY,
      JSON.stringify({
        customerName: customer.name,
        customerPhone: customer.phone,
        orderType: "pickup",
        total: grandTotal,
        createdAt: Date.now(),
      }),
    );

    try {
      const endpoint = `${API_BASE_URL}/api/stripe/create-checkout-session`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          customer,
          orderType: "pickup",
          note: customer.note,
          origin: window.location.origin,
          currency: "eur",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Checkout session konnte nicht erstellt werden.");
      }

      const data = await response.json();
      if (!data?.url || typeof data.url !== "string") {
        throw new Error("Stripe Checkout URL fehlt.");
      }

      window.location.href = data.url;
    } catch (error: any) {
      setCheckoutError(error?.message ?? "Fehler beim Starten von Stripe Checkout.");
      setIsRedirectingToStripe(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t.checkout.cartEmpty}</p>
          <Link href="/order" className="text-primary font-medium hover:underline">{t.checkout.cartEmptyLink}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/order" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft size={16} /> {t.checkout.backToOrder}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: form */}
        <div className="lg:col-span-3 space-y-6">
          {step === "details" ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              {/* Customer details */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-5">{t.checkout.yourDetails}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{t.checkout.nameLabel}</label>
                      <input
                        required
                        value={customer.name}
                        onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="Max Mustermann"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{t.checkout.phoneLabelReq}</label>
                      <input
                        required
                        type="tel"
                        value={customer.phone}
                        onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="+49 ..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t.checkout.emailLabel}</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="ihre@email.de"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t.checkout.notesLabel}</label>
                    <textarea
                      rows={2}
                      value={customer.note}
                      onChange={e => setCustomer(p => ({ ...p, note: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                      placeholder={t.checkout.notesPlaceholder}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium text-base hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                {t.checkout.continueBtn}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <button onClick={() => setStep("details")} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <ArrowLeft size={16} /> {t.checkout.editDetails}
              </button>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <Lock size={16} className="text-primary" /> {t.checkout.securePayment}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">{t.checkout.payment}</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("stripe");
                      setCheckoutError(null);
                    }}
                    className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      paymentMethod === "stripe"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      Karte / <span className="text-base leading-none"></span> Apple Pay
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("paypal");
                      setCheckoutError(null);
                    }}
                    className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      paymentMethod === "paypal"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    PayPal
                  </button>
                </div>

                {paymentMethod === "stripe" ? (
                  <>
                    <button
                      type="button"
                      onClick={handleStripeCheckout}
                      disabled={isRedirectingToStripe}
                      className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Lock size={16} />
                      {isRedirectingToStripe
                        ? "Weiterleitung zu Stripe..."
                        : `Mit Karte /  Apple Pay bezahlen (${fmt(grandTotal)})`}
                    </button>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Apple Pay wird bei unterstuetzten Geraeten automatisch in Stripe Checkout angezeigt.
                    </p>
                  </>
                ) : (
                  <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "EUR" }}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "pill", color: "gold" }}
                      createOrder={(_data, actions) =>
                        actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            amount: { value: grandTotal.toFixed(2), currency_code: "EUR" },
                            description: `LYS Noodle Box - ${customer.name}`,
                          }],
                        })
                      }
                      onApprove={async (_data, actions) => {
                        await actions.order?.capture();
                        localStorage.setItem(
                          CHECKOUT_CONTEXT_KEY,
                          JSON.stringify({
                            customerName: customer.name,
                            customerPhone: customer.phone,
                            orderType: "pickup",
                            total: grandTotal,
                            createdAt: Date.now(),
                          }),
                        );
                        localStorage.removeItem("lys_cart");
                        navigate("/checkout/success");
                      }}
                      onError={() =>
                        setCheckoutError(
                          "PayPal-Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.",
                        )
                      }
                    />
                  </PayPalScriptProvider>
                )}
                {checkoutError && (
                  <p className="mt-4 text-sm text-destructive">{checkoutError}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
            <h2 className="font-serif text-xl font-bold text-foreground mb-5">{t.checkout.orderSummary}</h2>
            <div className="space-y-3 mb-5">
              {cart.map(item => (
                <div key={item.id} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    {item.size && (
                      <p className="text-xs text-muted-foreground">
                        {item.size === "small" ? t.order.small : t.order.large}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    <p className="text-sm font-medium text-foreground">{fmt(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t.checkout.subtotal}</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-foreground pt-1 border-t border-border">
                <span>{t.checkout.total}</span>
                <span>{fmt(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock size={12} />
              <span>{t.checkout.sslNote}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
