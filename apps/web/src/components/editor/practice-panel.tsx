"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { apiFetch } from "@/lib/api";
import { useEditorStore } from "./editor-store";
import { PreviewFrame } from "./preview-frame";
import { EditorToolbar } from "./editor-toolbar";
import type { SnapshotResponse } from "@beecodefi/schemas";

// Monaco is ~2 MB — keep it out of the initial bundle (`06 §6`), only load
// once the Practice panel actually mounts.
const CodeEditor = dynamic(() => import("./code-editor").then((m) => m.CodeEditor), { ssr: false });

const AUTOSAVE_DEBOUNCE_MS = 3000;

export function PracticePanel({ lessonId }: { lessonId: string }) {
  const hydrate = useEditorStore((s) => s.hydrate);
  const code = useEditorStore((s) => s.code);
  const markSaved = useEditorStore((s) => s.markSaved);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const hydrated = useRef(false);

  const { data } = useQuery({
    queryKey: ["editor-snapshot", lessonId],
    queryFn: () => apiFetch<SnapshotResponse>(`/editor/${lessonId}/snapshot`),
  });

  useEffect(() => {
    if (data && !hydrated.current) {
      hydrate(data.code, data.starterCode, data.savedAt);
      hydrated.current = true;
    }
  }, [data, hydrate]);

  useEffect(() => {
    if (!hydrated.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const res = await apiFetch<{ saved: boolean }>(`/editor/${lessonId}/snapshot`, {
        method: "PUT",
        body: JSON.stringify({ code, isManual: false }),
      });
      if (res.saved) markSaved(new Date().toISOString());
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, lessonId]);

  return (
    <div className="grid h-[480px] grid-cols-2 gap-3">
      <div className="rounded-md border border-accent/20">
        <EditorToolbar />
        <div className="h-[430px]">
          <CodeEditor />
        </div>
      </div>
      <PreviewFrame code={code} />
    </div>
  );
}
