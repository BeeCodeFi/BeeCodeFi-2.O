"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SubmitAttemptResponse } from "@beecodefi/schemas";

export function QuizResult({
  result,
  onRetake,
}: {
  result: SubmitAttemptResponse;
  onRetake: () => void;
}) {
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  useEffect(() => {
    const missed = result.results.filter((r) => !r.correct && r.explanationCdnPath);
    const uniquePaths = Array.from(
      new Set(missed.map((r) => r.explanationCdnPath!.split("#")[0]!)),
    );
    Promise.all(uniquePaths.map((p) => fetch(p).then((r) => r.json())))
      .then((files) => Object.assign({}, ...files))
      .then(setExplanations)
      .catch(() => setExplanations({}));
  }, [result]);

  const percent = Math.round(result.score * 100);

  return (
    <Card className={result.passed ? "border-success/50" : "border-warn/50"}>
      <h3 className="mb-2 text-lg font-semibold">
        {result.passed ? "🐝 Passed!" : "Not quite — review and retake"}
      </h3>
      <p className="mb-4 text-sm text-text/70">Score: {percent}%</p>
      <ul className="mb-4 space-y-2">
        {result.results
          .filter((r) => !r.correct)
          .map((r) => {
            const key = r.explanationCdnPath?.split("#")[1];
            return (
              <li key={r.questionId} className="text-sm text-text/80">
                <span className="text-error">✗</span> {key ? explanations[key] : "Review this question."}
              </li>
            );
          })}
      </ul>
      {!result.passed && <Button onClick={onRetake}>Retake with new questions</Button>}
    </Card>
  );
}
