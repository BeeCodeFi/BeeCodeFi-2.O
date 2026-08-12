# 06 — Frontend Plan

## 1. Brand & Theme — "Free Premium Education For Everyone"

**Identity:** Bee = industrious, community, sweet reward. Premium ≠ cluttered; premium = calm, fast, typographically excellent.

**Design tokens (CSS variables, theme-switchable):**

| Token | Light | Dark (default) |
|---|---|---|
| `--bg` | #FFFBF2 (warm paper) | #0F1115 |
| `--surface` | #FFFFFF | #171A21 |
| `--primary` (honey) | #F5B301 | #FFC93C |
| `--accent` (hive teal) | #0E7C7B | #2DD4BF |
| `--text` | #1C1917 | #E7E5E4 |
| `--success/warn/error` | #16A34A / #F59E0B / #DC2626 | tuned variants |

- Typography: `Inter` (UI) + `JetBrains Mono` (code). Generous line-height in lessons (1.75) — readability is the premium.
- Micro-delight: honeycomb pattern in hero, bee mascot for milestones, subtle hex-shaped progress nodes. Never noisy inside lesson content.
- Dark mode is first-class (developers live in dark mode); `light | dark | bee (high-contrast honey) | system` in settings.
- Accessibility: WCAG AA contrast, full keyboard nav in quiz & editor, `prefers-reduced-motion` respected.

## 2. Route Map (Next.js)

```
/                          Landing (SSG) — value prop, course catalog, live demo editor
/courses                   Catalog (SSG)
/learn/[course]                       Course home: module tree + progress grid (SSR)
/learn/[course]/[module]/[lesson]     THE loop page (SSG shell + client hydration)
/playground                Full-screen editor (public, no login needed — acquisition tool)
/dashboard                 Progress rings, streak calendar, resume, weak-topic review
/dashboard/repos           GitHub repos & push history
/settings                  Profile, theme, editor prefs, GitHub connection, data export
/auth/(login|register|reset|verify)
/docs/git-basics           The "don't know git?" micro-course (linked from task screen)
```

Lesson pages are **SSG + public for the Read stage** (SEO — this is how W3Schools wins search; we must too). Practice/Quiz/Build require login; the page shows them as locked with a friction-free signup prompt.

## 3. Component Architecture

```
app-shell/            Navbar (streak flame, XP, avatar), CommandPalette (Ctrl+K search)
lesson/
  LoopBar             sticky 4-stage state bar
  LessonReader        MDX renderer + section IntersectionObservers + progress rail
  CheckpointQuestion  inline MCQ
editor/
  CodeEditor          Monaco wrapper (tabs html/css/js)
  PreviewFrame        sandboxed iframe (separate origin, srcdoc, debounce 400ms)
  EditorToolbar       run/reset/format/full-screen/save-state indicator
quiz/
  QuizRunner          one-question-at-a-time flow, progress dots
  QuestionRenderer    per-qtype renderers (mcq/multi/fill_blank/fix_code/order_steps)
  QuizResult          score, per-question review, explanations, retake CTA
  PracticePool        post-pass endless practice mode
task/
  TaskBrief           brief + rubric checklist (live-checks editor code client-side as hints)
  SubmissionPanel     3 tabs: Push to GitHub | Upload files (drag-drop field) | Submit editor code
  AutoCheckReport     pass/needs_rework with actionable items
dashboard/
  CourseRing, StageGrid, StreakCalendar (contribution-style, push days gold), WeakTopics
github/
  ConnectCard, RepoBootstrapWizard, PushComposer (file tree + commit message), PushStatus
```

## 4. State & Data Layer

- **TanStack Query** for all server state (progress, attempts, snapshots) — cache keys per lesson; optimistic updates for section-read batching.
- **Zustand** for ephemeral UI state (editor buffers before autosave, quiz local answers).
- Telemetry batcher: section dwell accumulates in a ref, flushes every 15s + `sendBeacon` on unload.
- Editor autosave: debounce 3s → `PUT /editor/:lessonId/snapshot`; "Saved ✓" indicator.

## 5. Scroll-Tracking Implementation Sketch

```ts
// per section anchor
const io = new IntersectionObserver(entries => {
  for (const e of entries) sectionVisible[e.target.id] = e.intersectionRatio >= 0.6;
}, { threshold: [0, 0.6, 1] });

setInterval(() => {
  if (document.visibilityState !== 'visible') return;
  for (const id of visibleIds()) dwell[id] += 1;      // seconds
}, 1000);
// flush {sectionId, dwellSeconds, maxScrollPct} batches to API
```

Server marks a section complete when dwell ≥ `min_dwell_seconds`; lesson "Read" completes per `04 §Stage 1`.

## 6. Performance Budget

- Lesson page LCP < 1.5s (static HTML from CDN), JS < 200 KB before editor loads.
- Monaco lazy-loaded only when Practice panel first opened (it's ~2 MB — never in initial bundle).
- Quiz payloads prefetched when Read hits 80%.

## 7. Empty/Edge States (design these up front)

- Not logged in on a lesson → Read works; other stages show value-selling lock cards.
- GitHub not connected on task screen → Upload tab is default, with a gentle "Level up: push to GitHub" card linking `/docs/git-basics` + connect flow.
- Offline in editor → local buffer kept, "reconnecting" toast, autosave resumes.
