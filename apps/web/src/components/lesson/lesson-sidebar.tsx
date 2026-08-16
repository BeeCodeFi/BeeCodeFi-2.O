import Link from "next/link";
import { ProgressBar } from "@/components/ui/progress-bar";

export interface SidebarLesson {
  id: string;
  slug: string;
  moduleSlug: string;
  title: string;
  estReadMinutes: number;
  completed: boolean;
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  lessons,
  currentLessonId,
  percentComplete,
}: {
  courseSlug: string;
  courseTitle: string;
  lessons: SidebarLesson[];
  currentLessonId: string;
  percentComplete: number;
}) {
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  const totalMinutes = lessons.reduce((sum, l) => sum + l.estReadMinutes, 0);
  const completedCount = lessons.filter((l) => l.completed).length;

  return (
    <aside className="animate-slide-in-left sticky top-[180px] max-h-[calc(100vh-200px)] overflow-y-auto pr-2">

      {/* Back link */}
      <Link
        href="/courses"
        className="mb-5 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-text/50 transition-all duration-200 hover:bg-surface-hover hover:text-primary"
      >
        ← All Courses
      </Link>

      {/* Course info */}
      <div className="mb-4 rounded-xl border border-accent/15 bg-surface p-3.5 shadow-soft">
        <h2 className="text-sm font-bold text-text/80 leading-snug">{courseTitle}</h2>
        <p className="mt-1 text-xs text-text/45">
          {lessons.length} lessons · {totalMinutes} min total
        </p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-text/45">Progress</span>
            <span className="text-xs font-bold tabular-nums text-primary">
              {completedCount}/{lessons.length}
            </span>
          </div>
          <ProgressBar percent={percentComplete} />
          <p className="mt-1.5 text-xs text-text/35">
            Lesson {currentIndex >= 0 ? currentIndex + 1 : "–"} of {lessons.length}
          </p>
        </div>
      </div>

      {/* Lesson list */}
      <ul className="space-y-0.5">
        {lessons.map((lesson, i) => {
          const isCurrent = lesson.id === currentLessonId;
          return (
            <li key={lesson.id}>
              <Link
                href={`/learn/${courseSlug}/${lesson.moduleSlug}/${lesson.slug}#read`}
                className={`flex items-center justify-between gap-2 rounded-xl border-l-2 px-3 py-2.5 text-sm transition-all duration-200 ${
                  isCurrent
                    ? "border-primary bg-primary/10 font-semibold text-primary shadow-soft"
                    : "border-transparent text-text/65 hover:bg-surface-hover hover:text-text/85"
                }`}
              >
                <span className="flex min-w-0 items-start gap-2.5">
                  {/* Status dot */}
                  {lesson.completed ? (
                    <span className="mt-[2px] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success/20 text-[9px] font-bold text-success">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <span className="mt-[2px] h-4 w-4 flex-shrink-0 rounded-full border-2 border-primary bg-primary/20 animate-ping-soft" />
                  ) : (
                    <span className="mt-[2px] h-4 w-4 flex-shrink-0 rounded-full border border-text/20" />
                  )}
                  <span className="leading-snug">
                    <span className="mr-1 text-text/35">{i + 1}.</span>
                    {lesson.title}
                  </span>
                </span>
                <span className="flex-shrink-0 text-xs text-text/35">{lesson.estReadMinutes}m</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
