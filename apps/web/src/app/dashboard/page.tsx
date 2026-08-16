"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { CourseProgressResponse, MeResponse, ProgressSummaryResponse } from "@beecodefi/schemas";

const STAGE_ICON = { read: "📖", practice: "⌨️", quiz: "🧠", build: "🚀" } as const;

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
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <Card>
        {isLoading && <p className="text-text/60">Loading…</p>}
        {isError && <p className="text-text/60">Sign in to see your progress here.</p>}
        {me && !courseProgress && <p>Welcome back, {me.displayName}. No courses started yet.</p>}
        {me && courseProgress && (
          <div>
            <p className="mb-1">Welcome back, {me.displayName}.</p>
            <p className="text-sm text-text/60">
              HTML course: {Math.round(courseProgress.percentComplete)}% complete
            </p>
          </div>
        )}
      </Card>

      {summary?.resume && (
        <Card className="border-primary/40">
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
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-text/70">Lessons</h2>
          <ul className="space-y-2">
            {courseProgress.lessons.map((lesson) => (
              <li key={lesson.lessonId} className="flex items-center justify-between text-sm">
                <Link
                  href={`/learn/html/${lesson.moduleSlug}/${lesson.slug}`}
                  className="hover:underline"
                >
                  {lesson.title}
                </Link>
                <span className="flex gap-1">
                  {(["read", "practice", "quiz", "build"] as const).map((stage) => (
                    <span
                      key={stage}
                      title={`${stage}: ${lesson.stages[stage]}`}
                      className={lesson.stages[stage] === "done" ? "opacity-100" : "opacity-30"}
                    >
                      {STAGE_ICON[stage]}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}
