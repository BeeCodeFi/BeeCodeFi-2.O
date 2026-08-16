"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { ParsedSection } from "@/lib/lesson-sections";
import { apiFetch } from "@/lib/api";
import { CheckpointQuestion, type CheckpointPayload } from "./checkpoint-question";
import type { LessonSectionSummary } from "@beecodefi/schemas";

const FLUSH_INTERVAL_MS = 15_000;
const VISIBLE_THRESHOLD = 0.6;

interface DwellState {
  dwellSeconds: number;
  maxScrollPct: number;
  pendingDwell: number;
  pendingScrollPct: number;
}

export function LessonReader({
  lessonId,
  cdnPath,
  sections,
  parsedSections,
  loading,
  onReadProgress,
}: {
  lessonId: string;
  cdnPath: string;
  sections: LessonSectionSummary[];
  parsedSections: ParsedSection[];
  loading: boolean;
  onReadProgress?: () => void;
}) {
  const [checkpoint, setCheckpoint] = useState<CheckpointPayload | null>(null);
  const dwellRef = useRef<Map<string, DwellState>>(new Map());
  const visibleRef = useRef<Set<string>>(new Set());
  const sectionByAnchor = useMemo(() => new Map(sections.map((s) => [s.anchor, s])), [sections]);

  useEffect(() => {
    fetch(`${cdnPath}/checkpoint.json`)
      .then((r) => r.json())
      .then(setCheckpoint)
      .catch(() => setCheckpoint(null));
  }, [cdnPath]);

  // Per-second dwell ticker — only counts while the tab is visible (`04 §Stage 1`).
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      for (const anchor of visibleRef.current) {
        const state = dwellRef.current.get(anchor) ?? {
          dwellSeconds: 0,
          maxScrollPct: 0,
          pendingDwell: 0,
          pendingScrollPct: 0,
        };
        state.pendingDwell += 1;
        dwellRef.current.set(anchor, state);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const flush = useRef(async (useBeacon: boolean) => {
    const reads = Array.from(dwellRef.current.entries())
      .filter(([, s]) => s.pendingDwell > 0 || s.pendingScrollPct > 0)
      .map(([anchor, s]) => {
        const section = sectionByAnchor.get(anchor);
        const payload = section
          ? { sectionId: section.id, dwellSeconds: s.pendingDwell, maxScrollPct: s.pendingScrollPct }
          : null;
        s.dwellSeconds += s.pendingDwell;
        s.maxScrollPct = Math.max(s.maxScrollPct, s.pendingScrollPct);
        s.pendingDwell = 0;
        s.pendingScrollPct = 0;
        return payload;
      })
      .filter((p): p is NonNullable<typeof p> => Boolean(p));

    if (reads.length === 0) return;

    if (useBeacon && typeof navigator.sendBeacon === "function") {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
      const blob = new Blob([JSON.stringify({ reads })], { type: "application/json" });
      navigator.sendBeacon(`${API_URL}/progress/section-reads`, blob);
      return;
    }

    await apiFetch("/progress/section-reads", { method: "POST", body: JSON.stringify({ reads }) });
    onReadProgress?.();
  });

  useEffect(() => {
    const interval = setInterval(() => flush.current(false), FLUSH_INTERVAL_MS);
    const onUnload = () => flush.current(true);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", onUnload);
      flush.current(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (parsedSections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const anchor = (entry.target as HTMLElement).dataset.anchor;
          if (!anchor) continue;
          if (entry.intersectionRatio >= VISIBLE_THRESHOLD) {
            visibleRef.current.add(anchor);
          } else {
            visibleRef.current.delete(anchor);
          }
          const state = dwellRef.current.get(anchor) ?? {
            dwellSeconds: 0,
            maxScrollPct: 0,
            pendingDwell: 0,
            pendingScrollPct: 0,
          };
          state.pendingScrollPct = Math.max(state.pendingScrollPct, entry.intersectionRatio * 100);
          dwellRef.current.set(anchor, state);
        }
      },
      { threshold: [0, VISIBLE_THRESHOLD, 1] },
    );
    const nodes = document.querySelectorAll("[data-anchor]");
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [parsedSections]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-6 w-1/2" />
        <div className="skeleton h-4" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-24" />
      </div>
    );
  }

  return (
    <article className="prose-lesson max-w-3xl leading-[1.75]">
      {parsedSections.map((section) => (
        <section key={section.anchor} id={section.anchor} data-anchor={section.anchor} className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">{section.heading}</h2>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{section.body}</ReactMarkdown>
        </section>
      ))}
      {checkpoint && <CheckpointQuestion lessonId={lessonId} checkpoint={checkpoint} />}
    </article>
  );
}
