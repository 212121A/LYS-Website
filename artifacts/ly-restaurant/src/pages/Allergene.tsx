import { ListChecks, FlaskConical } from "lucide-react";
import { ALLERGENS, ADDITIVES, DISH_GROUPS, type LegendEntry } from "@/data/allergens";

const CODE_LABELS: Record<string, string> = Object.fromEntries(
  [...ALLERGENS, ...ADDITIVES].map((e) => [e.code, e.label]),
);

function CodeChip({ code }: { code: string }) {
  return (
    <span
      title={CODE_LABELS[code]}
      className="inline-flex items-center justify-center min-w-[1.6rem] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold font-mono"
    >
      {code}
    </span>
  );
}

function Legend({ title, icon, entries }: { title: string; icon: React.ReactNode; entries: LegendEntry[] }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">{title}</h2>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.code} className="flex items-start gap-3 text-sm">
            <CodeChip code={e.code} />
            <span className="text-muted-foreground leading-relaxed pt-0.5">{e.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Allergene() {
  return (
    <div>
      {/* Header */}
      <section className="bg-card border-b border-border py-20 pattern-bg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase mb-3">
            Kennzeichnung
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Allergene &amp; Zusatzstoffe
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Übersicht der kennzeichnungspflichtigen Allergene und Zusatzstoffe
            für unsere Gerichte und Getränke.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Legenden */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Legend
            title="Allergene"
            icon={<ListChecks size={18} className="text-primary" />}
            entries={ALLERGENS}
          />
          <Legend
            title="Zusatzstoffe"
            icon={<FlaskConical size={18} className="text-primary" />}
            entries={ADDITIVES}
          />
        </div>

        {/* Gerichte nach Kategorie */}
        {DISH_GROUPS.map((group) => (
          <section key={group.title} className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-foreground">{group.title}</h2>
            {group.note && (
              <p className="text-xs text-muted-foreground mt-1.5">{group.note}</p>
            )}
            <div className="mt-5 divide-y divide-border">
              {group.items.map((item) => (
                <div key={item.ref} className="flex items-start justify-between gap-3 sm:gap-4 py-2.5">
                  <p className="flex-1 min-w-0 text-sm text-foreground break-words">
                    {item.name ? (
                      <>
                        <span className="font-mono font-semibold mr-2">{item.ref}</span>
                        {item.name}
                      </>
                    ) : (
                      <span className="font-medium">{item.ref}</span>
                    )}
                  </p>
                  <span className="flex flex-wrap justify-end gap-1 shrink-0 max-w-[48%]">
                    {item.codes.length > 0 ? (
                      item.codes.map((code) => <CodeChip key={code} code={code} />)
                    ) : item.note ? null : (
                      <span className="text-sm text-muted-foreground">&ndash;</span>
                    )}
                    {item.note && (
                      <span className="text-xs text-muted-foreground italic self-center">
                        {item.note}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
