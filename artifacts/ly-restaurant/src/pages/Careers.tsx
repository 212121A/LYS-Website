import { useState } from "react";
import { CheckCircle, Briefcase, Heart, Coffee, Users, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Careers() {
  const { t } = useLanguage();
  const [openPosition, setOpenPosition] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", message: "" });

  const benefits = [
    { icon: Heart, label: t.careers.b1Title, desc: t.careers.b1Desc },
    { icon: Coffee, label: t.careers.b2Title, desc: t.careers.b2Desc },
    { icon: Users, label: t.careers.b3Title, desc: t.careers.b3Desc },
    { icon: Briefcase, label: t.careers.b4Title, desc: t.careers.b4Desc },
  ];

  const positions = [
    { id: "service", title: t.careers.pos1Title, type: t.careers.pos1Type, desc: t.careers.pos1Desc },
    { id: "kueche", title: t.careers.pos2Title, type: t.careers.pos2Type, desc: t.careers.pos2Desc },
    { id: "praktikum", title: t.careers.pos3Title, type: t.careers.pos3Type, desc: t.careers.pos3Desc },
  ];

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
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.careers.teamTag}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{t.careers.title}</h1>
          <p className="text-muted-foreground max-w-xl">{t.careers.headerSubtitle}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why us */}
        <div className="mb-16">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.careers.whyTag}</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10">{t.careers.whyTitle}</h2>
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
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.careers.posTag}</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">{t.careers.posTitle}</h2>
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
                      {t.careers.applyNow} <Send size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{t.careers.noPosTitle}</strong>{" "}
              {t.careers.noPosText}
            </p>
          </div>
        </div>

        {/* Application form */}
        <div id="apply-form">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.careers.formTag}</p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">{t.careers.formTitle}</h2>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">{t.careers.successTitle}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t.careers.successDesc}</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", position: "", message: "" }); }}
                data-testid="button-new-application"
                className="text-primary text-sm font-medium hover:underline"
              >
                {t.careers.newApplication}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="apply-name" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.careers.nameLabel}
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
                    {t.careers.phoneLbl}
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
                  {t.careers.emailLabel}
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
                  {t.careers.posLabel}
                </label>
                <select
                  id="apply-position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  data-testid="select-apply-position"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                >
                  <option value="">{t.careers.posDefault}</option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                  <option value={t.careers.posInitiative}>{t.careers.posInitiative}</option>
                </select>
              </div>

              <div>
                <label htmlFor="apply-message" className="block text-sm font-medium text-foreground mb-1.5">
                  {t.careers.motivationLabel}
                </label>
                <textarea
                  id="apply-message"
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  data-testid="input-apply-message"
                  placeholder={t.careers.motivationPlaceholder}
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
                {t.careers.submitBtn}
              </button>

              <p className="text-xs text-muted-foreground">{t.careers.submitNote}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
