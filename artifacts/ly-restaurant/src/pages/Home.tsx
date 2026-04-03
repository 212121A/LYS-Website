import { Link } from "wouter";
import { ArrowRight, Clock, MapPin, Phone, Utensils, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="pattern-bg">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Decorative kanji / japanese symbols background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="font-serif text-[32rem] leading-none text-foreground">麗</span>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-primary/8 blur-2xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-2xl">
            {/* Decorative tag */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-medium tracking-wider uppercase mb-6 border border-primary/20">
              <span className="font-serif text-base">麗</span>
              Asiatische Spezialitäten · Schwäbisch Gmünd
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Ly
              <br />
              <span className="text-primary">Asiatische</span>
              <br />
              Spezialitäten
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
              Authentische asiatische Küche — von knusprigen Frühlingsrollen über gebratenen Reis 
              bis zu aromatischen Thai-Curries. Frisch zubereitet, mit Liebe serviert.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/order"
                data-testid="button-hero-order"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                Jetzt bestellen
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/menu"
                data-testid="button-hero-menu"
                className="inline-flex items-center gap-2 bg-card border border-border text-foreground px-7 py-3.5 rounded-full font-medium hover:bg-accent transition-all"
              >
                Menü ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info bar */}
      <section className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex items-center gap-3 py-5 px-4 sm:px-8">
              <MapPin size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Adresse</p>
                <p className="text-sm font-medium">Ledergasse 44–46, 73525 Schwäbisch Gmünd</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-5 px-4 sm:px-8">
              <Phone size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Telefon</p>
                <a href="tel:071719994828" className="text-sm font-medium hover:text-primary transition-colors">
                  07171 / 9994828
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 py-5 px-4 sm:px-8">
              <Clock size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Öffnungszeiten</p>
                <p className="text-sm font-medium">Mo–Sa: 11:00–20:30 Uhr</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Unsere Spezialitäten</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Was uns besonders macht</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🥟",
              title: "Knusprige Vorspeisen",
              desc: "Unsere handgemachten Nem Ran und Frühlingsrollen sind nach traditionellem vietnamesischen Rezept — knusprig außen, saftig innen.",
              link: "/menu",
            },
            {
              emoji: "🍜",
              title: "Wok-Gerichte",
              desc: "Gebratener Reis und Nudeln mit frischem Gemüse, zartem Hühnerfleisch oder knuspriger Ente — direkt aus dem heißen Wok.",
              link: "/menu",
            },
            {
              emoji: "🍛",
              title: "Thai-Curries",
              desc: "Cremige Thaicurries mit Kokosmilch, zart scharf und aromatisch — mit Tofu, Garnelen, Ente oder Hühnerfleisch.",
              link: "/menu",
            },
          ].map((item) => (
            <Link key={item.title} href={item.link} data-testid={`card-category-${item.title}`}>
              <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer">
                <div className="text-4xl mb-4 float-anim">{item.emoji}</div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Zum Menü <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Boxes highlight */}
      <section className="bg-primary/5 border-y border-primary/10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Neu & Beliebt</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nudel- & Reisboxen
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Perfekt für unterwegs: Unsere leckeren Boxen mit Nudeln oder Reis, 
                frischem Gemüse und Deiner Lieblingssoße. Sojasoße, Süßsauer oder 
                Thaicurry mit Kokosmilch — ganz nach Deinem Geschmack.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Sojasoße", "Süßsauersoße", "Thaicurry & Kokosmilch"].map((sauce) => (
                  <span key={sauce} className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full border border-primary/20 font-medium">
                    {sauce}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Utensils size={14} className="text-primary" />
                <span>Bereits ab <strong className="text-foreground">4,00 €</strong> (klein)</span>
              </div>
              <Link
                href="/order"
                data-testid="button-boxes-order"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-all mt-4"
              >
                Box bestellen <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Mit Gemüse", price: "ab 4,00 €", tag: "Vegan möglich" },
                { name: "Mit Hühnerfleisch", price: "ab 4,50 €", tag: "Beliebt" },
                { name: "Mit pan. Fisch", price: "6,00 €", tag: "Frisch" },
                { name: "Mit Frühlingsrollen", price: "6,00 €", tag: "Vegetarisch" },
              ].map((box) => (
                <div key={box.name} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
                  <span className="inline-block bg-primary/10 text-primary text-[10px] font-medium px-2 py-0.5 rounded-full mb-2">
                    {box.tag}
                  </span>
                  <p className="text-sm font-medium text-foreground">{box.name}</p>
                  <p className="text-primary font-semibold text-sm mt-1">{box.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / quote */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="fill-primary text-primary" />
          ))}
        </div>
        <blockquote className="font-serif text-2xl md:text-3xl text-foreground max-w-3xl mx-auto leading-relaxed italic mb-6">
          "Das beste asiatische Restaurant in Schwäbisch Gmünd — die Frühlingsrollen sind einfach unschlagbar!"
        </blockquote>
        <p className="text-muted-foreground text-sm">— Begeisterte Gäste aus der Region</p>

        <div className="mt-12">
          <Link
            href="/about"
            data-testid="button-learn-more"
            className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
          >
            Mehr über uns erfahren <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
