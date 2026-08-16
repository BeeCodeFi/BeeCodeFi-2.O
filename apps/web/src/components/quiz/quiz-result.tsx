"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SubmitAttemptResponse, SubmitAnswer } from "@beecodefi/schemas";

export function QuizResult({
  result,
  submittedAnswers,
  onRetake,
}: {
  result: SubmitAttemptResponse;
  submittedAnswers?: SubmitAnswer[];
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

  // Build a map of questionId → what the user submitted
  const answerMap = new Map(
    (submittedAnswers ?? []).map((a) => [
      a.questionId,
      Array.isArray(a.answer) ? a.answer.join(", ") : a.answer,
    ]),
  );

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
            {wrongCount === 1 ? "1 question to review" : `${wrongCount} questions to review`}
          </p>
          <ul className="mb-4 space-y-3">
            {wrongAnswers.map((r, i) => {
              const key = r.explanationCdnPath?.split("#")[1];
              const explanation = key ? explanations[key] : undefined;
              const userAnswer = answerMap.get(r.questionId);

              return (
                <li
                  key={r.questionId}
                  className="rounded-lg border border-error/20 bg-error/5 p-3 text-sm"
                >
                  {/* Header row */}
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="text-error font-bold">✗</span>
                    <span className="font-semibold text-text/90">
                      Question {i + 1} — incorrect
                    </span>
                  </div>

                  {/* What the user answered */}
                  {userAnswer && (
                    <div className="mb-2 flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded bg-error/20 px-1.5 py-0.5 text-xs font-medium text-error">
                        You answered
                      </span>
                      <span className="text-text/70">{userAnswer}</span>
                    </div>
                  )}

                  {/* Correct answer shown directly */}
                  {(r as { correctAnswer?: string | null }).correctAnswer && (
                    <div className="mb-2 flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded bg-success/20 px-1.5 py-0.5 text-xs font-medium text-success">
                        Correct answer
                      </span>
                      <span className="font-medium text-success/90">
                        {(r as { correctAnswer?: string | null }).correctAnswer}
                      </span>
                    </div>
                  )}

                  {/* Full explanation */}
                  {explanation && (
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary/70">
                        Why
                      </span>
                      <p className="text-text/60">{explanation}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {result.passed && wrongCount === 0 && (
        <p className="mb-4 text-sm text-success">Perfect score — every answer correct! 🎉</p>
      )}

      {!result.passed && (
        <Button onClick={onRetake}>Retake with new questions</Button>
      )}
    </Card>
  );
}
