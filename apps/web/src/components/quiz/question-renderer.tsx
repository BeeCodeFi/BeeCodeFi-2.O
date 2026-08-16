"use client";

import { useEffect, useState } from "react";
import type { AttemptQuestion } from "@beecodefi/schemas";
import { Button } from "@/components/ui/button";

interface QuestionPayload {
  prompt: string;
  options?: string[];
  placeholder?: string;
}

export function QuestionRenderer({
  question,
  onAnswer,
}: {
  question: AttemptQuestion;
  onAnswer: (answer: string | string[]) => void;
}) {
  const [payload, setPayload] = useState<QuestionPayload | null>(null);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [ordered, setOrdered] = useState<string[]>([]);

  useEffect(() => {
    setText("");
    setSelected([]);
    setOrdered([]);
    fetch(question.payloadCdnPath)
      .then((r) => r.json())
      .then(setPayload);
  }, [question.payloadCdnPath]);

  if (!payload) return <p className="text-text/60">Loading question…</p>;

  if (question.qtype === "fill_blank") {
    return (
      <div className="space-y-3">
        <p className="font-medium">{payload.prompt}</p>
        <input
          className="w-full rounded-md border border-accent/30 bg-bg px-3 py-2 text-sm"
          placeholder={payload.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={() => onAnswer(text)} disabled={text.trim().length === 0}>
          Next
        </Button>
      </div>
    );
  }

  if (question.qtype === "multi") {
    const options = payload.options ?? [];
    return (
      <div className="space-y-3">
        <p className="font-medium">{payload.prompt}</p>
        <div className="space-y-2">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={(e) =>
                  setSelected((prev) => (e.target.checked ? [...prev, opt] : prev.filter((o) => o !== opt)))
                }
              />
              {opt}
            </label>
          ))}
        </div>
        <Button onClick={() => onAnswer(selected)} disabled={selected.length === 0}>
          Next
        </Button>
      </div>
    );
  }

  if (question.qtype === "order_steps") {
    const options = payload.options ?? [];
    const remaining = options.filter((o) => !ordered.includes(o));
    return (
      <div className="space-y-3">
        <p className="font-medium">{payload.prompt}</p>
        <p className="text-xs text-text/60">Click options in the order they should appear.</p>
        <div className="flex flex-wrap gap-2">
          {ordered.map((opt, i) => (
            <span key={opt} className="rounded-md bg-primary/20 px-2 py-1 text-sm font-mono">
              {i + 1}. {opt}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {remaining.map((opt) => (
            <Button key={opt} variant="secondary" onClick={() => setOrdered((prev) => [...prev, opt])}>
              {opt}
            </Button>
          ))}
        </div>
        <Button onClick={() => onAnswer(ordered)} disabled={remaining.length > 0}>
          Next
        </Button>
      </div>
    );
  }

  // mcq / fix_code — single choice.
  const options = payload.options ?? [];
  return (
    <div className="space-y-3">
      <p className="font-medium">{payload.prompt}</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <Button key={opt} variant="secondary" className="block w-full text-left" onClick={() => onAnswer(opt)}>
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}
