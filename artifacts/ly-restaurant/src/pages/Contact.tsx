import { useState } from "react";
import { Phone, MapPin, Mail, Clock, CheckCircle, Send } from "lucide-react";

export default function Contact() {
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
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Schreiben Sie uns</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Kontakt</h1>
          <p className="text-muted-foreground max-w-lg">
            Haben Sie Fragen, Anregungen oder möchten einen Tisch reservieren? Wir freuen uns von Ihnen zu hören.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">So erreichen Sie uns</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Telefon</p>
                  <a href="tel:071719994828" data-testid="link-phone" className="font-medium text-foreground hover:text-primary transition-colors">
                    07171 / 9994828
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">Am schnellsten erreichen Sie uns per Telefon</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Adresse</p>
                  <p className="font-medium text-foreground">Ledergasse 44–46</p>
                  <p className="text-sm text-muted-foreground">73525 Schwäbisch Gmünd</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Öffnungszeiten</p>
                  <p className="font-medium text-foreground">Mo–Sa: 11:00–20:30 Uhr</p>
                  <p className="text-sm text-muted-foreground">Sonntag geschlossen</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-card border border-border rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=Ledergasse+44+73525+Schwäbisch+Gmünd"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-map-open"
                className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin size={20} className="text-primary" />
                </div>
                <span className="text-sm font-medium">In Google Maps öffnen</span>
                <span className="text-xs text-muted-foreground">Ledergasse 44–46, Schwäbisch Gmünd</span>
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Nachricht schreiben</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={28} className="text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">Danke für Ihre Nachricht!</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Wir melden uns baldmöglichst bei Ihnen zurück.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
                  data-testid="button-new-message"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Neue Nachricht senden
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                    Ihr Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    data-testid="input-contact-name"
                    placeholder="Max Mustermann"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                    E-Mail-Adresse *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    data-testid="input-contact-email"
                    placeholder="max@beispiel.de"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                    Ihre Nachricht *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    data-testid="input-contact-message"
                    placeholder="Wie können wir Ihnen helfen?"
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
                  Nachricht senden
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Für schnelle Antworten empfehlen wir einen Anruf unter{" "}
                  <a href="tel:071719994828" className="text-primary hover:underline">07171 / 9994828</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
