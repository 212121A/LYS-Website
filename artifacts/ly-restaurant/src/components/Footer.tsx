import { Link } from "wouter";
import { Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
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
    <footer className="bg-foreground text-background mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img src="/logo.png" alt="LYS Noodle Box" className="h-16 w-auto mb-4 brightness-0 invert" />
            <p className="text-background/60 text-sm leading-relaxed">{t.footer.tagline}</p>
          </div>

          <div>
            <h3 className="font-semibold text-background/90 mb-4 tracking-wide uppercase text-xs">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/60 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background/90 mb-4 tracking-wide uppercase text-xs">{t.common.phone} / {t.common.address}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-background/60 text-sm">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>Kappelgasse 2<br />73525 Schwäbisch Gmünd</span>
              </li>
              <li className="flex items-center gap-2 text-background/60 text-sm">
                <Phone size={15} className="shrink-0 text-primary" />
                <a href="tel:07171/9994828" className="hover:text-background transition-colors">07171 / 9994828</a>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-primary transition-colors" data-testid="link-instagram">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-primary transition-colors" data-testid="link-facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-background/40 text-xs">
          <p>© {new Date().getFullYear()} LYS Noodle Box. {t.footer.rights}</p>
          <p>Allergiker-Information auf Anfrage</p>
        </div>
      </div>
    </footer>
  );
}
