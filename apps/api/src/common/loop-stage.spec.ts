import { computeLessonStages, isLessonComplete } from "./loop-stage";

const now = new Date();

describe("computeLessonStages", () => {
  it("locks quiz and build with no progress", () => {
    expect(computeLessonStages(null)).toEqual({
      read: "available",
      practice: "available",
      quiz: "locked",
      build: "locked",
    });
  });

  it("unlocks quiz once read is complete", () => {
    const stages = computeLessonStages({
      readCompletedAt: now,
      editorPracticedAt: null,
      quizPassedAt: null,
      taskCompletedAt: null,
    });
    expect(stages.quiz).toBe("available");
    expect(stages.build).toBe("locked");
  });

  it("shows quiz in_progress when an attempt exists but hasn't passed", () => {
    const stages = computeLessonStages(
      { readCompletedAt: now, editorPracticedAt: null, quizPassedAt: null, taskCompletedAt: null },
      { hasQuizAttempt: true },
    );
    expect(stages.quiz).toBe("in_progress");
  });

  it("unlocks build once quiz is passed, and marks stages done", () => {
    const stages = computeLessonStages({
      readCompletedAt: now,
      editorPracticedAt: now,
      quizPassedAt: now,
      taskCompletedAt: now,
    });
    expect(stages).toEqual({ read: "done", practice: "done", quiz: "done", build: "done" });
  });

  it("never unlocks build before the quiz is passed, regardless of read state", () => {
    const stages = computeLessonStages({
      readCompletedAt: null,
      editorPracticedAt: null,
      quizPassedAt: null,
      taskCompletedAt: null,
    });
    expect(stages.build).toBe("locked");
  });
});

describe("isLessonComplete", () => {
  it("is false until all four stage timestamps are set", () => {
    expect(
      isLessonComplete({
        readCompletedAt: now,
        editorPracticedAt: now,
        quizPassedAt: now,
        taskCompletedAt: null,
      }),
    ).toBe(false);
  });

  it("is true once read, practice, quiz, and task are all complete", () => {
    expect(
      isLessonComplete({
        readCompletedAt: now,
        editorPracticedAt: now,
        quizPassedAt: now,
        taskCompletedAt: now,
      }),
    ).toBe(true);
  });
});
