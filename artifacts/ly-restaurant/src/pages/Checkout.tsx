import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CheckCircle, ArrowLeft, Lock, CreditCard, Smartphone, Building2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: "small" | "large";
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function StripePaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Zahlung fehlgeschlagen");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && (
        <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-medium text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Lock size={16} />
        {loading ? "Zahlung wird verarbeitet…" : "Jetzt bezahlen"}
      </button>
    </form>
  );
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", note: "" });
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState({ street: "", city: "", zip: "" });
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"details" | "payment">("details");
  const [loading, setLoading] = useState(false);

  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID ?? "sb";

  useEffect(() => {
    const saved = localStorage.getItem("lys_cart");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch {}
    }
  }, []);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCents = Math.round(total * 100);
  const deliveryFee = orderType === "delivery" ? 200 : 0;
  const grandTotalCents = totalCents + deliveryFee;

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) return;
    setLoading(true);

    if (paymentMethod === "stripe") {
      try {
        const cfgRes = await fetch(`${API_BASE}/api/stripe/config`);
        const { publishableKey } = await cfgRes.json();
        setStripePromise(loadStripe(publishableKey));

        const piRes = await fetch(`${API_BASE}/api/stripe/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotalCents,
            metadata: { customerName: customer.name, phone: customer.phone },
          }),
        });
        const { clientSecret: cs } = await piRes.json();
        setClientSecret(cs);
      } catch {
        alert("Verbindung zum Zahlungsserver fehlgeschlagen. Bitte versuchen Sie es erneut.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setStep("payment");
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Ihr Warenkorb ist leer.</p>
          <Link href="/order" className="text-primary font-medium hover:underline">Zurück zur Bestellung</Link>
        </div>
      </div>
    );
  }

  if (success) {
    localStorage.removeItem("lys_cart");
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Vielen Dank!</h2>
          <p className="text-muted-foreground mb-2">
            Ihre Bestellung wurde erfolgreich aufgegeben, <strong>{customer.name}</strong>.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Wir melden uns per Telefon unter <strong>{customer.phone}</strong> mit der Bestätigung.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { id: "stripe" as const, label: "Karte / Apple Pay / EC", icon: <CreditCard size={18} />, desc: "Visa, Mastercard, Apple Pay, Giropay & mehr" },
    { id: "paypal" as const, label: "PayPal", icon: <Building2 size={18} />, desc: "Bezahlen mit Ihrem PayPal-Konto" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/order" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft size={16} /> Zurück zur Bestellung
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: form */}
        <div className="lg:col-span-3 space-y-6">
          {step === "details" ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              {/* Customer details */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-5">Ihre Daten</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                      <input
                        required
                        value={customer.name}
                        onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="Ihr Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Telefon *</label>
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
                    <label className="block text-sm font-medium text-foreground mb-1.5">E-Mail</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="ihre@email.de"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Anmerkungen zur Bestellung</label>
                    <textarea
                      rows={2}
                      value={customer.note}
                      onChange={e => setCustomer(p => ({ ...p, note: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                      placeholder="z.B. ohne Schärfe, extra Soße …"
                    />
                  </div>
                </div>
              </div>

              {/* Order type */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-5">Abholung oder Lieferung</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(["pickup", "delivery"] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOrderType(t)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                        orderType === t
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-foreground hover:border-primary/40"
                      }`}
                    >
                      {t === "pickup" ? "🏪 Abholung" : "🛵 Lieferung (+2,00 €)"}
                    </button>
                  ))}
                </div>

                {orderType === "delivery" && (
                  <div className="mt-4 space-y-3">
                    <input
                      required={orderType === "delivery"}
                      value={address.street}
                      onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      placeholder="Straße und Hausnummer"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required={orderType === "delivery"}
                        value={address.zip}
                        onChange={e => setAddress(p => ({ ...p, zip: e.target.value }))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="PLZ"
                      />
                      <input
                        required={orderType === "delivery"}
                        value={address.city}
                        onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder="Ort"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment method selection */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-5">Zahlungsart</h2>
                <div className="space-y-3">
                  {paymentMethods.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === m.id
                          ? "bg-primary/8 border-primary text-foreground"
                          : "bg-background border-border hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${paymentMethod === m.id ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {m.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                      <div className="ml-auto">
                        <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === m.id ? "border-primary bg-primary" : "border-muted-foreground"}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                {loading ? "Wird geladen…" : "Weiter zur Zahlung"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <button onClick={() => setStep("details")} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <ArrowLeft size={16} /> Angaben bearbeiten
              </button>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <Lock size={16} className="text-primary" /> Sichere Zahlung
                </h2>

                {paymentMethod === "stripe" && stripePromise && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "flat", variables: { colorPrimary: "#5c4033", fontFamily: "Inter, sans-serif", borderRadius: "12px" } } }}>
                    <StripePaymentForm clientSecret={clientSecret} onSuccess={() => setSuccess(true)} />
                  </Elements>
                ) : paymentMethod === "paypal" ? (
                  <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "EUR" }}>
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "pill", color: "gold" }}
                      createOrder={(_data, actions) =>
                        actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            amount: { value: (grandTotalCents / 100).toFixed(2), currency_code: "EUR" },
                            description: `LYS Noodle Box – Bestellung von ${customer.name}`,
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
                ) : (
                  <p className="text-muted-foreground text-sm">Zahlungsformular wird geladen…</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
            <h2 className="font-serif text-xl font-bold text-foreground mb-5">Bestellung</h2>
            <div className="space-y-3 mb-5">
              {cart.map(item => (
                <div key={item.id} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-muted-foreground">{item.size === "small" ? "Klein" : "Groß"}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                    <p className="text-sm font-medium text-foreground">{(item.price * item.quantity).toFixed(2).replace(".", ",") + " €"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Zwischensumme</span>
                <span>{(total).toFixed(2).replace(".", ",") + " €"}</span>
              </div>
              {orderType === "delivery" && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Liefergebühr</span>
                  <span>2,00 €</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-foreground pt-1 border-t border-border">
                <span>Gesamt</span>
                <span>{((total + deliveryFee / 100)).toFixed(2).replace(".", ",") + " €"}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock size={12} />
              <span>SSL-verschlüsselte Zahlung</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
