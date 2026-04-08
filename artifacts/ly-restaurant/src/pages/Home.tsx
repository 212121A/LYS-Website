import { Link } from "wouter";
import { ArrowRight, Clock, MapPin, Phone, Utensils, Star } from "lucide-react";
import springRollsImg from "@assets/F7C3641B-3647-4B49-BA2C-BB1DAC79A504_1775241763325.PNG";
import curryImg from "@assets/52E8C510-830F-40FA-B773-ADA071B6847A_1775241763325.PNG";
import chickenRiceImg from "@assets/2B3F8F4C-9785-4E35-8C8B-FF905937040C_1775241763325.PNG";
import restaurantExteriorImg from "@assets/image_1775647522456.png";
import kitchenImg from "@assets/IMG_1015_1775241763325.jpg";
import heroFoodImg from "@assets/hero-food.png";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const categories = [
    { img: springRollsImg, title: t.home.springRolls, desc: t.home.springRollsDesc },
    { img: chickenRiceImg, title: t.home.wokTitle, desc: t.home.wokDesc },
    { img: curryImg, title: t.home.curry, desc: t.home.curryDesc },
  ];

  const boxes = [
    { name: t.home.box1Name, price: t.home.box1Price, tag: t.home.box1Tag },
    { name: t.home.box2Name, price: t.home.box2Price, tag: t.home.box2Tag },
    { name: t.home.box3Name, price: t.home.box3Price, tag: t.home.box3Tag },
    { name: t.home.box4Name, price: t.home.box4Price, tag: t.home.box4Tag },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-4">
            {/* Text side */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
              <img src="/logo.png" alt="LYS Noodle Box" className="w-full max-w-xs sm:max-w-sm lg:max-w-md h-auto mb-0" />
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-md mt-5">
                {t.home.heroDesc}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/order" data-testid="button-hero-order" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-9 py-4 rounded-full font-medium text-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5">
                  {t.common.orderNow} <ArrowRight size={18} />
                </Link>
                <Link href="/menu" data-testid="button-hero-menu" className="inline-flex items-center gap-2 bg-background border border-border text-foreground px-9 py-4 rounded-full font-medium text-lg hover:bg-accent transition-all">
                  {t.common.viewMenu}
                </Link>
              </div>
            </div>
            {/* Food image side */}
            <div className="flex justify-center lg:justify-end items-end order-1 lg:order-2 relative">
              <img
                src={heroFoodImg}
                alt="LYS Noodle Box & Getränk"
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info bar */}
      <section className="border-y border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex items-center gap-3 py-5 px-4 sm:px-8">
              <MapPin size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{t.common.address}</p>
                <p className="text-sm font-medium">Ledergasse 44–46, 73525 Schwäbisch Gmünd</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-5 px-4 sm:px-8">
              <Phone size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{t.common.phone}</p>
                <a href="tel:071719994828" className="text-sm font-medium hover:text-primary transition-colors">07171 / 9994828</a>
              </div>
            </div>
            <div className="flex items-center gap-3 py-5 px-4 sm:px-8">
              <Clock size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{t.common.openingHours}</p>
                <p className="text-sm font-medium">Mo–Sa: 11:00–20:30 Uhr</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.home.specTag}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{t.home.categoriesTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((item) => (
            <Link key={item.title} href="/menu" data-testid={`card-category-${item.title}`}>
              <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer">
                <div className="h-48 overflow-hidden bg-muted">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.common.viewMenu} <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Kitchen banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl overflow-hidden relative h-72 md:h-96">
          <img src={kitchenImg} alt="Frische Zutaten in der Küche" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent flex items-center">
            <div className="px-8 md:px-14 max-w-lg">
              <p className="text-background/80 text-xs uppercase tracking-widest font-medium mb-2">{t.home.freshTag}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-background mb-3 leading-tight">{t.home.freshTitle}</h2>
              <p className="text-background/70 text-sm leading-relaxed">{t.home.freshDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Boxes highlight */}
      <section className="bg-primary/5 border-y border-primary/10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">{t.home.boxTag}</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">{t.home.boxTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{t.home.boxDesc}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[t.home.boxSauce1, t.home.boxSauce2, t.home.boxSauce3].map((sauce) => (
                  <span key={sauce} className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full border border-primary/20 font-medium">{sauce}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Utensils size={14} className="text-primary" />
                <span>{t.home.boxPriceFrom}</span>
              </div>
              <Link href="/order" data-testid="button-boxes-order" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-all mt-4">
                {t.common.orderNow} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {boxes.map((box) => (
                <div key={box.name} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
                  <span className="inline-block bg-primary/10 text-primary text-[10px] font-medium px-2 py-0.5 rounded-full mb-2">{box.tag}</span>
                  <p className="text-sm font-medium text-foreground">{box.name}</p>
                  <p className="text-primary font-semibold text-sm mt-1">{box.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden h-72 lg:h-80 shadow-lg">
            <img src={restaurantExteriorImg} alt="LYS Noodle Box Außenansicht" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-primary text-primary" />)}
            </div>
            <blockquote className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed italic mb-5">
              {t.home.testimonialQuote}
            </blockquote>
            <p className="text-muted-foreground text-sm mb-8">{t.home.testimonialAuthor}</p>
            <Link href="/about" data-testid="button-learn-more" className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all">
              {t.common.learnMore} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
