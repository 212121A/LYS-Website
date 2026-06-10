import { useEffect } from "react";
import { useLocation } from "wouter";

const SITE_URL = "https://lysnoodleandrice.com";
const BRAND = "LYS Noodles & Rice";

interface RouteMeta {
  title: string;
  description: string;
  /** Transaktionale/private Seiten von der Indexierung ausschließen. */
  noindex?: boolean;
}

// Ein klarer Such-Intent pro URL. Titel ~50-60 Zeichen, Primärbegriff vorne,
// Marke am Ende. Descriptions ~120-160 Zeichen, ehrlich und konkret.
const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: `${BRAND} – Asiatische Küche in Schwäbisch Gmünd`,
    description:
      "Frische Nudel- & Reisboxen, Bowls, Matcha & vietnamesischer Kaffee bei LYS Noodles & Rice in Schwäbisch Gmünd – frisch zubereitet, zum Mitnehmen oder online bestellen.",
  },
  "/menu": {
    title: `Speisekarte – ${BRAND} Schwäbisch Gmünd`,
    description:
      "Unsere Speisekarte: Nudel- & Reisboxen, Thai-Curry, gebratener Reis, Bowls, Matcha und vietnamesischer Kaffee – frisch zubereitet in Schwäbisch Gmünd.",
  },
  "/order": {
    title: `Online bestellen – ${BRAND}`,
    description:
      "Bestelle deine asiatischen Gerichte bequem online bei LYS Noodles & Rice in Schwäbisch Gmünd: Nudel- & Reisboxen, Bowls, Matcha & mehr zum Mitnehmen.",
  },
  "/about": {
    title: `Über uns – ${BRAND} Schwäbisch Gmünd`,
    description:
      "Die Geschichte von LYS Noodles & Rice: authentische asiatische Küche aus Erfahrung – frisch, ehrlich und fair, mitten in Schwäbisch Gmünd.",
  },
  "/contact": {
    title: `Kontakt & Öffnungszeiten – ${BRAND}`,
    description:
      "Kontakt, Adresse und Öffnungszeiten von LYS Noodles & Rice in der Kappelgasse 2, 73525 Schwäbisch Gmünd. Ruf an oder schreib uns eine Nachricht.",
  },
  "/careers": {
    title: `Jobs & Bewerbung – ${BRAND}`,
    description:
      "Werde Teil des Teams von LYS Noodles & Rice in Schwäbisch Gmünd. Aktuelle Stellen in Service und Küche – jetzt unkompliziert bewerben.",
  },
  "/allergene": {
    title: `Allergene & Zusatzstoffe – ${BRAND}`,
    description:
      "Allergene und Zusatzstoffe aller Gerichte und Getränke von LYS Noodles & Rice – übersichtlich nach Kategorie und Menü-Nummer aufgelistet.",
  },
  "/impressum": {
    title: `Impressum – ${BRAND}`,
    description:
      "Impressum und rechtliche Angaben von LYS Noodles & Rice, Kappelgasse 2, 73525 Schwäbisch Gmünd.",
  },
  "/datenschutz": {
    title: `Datenschutz – ${BRAND}`,
    description:
      "Datenschutzerklärung von LYS Noodles & Rice – Informationen zur Verarbeitung deiner Daten gemäß DSGVO.",
  },
  "/checkout": {
    title: `Kasse – ${BRAND}`,
    description: "Schließe deine Bestellung bei LYS Noodles & Rice ab.",
    noindex: true,
  },
  "/success": {
    title: `Bestellung erfolgreich – ${BRAND}`,
    description: "Vielen Dank für deine Bestellung bei LYS Noodles & Rice.",
    noindex: true,
  },
  "/cancel": {
    title: `Zahlung abgebrochen – ${BRAND}`,
    description: "Die Zahlung wurde abgebrochen.",
    noindex: true,
  },
};

const FALLBACK: RouteMeta = ROUTE_META["/"];

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Hält Title, Description, Canonical und Social-Meta pro Route aktuell.
 * Notwendig, weil die App eine Client-SPA ist und sonst alle Routen den
 * statischen Title aus index.html teilen würden (Duplicate-Title-Signal).
 */
export default function RouteSeo() {
  const [location] = useLocation();

  useEffect(() => {
    const path = location.split(/[?#]/)[0];
    const meta = ROUTE_META[path] ?? FALLBACK;
    const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;

    document.title = meta.title;
    upsertMeta('meta[name="description"]', "name", "description", meta.description);
    upsertMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    );
    upsertCanonical(canonical);

    upsertMeta('meta[property="og:title"]', "property", "og:title", meta.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", meta.description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", meta.description);
  }, [location]);

  return null;
}
