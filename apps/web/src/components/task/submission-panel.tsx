"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useEditorStore } from "@/components/editor/editor-store";
import { AutoCheckReport } from "./auto-check-report";
import type { SubmissionResponse } from "@beecodefi/schemas";

type Tab = "upload" | "onsite_editor" | "github";

export function SubmissionPanel({ taskId, onPassed }: { taskId: string; onPassed?: () => void }) {
  const [tab, setTab] = useState<Tab>("onsite_editor");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResponse | null>(null);
  const code = useEditorStore((s) => s.code);

  async function submitOnsite() {
    setSubmitting(true);
    try {
      const res = await apiFetch<SubmissionResponse>(`/tasks/${taskId}/submissions`, {
        method: "POST",
        body: JSON.stringify({ method: "onsite_editor", code }),
      });
      setResult(res);
      if (res.status === "passed") onPassed?.();
    } finally {
      setSubmitting(false);
    }
  }

  async function submitUpload() {
    if (!file) return;
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("files", file);
      const res = await apiFetch<SubmissionResponse>(`/tasks/${taskId}/submissions`, {
        method: "POST",
        body: form,
      });
      setResult(res);
      if (res.status === "passed") onPassed?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-3 flex gap-1 border-b border-accent/20">
        <TabButton active={tab === "onsite_editor"} onClick={() => setTab("onsite_editor")}>
          Submit editor code
        </TabButton>
        <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
          Upload files
        </TabButton>
        <TabButton active={false} disabled title="Coming in Phase 2">
          Push to GitHub
        </TabButton>
      </div>

      {tab === "onsite_editor" && (
        <div className="space-y-3">
          <p className="text-sm text-text/70">Submits the HTML currently in your Practice editor.</p>
          <Button onClick={submitOnsite} disabled={submitting}>
            {submitting ? "Checking…" : "Submit current editor code"}
          </Button>
        </div>
      )}

      {tab === "upload" && (
        <div className="space-y-3">
          <p className="text-sm text-text/70">Drag/drop or choose an .html/.css/.js/.zip file (≤ 1 MB).</p>
          <input
            type="file"
            accept=".html,.css,.js,.zip"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <Button onClick={submitUpload} disabled={submitting || !file}>
            {submitting ? "Checking…" : "Upload & check"}
          </Button>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <AutoCheckReport report={result.autoCheckReport ?? { passed: false, issues: [] }} />
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  disabled,
  title,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  title?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "border-b-2 border-primary text-text" : "text-text/60"
      }`}
    >
      {children}
    </button>
  );
}
