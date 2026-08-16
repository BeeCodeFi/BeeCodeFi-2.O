// Sticky 4-stage state bar — files/04-learning-loop-spec.md Stage 0.

export type LoopStageState = "locked" | "available" | "in_progress" | "done";

export interface LoopStage {
  key: "read" | "practice" | "quiz" | "build";
  label: string;
  icon: string;
  state: LoopStageState;
}

const DEFAULT_STAGES: LoopStage[] = [
  { key: "read", label: "Read", icon: "📖", state: "available" },
  { key: "practice", label: "Practice", icon: "⌨️", state: "locked" },
  { key: "quiz", label: "Quiz", icon: "🧠", state: "locked" },
  { key: "build", label: "Build & Ship", icon: "🚀", state: "locked" },
];

const BADGE_CLASSES: Record<LoopStageState, string> = {
  locked: "border-2 border-dashed border-text/15 bg-surface text-text/25",
  available: "border-2 border-primary/40 bg-surface text-text/75 hover:border-primary hover:text-primary hover:shadow-soft",
  in_progress: "border-2 border-primary bg-primary/10 text-primary shadow-glow animate-pulse",
  done: "border-2 border-success bg-success text-bg shadow-soft",
};

const LABEL_CLASSES: Record<LoopStageState, string> = {
  locked: "text-text/30 font-medium",
  available: "text-text/75 font-semibold",
  in_progress: "text-primary font-bold",
  done: "text-success font-bold",
};

export function LoopBar({ stages = DEFAULT_STAGES }: { stages?: LoopStage[] }) {
  return (
    <nav
      aria-label="Lesson progress"
      className="animate-fade-in-down sticky top-[97px] z-20 flex items-center justify-center gap-2 border-b border-accent/15 bg-surface/90 py-3.5 shadow-soft backdrop-blur-md sm:gap-4"
      style={{ animationDelay: "100ms" }}
    >
      {stages.map((stage, i) => {
        const badge = (
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full text-base transition-all duration-300 ${BADGE_CLASSES[stage.state]}`}
          >
            {stage.state === "done" ? "✓" : stage.icon}
          </span>
        );
        return (
          <div key={stage.key} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              {stage.state === "locked" ? (
                badge
              ) : (
                <a
                  href={`#${stage.key}`}
                  className="transition-transform duration-200 ease-spring hover:scale-110 active:scale-95"
                >
                  {badge}
                </a>
              )}
              <span className={`hidden text-xs sm:block ${LABEL_CLASSES[stage.state]} transition-colors duration-200`}>
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <span
                className={`h-0.5 w-6 rounded-full transition-all duration-500 sm:w-12 ${
                  stage.state === "done"
                    ? "bg-gradient-to-r from-success to-success/50"
                    : "bg-text/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
