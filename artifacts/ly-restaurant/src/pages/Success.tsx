import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function Success() {
  const sessionId = useMemo(() => {
    const search = new URLSearchParams(window.location.search);
    return search.get("session_id");
  }, []);

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      setErrorMessage(
        "Bitte fragen Sie an der Kasse nach Ihrer Bestellnummer.",
      );
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setIsLoading(false);
      setErrorMessage(
        "Bitte fragen Sie an der Kasse nach Ihrer Bestellnummer.",
      );
      return;
    }

    let isCancelled = false;
    let elapsedMs = 0;

    const lookupOrder = async () => {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/orders?stripe_session_id=eq.${encodeURIComponent(
            sessionId,
          )}&select=order_number`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Supabase query failed");
        }

        const rows = (await response.json()) as Array<{ order_number?: string | number }>;
        const foundOrderNumber = rows?.[0]?.order_number;

        if (foundOrderNumber !== undefined && foundOrderNumber !== null && !isCancelled) {
          setOrderNumber(String(foundOrderNumber));
          setIsLoading(false);
          setErrorMessage(null);
          return true;
        }
      } catch {
        // Keep polling until timeout, then show fallback text.
      }

      return false;
    };

    const startPolling = async () => {
      while (!isCancelled && elapsedMs <= 30000) {
        const found = await lookupOrder();
        if (found) return;

        if (elapsedMs >= 30000) break;

        await new Promise((resolve) => setTimeout(resolve, 2000));
        elapsedMs += 2000;
      }

      if (!isCancelled) {
        setIsLoading(false);
        setErrorMessage(
          "Bitte fragen Sie an der Kasse nach Ihrer Bestellnummer.",
        );
      }
    };

    void startPolling();

    return () => {
      isCancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-lg p-8 sm:p-10 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 size={56} className="text-green-500" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Bestellung erfolgreich!
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-6">
          Ihre Bestellung wird gerade zubereitet. Bitte behalten Sie Ihre
          Bestellnummer im Blick.
        </p>

        {isLoading ? (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            Bestellnummer wird geladen...
          </div>
        ) : orderNumber ? (
          <div className="mb-8 rounded-2xl border border-primary/30 bg-primary/10 px-6 py-5 text-foreground">
            <p className="text-xl sm:text-2xl font-semibold">
              Ihre Bestellnummer:{" "}
              <span className="font-mono text-2xl sm:text-4xl">{orderNumber}</span>
            </p>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
            {errorMessage}
          </div>
        )}

        <div>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all"
          >
            Zurück zur Speisekarte
          </Link>
        </div>
      </div>
    </div>
  );
}
