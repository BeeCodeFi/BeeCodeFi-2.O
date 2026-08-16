"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deriveLevel, LEVEL_BADGE_CLASSES, LEVEL_SHORT } from "@/lib/lesson-level";
import type { CourseDetail, CourseSummary, ProgressSummaryResponse } from "@beecodefi/schemas";

const COURSE_ICONS: Record<string, string> = { html: "</>", css: "🎨", js: "{ }" };

export default function CoursesPage() {
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => apiFetch<CourseSummary[]>("/courses"),
  });

  const { data: details } = useQuery({
    queryKey: ["course-details", courses?.map((c) => c.slug)],
    queryFn: () => Promise.all(courses!.map((c) => apiFetch<CourseDetail>(`/courses/${c.slug}`))),
    enabled: Boolean(courses && courses.length > 0),
  });

  const { data: summary } = useQuery({
    queryKey: ["progress-summary"],
    queryFn: () => apiFetch<ProgressSummaryResponse>("/progress/summary"),
    retry: false,
  });

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <p className="mt-1 text-text/60">Pick a track and start the loop — read, practice, quiz, build.</p>
      </header>

      {!details && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-96" />
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {details?.map((course) => {
          const lessons = course.modules.flatMap((m, moduleIndex) =>
            m.lessons.map((l) => ({ ...l, moduleSlug: m.slug, moduleIndex })),
          );
          const totalMinutes = lessons.reduce((sum, l) => sum + l.estReadMinutes, 0);
          const firstLesson = lessons[0];
          const resume = summary?.resume?.courseSlug === course.slug ? summary.resume : null;
          const startHref = resume
            ? `/learn/${resume.courseSlug}/${resume.moduleSlug}/${resume.lessonSlug}#${resume.stage}`
            : firstLesson
              ? `/learn/${course.slug}/${firstLesson.moduleSlug}/${firstLesson.slug}#read`
              : `/learn/${course.slug}`;

          return (
            <Card key={course.id} className="animate-fade-in-up flex flex-col shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-mono text-lg text-white shadow-soft">
                  {COURSE_ICONS[course.slug] ?? "▤"}
                </span>
                <div className="text-right text-xs text-text/50">
                  <p>{lessons.length} lessons</p>
                  <p>⏱ {totalMinutes} min</p>
                </div>
              </div>

              <h2 className="text-lg font-semibold">{course.title}</h2>
              {course.description && <p className="mt-1 text-sm text-text/60">{course.description}</p>}

              <div className="my-3 h-48 space-y-1 overflow-y-auto rounded-lg border border-accent/10 bg-bg/40 p-2">
                {lessons.map((lesson, i) => {
                  const level = deriveLevel(lesson.moduleIndex);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${course.slug}/${lesson.moduleSlug}/${lesson.slug}#read`}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-surface-hover"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] text-text/60">
                          {i + 1}
                        </span>
                        <span className="truncate text-text/80">{lesson.title}</span>
                      </span>
                      <span
                        className={`ml-2 flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${LEVEL_BADGE_CLASSES[level]}`}
                      >
                        {LEVEL_SHORT[level]}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto flex items-center justify-between pt-2">
                <Link href={startHref}>
                  <Button>{resume ? "Continue →" : "Start Learning →"}</Button>
                </Link>
                <Link href={`/learn/${course.slug}`} className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
