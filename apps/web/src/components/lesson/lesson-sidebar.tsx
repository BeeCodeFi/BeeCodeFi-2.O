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

  return (
    <aside className="sticky top-[180px] max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      <Link
        href="/courses"
        className="mb-4 inline-flex items-center gap-1 text-sm text-text/60 transition-colors hover:text-primary"
      >
        ← All Courses
      </Link>

      <h2 className="text-base font-semibold">{courseTitle}</h2>
      <p className="mt-1 text-xs text-text/50">
        {lessons.length} lessons · {totalMinutes} min total
      </p>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-text/50">
          <span>Your progress</span>
          <span className="font-medium text-text/70">{Math.round(percentComplete)}%</span>
        </div>
        <ProgressBar percent={percentComplete} />
        <p className="mt-1 text-xs text-text/40">
          Lesson {currentIndex >= 0 ? currentIndex + 1 : "–"} of {lessons.length}
        </p>
      </div>

      <ul className="mt-4 space-y-0.5">
        {lessons.map((lesson, i) => {
          const isCurrent = lesson.id === currentLessonId;
          return (
            <li key={lesson.id}>
              <Link
                href={`/learn/${courseSlug}/${lesson.moduleSlug}/${lesson.slug}#read`}
                className={`flex items-center justify-between gap-2 rounded-lg border-l-2 px-2.5 py-2 text-sm transition-colors ${
                  isCurrent
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-transparent text-text/70 hover:bg-surface-hover"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {lesson.completed ? (
                    <span className="text-success">✓</span>
                  ) : isCurrent ? (
                    <span>⚡</span>
                  ) : (
                    <span className="h-3.5 w-3.5 rounded-full border border-text/25" />
                  )}
                  <span className="truncate">
                    {i + 1}. {lesson.title}
                  </span>
                </span>
                <span className="flex-shrink-0 text-xs text-text/40">{lesson.estReadMinutes}m</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
