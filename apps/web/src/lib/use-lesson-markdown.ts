import { useEffect, useState } from "react";
import { parseLessonSections, type ParsedSection } from "./lesson-sections";

/**
 * Fetches and parses a lesson's markdown body once, shared by LessonReader
 * (renders section bodies) and the table-of-contents sidebar (needs heading
 * text) so they don't each fetch `lesson.mdx` independently.
 */
export function useLessonMarkdown(cdnPath: string): { sections: ParsedSection[]; loading: boolean } {
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    setMarkdown(null);
    fetch(`${cdnPath}/lesson.mdx`)
      .then((r) => r.text())
      .then(setMarkdown)
      .catch(() => setMarkdown(""));
  }, [cdnPath]);

  return {
    sections: markdown ? parseLessonSections(markdown) : [],
    loading: markdown === null,
  };
}
