import { useState } from "react";
import { Link } from "wouter";
import { Flame, Leaf, ArrowRight, ShoppingCart } from "lucide-react";
import { menuCategories, formatPrice } from "@/data/menu";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "Alle" },
    { id: "vorspeisen", label: "Vorspeisen" },
    { id: "reis-gebraten", label: "Reis" },
    { id: "nudel-gebraten", label: "Nudeln" },
    { id: "huhnerfleisch-gebraten", label: "Hühnerfleisch" },
    { id: "huhnerfleisch-paniert", label: "Paniert" },
    { id: "ente", label: "Ente" },
    { id: "thaicurry", label: "Thai-Curry" },
    { id: "nudel-reisboxen", label: "Boxen" },
    { id: "getraenke", label: "Getränke" },
  ];

  const visibleCategories = activeCategory === "all"
    ? menuCategories
    : menuCategories.filter((c) => c.id === activeCategory);

  return (
    <div>
      {/* Header */}
      <section className="bg-card border-b border-border py-16 pattern-bg relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-[0.04] select-none pointer-events-none pr-8">
          <span className="font-serif text-[20rem] leading-none text-foreground">食</span>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Ly Asiatische Spezialitäten</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Speisekarte</h1>
          <p className="text-muted-foreground max-w-lg">
            Alle Preise inkl. MwSt. Allergiker-Informationen auf Anfrage beim Personal.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Flame size={12} className="text-orange-500" /> Leicht scharf</span>
            <span className="flex items-center gap-1.5"><Leaf size={12} className="text-primary" /> Vegetarisch</span>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                data-testid={`filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {visibleCategories.map((category) => (
            <div key={category.id} id={category.id}>
              {/* Category header */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">{category.name}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Special note for boxes */}
              {category.id === "nudel-reisboxen" && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-muted-foreground">
                  <strong className="text-foreground">Soßen inklusive:</strong> Sojasoße, Süßsauersoße oder Thaicurry (mit Kokosmilch, leicht scharf)
                </div>
              )}

              {/* Items grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    data-testid={`menu-item-${item.id}`}
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.number && (
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {item.number}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5">
                            {item.spicy && <Flame size={12} className="text-orange-500 shrink-0" />}
                            {item.vegetarian && <Leaf size={12} className="text-primary shrink-0" />}
                          </div>
                        </div>
                        <h3 className="font-medium text-foreground text-sm leading-snug">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-foreground text-sm">{formatPrice(item.price)}</span>
                        {item.priceSmall !== undefined && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Klein: {formatPrice(item.priceSmall)}
                          </p>
                        )}
                        {item.priceSmall !== undefined && item.price > 0 && (
                          <p className="text-[10px] text-muted-foreground">
                            Groß: {formatPrice(item.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Allergen note */}
        <div className="mt-16 bg-card border border-border rounded-2xl p-6">
          <h3 className="font-medium text-foreground mb-2 text-sm">Allergiker-Information</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Über die in unseren enthaltenen allergenen Zutaten geben wir Ihnen gerne mündlich Auskunft 
            oder eine schriftliche Dokumentation kann jederzeit eingesehen werden. Bei Fragen steht unser 
            Team Ihnen gerne zur Verfügung.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/order"
            data-testid="button-menu-order"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
          >
            <ShoppingCart size={16} />
            Jetzt bestellen
          </Link>
        </div>
      </div>
    </div>
  );
}
