import type { ParsedSection } from "@/lib/lesson-sections";

export function TableOfContents({ sections }: { sections: ParsedSection[] }) {
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="animate-slide-in-right sticky top-[180px] max-h-[calc(100vh-200px)] overflow-y-auto pl-2"
      style={{ animationDelay: "200ms" }}
    >
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-surface px-3 py-2 shadow-soft">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/15 text-primary">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
            <path
              fill="currentColor"
              d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h10v2H3v-2z"
            />
          </svg>
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-text/60">
          On this page
        </span>
      </div>

      <ul className="relative ml-4 space-y-1 border-l-2 border-accent/10 py-1 pl-3 text-sm">
        {sections.map((section) => (
          <li key={section.anchor}>
            <a
              href={`#${section.anchor}`}
              className="block rounded-md px-2 py-1.5 text-text/55 transition-colors duration-200 hover:bg-surface-hover hover:text-primary hover:font-medium"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
