import { Link } from "wouter";
import { CircleX } from "lucide-react";

export default function Cancel() {
  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-lg p-8 sm:p-10 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <CircleX size={56} className="text-red-500" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Zahlung nicht abgeschlossen
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-8">
          Ihre Zahlung wurde abgebrochen oder abgelehnt. Ihre Bestellung wurde
          nicht aufgenommen.
        </p>

        <div>
          <Link
            href="/order"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all"
          >
            Erneut versuchen
          </Link>
        </div>
      </div>
    </div>
  );
}
