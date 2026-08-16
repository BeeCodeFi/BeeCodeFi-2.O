import Link from "next/link";
import type { LessonProgressGridItem } from "@beecodefi/schemas";

const STAGE_ICON = { read: "📖", practice: "⌨️", quiz: "🧠", build: "🚀" } as const;
const STAGES = ["read", "practice", "quiz", "build"] as const;

export function LessonStageRow({
  courseSlug,
  lesson,
}: {
  courseSlug: string;
  lesson: LessonProgressGridItem;
}) {
  return (
    <li>
      <Link
        href={`/learn/${courseSlug}/${lesson.moduleSlug}/${lesson.slug}`}
        className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors duration-150 hover:bg-primary/10"
      >
        <span className={lesson.completedAt ? "text-text" : "text-text/90"}>
          {lesson.completedAt && <span className="mr-1.5 text-success">✓</span>}
          {lesson.title}
        </span>
        <span className="flex gap-1">
          {STAGES.map((stage) => (
            <span
              key={stage}
              title={`${stage}: ${lesson.stages[stage]}`}
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all duration-200 ${
                lesson.stages[stage] === "done"
                  ? "bg-success/20 opacity-100"
                  : lesson.stages[stage] === "locked"
                    ? "opacity-25"
                    : "bg-primary/10 opacity-70"
              }`}
            >
              {STAGE_ICON[stage]}
            </span>
          ))}
        </span>
      </Link>
    </li>
  );
}
