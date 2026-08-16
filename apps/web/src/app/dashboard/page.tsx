"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { apiFetch } from "@/lib/api";
import { LessonStageRow } from "@/components/dashboard/lesson-stage-row";
import type { CourseProgressResponse, MeResponse, ProgressSummaryResponse } from "@beecodefi/schemas";

export default function DashboardPage() {
  const { data: me, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<MeResponse>("/me"),
    retry: false,
  });

  const { data: summary } = useQuery({
    queryKey: ["progress-summary"],
    queryFn: () => apiFetch<ProgressSummaryResponse>("/progress/summary"),
    enabled: Boolean(me),
  });

  const { data: courseProgress } = useQuery({
    queryKey: ["course-progress", "html"],
    queryFn: () => apiFetch<CourseProgressResponse>("/progress/courses/html"),
    enabled: Boolean(me),
  });

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-6 py-14">

      {/* Page title */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-text/90">Dashboard</h1>
        <p className="mt-1 text-base text-text/55">Track your learning progress</p>
      </div>

      {/* Welcome / progress card */}
      <Card
        className="animate-fade-in-up overflow-hidden"
        style={{ animationDelay: "80ms" } as React.CSSProperties}
      >
        {/* Decorative gradient strip */}
        <div className="gradient-bg-animated pointer-events-none absolute left-0 top-0 h-1 w-full rounded-t-2xl opacity-70" />

        {isLoading && (
          <div className="space-y-3 pt-1">
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-3 w-28" />
            <div className="skeleton mt-3 h-2.5 w-full rounded-full" />
          </div>
        )}
        {isError && (
          <p className="text-base text-text/55">
            Sign in to see your progress here.
          </p>
        )}
        {me && !courseProgress && (
          <div>
            <p className="text-base font-medium">
              Welcome back, <span className="text-primary font-semibold">{me.displayName}</span>!
            </p>
            <p className="mt-1 text-sm text-text/55">No courses started yet.</p>
          </div>
        )}
        {me && courseProgress && (
          <div className="pt-1">
            <p className="text-lg font-semibold">
              Welcome back,{" "}
              <span className="gradient-text-animated">{me.displayName}</span>! 👋
            </p>
            <p className="mt-0.5 text-sm text-text/55 mb-4">
              Keep going — consistency is the key.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <ProgressBar percent={courseProgress.percentComplete} />
              </div>
              <span className="text-sm font-bold text-primary tabular-nums">
                {Math.round(courseProgress.percentComplete)}%
              </span>
            </div>
            <p className="mt-2 text-xs text-text/40">HTML Course overall progress</p>
          </div>
        )}
      </Card>

      {/* Resume card */}
      {summary?.resume && (
        <Card
          className="animate-scale-in border-primary/35 bg-gradient-to-br from-primary/5 to-transparent"
          style={{ animationDelay: "160ms" } as React.CSSProperties}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary/70">
                Resume where you left off
              </p>
              <p className="text-base font-semibold text-text/90">
                {summary.resume.lessonSlug.replace(/-/g, " ")}
              </p>
              <p className="mt-0.5 text-sm text-text/55 capitalize">
                {summary.resume.stage} stage
              </p>
            </div>
            <Link
              href={`/learn/${summary.resume.courseSlug}/${summary.resume.moduleSlug}/${summary.resume.lessonSlug}#${summary.resume.stage}`}
              className="mt-1 flex-shrink-0 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/20 hover:shadow-glow"
            >
              Continue →
            </Link>
          </div>
        </Card>
      )}

      {/* Lessons grid */}
      {courseProgress && courseProgress.lessons.length > 0 && (
        <Card
          className="animate-fade-in-up"
          style={{ animationDelay: "240ms" } as React.CSSProperties}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text/80">Lessons</h2>
            <Link
              href={`/learn/${courseProgress.courseSlug}`}
              className="text-sm font-medium text-primary transition-colors hover:text-primary-strong"
            >
              View course →
            </Link>
          </div>

          {groupByModule(courseProgress.lessons).map(([moduleSlug, lessons], gi) => (
            <div
              key={moduleSlug}
              className="mb-5 last:mb-0 animate-fade-in-up"
              style={{ animationDelay: `${(gi + 3) * 80}ms` } as React.CSSProperties}
            >
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text/35">
                <span className="h-px flex-1 bg-accent/10" />
                {humanize(moduleSlug)}
                <span className="h-px flex-1 bg-accent/10" />
              </h3>
              <ul className="space-y-2">
                {lessons.map((lesson, li) => (
                  <li
                    key={lesson.lessonId}
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${(gi * 6 + li + 4) * 60}ms` } as React.CSSProperties}
                  >
                    <LessonStageRow courseSlug={courseProgress.courseSlug} lesson={lesson} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>
      )}
    </section>
  );
}

function groupByModule<T extends { moduleSlug: string }>(items: T[]): Array<[string, T[]]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    groups.set(item.moduleSlug, [...(groups.get(item.moduleSlug) ?? []), item]);
  }
  return Array.from(groups.entries());
}

function humanize(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
