import { parse } from "parse5";
import type { AutoCheckReport } from "@beecodefi/schemas";

export interface Rubric {
  requiredElements: string[]; // e.g. "form", "input[type=email]"
  forbidden: string[]; // e.g. "<table"
  minLines: number;
  mustValidateHtml?: boolean;
}

interface Element {
  tagName?: string;
  attrs?: { name: string; value: string }[];
  childNodes?: Element[];
}

function collectElements(node: Element, acc: Element[] = []): Element[] {
  if (node.tagName) acc.push(node);
  for (const child of node.childNodes ?? []) collectElements(child, acc);
  return acc;
}

function matchesSelector(el: Element, selector: string): boolean {
  // Supports "tag", "tag[attr]" (existence check), and "tag[attr=value]".
  const match = /^([a-z0-9-]+)(?:\[([a-z-]+)(?:=(.+))?\])?$/i.exec(selector.trim());
  if (!match) return false;
  const [, tag = "", attrName, attrValue] = match;
  if (el.tagName?.toLowerCase() !== tag.toLowerCase()) return false;
  if (!attrName) return true;
  const attr = el.attrs?.find((a) => a.name.toLowerCase() === attrName.toLowerCase());
  if (!attr) return false;
  if (attrValue === undefined) return true;
  return attr.value.toLowerCase() === attrValue.toLowerCase();
}

/**
 * Parsing-only rubric evaluation (`04 §Stage 4`) — parse5 never executes the
 * submitted HTML, it only builds a tree we can inspect for required/
 * forbidden elements.
 */
export function checkRubric(html: string, rubric: Rubric): AutoCheckReport {
  const issues: AutoCheckReport["issues"] = [];
  const document = parse(html);
  const elements = collectElements(document as unknown as Element);

  for (const selector of rubric.requiredElements) {
    if (!elements.some((el) => matchesSelector(el, selector))) {
      issues.push({ code: "MISSING_ELEMENT", message: `Missing a required element: ${selector}` });
    }
  }

  for (const forbidden of rubric.forbidden) {
    const tag = forbidden.replace(/^</, "").trim();
    if (elements.some((el) => el.tagName?.toLowerCase() === tag.toLowerCase())) {
      issues.push({ code: "FORBIDDEN_ELEMENT", message: `Found a forbidden element: ${forbidden}` });
    }
  }

  const lineCount = html.split("\n").filter((l) => l.trim().length > 0).length;
  if (lineCount < rubric.minLines) {
    issues.push({
      code: "TOO_SHORT",
      message: `Needs at least ${rubric.minLines} non-blank lines (found ${lineCount}).`,
    });
  }

  return { passed: issues.length === 0, issues };
}
