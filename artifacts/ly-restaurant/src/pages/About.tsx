import { Link } from "wouter";
import { Heart, Leaf, Users, MapPin, ArrowRight, ImageIcon } from "lucide-react";
import restaurantExteriorImg from "@assets/image_1775647522456.png";
import { useLanguage } from "@/i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: Heart, title: t.about.valueHeart, desc: t.about.valueHeartDesc },
    { icon: Leaf, title: t.about.valueFresh, desc: t.about.valueFreshDesc },
    { icon: Users, title: t.about.valueFamily, desc: t.about.valueFamilyDesc },
    { icon: MapPin, title: t.about.valueLocal, desc: t.about.valueLocalDesc },
  ];

  const schedule = [
    { day: t.about.mondayFriday, hours: "11:00 – 21:30 Uhr", closed: false },
    { day: t.about.saturdayHours, hours: "11:00 – 22:00 Uhr", closed: false },
    { day: t.about.sundayClosed, hours: "13:00 – 20:00 Uhr", closed: false },
  ];

  return (
    <div>
      {/* Header with real restaurant photo */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-end bg-foreground">
        <img
          src={restaurantExteriorImg}
          alt="Ly Restaurant Außenansicht"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <p className="text-background/70 text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.about.storyTag}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-background mb-4 leading-tight">
            {t.about.title}
          </h1>
          <p className="text-background/75 max-w-lg leading-relaxed">
            {t.about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Story with kitchen image */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.about.whoTag}</p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">{t.about.whoTitle}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t.about.whoP1}</p>
              <p>{t.about.whoP2}</p>
              <p>{t.about.whoP3}</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 bg-muted border border-dashed border-border flex items-center justify-center" aria-label="Platzhalter für Bild">
            <ImageIcon size={40} className="text-muted-foreground/40" strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Food spread placeholder */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl overflow-hidden h-64 md:h-80 bg-muted border border-dashed border-border flex items-center justify-center" aria-label="Platzhalter für Bild">
          <ImageIcon size={56} className="text-muted-foreground/40" strokeWidth={1.5} />
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary/5 border-y border-primary/10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.about.drivesTag}</p>
            <h2 className="font-serif text-3xl font-bold text-foreground">{t.about.drivesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                data-testid={`value-card-${value.title}`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening hours */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.about.hoursTag}</p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">{t.about.hoursTitle}</h2>

            <div className="space-y-3">
              {schedule.map((slot) => (
                <div key={slot.day} className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-colors ${slot.closed ? "bg-muted/50 border-border text-muted-foreground" : "bg-card border-border"}`}>
                  <span className="text-sm font-medium">{slot.day}</span>
                  <span className={`text-sm font-semibold ${slot.closed ? "text-muted-foreground" : "text-primary"}`}>
                    {slot.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.about.addressTag}</p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">{t.about.addressTitle}</h2>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={20} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">LYS</p>
                  <p className="text-muted-foreground text-sm mt-1">Kappelgasse 2</p>
                  <p className="text-muted-foreground text-sm">73525 Schwäbisch Gmünd</p>
                  <p className="text-muted-foreground text-xs">Am Marktplatz gegenüber der Bibliothek</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Kappelgasse+2+73525+Schwäbisch+Gmünd"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-maps"
                className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline mt-2"
              >
                {t.common.mapsBtn} <ArrowRight size={12} />
              </a>
            </div>

            <div className="mt-6">
              <Link
                href="/contact"
                data-testid="button-contact-from-about"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-all"
              >
                {t.about.contactBtn} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
