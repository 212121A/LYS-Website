import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

const FALLBACK_MESSAGE = "Bitte fragen Sie an der Kasse nach Ihrer Bestellnummer.";

export default function Success() {
  const sessionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("session_id");
  }, []);

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {

    if (!sessionId) {
      setIsLoading(false);
      setErrorMessage(FALLBACK_MESSAGE);
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      setIsLoading(false);
      setErrorMessage(FALLBACK_MESSAGE);
      return;
    }

    let isActive = true;
    const timeoutIds: number[] = [];

    const startDelayId = window.setTimeout(async () => {
      if (!isActive) return;

      const maxAttempts = 15;
      let attempts = 0;

      const poll = async () => {
        if (!isActive) return;

        attempts++;

        try {
          const encodedSessionId = encodeURIComponent(sessionId);
          const url = `${supabaseUrl}/rest/v1/orders?stripe_session_id=eq.${encodedSessionId}&select=order_number`;

          const res = await fetch(
            url,
            {
              headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
                "Content-Type": "application/json",
              },
            },
          );

          const data = (await res.json()) as Array<{ order_number?: string | number }>;

          if (data && data.length > 0 && data[0].order_number) {
            if (!isActive) return;
            setOrderNumber(String(data[0].order_number));
            setIsLoading(false);
            setErrorMessage(null);
            return;
          }

        } catch (err) {
        }

        if (attempts < maxAttempts) {
          const nextPollId = window.setTimeout(() => {
            void poll();
          }, 3000);
          timeoutIds.push(nextPollId);
          return;
        }

        if (!isActive) return;
        setIsLoading(false);
        setErrorMessage(FALLBACK_MESSAGE);
      };

      void poll();
    }, 3000);
    timeoutIds.push(startDelayId);

    return () => {
      isActive = false;
      timeoutIds.forEach((id) => window.clearTimeout(id));
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
            <span>Bestellnummer wird geladen</span>
            <span className="inline-flex items-end leading-none">
              <span className="inline-block animate-bounce">.</span>
              <span className="inline-block animate-bounce [animation-delay:150ms]">
                .
              </span>
              <span className="inline-block animate-bounce [animation-delay:300ms]">
                .
              </span>
            </span>
          </div>
        ) : orderNumber ? (
          <div className="mb-8 rounded-2xl border border-primary/30 bg-primary/10 px-6 py-7 text-foreground text-center">
            <p className="text-2xl sm:text-3xl font-semibold">
              Ihre Bestellnummer:
            </p>
            <p className="font-mono text-5xl sm:text-6xl font-bold mt-2">
              {orderNumber}
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
