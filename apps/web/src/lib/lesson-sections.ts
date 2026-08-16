export interface ParsedSection {
  anchor: string;
  heading: string;
  body: string;
}

const HEADING_RE = /^##\s+(.+?)\s*\{#([\w-]+)\}\s*$/;

/**
 * Splits a lesson's markdown body into per-anchor sections so each can be
 * wrapped in its own IntersectionObserver target for dwell tracking
 * (`04 §Stage 1`). Content before the first anchored heading (the intro) is
 * dropped from tracking — only anchored sections count toward Read completion.
 */
export function parseLessonSections(markdown: string): ParsedSection[] {
  const lines = markdown.split("\n");
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    const match = HEADING_RE.exec(line);
    if (match) {
      if (current) sections.push(current);
      current = { anchor: match[2]!, heading: match[1]!, body: "" };
    } else if (current) {
      current.body += `${line}\n`;
    }
  }
  if (current) sections.push(current);
  return sections;
}
