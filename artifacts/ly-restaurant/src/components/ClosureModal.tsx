import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  announcedClosure,
  formatClosureDay,
  formatClosureMoment,
} from "@/lib/closures";

/**
 * Hinweis-Dialog für eine anstehende oder laufende Sonderschließung
 * (siehe lib/closures.ts). Öffnet sich einmal pro Browser-Session; der Merker
 * hängt am Schließungs-Zeitraum, eine neue Schließung zeigt sich also wieder.
 * Ohne aktive Schließung rendert die Komponente nichts.
 */
export default function ClosureModal() {
  const { t, lang } = useLanguage();
  const closure = announcedClosure();
  const [open, setOpen] = useState(false);
  const seenKey = closure ? `lys_closure_seen_${closure.orderStopAt}` : "";

  useEffect(() => {
    if (!seenKey || sessionStorage.getItem(seenKey)) return;
    // Kurz warten, damit der Dialog nicht in den Seitenaufbau hineinspringt.
    const timer = setTimeout(() => setOpen(true), 550);
    return () => clearTimeout(timer);
  }, [seenKey]);

  if (!closure) return null;

  const fill = (text: string) =>
    text
      .replace(
        "{days}",
        new Intl.ListFormat(lang, { style: "long", type: "conjunction" }).format(
          closure.closedDays.map((day) => formatClosureDay(day, lang)),
        ),
      )
      .replace("{reopen}", formatClosureDay(closure.reopenDay, lang))
      .replace("{stop}", formatClosureMoment(closure.orderStopAt, lang));

  const dayTile = (isoDay: string) => {
    const [year, month, day] = isoDay.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const part = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(lang, { timeZone: "UTC", ...options }).format(date);
    return {
      key: isoDay,
      weekday: part({ weekday: "short" }),
      day: part({ day: "numeric" }),
      month: part({ month: "short" }),
    };
  };

  const close = () => {
    sessionStorage.setItem(seenKey, "1");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[3px] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/20 focus:outline-none motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0">
          <div className="relative">
            <img
              src="/lys-closure.jpg"
              alt=""
              className="h-36 w-full object-cover sm:h-44"
            />
            {/* Bild in die Kartenfläche auslaufen lassen, statt harter Kante */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            <Dialog.Close
              className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-foreground/70 backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t.closure.dismiss}
            >
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="px-6 pb-6 pt-1 sm:px-8 sm:pb-8">
            <Dialog.Title className="font-serif text-2xl font-bold leading-tight text-foreground">
              {t.closure.checkoutTitle}
            </Dialog.Title>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {closure.closedDays.map(dayTile).map((tile) => (
                <div
                  key={tile.key}
                  className="flex min-w-[4.5rem] flex-col items-center rounded-xl border border-border bg-background px-4 py-3"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {tile.weekday}
                  </span>
                  <span className="font-serif text-2xl font-bold leading-none text-primary">
                    {tile.day}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">{tile.month}</span>
                </div>
              ))}
            </div>

            <Dialog.Description className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {fill(t.closure.bannerText)}
            </Dialog.Description>

            <p className="mt-4 rounded-xl bg-muted/70 px-4 py-3 text-sm leading-relaxed text-foreground">
              {fill(t.closure.bannerOrders)}
            </p>

            <button
              type="button"
              onClick={close}
              className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              {t.closure.dismiss}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
