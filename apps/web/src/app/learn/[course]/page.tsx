"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LessonStageRow } from "@/components/dashboard/lesson-stage-row";
import type { CourseDetail, CourseProgressResponse, ProgressSummaryResponse } from "@beecodefi/schemas";

const COURSE_GRADIENTS: Record<string, string> = {
  html: "from-orange-500 to-red-500",
  css:  "from-blue-500 to-cyan-500",
  js:   "from-yellow-400 to-orange-400",
};

export default function CourseHomePage({ params }: { params: { course: string } }) {
  const { data: course } = useQuery({
    queryKey: ["course", params.course],
    queryFn: () => apiFetch<CourseDetail>(`/courses/${params.course}`),
  });

  const { data: summary } = useQuery({
    queryKey: ["progress-summary"],
    queryFn: () => apiFetch<ProgressSummaryResponse>("/progress/summary"),
    retry: false,
  });

  const { data: courseProgress } = useQuery({
    queryKey: ["course-progress", params.course],
    queryFn: () => apiFetch<CourseProgressResponse>(`/progress/courses/${params.course}`),
    retry: false,
  });

  if (!course) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-14">
        <div className="skeleton h-10 w-1/3 rounded-xl" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
        <div className="skeleton h-2.5 w-full rounded-full" />
        <div className="skeleton h-64 rounded-2xl" />
      </section>
    );
  }

  const gradient = COURSE_GRADIENTS[course.slug] ?? "from-primary to-accent";
  const stagesByLessonId = new Map(courseProgress?.lessons.map((l) => [l.lessonId, l]) ?? []);
  const totalLessons = course.modules.flatMap((m) => m.lessons).length;

  return (
    <section className="relative mx-auto max-w-3xl space-y-7 px-6 py-14">

      {/* ── Course header ──────────────────────────────── */}
      <header className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-accent/15 bg-surface p-7 shadow-card">
        {/* Decorative gradient top bar */}
        <div className={`absolute left-0 top-0 h-1.5 w-full rounded-t-2xl bg-gradient-to-r ${gradient}`} />
        {/* Orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-primary/60">
            Course
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-text/90">{course.title}</h1>
          {course.description && (
            <p className="mt-2 text-base leading-relaxed text-text/55">{course.description}</p>
          )}

          {/* Progress */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-text/60">Your progress</span>
              <span className="font-bold tabular-nums text-primary">
                {courseProgress ? `${Math.round(courseProgress.percentComplete)}%` : "—"}
              </span>
            </div>
            <ProgressBar percent={courseProgress?.percentComplete ?? 0} />
            <p className="mt-1.5 text-xs text-text/40">
              {totalLessons} lessons total
            </p>
          </div>
        </div>
      </header>

      {/* ── Resume card ────────────────────────────────── */}
      {summary?.resume && summary.resume.courseSlug === params.course && (
        <Card
          className="animate-scale-in border-primary/35 bg-gradient-to-br from-primary/5 to-transparent"
          style={{ animationDelay: "80ms" } as React.CSSProperties}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-primary/60">
                Resume where you left off
              </p>
              <p className="text-base font-semibold text-text/90 capitalize">
                {summary.resume.lessonSlug.replace(/-/g, " ")}
              </p>
              <p className="mt-0.5 text-sm text-text/50 capitalize">
                {summary.resume.stage} stage
              </p>
            </div>
            <Link
              href={`/learn/${summary.resume.courseSlug}/${summary.resume.moduleSlug}/${summary.resume.lessonSlug}#${summary.resume.stage}`}
              className="flex-shrink-0 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/20 hover:shadow-glow"
            >
              Continue →
            </Link>
          </div>
        </Card>
      )}

      {/* ── Module/lesson list ─────────────────────────── */}
      {course.modules.map((module, mi) => (
        <Card
          key={module.id}
          className="animate-card-rise"
          style={{ animationDelay: `${(mi + 2) * 80}ms` } as React.CSSProperties}
        >
          {/* Module heading */}
          <div className="mb-4 flex items-center gap-3">
            <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${gradient} flex-shrink-0 shadow-soft`} />
            <h2 className="text-sm font-bold uppercase tracking-widest text-text/50">
              {module.title}
            </h2>
          </div>

          <ul className="space-y-2">
            {module.lessons.map((lesson, li) => {
              const progressItem = stagesByLessonId.get(lesson.id);
              const stages = progressItem?.stages ?? lesson.stages ?? {
                read: "available",
                practice: "available",
                quiz: "locked",
                build: "locked",
              };
              return (
                <li
                  key={lesson.id}
                  className="animate-slide-in-left"
                  style={{ animationDelay: `${(mi * 6 + li + 3) * 55}ms` } as React.CSSProperties}
                >
                  <LessonStageRow
                    courseSlug={course.slug}
                    lesson={{
                      lessonId: lesson.id,
                      slug: lesson.slug,
                      title: lesson.title,
                      moduleSlug: module.slug,
                      stages,
                      completedAt: progressItem?.completedAt ?? null,
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </section>
  );
}
