import { Link } from "wouter";
import vietnameseCoffeeImg from "@assets/lys-coffee-card.png";
import matchaImg from "@assets/lys-matcha-card.png";
import noodleRiceBoxImg from "@assets/lys-noodle-box-new.png";
import storefrontImg from "@assets/lys-storefront.png";
import kitchenImg from "@assets/lys-fresh-ingredients-new.png";
import heroDrinksImg from "@assets/lys-hero-drinks.png";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Home — minimalist rewrite.
 *  Direction : Quiet, contemporary, image-first.
 *              Aesop / MUJI / Kinfolk reference.
 *  Pattern   : Full-bleed hero · Generous whitespace · Plain typographic blocks
 *  Style     : Sans-only, thin weights, hairline rules, no decorations, no marquees.
 */
export default function Home() {
  const { t } = useLanguage();

  const trinity = [
    { img: vietnameseCoffeeImg, kicker: "01 · Cà Phê",   title: t.home.springRolls, desc: t.home.springRollsDesc },
    { img: matchaImg,           kicker: "02 · Trà Xanh", title: t.home.wokTitle,    desc: t.home.wokDesc },
    { img: noodleRiceBoxImg,    kicker: "03 · Hộp",      title: t.home.curry,       desc: t.home.curryDesc },
  ];

  const boxes = [
    { name: t.home.box1Name, price: t.home.box1Price, tag: t.home.box1Tag },
    { name: t.home.box2Name, price: t.home.box2Price, tag: t.home.box2Tag },
    { name: t.home.box3Name, price: t.home.box3Price, tag: t.home.box3Tag },
    { name: t.home.box4Name, price: t.home.box4Price, tag: t.home.box4Tag },
  ];

  return (
    <div className="relative w-full min-w-0 bg-background text-foreground">
      <style>{`
        @keyframes lys-fade-up {
          from { opacity: 0; transform: translate3d(0, 14px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes lys-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .lys-fade-up { animation: lys-fade-up 1100ms cubic-bezier(.16,1,.3,1) both; }
        .lys-fade    { animation: lys-fade 1400ms ease-out both; }

        .lys-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          padding-bottom: 3px;
          font-size: .8125rem;
          letter-spacing: .04em;
          color: hsl(var(--foreground));
          transition: color 320ms ease, gap 380ms ease;
        }
        .lys-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: hsl(var(--foreground) / .35);
          transition: background 320ms ease;
        }
        .lys-link:hover { gap: .9rem; }
        .lys-link:hover::after { background: hsl(var(--foreground)); }
        .lys-link:focus-visible {
          outline: 2px solid hsl(var(--foreground));
          outline-offset: 6px;
          border-radius: 2px;
        }

        .lys-caps {
          font-family: var(--app-font-sans);
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: hsl(var(--foreground) / .55);
        }

        .lys-rule {
          display: block;
          width: 100%;
          height: 1px;
          background: hsl(var(--foreground) / .15);
        }

        @media (prefers-reduced-motion: reduce) {
          .lys-fade-up, .lys-fade { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════
            1 · HERO — full-bleed, full-size image
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full">
        {/* Small brand strip above hero */}
        <div className="max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-6 lg:pt-8 lg:pb-8">
          <div className="flex items-center justify-between gap-6">
            <span className="lys-caps">LYS · Noodle &amp; Box</span>
            <span className="lys-caps hidden sm:inline">Schwäbisch Gmünd</span>
            <span className="lys-caps hidden md:inline">Open · 11:00 – 21:30</span>
          </div>
        </div>

        {/* The hero image — full-bleed, focused on the drinks & box, blinds cropped out */}
        <div className="lys-fade w-full overflow-hidden">
          <img
            src={heroDrinksImg}
            alt="LYS Hero"
            className="block w-full h-[60vh] sm:h-[72vh] lg:h-[82vh] object-cover select-none"
            style={{ objectPosition: "50% 78%" }}
            draggable={false}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
            2 · STATEMENT — quiet introduction
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-28 lg:pt-44 pb-24 lg:pb-36">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">

            <div className="col-span-12 md:col-span-3">
              <p className="lys-caps lys-fade-up">— Index</p>
            </div>

            <div className="col-span-12 md:col-span-9 max-w-3xl">
              <p
                className="lys-fade-up font-sans font-light tracking-[-0.015em] leading-[1.18] text-[1.75rem] sm:text-[2.25rem] lg:text-[2.85rem] xl:text-[3.25rem] text-foreground"
                style={{ animationDelay: "80ms" }}
              >
                Mit Erfahrung gekocht. Für deinen Alltag gemacht. Frische Nudel- und
                Reisgerichte, Bowls und Drinks — schnell zubereitet und voller Geschmack.
              </p>

              <div
                className="lys-fade-up flex flex-wrap items-center gap-8 mt-12 lg:mt-16"
                style={{ animationDelay: "200ms" }}
              >
                <Link
                  href="/order"
                  data-testid="button-hero-order"
                  className="lys-link cursor-pointer"
                >
                  {t.common.orderNow}
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/menu" className="lys-link cursor-pointer">
                  {t.common.viewMenu}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <span className="lys-rule" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
            3 · TRINITY — three products, calm grid
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-12 pt-24 lg:pt-36 pb-24 lg:pb-32">

          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-end mb-16 lg:mb-24">
            <div className="col-span-12 md:col-span-3">
              <p className="lys-caps">— 01 / Auswahl</p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-sans font-light tracking-[-0.015em] leading-[1.1] text-3xl sm:text-4xl lg:text-5xl text-foreground max-w-2xl">
                {t.home.categoriesTitle}.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            {trinity.map((item) => (
              <Link
                key={item.title}
                href="/menu"
                data-testid={`card-trinity-${item.kicker}`}
                className="group col-span-12 sm:col-span-6 lg:col-span-4 block cursor-pointer focus:outline-none"
              >
                <div className="relative w-full overflow-hidden bg-[hsl(27,18%,82%)]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="block w-full h-auto transition-transform duration-[1600ms] ease-out group-hover:scale-[1.025] select-none"
                    draggable={false}
                  />
                </div>
                <div className="pt-6 lg:pt-8">
                  <p className="lys-caps mb-3">{item.kicker}</p>
                  <h3 className="font-sans font-normal text-xl lg:text-2xl text-foreground leading-tight tracking-[-0.01em] mb-3 transition-colors duration-300 group-hover:text-foreground/70">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/65 max-w-md">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <span className="lys-rule" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
            4 · KITCHEN — full-width image, quiet caption
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="w-full lys-fade">
          <img
            src={kitchenImg}
            alt="Frische Zutaten"
            className="block w-full h-auto select-none"
            draggable={false}
          />
        </div>

        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-20 lg:pt-28 pb-24 lg:pb-36">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="col-span-12 md:col-span-3">
              <p className="lys-caps">— 02 / {t.home.freshTag}</p>
            </div>
            <div className="col-span-12 md:col-span-6 max-w-xl">
              <h2 className="font-sans font-light tracking-[-0.015em] leading-[1.12] text-3xl sm:text-4xl lg:text-[2.85rem] text-foreground mb-7">
                {t.home.freshTitle}.
              </h2>
              <p className="text-base leading-relaxed text-foreground/70 mb-8">
                {t.home.freshDesc}
              </p>
              <Link href="/menu" className="lys-link cursor-pointer">
                {t.common.viewMenu}
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="col-span-12 md:col-span-3 md:pl-4 lg:pl-8 mt-10 md:mt-0">
              <dl className="space-y-6">
                {[
                  { n: "100%", l: "Frisch" },
                  { n: "0",    l: "Konservierung" },
                  { n: "8+",   l: "Saucen" },
                ].map(({ n, l }) => (
                  <div key={l} className="pt-4 border-t border-foreground/15">
                    <dt className="font-sans font-light text-3xl lg:text-4xl tabular-nums text-foreground leading-none mb-2">
                      {n}
                    </dt>
                    <dd className="lys-caps">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <span className="lys-rule" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
            5 · BOXES — pure typographic list + single image
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-[120rem] mx-auto px-5 sm:px-8 lg:px-12 pt-24 lg:pt-36 pb-24 lg:pb-36">

          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-end mb-16 lg:mb-20">
            <div className="col-span-12 md:col-span-3">
              <p className="lys-caps">— 03 / {t.home.boxTag}</p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-sans font-light tracking-[-0.015em] leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-foreground max-w-2xl">
                {t.home.boxTitle}.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">

            {/* Left — single image */}
            <div className="col-span-12 lg:col-span-5">
              <div className="w-full overflow-hidden bg-[hsl(27,18%,82%)]">
                <img
                  src={noodleRiceBoxImg}
                  alt={t.home.boxTitle}
                  className="block w-full h-auto select-none"
                  draggable={false}
                />
              </div>
              <p className="text-sm leading-relaxed text-foreground/70 mt-6 max-w-md">
                {t.home.boxDesc}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
                {[t.home.boxSauce1, t.home.boxSauce2, t.home.boxSauce3].map((sauce) => (
                  <span key={sauce} className="lys-caps">· {sauce}</span>
                ))}
              </div>
            </div>

            {/* Right — minimal table */}
            <div className="col-span-12 lg:col-span-7">
              <div className="border-t border-foreground/15">
                {boxes.map((box, idx) => (
                  <Link
                    key={box.name}
                    href="/order"
                    data-testid={`row-box-${idx}`}
                    className="group grid grid-cols-12 items-baseline gap-4 py-6 sm:py-7 border-b border-foreground/15 cursor-pointer transition-colors duration-300"
                  >
                    <span className="col-span-2 sm:col-span-1 lys-caps tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="col-span-7 sm:col-span-7 font-sans font-normal text-lg sm:text-xl lg:text-[1.5rem] text-foreground leading-snug tracking-[-0.01em] transition-colors duration-300 group-hover:text-foreground/65">
                      {box.name}
                    </p>
                    <span className="hidden sm:inline lys-caps col-span-2">{box.tag}</span>
                    <p className="col-span-3 sm:col-span-2 text-right font-sans font-light text-lg sm:text-xl lg:text-[1.5rem] text-foreground tabular-nums">
                      {box.price}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/order" className="lys-link cursor-pointer">
                  {t.common.orderNow}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <span className="lys-rule" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
            6 · VISIT — full image + plain info
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="w-full lys-fade">
          <img
            src={storefrontImg}
            alt="LYS Noodle Box Außenansicht"
            className="block w-full h-auto select-none"
            draggable={false}
          />
        </div>

        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-20 lg:pt-28 pb-24 lg:pb-36">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="col-span-12 md:col-span-3">
              <p className="lys-caps">— 04 / Besuch</p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-sans font-light tracking-[-0.015em] leading-[1.1] text-3xl sm:text-4xl lg:text-[2.85rem] text-foreground max-w-2xl mb-12 lg:mb-16">
                Kappelgasse 2, 73525 Schwäbisch Gmünd.
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 max-w-3xl">
                <div className="pt-5 border-t border-foreground/15">
                  <p className="lys-caps mb-3">{t.common.openingHours}</p>
                  <p className="text-sm leading-relaxed text-foreground">
                    Mo–Do · 11:00 – 21:30<br />
                    Fr–Sa · 11:00 – 22:00<br />
                    So · 13:00 – 20:00
                  </p>
                </div>
                <div className="pt-5 border-t border-foreground/15">
                  <p className="lys-caps mb-3">{t.common.address}</p>
                  <p className="text-sm leading-relaxed text-foreground">
                    Kappelgasse 2<br />
                    73525 Schwäbisch Gmünd<br />
                    Deutschland
                  </p>
                </div>
                <div className="pt-5 border-t border-foreground/15">
                  <p className="lys-caps mb-3">{t.common.phone}</p>
                  <a href="tel:xxxxxx" className="lys-link cursor-pointer">
                    xxxxxx
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>

              {/* Testimonial below — very quiet */}
              <div className="mt-20 lg:mt-28 max-w-2xl">
                <p className="lys-caps mb-5">— Stimmen</p>
                <blockquote className="font-sans font-light tracking-[-0.01em] leading-[1.35] text-xl sm:text-2xl lg:text-[1.75rem] text-foreground/85 italic">
                  {t.home.testimonialQuote}
                </blockquote>
                <p className="lys-caps mt-6">{t.home.testimonialAuthor}</p>
              </div>
            </div>
          </div>
        </div>
        <span className="lys-rule" />
      </section>

      {/* ════════════════════════════════════════════════════════════════
            7 · CLOSING — single quiet invitation
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-24 lg:pt-36 pb-32 lg:pb-48">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-end">
            <div className="col-span-12 md:col-span-9">
              <p className="lys-caps mb-6">— 05 / Schluss</p>
              <h2 className="font-sans font-light tracking-[-0.02em] leading-[0.98] text-[2.6rem] sm:text-6xl lg:text-[5.5rem] xl:text-[7rem] text-foreground">
                {t.home.ctaTitle}
              </h2>
              <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/70 leading-relaxed">
                {t.home.ctaDesc}
              </p>
            </div>

            <div className="col-span-12 md:col-span-3 flex md:justify-end mt-8 md:mt-0">
              <Link
                href="/order"
                data-testid="button-final-cta"
                className="lys-link cursor-pointer text-base"
              >
                {t.home.ctaBtn}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
            8 · STOREFRONT — full-bleed closing image
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="w-full lys-fade">
          <img
            src={storefrontImg}
            alt="LYS Noodle &amp; Rice — Kappelgasse 2, Schwäbisch Gmünd"
            className="block w-full h-auto select-none"
            draggable={false}
          />
        </div>
        <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 pt-8 lg:pt-10 pb-16 lg:pb-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="lys-caps">— LYS Noodle &amp; Rice · Kappelgasse 2</p>
            <p className="lys-caps">Schwäbisch Gmünd · 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}
