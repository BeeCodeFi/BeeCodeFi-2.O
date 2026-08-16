"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface CheckpointPayload {
  id: string;
  prompt: string;
  options: string[];
}

export function CheckpointQuestion({
  lessonId,
  checkpoint,
  onPassed,
}: {
  lessonId: string;
  checkpoint: CheckpointPayload;
  onPassed?: () => void;
}) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(option: string) {
    setSelected(option);
    setSubmitting(true);
    try {
      await apiFetch("/progress/checkpoint", {
        method: "POST",
        body: JSON.stringify({ lessonId, questionId: checkpoint.id, answer: option }),
      });
      setAnswered(true);
      onPassed?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="my-6 border-primary/40">
      <p className="mb-3 text-sm font-medium">🍯 Quick check: {checkpoint.prompt}</p>
      {answered ? (
        <p className="text-sm text-success">Got it — thanks for checking in.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {checkpoint.options.map((option) => (
            <Button
              key={option}
              variant={selected === option ? "primary" : "secondary"}
              disabled={submitting}
              onClick={() => submit(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}

export type { CheckpointPayload };
