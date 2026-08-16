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
  const wrongAnswers = result.results.filter((r) => !r.correct);
  const wrongCount = wrongAnswers.length;
  const totalCount = result.results.length;

  return (
    <Card className={result.passed ? "border-success/50" : "border-warn/50"}>
      <h3 className="mb-2 text-lg font-semibold">
        {result.passed ? "🐝 Passed!" : "Not quite — review and retake"}
      </h3>
      <p className="mb-4 text-sm text-text/70">
        Score: {percent}% &nbsp;·&nbsp; {totalCount - wrongCount}/{totalCount} correct
      </p>

      {wrongCount > 0 && (
        <>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text/50">
            Questions to review
          </p>
          <ul className="mb-4 space-y-3">
            {wrongAnswers.map((r, i) => {
              const key = r.explanationCdnPath?.split("#")[1];
              const explanation = key ? explanations[key] : undefined;
              return (
                <li
                  key={r.questionId}
                  className="rounded-lg border border-error/20 bg-error/5 p-3 text-sm"
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <span className="text-error">✗</span>
                    <span className="font-medium text-text/80">Question {i + 1}</span>
                  </div>
                  {explanation ? (
                    <p className="text-text/70">{explanation}</p>
                  ) : (
                    <p className="text-text/50">Review this question when you retake.</p>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {!result.passed && <Button onClick={onRetake}>Retake with new questions</Button>}
    </Card>
  );
}
