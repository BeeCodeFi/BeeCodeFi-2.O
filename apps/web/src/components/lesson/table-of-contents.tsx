import type { ParsedSection } from "@/lib/lesson-sections";

export function TableOfContents({ sections }: { sections: ParsedSection[] }) {
  if (sections.length === 0) return null;

  return (
    <nav aria-label="On this page" className="sticky top-[180px]">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text/40">
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
          <path
            fill="currentColor"
            d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h10v2H3v-2z"
          />
        </svg>
        On this page
      </p>
      <ul className="space-y-2 border-l border-accent/15 pl-3 text-sm">
        {sections.map((section) => (
          <li key={section.anchor}>
            <a
              href={`#${section.anchor}`}
              className="block text-text/60 transition-colors hover:text-primary"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
