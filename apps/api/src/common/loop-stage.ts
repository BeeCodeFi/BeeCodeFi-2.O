import type { LessonStageStates, LoopStageState } from "@beecodefi/schemas";

export interface LessonProgressTimestamps {
  readCompletedAt: Date | null;
  editorPracticedAt: Date | null;
  quizPassedAt: Date | null;
  taskCompletedAt: Date | null;
}

export interface StageContext {
  hasQuizAttempt?: boolean;
  hasSubmission?: boolean;
}

/**
 * Single source of truth for the LoopBar's four-stage state, per `04 §Stage 0`:
 * Quiz unlocks after Read; Build unlocks after Quiz pass; Practice is always available.
 */
export function computeLessonStages(
  progress: LessonProgressTimestamps | null,
  ctx: StageContext = {},
): LessonStageStates {
  const read: LoopStageState = progress?.readCompletedAt ? "done" : "available";

  const practice: LoopStageState = progress?.editorPracticedAt ? "done" : "available";

  let quiz: LoopStageState;
  if (!progress?.readCompletedAt) {
    quiz = "locked";
  } else if (progress.quizPassedAt) {
    quiz = "done";
  } else if (ctx.hasQuizAttempt) {
    quiz = "in_progress";
  } else {
    quiz = "available";
  }

  let build: LoopStageState;
  if (!progress?.quizPassedAt) {
    build = "locked";
  } else if (progress.taskCompletedAt) {
    build = "done";
  } else if (ctx.hasSubmission) {
    build = "in_progress";
  } else {
    build = "available";
  }

  return { read, practice, quiz, build };
}

export function isLessonComplete(progress: LessonProgressTimestamps): boolean {
  return Boolean(
    progress.readCompletedAt &&
      progress.editorPracticedAt &&
      progress.quizPassedAt &&
      progress.taskCompletedAt,
  );
}
