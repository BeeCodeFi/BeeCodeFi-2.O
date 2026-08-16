"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deriveLevel, LEVEL_BADGE_CLASSES, LEVEL_SHORT } from "@/lib/lesson-level";
import type { CourseDetail, CourseSummary, ProgressSummaryResponse } from "@beecodefi/schemas";

const COURSE_ICONS: Record<string, string> = { html: "</>", css: "🎨", js: "{ }" };
const COURSE_GRADIENTS: Record<string, string> = {
  html: "from-orange-500 to-red-500",
  css:  "from-blue-500 to-cyan-500",
  js:   "from-yellow-400 to-orange-400",
};

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
    <section className="mx-auto max-w-6xl px-6 py-14">

      {/* Header */}
      <header className="mb-10 animate-fade-in-up">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary/70">
          All tracks
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-text/90">Courses</h1>
        <p className="mt-2 max-w-lg text-base text-text/55">
          Pick a track and start the loop — read, practice, quiz, build. Progress is always saved.
        </p>
      </header>

      {/* Skeleton */}
      {!details && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-96 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Course cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {details?.map((course, ci) => {
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
          const gradient = COURSE_GRADIENTS[course.slug] ?? "from-primary to-accent";

          return (
            <Card
              key={course.id}
              className="card-hover animate-card-rise group relative flex flex-col overflow-hidden shadow-card"
              style={{ animationDelay: `${ci * 100}ms` } as React.CSSProperties}
            >
              {/* Top gradient banner */}
              <div
                className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${gradient}`}
              />

              {/* Icon + meta */}
              <div className="mb-4 mt-1.5 flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} font-mono text-lg font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:shadow-card`}
                >
                  {COURSE_ICONS[course.slug] ?? "▤"}
                </span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text/70">{lessons.length} lessons</p>
                  <p className="text-xs text-text/40">⏱ {totalMinutes} min total</p>
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-text/90">{course.title}</h2>
              {course.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-text/55">{course.description}</p>
              )}

              {/* Lesson list */}
              <div className="my-4 h-52 space-y-0.5 overflow-y-auto rounded-xl border border-accent/10 bg-bg/50 p-2">
                {lessons.map((lesson, i) => {
                  const level = deriveLevel(lesson.moduleIndex);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${course.slug}/${lesson.moduleSlug}/${lesson.slug}#read`}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-all duration-150 hover:bg-surface-hover"
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-text/50">
                          {i + 1}
                        </span>
                        <span className="truncate text-sm text-text/75">{lesson.title}</span>
                      </span>
                      <span
                        className={`ml-2 flex-shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${LEVEL_BADGE_CLASSES[level]}`}
                      >
                        {LEVEL_SHORT[level]}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-auto flex items-center justify-between pt-1">
                <Link href={startHref}>
                  <Button className="text-sm">
                    {resume ? "Continue →" : "Start Learning →"}
                  </Button>
                </Link>
                <Link
                  href={`/learn/${course.slug}`}
                  className="text-sm font-medium text-primary transition-colors hover:text-primary-strong"
                >
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
