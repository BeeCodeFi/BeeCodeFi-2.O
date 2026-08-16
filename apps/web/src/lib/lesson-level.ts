export type LessonLevel = "Beginner" | "Intermediate" | "Advanced";

/**
 * Display-only heuristic — we don't store a level column on lessons.
 * Earlier modules in a course are assumed more foundational.
 */
export function deriveLevel(moduleIndex: number): LessonLevel {
  if (moduleIndex <= 1) return "Beginner";
  if (moduleIndex <= 3) return "Intermediate";
  return "Advanced";
}

export const LEVEL_BADGE_CLASSES: Record<LessonLevel, string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warn/15 text-warn",
  Advanced: "bg-error/15 text-error",
};

export const LEVEL_SHORT: Record<LessonLevel, string> = {
  Beginner: "BEG",
  Intermediate: "INT",
  Advanced: "ADV",
};
