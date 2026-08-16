"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuestionRenderer } from "./question-renderer";
import type { PracticePoolResponse } from "@beecodefi/schemas";

export function PracticePool({ quizId }: { quizId: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { data } = useQuery({
    queryKey: ["practice-pool", quizId],
    queryFn: () => apiFetch<PracticePoolResponse>(`/quizzes/${quizId}/practice-pool`),
    enabled: open,
  });

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Practice more (ungraded)
      </Button>
    );
  }

  if (!data || data.questions.length === 0) {
    return <p className="text-text/60">Loading more questions…</p>;
  }

  const question = data.questions[index % data.questions.length]!;

  return (
    <Card>
      <p className="mb-3 text-xs text-text/50">Practice mode — untimed, ungraded, no pressure.</p>
      <QuestionRenderer question={question} onAnswer={() => setIndex((i) => i + 1)} />
    </Card>
  );
}
