import { Link } from "wouter";
import { Heart, Leaf, Users, MapPin, ArrowRight } from "lucide-react";
import restaurantExteriorImg from "@assets/IMG_7821_1775241763325.JPG";
import kitchenImg from "@assets/IMG_1015_1775241763325.jpg";
import foodSpreadImg from "@assets/IMG_0767_1775241763325.jpg";

export default function About() {
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
          <p className="text-background/70 text-xs font-medium tracking-[0.3em] uppercase mb-3">Unsere Geschichte</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-background mb-4 leading-tight">
            Über uns &amp;<br />unsere Küche
          </h1>
          <p className="text-background/75 max-w-lg leading-relaxed">
            Ein kleines, familiäres Restaurant in Schwäbisch Gmünd — mit großer Leidenschaft für authentische asiatische Küche.
          </p>
        </div>
      </section>

      {/* Story with kitchen image */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Wer wir sind</p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Mit Leidenschaft für Geschmack</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Unser Restaurant entstand aus dem Wunsch, den Menschen in Schwäbisch Gmünd die vielfältigen 
                Aromen Asiens näherzubringen — nicht in einer verwässerten Version, sondern so, wie wir 
                es selbst von zu Hause kennen und lieben.
              </p>
              <p>
                Jedes Gericht auf unserer Speisekarte wird mit frischen, sorgfältig ausgewählten Zutaten 
                zubereitet. Vom klassischen Nem Ran über unsere beliebten gebratenen Nudelboxen bis hin zu 
                den cremigen Thaicurries — hinter jedem Teller steckt eine Geschichte und echte Hingabe.
              </p>
              <p>
                Als Familienbetrieb legen wir besonderen Wert auf Gastfreundschaft, Qualität und 
                Authentizität. Wir freuen uns, Sie bei uns begrüßen zu dürfen!
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 shadow-lg">
            <img
              src={kitchenImg}
              alt="Frische Zutaten täglich vorbereitet"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Food spread full-width image */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl overflow-hidden h-64 md:h-80 shadow-lg">
          <img
            src={foodSpreadImg}
            alt="Unsere frischen Gerichte täglich zubereitet"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Values */}
      <section className="bg-primary/5 border-y border-primary/10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground">Was uns antreibt</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Mit Herz",
                desc: "Jedes Gericht wird mit echter Leidenschaft und Sorgfalt zubereitet — kein Fast Food, sondern echte Küche.",
              },
              {
                icon: Leaf,
                title: "Frische Zutaten",
                desc: "Wir setzen auf frische, qualitativ hochwertige Zutaten — täglich und ohne Kompromisse.",
              },
              {
                icon: Users,
                title: "Familiär",
                desc: "Als Familienbetrieb stehen Wärme und persönliche Gastfreundschaft an erster Stelle.",
              },
              {
                icon: MapPin,
                title: "Regional verankert",
                desc: "Mitten in Schwäbisch Gmünd — Ihr Nachbar für asiatische Spezialitäten seit Jahren.",
              },
            ].map((value) => (
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
            <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Immer für Sie da</p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Öffnungszeiten</h2>

            <div className="space-y-3">
              {[
                { day: "Montag – Freitag", hours: "11:00 – 20:30 Uhr" },
                { day: "Samstag", hours: "11:00 – 20:30 Uhr" },
                { day: "Sonntag", hours: "Geschlossen" },
              ].map((slot) => (
                <div key={slot.day} className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-colors ${slot.hours === "Geschlossen" ? "bg-muted/50 border-border text-muted-foreground" : "bg-card border-border"}`}>
                  <span className="text-sm font-medium">{slot.day}</span>
                  <span className={`text-sm font-semibold ${slot.hours === "Geschlossen" ? "text-muted-foreground" : "text-primary"}`}>
                    {slot.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Finden Sie uns</p>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Adresse</h2>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={20} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Ly Asiatische Spezialitäten</p>
                  <p className="text-muted-foreground text-sm mt-1">Ledergasse 44–46</p>
                  <p className="text-muted-foreground text-sm">73525 Schwäbisch Gmünd</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Ledergasse+44+73525+Schwäbisch+Gmünd"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-maps"
                className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline mt-2"
              >
                In Google Maps öffnen <ArrowRight size={12} />
              </a>
            </div>

            <div className="mt-6">
              <Link
                href="/contact"
                data-testid="button-contact-from-about"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-all"
              >
                Kontakt aufnehmen <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
