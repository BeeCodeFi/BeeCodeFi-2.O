import Link from "next/link";
import { Button } from "@/components/ui/button";

const LOOP = [
  { icon: "📖", label: "Read",     desc: "Curated lessons",    color: "from-violet-500/20 to-purple-500/10" },
  { icon: "⌨️", label: "Practice", desc: "Live editor",        color: "from-blue-500/20   to-indigo-500/10" },
  { icon: "🧠", label: "Quiz",     desc: "Deep question pools", color: "from-indigo-500/20 to-violet-500/10" },
  { icon: "🚀", label: "Build",    desc: "Ship to GitHub",     color: "from-purple-500/20 to-fuchsia-500/10"},
];

const STATS = [
  { value: "45+",  label: "Lessons" },
  { value: "1.2K", label: "Quiz questions" },
  { value: "100%", label: "Free forever" },
  { value: "∞",    label: "Retakes" },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ── Background orbs ──────────────────────────────────── */}
      <div
        aria-hidden
        className="hero-orb left-[10%] top-[-6rem] h-[36rem] w-[36rem] bg-primary/20"
        style={{ animationDelay: "0s" }}
      />
      <div
        aria-hidden
        className="hero-orb right-[-8rem] top-[20%] h-80 w-80 bg-accent/20"
        style={{ animationDelay: "-2.5s" }}
      />
      <div
        aria-hidden
        className="hero-orb bottom-[10%] left-[40%] h-64 w-64 bg-primary-strong/15"
        style={{ animationDelay: "-4s" }}
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative mx-auto flex max-w-3xl flex-col items-start gap-8 px-6 py-32 sm:py-40">

        {/* Badge */}
        <span
          className="animate-fade-in-up animate-glow-pulse relative flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-glow"
          style={{ animationDelay: "0ms" }}
        >
          <span className="animate-float inline-block">🐝</span>
          Free, forever — the core loop is never paywalled
        </span>

        {/* Headline */}
        <h1
          className="animate-fade-in-up text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Free Premium{" "}
          <br />
          <span className="gradient-text-animated">Education</span>{" "}
          <span className="text-text/90">For Everyone</span>
        </h1>

        {/* Sub-heading */}
        <p
          className="animate-fade-in-up max-w-xl text-lg leading-relaxed text-text/65 sm:text-xl"
          style={{ animationDelay: "160ms" }}
        >
          Read → Practice in editor → Quiz exhaustively → Build a mini-project → Push to GitHub.
          One tight loop per concept, progress tracked end-to-end.
        </p>

        {/* Loop steps */}
        <div
          className="animate-fade-in-up stagger-children flex flex-wrap items-center gap-3 py-1"
          style={{ animationDelay: "240ms" }}
        >
          {LOOP.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-3">
              <div
                className={`group flex items-center gap-2 rounded-xl border border-accent/20 bg-gradient-to-br ${stage.color} px-4 py-2.5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card`}
              >
                <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                  {stage.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text/90">{stage.label}</p>
                  <p className="text-2xs text-text/50">{stage.desc}</p>
                </div>
              </div>
              {i < LOOP.length - 1 && (
                <span className="text-lg font-light text-text/25">→</span>
              )}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          className="animate-fade-in-up flex flex-wrap gap-3 pt-2"
          style={{ animationDelay: "320ms" }}
        >
          <Link href="/auth/register">
            <Button className="animate-glow-pulse px-6 py-3 text-base font-semibold shadow-glow">
              Get started free →
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" className="px-6 py-3 text-base font-medium">
              Browse courses
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section className="relative mx-auto max-w-3xl px-6 pb-20">
        <div
          className="animate-fade-in stagger-children grid grid-cols-2 gap-4 sm:grid-cols-4"
          style={{ animationDelay: "400ms" }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="card-hover rounded-2xl border border-accent/15 bg-surface p-5 text-center shadow-soft"
            >
              <p className="gradient-text-animated text-3xl font-extrabold tracking-tight">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-text/55">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────── */}
      <section className="relative mx-auto max-w-3xl px-6 pb-32">
        <h2
          className="animate-fade-in-up mb-8 text-2xl font-bold text-text/90"
          style={{ animationDelay: "200ms" }}
        >
          Why BeeCodeFi?
        </h2>
        <div className="stagger-children grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: "🔒",
              title: "Never paywalled",
              desc: "Read, practice, quiz, and build — all completely free. No subscription gates.",
            },
            {
              icon: "📊",
              title: "Progress-first",
              desc: "Every action is tracked. See exactly which stage of which lesson you're in.",
            },
            {
              icon: "🐙",
              title: "Ship to GitHub",
              desc: "Every lesson ends with real code pushed to your own GitHub repository.",
            },
            {
              icon: "🧪",
              title: "Exhaustive quizzes",
              desc: "1,250-question pools — you'll never see the same quiz twice.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="card-hover animate-card-rise group rounded-2xl border border-accent/15 bg-surface p-6 shadow-soft"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-2xl transition-transform duration-300 group-hover:scale-110">
                {f.icon}
              </span>
              <h3 className="mb-1.5 text-base font-semibold text-text/90">{f.title}</h3>
              <p className="text-sm leading-relaxed text-text/55">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
