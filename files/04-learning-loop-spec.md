# 04 — Learning Loop Specification

The loop is the product. This document defines each stage's behavior, completion criteria, and anti-gaming rules precisely enough to implement.

## Stage 0 — Concept Page Layout

Each lesson page has a persistent **Loop Bar** (sticky) showing four steps with live state:

`[📖 Read] → [⌨️ Practice] → [🧠 Quiz] → [🚀 Build & Ship]`

States per step: `locked | available | in_progress | done`. Quiz unlocks after Read; Build unlocks after Quiz pass. Practice is available immediately (learning by poking is encouraged).

---

## Stage 1 — Read (scroll + dwell tracking)

**Mechanism**
- Lesson body is divided into sections, each with a stable anchor (`lesson_sections` table).
- Client uses `IntersectionObserver` per section. A section counts as read when:
  - it has been ≥ 60% visible for ≥ `min_dwell_seconds` (cumulative), AND
  - the page is focused (`visibilitychange` pauses timers).
- Client batches telemetry to `POST /progress/section-reads` every 15s and on `beforeunload` (sendBeacon).
- **Read complete** when all sections complete AND total dwell ≥ 50% of `est_read_minutes`.

**Anti-gaming**
- Fast-scroll to bottom ≠ complete (dwell requirement).
- One inline **checkpoint question** per lesson (1 trivial MCQ embedded mid-lesson) must be answered — costs 5 seconds for honest readers, blocks scripts.
- Server sanity-checks: reject dwell reports exceeding wall-clock elapsed time.

**UX detail:** a thin honey-colored progress rail on the page edge fills as sections complete — reading itself feels like progress.

---

## Stage 2 — Practice (embedded editor)

- Monaco editor with tabs (HTML / CSS / JS as the course requires) + live preview iframe (sandboxed, separate origin).
- Pre-seeded with the lesson's starter snippet from CDN.
- Autosave to `editor_snapshots` (debounced 3s); learner can resume anywhere, any device.
- **Practice complete** when the learner has made a *meaningful edit*: diff vs starter ≥ N characters (default 30) AND at least one preview render. Recorded as `editor_practiced_at`.
- "Reset to starter" and "Open in playground" (full-screen) buttons.

---

## Stage 3 — Quiz (exhaustive by design)

**Sizing policy (the "never leave the site" guarantee)**
- Pool per lesson: **2–3× served count**. Serve 15–30 depending on lesson weight (defined per lesson in `08`).
- Difficulty mix served: ~40% easy, 40% medium, 20% hard.
- Question types: `mcq`, `multi`, `fill_blank` (type the tag/attribute), `fix_code` (spot/fix the bug in a snippet), `order_steps`.

**Flow**
1. `POST /quizzes/:id/attempts` → server selects randomized question set (stored in `quiz_attempts.question_ids`), returns question CDN paths **without answer keys**.
2. Client renders one question at a time; answers accumulate locally; timer optional (off by default — mastery over speed).
3. `POST /attempts/:id/submit` → server grades, stores `quiz_attempt_answers`, returns score, per-question correctness, explanation links.
4. Pass ≥ 80% → `quiz_passed_at` set. Fail → review screen (explanations for missed questions), retake gets a **different random subset** with option order shuffled.
5. After pass, "Practice more" mode stays available: serves remaining pool questions untimed, ungraded — this is the feature that replaces external quiz sites.

**Integrity**
- Answer keys never leave the server (`03 §4.2`).
- Attempt is server-timestamped; answers submitted after 24h auto-expire the attempt.

---

## Stage 4 — Build & Ship (practice task + submission)

**Task definition** (`practice_tasks`): a brief ("Build a signup page using only the elements from this lesson"), starter files, and a machine-checkable `rubric`, e.g.:

```json
{
  "required_elements": ["form", "input[type=email]", "label", "button[type=submit]"],
  "forbidden": ["<table"],
  "min_lines": 15,
  "must_validate_html": true
}
```

**Three submission methods** (learner chooses; all satisfy the stage):

| Method | Flow | When |
|---|---|---|
| **GitHub push** (preferred) | Learner writes code on-site or pastes local code → site commits to their `beecodefi-html` repo under `lessons/03-forms/` and pushes (see `07`) | GitHub connected |
| **File upload** | The final task screen has an **upload field** (drag-drop, ≤1 MB, `.html/.css/.js/.zip`) → stored in object storage, auto-checked | Learner built locally in VS Code, no GitHub |
| **On-site editor submit** | "Submit current editor code" button | Total beginner |

**Auto-check pipeline** (all methods): parse submitted HTML (server-side, `parse5` — parsing only, never execution), evaluate rubric, run W3C-style validation. Result → `passed` or `needs_rework` with actionable messages ("Missing a `<label>` linked to your email input"). Passing sets `task_completed_at`.

**Completion:** service function sees all four timestamps → sets `completed_at`, awards XP, advances streak, unlocks next lesson.

---

## Progress, Streaks, XP

- **Course %** = completed lessons / published lessons (weighted lessons possible later).
- **Streak day** = any day with ≥1 loop-stage completion; a **GitHub push day** gets a 🐝 gold mark — the "push daily" habit is visualized as a contribution-style calendar on the dashboard.
- **XP**: read 10, practice 10, quiz pass 30 (+1/extra pool question answered in practice-more mode), task 50, first push of the day +20. XP feeds level titles (Larva → Worker Bee → Queen Bee 🐝).

## Dashboard (traceability surface)

- Per-course ring chart + per-lesson four-stage grid (exactly which stage of which lesson is pending).
- Streak calendar with push days highlighted.
- "Resume" button → deep-links to the exact pending stage of the next lesson.
- Quiz analytics: weakest topics by wrong-answer rate → "Review these 6 questions".
