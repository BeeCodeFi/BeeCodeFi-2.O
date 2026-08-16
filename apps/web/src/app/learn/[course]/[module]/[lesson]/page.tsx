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
  { key: "read",     label: "Read",       icon: "📖" },
  { key: "practice", label: "Practice",   icon: "⌨️" },
  { key: "quiz",     label: "Quiz",       icon: "🧠" },
  { key: "build",    label: "Build & Ship", icon: "🚀" },
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

  /* ── Loading skeleton ── */
  if (!course || !lesson) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-5">
          <div className="skeleton h-4 w-28 rounded-lg" />
          <div className="skeleton h-9 w-2/3 rounded-xl" />
          <div className="skeleton h-5 w-1/3 rounded-lg" />
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
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
      {/* ── Breadcrumb / lesson tracker bar ── */}
      <div className="animate-fade-in-down sticky top-[57px] z-30 flex items-center justify-between border-b border-accent/15 bg-surface/90 px-6 py-3 text-sm backdrop-blur-md">
        <Link
          href={`/learn/${params.course}`}
          className="flex items-center gap-1.5 font-medium text-text/55 transition-colors duration-200 hover:text-primary"
        >
          ← Course
        </Link>
        <span className="hidden max-w-xs truncate font-semibold text-text/75 sm:block">
          <span className="text-text/40">{currentIndex + 1}/{allLessons.length} · </span>
          {lesson.title}
        </span>
        <span className="w-20" />
      </div>

      <LoopBar stages={loopStages} />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr_200px]">

        {/* ── Left sidebar ── */}
        <LessonSidebar
          courseSlug={params.course}
          courseTitle={course.title}
          lessons={sidebarLessons}
          currentLessonId={lesson.id}
          percentComplete={courseProgress?.percentComplete ?? 0}
        />

        {/* ── Main content ── */}
        <div className="min-w-0 space-y-12">

          {/* Lesson header */}
          <header className="animate-fade-in-up">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-text/90">
              {lesson.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${LEVEL_BADGE_CLASSES[level]}`}>
                {level}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-text/65">
                ⏱ {lesson.estReadMinutes} min read
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-text/65">
                📝 Lesson {currentIndex + 1} of {allLessons.length}
              </span>
            </div>
          </header>

          {/* Read stage */}
          <div id="read" className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            <LessonReader
              lessonId={lesson.id}
              cdnPath={lesson.cdnPath}
              sections={lesson.sections}
              parsedSections={parsedSections}
              loading={markdownLoading}
              onReadProgress={refresh}
            />
          </div>

          {/* Sign-in gate */}
          {!signedIn && (
            <Card className="animate-scale-in border-accent/20 bg-gradient-to-br from-primary/5 to-transparent text-center">
              <p className="text-sm font-medium text-text/65">
                🔐 Sign in to unlock Practice, Quiz, and Build & Ship for this lesson.
              </p>
              <Link href="/auth/login" className="mt-3 inline-block">
                <Button variant="ghost" className="text-sm">Sign in →</Button>
              </Link>
            </Card>
          )}

          {/* Practice / Quiz / Build stages */}
          {signedIn && (
            <>
              <StageSection id="practice" icon="⌨️" title="Practice" state={stages.practice}>
                <PracticePanel lessonId={lesson.id} />
              </StageSection>

              <StageSection id="quiz" icon="🧠" title="Quiz" state={stages.quiz}>
                {lesson.quiz && (
                  <div className="space-y-4">
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

              {/* Lesson complete card */}
              {lessonComplete && (
                <Card className="animate-bounce-in border-success/40 bg-gradient-to-br from-success/8 to-transparent text-center shadow-card">
                  <div className="mb-2 text-4xl">🐝</div>
                  <p className="mb-1 text-xl font-bold text-text/90">Lesson complete!</p>
                  <p className="mb-5 text-sm text-text/50">
                    Great work — keep the momentum going.
                  </p>
                  {nextLesson ? (
                    <Link href={`/learn/${params.course}/${nextLesson.moduleSlug}/${nextLesson.slug}#read`}>
                      <Button className="px-6">Next: {nextLesson.title} →</Button>
                    </Link>
                  ) : (
                    <Link href={`/learn/${params.course}`}>
                      <Button variant="secondary" className="px-6">Back to course →</Button>
                    </Link>
                  )}
                </Card>
              )}
            </>
          )}
        </div>

        {/* ── Right TOC ── */}
        <div className="hidden lg:block">
          <TableOfContents sections={parsedSections} />
        </div>
      </section>
    </>
  );
}

/* ── Stage section wrapper ── */
function StageSection({
  id, icon, title, state, children,
}: {
  id: string;
  icon: string;
  title: string;
  state: LoopStageState;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="animate-fade-in-up space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <h2 className="text-xl font-bold tracking-tight text-text/85">{title}</h2>
        {state === "done" && (
          <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-bold text-success">
            ✓ done
          </span>
        )}
        {state === "in_progress" && (
          <span className="animate-ping-soft rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
            in progress
          </span>
        )}
      </div>

      {state === "locked" ? (
        <Card className="border-dashed border-accent/20 bg-transparent shadow-none">
          <p className="flex items-center gap-2.5 text-sm text-text/45">
            <span className="text-base">🔒</span>
            {title === "Quiz"
              ? "Complete the Read stage to unlock the quiz."
              : "Pass the quiz to unlock Build & Ship."}
          </p>
        </Card>
      ) : (
        children
      )}
    </div>
  );
}
