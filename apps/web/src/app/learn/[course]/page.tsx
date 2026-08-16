"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LessonStageRow } from "@/components/dashboard/lesson-stage-row";
import type { CourseDetail, CourseProgressResponse, ProgressSummaryResponse } from "@beecodefi/schemas";

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
      <section className="mx-auto max-w-3xl space-y-4 px-6 py-12">
        <div className="skeleton h-8 w-1/2" />
        <div className="skeleton h-24" />
      </section>
    );
  }

  const stagesByLessonId = new Map(courseProgress?.lessons.map((l) => [l.lessonId, l]) ?? []);

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        {course.description && <p className="mt-1 text-text/70">{course.description}</p>}
        {courseProgress && (
          <div className="mt-3 flex items-center gap-3">
            <div className="max-w-xs flex-1">
              <ProgressBar percent={courseProgress.percentComplete} />
            </div>
            <span className="text-sm font-medium text-text/60">
              {Math.round(courseProgress.percentComplete)}% complete
            </span>
          </div>
        )}
      </header>

      {summary?.resume && summary.resume.courseSlug === params.course && (
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

      {course.modules.map((module) => (
        <Card key={module.id} className="animate-fade-in-up">
          <h2 className="mb-3 text-sm font-semibold text-text/70">{module.title}</h2>
          <ul className="space-y-2">
            {module.lessons.map((lesson) => {
              const progressItem = stagesByLessonId.get(lesson.id);
              const stages = progressItem?.stages ?? lesson.stages ?? {
                read: "available",
                practice: "available",
                quiz: "locked",
                build: "locked",
              };
              return (
                <LessonStageRow
                  key={lesson.id}
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
              );
            })}
          </ul>
        </Card>
      ))}
    </section>
  );
}
