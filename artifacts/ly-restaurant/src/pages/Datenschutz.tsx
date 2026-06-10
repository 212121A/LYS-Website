import {
  Shield,
  Server,
  Database,
  FileText,
  MessageSquare,
  ShoppingBag,
  CreditCard,
  MapPin,
  Cookie,
  Mail,
  Clock,
  UserCheck,
  Scale,
  Lock,
  Info,
} from "lucide-react";
import type { ReactNode } from "react";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ExtLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline break-words"
    >
      {href}
    </a>
  );
}

export default function Datenschutz() {
  return (
    <div>
      {/* Header */}
      <section className="bg-card border-b border-border py-20 pattern-bg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">
            Rechtliche Informationen
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Datenschutzerklärung
          </h1>
          <p className="text-muted-foreground max-w-lg">Stand: Juni 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <Section icon={Shield} title="1. Verantwortlicher">
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO)
            ist:
          </p>
          <div className="text-foreground">
            <p className="font-medium">LYS Noodles & Rice</p>
            <p>Inhaber: Manh Chung Tran</p>
            <p>Kappelgasse 2</p>
            <p>73525 Schwäbisch Gmünd</p>
            <p>Deutschland</p>
            <p className="mt-2">
              E-Mail:{" "}
              <a
                href="mailto:info@lysnoodleandrice.com"
                className="text-primary hover:underline"
              >
                info@lysnoodleandrice.com
              </a>
            </p>
          </div>
        </Section>

        <Section icon={Info} title="2. Allgemeine Hinweise zur Datenverarbeitung">
          <p>
            Der Schutz deiner personenbezogenen Daten ist uns wichtig. Wir
            behandeln personenbezogene Daten vertraulich und entsprechend den
            geltenden Datenschutzvorschriften, insbesondere der
            Datenschutz-Grundverordnung (DSGVO) und dem
            Bundesdatenschutzgesetz (BDSG).
          </p>
          <p>
            Personenbezogene Daten werden nur erhoben und verarbeitet, soweit
            dies zur Bereitstellung einer funktionsfähigen Website, zur
            Durchführung von Bestellungen, zur Bearbeitung von Anfragen oder
            Bewerbungen oder aufgrund gesetzlicher Verpflichtungen erforderlich
            ist.
          </p>
        </Section>

        <Section icon={Server} title="3. Hosting durch Vercel">
          <p>
            Diese Website wird über den Hosting-Anbieter Vercel bereitgestellt.
          </p>
          <div className="text-foreground">
            <p className="font-medium">Anbieter:</p>
            <p>Vercel Inc.</p>
            <p>440 N Barranca Ave #4133</p>
            <p>Covina, CA 91723</p>
            <p>USA</p>
          </div>
          <p>
            Beim Besuch unserer Website werden technisch notwendige Daten
            verarbeitet, um die Website bereitzustellen und die
            Systemsicherheit zu gewährleisten. Hierzu können insbesondere
            gehören:
          </p>
          <Bullets
            items={[
              "IP-Adresse",
              "Browsertyp und Browserversion",
              "Betriebssystem",
              "Datum und Uhrzeit des Zugriffs",
              "Referrer-URL",
              "aufgerufene Seiten",
            ]}
          />
          <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</p>
          <p>
            Weitere Informationen:{" "}
            <ExtLink href="https://vercel.com/legal/privacy-policy" />
          </p>
        </Section>

        <Section icon={Database} title="4. Datenverarbeitung über Supabase">
          <p>
            Zur Speicherung und Verarbeitung bestimmter Daten nutzen wir die
            Plattform Supabase.
          </p>
          <div className="text-foreground">
            <p className="font-medium">Anbieter:</p>
            <p>Supabase, Inc.</p>
            <p>970 Toa Payoh North</p>
            <p>#07-04</p>
            <p>Singapore 318992</p>
          </div>
          <p>
            Über Supabase können insbesondere folgende Daten verarbeitet und
            gespeichert werden:
          </p>
          <Bullets
            items={[
              "Bestelldaten",
              "Kundendaten",
              "Kontaktanfragen",
              "Bewerbungsdaten",
              "technische Systemdaten",
            ]}
          />
          <p>
            Die Verarbeitung erfolgt ausschließlich zum Betrieb unserer Website,
            zur Bearbeitung von Bestellungen, Anfragen und Bewerbungen sowie zur
            Erfüllung vertraglicher Verpflichtungen.
          </p>
          <p>
            Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO
            sowie Art. 6 Abs. 1 lit. f DSGVO.
          </p>
          <p>
            Sofern personenbezogene Daten außerhalb der Europäischen Union
            verarbeitet werden, erfolgt dies auf Grundlage geeigneter Garantien
            gemäß Art. 44 ff. DSGVO.
          </p>
          <p>
            Weitere Informationen:{" "}
            <ExtLink href="https://supabase.com/privacy" />
          </p>
        </Section>

        <Section icon={FileText} title="5. Server-Logfiles">
          <p>
            Der Hosting-Anbieter erhebt und speichert automatisch Informationen
            in sogenannten Server-Logfiles. Diese Daten umfassen insbesondere:
          </p>
          <Bullets
            items={[
              "IP-Adresse",
              "Browserinformationen",
              "Betriebssystem",
              "Datum und Uhrzeit der Anfrage",
              "Referrer-URL",
              "aufgerufene Inhalte",
            ]}
          />
          <p>
            Eine Zusammenführung dieser Daten mit anderen Datenquellen erfolgt
            nicht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </Section>

        <Section
          icon={MessageSquare}
          title="6. Kontakt- und Bewerbungsformulare (Formspree)"
        >
          <p>
            Für die Bereitstellung unserer Kontakt- und Bewerbungsformulare
            nutzen wir den Dienst Formspree.
          </p>
          <div className="text-foreground">
            <p className="font-medium">Anbieter:</p>
            <p>Formspree, Inc.</p>
            <p>2 Wisconsin Circle, Suite 700</p>
            <p>Chevy Chase, MD 20815</p>
            <p>USA</p>
          </div>
          <p>
            Wenn du eines unserer Formulare nutzt, werden die von dir
            eingegebenen Daten verarbeitet und an Formspree zur technischen
            Bearbeitung übermittelt. Je nach Formular können insbesondere
            folgende Daten verarbeitet werden:
          </p>
          <Bullets
            items={[
              "Vor- und Nachname",
              "E-Mail-Adresse",
              "Telefonnummer",
              "Nachrichteninhalt",
              "Bewerbungsunterlagen",
              "Lebenslauf",
              "weitere freiwillig übermittelte Informationen",
            ]}
          />
          <p>
            Die Verarbeitung erfolgt ausschließlich zur Bearbeitung deiner
            Anfrage oder zur Durchführung eines Bewerbungsverfahrens.
          </p>
          <p>Rechtsgrundlage ist:</p>
          <Bullets
            items={[
              "Art. 6 Abs. 1 lit. b DSGVO",
              "Art. 6 Abs. 1 lit. f DSGVO",
              "§ 26 BDSG bei Bewerbungen",
            ]}
          />
          <p>
            Da Formspree seinen Sitz in den USA hat, kann eine Übermittlung
            personenbezogener Daten in die USA erfolgen.
          </p>
          <p>
            Weitere Informationen:{" "}
            <ExtLink href="https://formspree.io/legal/privacy-policy" />
          </p>
          <p>
            Bewerbungsunterlagen werden spätestens sechs Monate nach Abschluss
            des Bewerbungsverfahrens gelöscht, sofern keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
          </p>
        </Section>

        <Section icon={ShoppingBag} title="7. Online-Bestellungen">
          <p>Über unsere Website können Speisen und Getränke bestellt werden.</p>
          <p>
            Zur Bearbeitung und Durchführung deiner Bestellung verarbeiten wir
            insbesondere:
          </p>
          <Bullets
            items={[
              "Vor- und Nachname",
              "Telefonnummer",
              "E-Mail-Adresse",
              "Bestelldaten",
              "Zahlungsinformationen",
            ]}
          />
          <p>
            Die Verarbeitung erfolgt zur Vertragserfüllung gemäß Art. 6 Abs. 1
            lit. b DSGVO. Die Daten werden ausschließlich zur Bestellabwicklung,
            Kundenkommunikation und Erfüllung gesetzlicher Pflichten verwendet.
          </p>
        </Section>

        <Section icon={CreditCard} title="8. Zahlungsabwicklung über Stripe">
          <p>Für die Abwicklung von Online-Zahlungen nutzen wir Stripe.</p>
          <div className="text-foreground">
            <p className="font-medium">Anbieter:</p>
            <p>Stripe, Inc.</p>
            <p>354 Oyster Point Boulevard</p>
            <p>South San Francisco, CA 94080</p>
            <p>USA</p>
          </div>
          <p>
            Bei einer Zahlung werden die zur Zahlungsabwicklung erforderlichen
            Daten an Stripe übermittelt. Hierzu können insbesondere gehören:
          </p>
          <Bullets
            items={[
              "Vor- und Nachname",
              "Rechnungsadresse",
              "E-Mail-Adresse",
              "Zahlungsbetrag",
              "Zahlungsdaten",
            ]}
          />
          <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.</p>
          <p>
            Weitere Informationen: <ExtLink href="https://stripe.com/privacy" />
          </p>
        </Section>

        <Section icon={MapPin} title="9. Google Maps">
          <p>
            Diese Website nutzt Google Maps zur Darstellung unseres Standorts.
          </p>
          <div className="text-foreground">
            <p className="font-medium">Anbieter:</p>
            <p>Google Ireland Limited</p>
            <p>Gordon House</p>
            <p>Barrow Street</p>
            <p>Dublin 4</p>
            <p>Irland</p>
          </div>
          <p>
            Bei Nutzung von Google Maps können personenbezogene Daten,
            insbesondere die IP-Adresse, an Google übermittelt werden. Die
            Nutzung erfolgt im Interesse einer nutzerfreundlichen Darstellung
            unseres Standorts gemäß Art. 6 Abs. 1 lit. f DSGVO.
          </p>
          <p>
            Weitere Informationen:{" "}
            <ExtLink href="https://policies.google.com/privacy" />
          </p>
        </Section>

        <Section icon={Cookie} title="10. Cookies">
          <p>
            Unsere Website verwendet ausschließlich technisch notwendige
            Cookies. Diese Cookies sind erforderlich, um die grundlegenden
            Funktionen der Website bereitzustellen und einen sicheren Betrieb zu
            gewährleisten.
          </p>
          <p>
            Es werden keine Analyse-, Marketing- oder Tracking-Cookies
            eingesetzt. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG.
          </p>
        </Section>

        <Section icon={Mail} title="11. Kommunikation per E-Mail">
          <p>
            Wenn du uns per E-Mail kontaktierst, werden die von dir
            übermittelten Daten zum Zweck der Bearbeitung deiner Anfrage
            gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
            beziehungsweise Art. 6 Abs. 1 lit. f DSGVO.
          </p>
          <p>Die Daten werden nicht ohne deine Einwilligung an Dritte weitergegeben.</p>
        </Section>

        <Section icon={Clock} title="12. Speicherdauer">
          <p>
            Personenbezogene Daten werden nur so lange gespeichert, wie dies für
            die jeweiligen Verarbeitungszwecke erforderlich ist oder gesetzliche
            Aufbewahrungspflichten bestehen.
          </p>
          <Bullets
            items={[
              "Kontaktanfragen: bis zu 6 Monate",
              "Bewerbungen: bis zu 6 Monate nach Abschluss des Verfahrens",
              "Bestellungen und Rechnungsdaten: entsprechend gesetzlicher Aufbewahrungspflichten",
              "Steuerrelevante Unterlagen: entsprechend gesetzlicher Vorgaben",
            ]}
          />
        </Section>

        <Section icon={UserCheck} title="13. Rechte betroffener Personen">
          <p>Du hast das Recht auf:</p>
          <Bullets
            items={[
              "Auskunft gemäß Art. 15 DSGVO",
              "Berichtigung gemäß Art. 16 DSGVO",
              "Löschung gemäß Art. 17 DSGVO",
              "Einschränkung der Verarbeitung gemäß Art. 18 DSGVO",
              "Datenübertragbarkeit gemäß Art. 20 DSGVO",
              "Widerspruch gemäß Art. 21 DSGVO",
              "Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3 DSGVO",
            ]}
          />
          <p>
            Zur Ausübung deiner Rechte kannst du dich jederzeit an uns wenden:{" "}
            <a
              href="mailto:info@lysnoodleandrice.com"
              className="text-primary hover:underline"
            >
              info@lysnoodleandrice.com
            </a>
          </p>
        </Section>

        <Section icon={Scale} title="14. Beschwerderecht bei einer Aufsichtsbehörde">
          <p>
            Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu
            beschweren.
          </p>
          <div className="text-foreground">
            <p className="font-medium">Zuständige Aufsichtsbehörde:</p>
            <p>
              Der Landesbeauftragte für den Datenschutz und die
              Informationsfreiheit Baden-Württemberg
            </p>
            <p>Postfach 10 29 32</p>
            <p>70025 Stuttgart</p>
          </div>
          <p>
            Website:{" "}
            <ExtLink href="https://www.baden-wuerttemberg.datenschutz.de" />
          </p>
        </Section>

        <Section icon={Lock} title="15. Datensicherheit">
          <p>
            Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein,
            um deine personenbezogenen Daten vor Verlust, Manipulation,
            unberechtigtem Zugriff und sonstigen unbefugten Verarbeitungen zu
            schützen.
          </p>
          <p>
            Unsere Website nutzt eine SSL-/TLS-Verschlüsselung, damit
            übermittelte Daten geschützt übertragen werden können.
          </p>
          <p>
            Die Sicherheitsmaßnahmen werden entsprechend der technologischen
            Entwicklung fortlaufend angepasst und verbessert.
          </p>
        </Section>
      </div>
    </div>
  );
}
