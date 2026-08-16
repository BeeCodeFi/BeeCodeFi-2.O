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
  locked: "border-2 border-dashed border-text/20 bg-surface text-text/30",
  available: "border-2 border-primary/50 bg-surface text-text",
  in_progress: "border-2 border-primary bg-primary/15 text-primary shadow-glow",
  done: "border-2 border-success bg-success text-bg",
};

const LABEL_CLASSES: Record<LoopStageState, string> = {
  locked: "text-text/35",
  available: "text-text",
  in_progress: "text-primary",
  done: "text-success",
};

export function LoopBar({ stages = DEFAULT_STAGES }: { stages?: LoopStage[] }) {
  return (
    <nav
      aria-label="Lesson progress"
      className="sticky top-[57px] z-30 flex items-center justify-center gap-1.5 border-b border-accent/15 bg-surface/85 py-3 shadow-soft backdrop-blur-md sm:gap-3"
    >
      {stages.map((stage, i) => {
        const badge = (
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all duration-300 ${BADGE_CLASSES[stage.state]}`}
          >
            {stage.state === "done" ? "✓" : stage.icon}
          </span>
        );
        return (
          <div key={stage.key} className="flex items-center gap-1.5 sm:gap-3">
            <div className="flex flex-col items-center gap-1">
              {stage.state === "locked" ? (
                badge
              ) : (
                <a href={`#${stage.key}`} className="transition-transform duration-150 hover:scale-110">
                  {badge}
                </a>
              )}
              <span className={`hidden text-xs font-medium sm:block ${LABEL_CLASSES[stage.state]}`}>
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <span
                className={`h-0.5 w-5 rounded-full transition-colors duration-300 sm:w-10 ${
                  stage.state === "done" ? "bg-success" : "bg-text/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
