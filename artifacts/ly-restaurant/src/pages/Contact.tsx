import { useState } from "react";
import { Phone, MapPin, Clock, CheckCircle, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-card border-b border-border py-20 pattern-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.contact.title}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{t.contact.title}</h1>
          <p className="text-muted-foreground max-w-lg">{t.contact.subtitle}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">{t.contact.reachTitle}</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{t.contact.phoneLabel}</p>
                  <a href="tel:xxxxxx" data-testid="link-phone" className="font-medium text-foreground hover:text-primary transition-colors">
                    xxxxxx
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.contact.phoneHint}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{t.contact.addressLabel}</p>
                  <p className="font-medium text-foreground">Kappelgasse 2</p>
                  <p className="text-sm text-muted-foreground">73525 Schwäbisch Gmünd</p>
                  <p className="text-xs text-muted-foreground">Am Marktplatz gegenüber der Bibliothek</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{t.contact.hoursLabel}</p>
                  <p className="font-medium text-foreground">{t.contact.hoursMoSa}</p>
                  <p className="text-sm text-foreground">{t.contact.hoursFrSa}</p>
                  <p className="text-sm text-muted-foreground">{t.contact.hoursSun}</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-card border border-border rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=Kappelgasse+2+73525+Schwäbisch+Gmünd"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-map-open"
                className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin size={20} className="text-primary" />
                </div>
                <span className="text-sm font-medium">{t.common.mapsBtn}</span>
                <span className="text-xs text-muted-foreground">Kappelgasse 2, 73525 Schwäbisch Gmünd</span>
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">{t.contact.msgTitle}</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={28} className="text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">{t.contact.thankYouTitle}</h3>
                <p className="text-muted-foreground text-sm mb-6">{t.contact.thankYouDesc}</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
                  data-testid="button-new-message"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  {t.contact.newMsg}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.contact.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    data-testid="input-contact-name"
                    placeholder={t.contact.namePlaceholder}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.contact.emailLabel}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    data-testid="input-contact-email"
                    placeholder={t.contact.emailPlaceholder}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.contact.msgLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    data-testid="input-contact-message"
                    placeholder={t.contact.msgPlaceholder}
                    rows={5}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  data-testid="button-submit-contact"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
                >
                  <Send size={15} />
                  {t.contact.sendBtn}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  {t.contact.quickCallNote}{" "}
                  <a href="tel:xxxxxx" className="text-primary hover:underline">xxxxxx</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
