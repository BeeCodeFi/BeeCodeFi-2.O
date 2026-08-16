"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { LoopBar, type LoopStage, type LoopStageState } from "@/components/lesson/loop-bar";
import { LessonReader } from "@/components/lesson/lesson-reader";
import { PracticePanel } from "@/components/editor/practice-panel";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { PracticePool } from "@/components/quiz/practice-pool";
import { TaskBrief } from "@/components/task/task-brief";
import { SubmissionPanel } from "@/components/task/submission-panel";
import type { CourseDetail, LessonDetail } from "@beecodefi/schemas";

const STAGE_META: Array<{ key: LoopStage["key"]; label: string; icon: string }> = [
  { key: "read", label: "Read", icon: "📖" },
  { key: "practice", label: "Practice", icon: "⌨️" },
  { key: "quiz", label: "Quiz", icon: "🧠" },
  { key: "build", label: "Build & Ship", icon: "🚀" },
];

export default function LessonLoopPage({
  params,
}: {
  params: { course: string; module: string; lesson: string };
}) {
  const queryClient = useQueryClient();

  const { data: course } = useQuery({
    queryKey: ["course", params.course],
    queryFn: () => apiFetch<CourseDetail>(`/courses/${params.course}`),
  });

  const lessonId = course?.modules
    .find((m) => m.slug === params.module)
    ?.lessons.find((l) => l.slug === params.lesson)?.id;

  const { data: lesson } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => apiFetch<LessonDetail>(`/lessons/${lessonId}`),
    enabled: Boolean(lessonId),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    queryClient.invalidateQueries({ queryKey: ["course", params.course] });
  }

  if (!course || !lesson) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-text/60">Loading lesson…</p>
      </section>
    );
  }

  const stages = lesson.stages ?? { read: "available", practice: "locked", quiz: "locked", build: "locked" };
  const loopStages: LoopStage[] = STAGE_META.map((meta) => ({
    ...meta,
    state: stages[meta.key] as LoopStageState,
  }));
  const signedIn = lesson.stages !== null;

  return (
    <>
      <LoopBar stages={loopStages} />
      <section className="mx-auto max-w-3xl space-y-10 px-6 py-10">
        <header>
          <p className="text-sm text-text/50">
            {course.title} / {lesson.moduleSlug}
          </p>
          <h1 className="text-2xl font-semibold">{lesson.title}</h1>
        </header>

        <div id="read">
          <LessonReader
            lessonId={lesson.id}
            cdnPath={lesson.cdnPath}
            sections={lesson.sections}
            onReadProgress={refresh}
          />
        </div>

        {!signedIn && (
          <Card>
            <p className="text-sm">
              Sign in to unlock Practice, Quiz, and Build & Ship for this lesson.
            </p>
          </Card>
        )}

        {signedIn && (
          <>
            <StageSection id="practice" icon="⌨️" title="Practice" state={stages.practice}>
              <PracticePanel lessonId={lesson.id} />
            </StageSection>

            <StageSection id="quiz" icon="🧠" title="Quiz" state={stages.quiz}>
              {lesson.quiz && (
                <div className="space-y-3">
                  <QuizRunner quizId={lesson.quiz.id} onPassed={refresh} />
                  {stages.quiz === "done" && <PracticePool quizId={lesson.quiz.id} />}
                </div>
              )}
            </StageSection>

            <StageSection id="build" icon="🚀" title="Build & Ship" state={stages.build}>
              {lesson.task && (
                <div className="space-y-4">
                  <TaskBrief briefCdnPath={lesson.task.briefCdnPath} title={lesson.task.title} />
                  <SubmissionPanel taskId={lesson.task.id} onPassed={refresh} />
                </div>
              )}
            </StageSection>
          </>
        )}
      </section>
    </>
  );
}

function StageSection({
  id,
  icon,
  title,
  state,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  state: LoopStageState;
  children: React.ReactNode;
}) {
  return (
    <div id={id}>
      <h2 className="mb-3 text-lg font-semibold">
        {icon} {title}
        {state === "done" && <span className="ml-2 text-sm text-success">✓ done</span>}
      </h2>
      {state === "locked" ? (
        <Card>
          <p className="text-sm text-text/60">
            {title === "Quiz" ? "Finish Read to unlock the quiz." : "Pass the quiz to unlock Build & Ship."}
          </p>
        </Card>
      ) : (
        children
      )}
    </div>
  );
}
