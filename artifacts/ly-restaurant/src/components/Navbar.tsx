import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languages } from "@/i18n/translations";

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();

  const currentLang = languages.find(l => l.code === lang)!;

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/menu", label: t.nav.menu },
    { href: "/order", label: t.nav.order },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
    { href: "/careers", label: t.nav.careers },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" data-testid="link-logo" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="LYS Noodle Box" className="h-14 w-auto" />
          </Link>

          {/* Desktop nav + language picker */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`nav-link-${link.href}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language picker */}
            <div ref={langRef} className="relative ml-2">
              <button
                onClick={() => setLangOpen(p => !p)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-all border border-border/60"
                aria-label="Sprache wählen"
              >
                <Globe size={14} />
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span className="text-xs font-mono uppercase">{lang}</span>
                <ChevronDown size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50 max-h-[420px] overflow-y-auto">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent text-left ${
                        l.code === lang ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      <span className="text-lg leading-none">{l.flag}</span>
                      <span>{l.name}</span>
                      {l.code === lang && <span className="ml-auto text-primary text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(p => !p)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm border border-border/60 hover:bg-accent transition-colors"
              >
                <span className="text-base">{currentLang.flag}</span>
                <ChevronDown size={11} className={`transition-transform text-foreground/60 ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-accent text-left ${
                        l.code === lang ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      <span className="text-base leading-none">{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setOpen(!open)}
              data-testid="button-mobile-menu"
              aria-label="Menu öffnen"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`mobile-nav-${link.href}`}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
