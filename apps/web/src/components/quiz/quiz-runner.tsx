"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { QuestionRenderer } from "./question-renderer";
import { QuizResult } from "./quiz-result";
import type { StartAttemptResponse, SubmitAttemptResponse, SubmitAnswer } from "@beecodefi/schemas";

export function QuizRunner({ quizId, onPassed }: { quizId: string; onPassed?: () => void }) {
  const [attempt, setAttempt] = useState<StartAttemptResponse | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SubmitAnswer[]>([]);
  const [result, setResult] = useState<SubmitAttemptResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    setResult(null);
    setAnswers([]);
    setIndex(0);
    try {
      const res = await apiFetch<StartAttemptResponse>(`/quizzes/${quizId}/attempts`, { method: "POST" });
      setAttempt(res);
    } finally {
      setLoading(false);
    }
  }

  async function onAnswer(answer: string | string[]) {
    if (!attempt) return;
    const question = attempt.questions[index]!;
    const nextAnswers = [...answers, { questionId: question.id, answer }];
    setAnswers(nextAnswers);

    if (index + 1 < attempt.questions.length) {
      setIndex(index + 1);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<SubmitAttemptResponse>(`/quiz-attempts/${attempt.attemptId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers: nextAnswers }),
      });
      setResult(res);
      if (res.passed) onPassed?.();
    } finally {
      setLoading(false);
    }
  }

  if (!attempt) {
    return (
      <Card>
        <p className="mb-3 text-sm text-text/70">
          Ready when you are — mastery over speed, no timer.
        </p>
        <Button onClick={start} disabled={loading}>
          Start quiz
        </Button>
      </Card>
    );
  }

  if (result) {
    return <QuizResult result={result} submittedAnswers={answers} onRetake={start} />;
  }

  const question = attempt.questions[index]!;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-center gap-1.5">
        {attempt.questions.map((q, i) => (
          <span
            key={q.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-primary" : i < index ? "w-2 bg-success" : "w-2 bg-text/15"
            }`}
          />
        ))}
      </div>
      <p className="mb-3 text-xs text-text/50">
        Question {index + 1} of {attempt.questions.length}
      </p>
      {loading ? <p className="text-text/60">Grading…</p> : <QuestionRenderer question={question} onAnswer={onAnswer} />}
    </Card>
  );
}
