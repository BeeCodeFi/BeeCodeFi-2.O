"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";

export function TaskBrief({ briefCdnPath, title }: { briefCdnPath: string; title: string }) {
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    fetch(briefCdnPath)
      .then((r) => r.text())
      .then(setMarkdown)
      .catch(() => setMarkdown(""));
  }, [briefCdnPath]);

  return (
    <Card>
      <h3 className="mb-2 text-lg font-semibold">🚀 {title}</h3>
      {markdown === null ? (
        <p className="text-text/60">Loading brief…</p>
      ) : (
        <div className="prose-lesson text-sm">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      )}
    </Card>
  );
}
