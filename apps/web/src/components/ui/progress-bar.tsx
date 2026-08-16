export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-accent/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary-strong transition-all duration-700 ease-spring"
        style={{ width: `${clamped}%`, backgroundSize: "200% 100%" }}
      />
      {/* Shimmer overlay when in-progress */}
      {clamped > 0 && clamped < 100 && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full opacity-40"
          style={{
            width: `${clamped}%`,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.8s linear infinite",
          }}
        />
      )}
    </div>
  );
}
