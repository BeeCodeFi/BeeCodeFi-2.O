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
    <section className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="animate-fade-in-up text-2xl font-semibold">Dashboard</h1>

      <Card className="animate-fade-in-up">
        {isLoading && (
          <div className="space-y-2">
            <div className="skeleton h-4 w-48" />
            <div className="skeleton h-3 w-32" />
          </div>
        )}
        {isError && <p className="text-text/60">Sign in to see your progress here.</p>}
        {me && !courseProgress && <p>Welcome back, {me.displayName}. No courses started yet.</p>}
        {me && courseProgress && (
          <div>
            <p className="mb-2">Welcome back, {me.displayName}.</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar percent={courseProgress.percentComplete} />
              </div>
              <span className="text-sm font-medium text-text/60">
                {Math.round(courseProgress.percentComplete)}%
              </span>
            </div>
          </div>
        )}
      </Card>

      {summary?.resume && (
        <Card className="animate-fade-in-up border-primary/40">
          <p className="mb-2 text-sm">
            Resume: <strong>{summary.resume.lessonSlug.replace(/-/g, " ")}</strong> — {summary.resume.stage}{" "}
            stage
          </p>
          <Link
            href={`/learn/${summary.resume.courseSlug}/${summary.resume.moduleSlug}/${summary.resume.lessonSlug}#${summary.resume.stage}`}
            className="text-sm font-medium text-primary underline"
          >
            Continue →
          </Link>
        </Card>
      )}

      {courseProgress && courseProgress.lessons.length > 0 && (
        <Card className="animate-fade-in-up">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text/70">Lessons</h2>
            <Link href={`/learn/${courseProgress.courseSlug}`} className="text-sm text-primary underline">
              View course →
            </Link>
          </div>
          {groupByModule(courseProgress.lessons).map(([moduleSlug, lessons]) => (
            <div key={moduleSlug} className="mb-4 last:mb-0">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text/40">
                {humanize(moduleSlug)}
              </h3>
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <LessonStageRow key={lesson.lessonId} courseSlug={courseProgress.courseSlug} lesson={lesson} />
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
