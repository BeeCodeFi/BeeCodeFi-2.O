import Link from "next/link";
import { Button } from "@/components/ui/button";

const LOOP = [
  { icon: "📖", label: "Read" },
  { icon: "⌨️", label: "Practice" },
  { icon: "🧠", label: "Quiz" },
  { icon: "🚀", label: "Build" },
];

export default function LandingPage() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-8rem] h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-6rem] top-1/3 h-72 w-72 rounded-full bg-accent/15 blur-[90px]"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 py-28">
        <span className="animate-fade-in-up rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          🐝 Free, forever — the core loop is never paywalled
        </span>

        <h1 className="animate-fade-in-up text-5xl font-semibold leading-tight tracking-tight text-text">
          Free Premium Education{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            For Everyone
          </span>
        </h1>

        <p className="animate-fade-in-up text-lg text-text/70">
          Read → Practice in editor → Quiz exhaustively → Build a mini-project → Push to GitHub.
          One tight loop per concept, with progress tracked end-to-end.
        </p>

        <div className="flex flex-wrap items-center gap-3 py-1">
          {LOOP.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-surface px-3 py-1.5 text-sm shadow-soft">
                <span>{stage.icon}</span>
                <span className="text-text/80">{stage.label}</span>
              </span>
              {i < LOOP.length - 1 && <span className="text-text/25">→</span>}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/auth/register">
            <Button>Get started</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
