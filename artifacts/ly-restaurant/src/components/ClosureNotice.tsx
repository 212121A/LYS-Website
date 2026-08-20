import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  announcedClosure,
  formatClosureDay,
  formatClosureMoment,
} from "@/lib/closures.ts";

/**
 * Hinweisband über der Navigation, solange eine Sonderschließung ansteht oder
 * läuft (siehe lib/closures.ts). Ohne aktive Schließung rendert es nichts.
 */
export default function ClosureNotice() {
  const { t, lang } = useLanguage();
  const closure = announcedClosure();
  if (!closure) return null;

  const days = new Intl.ListFormat(lang, {
    style: "long",
    type: "conjunction",
  }).format(closure.closedDays.map((day) => formatClosureDay(day, lang)));

  const fill = (text: string) =>
    text
      .replace("{days}", days)
      .replace("{reopen}", formatClosureDay(closure.reopenDay, lang))
      .replace("{stop}", formatClosureMoment(closure.orderStopAt, lang));

  return (
    <div className="bg-amber-100 text-amber-950 border-b border-amber-300 dark:bg-amber-950 dark:text-amber-50 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-start gap-3">
        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
        <div className="text-sm leading-snug">
          <p className="font-semibold">{fill(t.closure.bannerTitle)}</p>
          <p>{fill(t.closure.bannerText)}</p>
          <p className="mt-1 opacity-90">{fill(t.closure.bannerOrders)}</p>
        </div>
      </div>
    </div>
  );
}
