// Sticky 4-stage state bar — files/04-learning-loop-spec.md Stage 0.
// Phase 0 delivers the shell only; stage state comes from the progress
// engine in Phase 1.

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

const STATE_CLASSES: Record<LoopStageState, string> = {
  locked: "text-text/40",
  available: "text-text",
  in_progress: "text-primary",
  done: "text-success",
};

export function LoopBar({ stages = DEFAULT_STAGES }: { stages?: LoopStage[] }) {
  return (
    <nav
      aria-label="Lesson progress"
      className="sticky top-[57px] z-30 flex items-center justify-center gap-6 border-b border-accent/20 bg-surface/80 py-2 backdrop-blur"
    >
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex items-center gap-2">
          <span className={`text-sm font-medium ${STATE_CLASSES[stage.state]}`}>
            {stage.icon} {stage.label}
          </span>
          {i < stages.length - 1 && <span className="text-text/20">→</span>}
        </div>
      ))}
    </nav>
  );
}
