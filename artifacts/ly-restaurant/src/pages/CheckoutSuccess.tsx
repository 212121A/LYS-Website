import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const CHECKOUT_CONTEXT_KEY = "lys_checkout_context";
const CART_STORAGE_KEY = "lys_cart_v2";
const LEGACY_CART_STORAGE_KEY = "lys_cart";

interface CheckoutContext {
  customerName?: string;
  customerPhone?: string;
  orderType?: "pickup" | "delivery";
  total?: number;
  createdAt?: number;
}

export default function CheckoutSuccess() {
  const { t } = useLanguage();

  const context = useMemo<CheckoutContext>(() => {
    const raw = localStorage.getItem(CHECKOUT_CONTEXT_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
  }, []);

  const total =
    typeof context.total === "number" && Number.isFinite(context.total)
      ? `${context.total.toFixed(2).replace(".", ",")} EUR`
      : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 text-center shadow-lg">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-primary" />
        </div>
        <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">
          Zahlung erfolgreich
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
          {t.checkout.thankYou}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t.checkout.thankYouMsg}
          {context.customerName ? (
            <>
              {" "}
              <strong>{context.customerName}</strong>
            </>
          ) : null}
          .
        </p>

        <div className="bg-background border border-border rounded-2xl p-5 text-left space-y-2 mb-8">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Bestellart:</span>{" "}
            {context.orderType === "delivery" ? t.checkout.delivery : t.checkout.pickup}
          </p>
          {total ? (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Bezahlt:</span> {total}
            </p>
          ) : null}
          {context.customerPhone ? (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">
                {t.checkout.thankYouPhone}
              </span>{" "}
              <strong>{context.customerPhone}</strong>
            </p>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all"
          >
            <Home size={16} />
            {t.checkout.backHome}
          </Link>
          <Link
            href="/order"
            className="inline-flex items-center justify-center gap-2 border border-border bg-background px-6 py-3 rounded-full font-medium text-foreground hover:border-primary/40 transition-all"
          >
            <ShoppingBag size={16} />
            Neue Bestellung
          </Link>
        </div>
      </div>
    </div>
  );
}
