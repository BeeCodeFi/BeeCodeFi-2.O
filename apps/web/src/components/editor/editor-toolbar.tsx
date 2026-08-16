"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "./editor-store";

export function EditorToolbar() {
  const reset = useEditorStore((s) => s.reset);
  const savedAt = useEditorStore((s) => s.savedAt);

  return (
    <div className="flex items-center justify-between border-b border-accent/20 px-3 py-2">
      <Button variant="ghost" onClick={reset}>
        Reset to starter
      </Button>
      <span className="text-xs text-text/50">
        {savedAt ? `Saved ✓ ${new Date(savedAt).toLocaleTimeString()}` : "Not saved yet"}
      </span>
    </div>
  );
}
