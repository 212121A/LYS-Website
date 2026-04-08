import { useState } from "react";
import { Link } from "wouter";
import { Flame, Leaf, ShoppingCart } from "lucide-react";
import { menuCategories, formatPrice } from "@/data/menu";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Menu() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: t.menu.filterAll },
    { id: "vorspeisen", label: t.menu.filterStarters },
    { id: "reis-gebraten", label: t.menu.filterRice },
    { id: "nudel-gebraten", label: t.menu.filterNoodles },
    { id: "huhnerfleisch-gebraten", label: t.menu.filterChicken },
    { id: "huhnerfleisch-paniert", label: t.menu.filterBreaded },
    { id: "ente", label: t.menu.filterDuck },
    { id: "thaicurry", label: t.menu.filterCurry },
    { id: "nudel-reisboxen", label: t.menu.filterBoxes },
    { id: "getraenke", label: t.menu.filterDrinks },
  ];

  const visibleCategories = activeCategory === "all"
    ? menuCategories
    : menuCategories.filter((c) => c.id === activeCategory);

  return (
    <div>
      {/* Header */}
      <section className="bg-card border-b border-border py-16 pattern-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">Ly Asiatische Spezialitäten</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">{t.menu.title}</h1>
          <p className="text-muted-foreground max-w-lg">{t.menu.pricesNote}</p>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Flame size={12} className="text-orange-500" /> {t.menu.spicy}</span>
            <span className="flex items-center gap-1.5"><Leaf size={12} className="text-primary" /> {t.menu.vegetarian}</span>
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
                  <strong className="text-foreground">{t.menu.boxSaucesStrong}</strong> {t.menu.boxSaucesNote}
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
                            {t.menu.sizeSmall}: {formatPrice(item.priceSmall)}
                          </p>
                        )}
                        {item.priceSmall !== undefined && item.price > 0 && (
                          <p className="text-[10px] text-muted-foreground">
                            {t.menu.sizeLarge}: {formatPrice(item.price)}
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
          <h3 className="font-medium text-foreground mb-2 text-sm">{t.menu.allergenTitle}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{t.menu.allergenText}</p>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/order"
            data-testid="button-menu-order"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
          >
            <ShoppingCart size={16} />
            {t.menu.orderCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
