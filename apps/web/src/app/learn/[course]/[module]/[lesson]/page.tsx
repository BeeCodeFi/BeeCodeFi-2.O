"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLessonMarkdown } from "@/lib/use-lesson-markdown";
import { deriveLevel, LEVEL_BADGE_CLASSES } from "@/lib/lesson-level";
import { LoopBar, type LoopStage, type LoopStageState } from "@/components/lesson/loop-bar";
import { LessonReader } from "@/components/lesson/lesson-reader";
import { LessonSidebar, type SidebarLesson } from "@/components/lesson/lesson-sidebar";
import { TableOfContents } from "@/components/lesson/table-of-contents";
import { PracticePanel } from "@/components/editor/practice-panel";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { PracticePool } from "@/components/quiz/practice-pool";
import { TaskBrief } from "@/components/task/task-brief";
import { SubmissionPanel } from "@/components/task/submission-panel";
import type { CourseDetail, CourseProgressResponse, LessonDetail } from "@beecodefi/schemas";

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

  const { data: courseProgress } = useQuery({
    queryKey: ["course-progress", params.course],
    queryFn: () => apiFetch<CourseProgressResponse>(`/progress/courses/${params.course}`),
    retry: false,
  });

  const { sections: parsedSections, loading: markdownLoading } = useLessonMarkdown(lesson?.cdnPath ?? "");

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    queryClient.invalidateQueries({ queryKey: ["course", params.course] });
    queryClient.invalidateQueries({ queryKey: ["course-progress", params.course] });
  }

  if (!course || !lesson) {
    return (
      <section className="mx-auto max-w-3xl space-y-4 px-6 py-12">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-40" />
      </section>
    );
  }

  const stages = lesson.stages ?? { read: "available", practice: "locked", quiz: "locked", build: "locked" };
  const loopStages: LoopStage[] = STAGE_META.map((meta) => ({
    ...meta,
    state: stages[meta.key] as LoopStageState,
  }));
  const signedIn = lesson.stages !== null;

  const allLessons = course.modules.flatMap((m, moduleIndex) =>
    m.lessons.map((l) => ({ ...l, moduleSlug: m.slug, moduleIndex })),
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const currentMeta = allLessons[currentIndex];
  const nextLesson = currentIndex >= 0 ? allLessons[currentIndex + 1] : undefined;
  const lessonComplete = Object.values(stages).every((s) => s === "done");
  const level = deriveLevel(currentMeta?.moduleIndex ?? 0);

  const progressByLessonId = new Map(courseProgress?.lessons.map((l) => [l.lessonId, l]) ?? []);
  const sidebarLessons: SidebarLesson[] = allLessons.map((l) => ({
    id: l.id,
    slug: l.slug,
    moduleSlug: l.moduleSlug,
    title: l.title,
    estReadMinutes: l.estReadMinutes,
    completed: Boolean(progressByLessonId.get(l.id)?.completedAt),
  }));

  return (
    <>
      <div className="sticky top-[57px] z-30 flex items-center justify-between border-b border-accent/15 bg-surface/85 px-6 py-2.5 text-sm backdrop-blur-md">
        <Link
          href={`/learn/${params.course}`}
          className="flex items-center gap-1.5 text-text/60 transition-colors hover:text-primary"
        >
          ← All Courses
        </Link>
        <span className="hidden font-medium text-text/70 sm:block">
          {currentIndex + 1}/{allLessons.length} · {lesson.title}
        </span>
        <span className="w-16" />
      </div>

      <LoopBar stages={loopStages} />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[240px_1fr_200px]">
        <LessonSidebar
          courseSlug={params.course}
          courseTitle={course.title}
          lessons={sidebarLessons}
          currentLessonId={lesson.id}
          percentComplete={courseProgress?.percentComplete ?? 0}
        />

        <div className="min-w-0 space-y-10">
          <header className="animate-fade-in-up">
            <h1 className="text-2xl font-semibold">{lesson.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-full px-2.5 py-1 font-semibold ${LEVEL_BADGE_CLASSES[level]}`}>
                {level}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 font-medium text-text/70">
                ⏱ {lesson.estReadMinutes} min
              </span>
            </div>
          </header>

          <div id="read">
            <LessonReader
              lessonId={lesson.id}
              cdnPath={lesson.cdnPath}
              sections={lesson.sections}
              parsedSections={parsedSections}
              loading={markdownLoading}
              onReadProgress={refresh}
            />
          </div>

          {!signedIn && (
            <Card>
              <p className="text-sm">Sign in to unlock Practice, Quiz, and Build & Ship for this lesson.</p>
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

              {lessonComplete && (
                <Card className="animate-fade-in-up border-success/40 bg-gradient-to-br from-success/10 to-transparent text-center shadow-card">
                  <p className="mb-3 text-lg font-medium">🐝 Lesson complete!</p>
                  {nextLesson ? (
                    <Link href={`/learn/${params.course}/${nextLesson.moduleSlug}/${nextLesson.slug}#read`}>
                      <Button>Next lesson: {nextLesson.title} →</Button>
                    </Link>
                  ) : (
                    <Link href={`/learn/${params.course}`}>
                      <Button variant="secondary">Back to course →</Button>
                    </Link>
                  )}
                </Card>
              )}
            </>
          )}
        </div>

        <div className="hidden lg:block">
          <TableOfContents sections={parsedSections} />
        </div>
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
    <div id={id} className="animate-fade-in-up">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        {icon} {title}
        {state === "done" && (
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
            ✓ done
          </span>
        )}
      </h2>
      {state === "locked" ? (
        <Card className="border-dashed bg-transparent shadow-none">
          <p className="flex items-center gap-2 text-sm text-text/50">
            <span>🔒</span>
            {title === "Quiz" ? "Finish Read to unlock the quiz." : "Pass the quiz to unlock Build & Ship."}
          </p>
        </Card>
      ) : (
        children
      )}
    </div>
  );
}
