import { Mail, MapPin, Phone, User, FileText, Scale } from "lucide-react";

export default function Impressum() {
  return (
    <div>
      {/* Header */}
      <section className="bg-card border-b border-border py-20 pattern-bg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">
            Rechtliche Informationen
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Impressum
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz) und § 18 Abs. 2 MStV
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Anbieter */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <User size={18} className="text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Diensteanbieter
            </h2>
          </div>
          <div className="space-y-1 text-foreground">
            <p className="font-medium">Manh Chung Tran</p>
            <p className="text-muted-foreground text-sm">LYS Noodle & Rice (Einzelunternehmen)</p>
          </div>
          <div className="mt-4 flex items-start gap-2 text-muted-foreground text-sm">
            <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Kappelgasse 2
              <br />
              73525 Schwäbisch Gmünd
              <br />
              Deutschland
            </span>
          </div>
        </section>

        {/* Kontakt */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Mail size={18} className="text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">Kontakt</h2>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={15} className="shrink-0 text-primary" />
              <span className="text-muted-foreground">
                Telefon:{" "}
                <span className="text-foreground font-medium">
                  {/* TODO: Telefonnummer eintragen — Pflichtangabe */}
                  [Telefonnummer bitte ergänzen]
                </span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="shrink-0 text-primary" />
              <span className="text-muted-foreground">
                E-Mail:{" "}
                <a
                  href="mailto:info@lysnoodleandrice.com"
                  className="text-primary hover:underline font-medium"
                >
                  info@lysnoodleandrice.com
                </a>
              </span>
            </li>
          </ul>
        </section>

        {/* Umsatzsteuer */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <FileText size={18} className="text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Umsatzsteuer
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            <br />
            <span className="text-foreground font-medium">
              {/* TODO: USt-IdNr. eintragen (Format DE123456789) oder bei Kleinunternehmern:
                  "Kleinunternehmer gemäß § 19 UStG, daher wird keine Umsatzsteuer ausgewiesen."
                  und Steuernummer angeben. */}
              [USt-IdNr. bzw. Steuernummer bitte ergänzen]
            </span>
          </p>
        </section>

        {/* Verantwortlich für den Inhalt */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <User size={18} className="text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
          </div>
          <div className="space-y-1 text-foreground text-sm">
            <p className="font-medium">Manh Chung Tran</p>
            <p className="text-muted-foreground">Kappelgasse 2, 73525 Schwäbisch Gmünd</p>
          </div>
        </section>

        {/* Streitbeilegung */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Scale size={18} className="text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit, die Sie unter{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>{" "}
              finden.
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>

        {/* Haftungshinweis */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Haftung für Inhalte
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
            übermittelte oder gespeicherte fremde Informationen zu überwachen
            oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
            hinweisen.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
            Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
            Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
            von entsprechenden Rechtsverletzungen werden wir diese Inhalte
            umgehend entfernen.
          </p>
        </section>

        {/* Haftung für Links */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Haftung für Links
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
            Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
            Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
          </p>
        </section>

        {/* Urheberrecht */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Urheberrecht
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen
            Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
            Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
            jeweiligen Autors bzw. Erstellers.
          </p>
        </section>
      </div>
    </div>
  );
}
