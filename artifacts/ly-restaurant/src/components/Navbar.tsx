import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Globe, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languages } from "@/i18n/translations";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

function LangPicker({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentLang = languages.find(l => l.code === lang)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-all border border-border/60 ${
          compact ? "px-2.5 py-1.5" : "px-3 py-2 ml-2"
        }`}
        aria-label="Sprache wählen"
      >
        {!compact && <Globe size={14} />}
        <span className="text-base leading-none">{currentLang.flag}</span>
        {!compact && <span className="text-xs font-mono uppercase">{lang}</span>}
        <ChevronDown size={12} className={`transition-transform text-foreground/60 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className={`absolute top-full mt-2 bg-background border border-border rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto ${compact ? "right-0 w-48" : "right-0 w-52"}`}>
          {languages.map(l => (
            <button
              key={l.code}
              onMouseDown={(e) => {
                e.preventDefault();
                setLang(l.code);
                setOpen(false);
              }}
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
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/menu", label: t.nav.menu },
    { href: "/order", label: t.nav.order },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
    { href: "/careers", label: t.nav.careers },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" data-testid="link-logo" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="LYS Noodle Box" className="h-14 w-auto" />
          </Link>

          {/* Desktop nav */}
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
            <LangPicker />
            <div className="ml-1 flex items-center gap-0.5">
              <a
                href="https://www.instagram.com/lys.noodlebox/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-foreground/60 hover:text-primary hover:bg-accent transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@lys.noodlebox"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-foreground/60 hover:text-primary hover:bg-accent transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon size={18} />
              </a>
              <a
                href="https://www.facebook.com/lys.noodlebox/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-foreground/60 hover:text-primary hover:bg-accent transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LangPicker compact />
            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Menu öffnen"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`mobile-nav-${link.href}`}
                onClick={() => setMenuOpen(false)}
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
