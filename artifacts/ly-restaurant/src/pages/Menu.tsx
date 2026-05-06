import { Download } from "lucide-react";

export default function Menu() {
  const downloads = [
    {
      href: "/menus/Speisekarte.pdf",
      filename: "LYS-Speisekarte.pdf",
      label: "Speisekarte",
      testId: "download-speisekarte",
    },
    {
      href: "/menus/Getraenkekarte.pdf",
      filename: "LYS-Getraenkekarte.pdf",
      label: "Getränkekarte",
      testId: "download-getraenkekarte",
    },
  ];

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-3xl gap-5 sm:grid-cols-2">
        {downloads.map((download) => (
          <a
            key={download.href}
            href={download.href}
            download={download.filename}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={download.testId}
            className="group flex min-h-44 flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card px-8 py-10 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
              <Download size={30} aria-hidden="true" />
            </span>
            <span className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              {download.label}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              PDF Download
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
