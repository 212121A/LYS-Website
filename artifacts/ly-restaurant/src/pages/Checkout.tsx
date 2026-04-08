import { useState, useEffect } from "react";
import { Link } from "wouter";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CheckCircle, ArrowLeft, Lock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: "small" | "large";
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID ?? "sb";

export default function Checkout() {
  const { t } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", note: "" });
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState({ street: "", city: "", zip: "" });
  const [step, setStep] = useState<"details" | "payment">("details");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lys_cart");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch {}
    }
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = orderType === "delivery" ? 2 : 0;
  const grandTotal = subtotal + deliveryFee;

  const fmt = (v: number) => v.toFixed(2).replace(".", ",") + " €";

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) return;
    setStep("payment");
  };

  if (success) {
    localStorage.removeItem("lys_cart");
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">{t.checkout.thankYou}</h2>
          <p className="text-muted-foreground mb-2">
            {t.checkout.thankYouMsg}, <strong>{customer.name}</strong>.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {t.checkout.thankYouPhone} <strong>{customer.phone}</strong>.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all">
            {t.checkout.backHome}
          </Link>
        </div>
      </div>
    );
  }

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

              {/* Pickup / Delivery */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-5">{t.checkout.pickupOrDelivery}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(["pickup", "delivery"] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                        orderType === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-foreground hover:border-primary/40"
                      }`}
                    >
                      {type === "pickup" ? t.checkout.pickup : t.checkout.delivery}
                    </button>
                  ))}
                </div>

                {orderType === "delivery" && (
                  <div className="mt-4 space-y-3">
                    <input
                      required
                      value={address.street}
                      onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder={t.checkout.streetPlaceholder}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        value={address.zip}
                        onChange={e => setAddress(p => ({ ...p, zip: e.target.value }))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder={t.checkout.zipPlaceholder}
                      />
                      <input
                        required
                        value={address.city}
                        onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder={t.checkout.cityPlaceholder}
                      />
                    </div>
                  </div>
                )}
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

                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "EUR" }}>
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "pill", color: "gold" }}
                    createOrder={(_data, actions) =>
                      actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{
                          amount: { value: grandTotal.toFixed(2), currency_code: "EUR" },
                          description: `LYS Noodle Box – ${customer.name}`,
                        }],
                      })
                    }
                    onApprove={async (_data, actions) => {
                      await actions.order!.capture();
                      setSuccess(true);
                    }}
                    onError={() => alert("PayPal-Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.")}
                  />
                </PayPalScriptProvider>
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
              {orderType === "delivery" && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t.checkout.deliveryFee}</span>
                  <span>2,00 €</span>
                </div>
              )}
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
