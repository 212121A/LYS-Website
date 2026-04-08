import { useState } from "react";
import { CheckCircle, Briefcase, Heart, Coffee, Users, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const positions = [
  {
    id: "service",
    title: "Servicekraft (m/w/d)",
    type: "Teilzeit / Vollzeit",
    desc: "Sie sind das Gesicht unseres Restaurants und sorgen mit Ihrer freundlichen Art dafür, dass sich unsere Gäste wohlfühlen.",
  },
  {
    id: "kueche",
    title: "Küchenhilfe / Kochgehilfe (m/w/d)",
    type: "Teilzeit / Vollzeit",
    desc: "Sie unterstützen unser Küchenteam bei der Vor- und Zubereitung unserer frischen asiatischen Spezialitäten.",
  },
  {
    id: "praktikum",
    title: "Praktikum in der Gastronomie",
    type: "Praktikum",
    desc: "Sie möchten erste Erfahrungen in der Gastronomie sammeln? Wir freuen uns über engagierte Praktikantinnen und Praktikanten.",
  },
];

const benefits = [
  { icon: Heart, label: "Familiäres Team", desc: "Wir sind ein kleines, herzliches Team — hier kennt jeder jeden." },
  { icon: Coffee, label: "Faire Bezahlung", desc: "Wir schätzen Ihre Arbeit und entlohnen sie entsprechend." },
  { icon: Users, label: "Entwicklung", desc: "Möglichkeiten zur persönlichen und beruflichen Weiterentwicklung." },
  { icon: Briefcase, label: "Flexible Zeiten", desc: "Wir versuchen, auf Ihre persönliche Situation einzugehen." },
];

export default function Careers() {
  const { t } = useLanguage();
  const [openPosition, setOpenPosition] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Werde Teil des Teams</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Bewerben</h1>
          <p className="text-muted-foreground max-w-xl">
            Wir suchen engagierte Menschen, die gemeinsam mit uns Gäste begeistern möchten. 
            Bringen Sie Ihre Persönlichkeit mit — den Rest bringen wir Ihnen bei.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why us */}
        <div className="mb-16">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Warum Ly?</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10">Ihre Vorteile bei uns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div key={b.label} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <b.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{b.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open positions */}
        <div className="mb-16">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Aktuell offen</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Offene Stellen</h2>
          <div className="space-y-3">
            {positions.map((pos) => (
              <div key={pos.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors" data-testid={`position-${pos.id}`}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenPosition(openPosition === pos.id ? null : pos.id)}
                  data-testid={`button-position-${pos.id}`}
                >
                  <div>
                    <h3 className="font-semibold text-foreground">{pos.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1 inline-block">
                      {pos.type}
                    </span>
                  </div>
                  {openPosition === pos.id ? (
                    <ChevronUp size={18} className="text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-muted-foreground shrink-0" />
                  )}
                </button>
                {openPosition === pos.id && (
                  <div className="px-5 pb-5 border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{pos.desc}</p>
                    <button
                      onClick={() => {
                        setForm((prev) => ({ ...prev, position: pos.title }));
                        document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      data-testid={`button-apply-${pos.id}`}
                      className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                    >
                      Jetzt bewerben <Send size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Keine passende Stelle dabei?</strong>{" "}
              Schicken Sie uns gerne eine Initiativbewerbung — wir freuen uns über motivierte Kandidatinnen und Kandidaten!
            </p>
          </div>
        </div>

        {/* Application form */}
        <div id="apply-form">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Direkt bewerben</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Bewerbungsformular</h2>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">Bewerbung eingegangen!</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Vielen Dank, <strong>{form.name}</strong>! Wir melden uns so schnell wie möglich bei Ihnen.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", position: "", message: "" }); }}
                data-testid="button-new-application"
                className="text-primary text-sm font-medium hover:underline"
              >
                Neue Bewerbung senden
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="apply-name" className="block text-sm font-medium text-foreground mb-1.5">
                    Vollständiger Name *
                  </label>
                  <input
                    id="apply-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    data-testid="input-apply-name"
                    placeholder="Max Mustermann"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="apply-phone" className="block text-sm font-medium text-foreground mb-1.5">
                    Telefonnummer
                  </label>
                  <input
                    id="apply-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    data-testid="input-apply-phone"
                    placeholder="0171 1234567"
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="apply-email" className="block text-sm font-medium text-foreground mb-1.5">
                  E-Mail-Adresse *
                </label>
                <input
                  id="apply-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  data-testid="input-apply-email"
                  placeholder="max@beispiel.de"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="apply-position" className="block text-sm font-medium text-foreground mb-1.5">
                  Gewünschte Stelle
                </label>
                <select
                  id="apply-position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  data-testid="select-apply-position"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                >
                  <option value="">Bitte wählen (oder Initiativbewerbung)</option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                  <option value="Initiativbewerbung">Initiativbewerbung</option>
                </select>
              </div>

              <div>
                <label htmlFor="apply-message" className="block text-sm font-medium text-foreground mb-1.5">
                  Kurzes Anschreiben / Motivation *
                </label>
                <textarea
                  id="apply-message"
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  data-testid="input-apply-message"
                  placeholder="Erzählen Sie uns kurz etwas über sich und warum Sie bei uns arbeiten möchten..."
                  rows={5}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                data-testid="button-submit-application"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
              >
                <Send size={15} />
                Bewerbung absenden
              </button>

              <p className="text-xs text-muted-foreground">
                Sie können sich auch direkt per E-Mail oder telefonisch bei uns melden — wir freuen uns auf Sie!
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
