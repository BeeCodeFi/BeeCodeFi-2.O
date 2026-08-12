# 01 — Vision & Scope

## 1. Vision

BeeCodeFi is the single place a self-taught developer needs. Today learners bounce between W3Schools (theory), CodePen (practice), random quiz sites (testing), and YouTube (projects) — knowledge gets fragmented and progress is untrackable. BeeCodeFi collapses that into one loop per concept, with progress measured end-to-end and proof-of-work landing in the learner's own GitHub.

**Theme:** Free Premium Education For Everyone — premium UX and depth, zero paywall for the core loop.

## 2. The Core Loop (product's heartbeat)

For every concept (e.g., "HTML Forms"):

1. **Learn** — read a focused lesson page. Scroll depth + dwell time mark the lesson as read.
2. **Try** — apply it immediately in an embedded code editor with live preview, pre-seeded with a starter snippet.
3. **Quiz** — answer an *exhaustive* question set (target: 15–30 questions per concept, mixed difficulty) so the learner never needs an external quiz site. Question pool is larger than what's served; questions rotate on retakes.
4. **Build** — a mini practice task ("create X using this concept"). Learner either:
   - pushes it to a well-structured GitHub repo directly from the site (preferred), or
   - completes it in the on-site editor / uploads their local code file (fallback for non-git users).
5. **Track** — every step updates the progress model: concept status, streaks, XP, course %.

A concept is "complete" only when all four stages are done. This is enforced by the progress engine, not the UI.

## 3. Personas

| Persona | Needs | Design consequence |
|---|---|---|
| **Absolute beginner** | Doesn't know git, needs hand-holding | On-site save + upload fallback; git taught as its own micro-course early |
| **Career switcher** | Proof of work for recruiters | GitHub integration produces a clean public repo per course (`beecodefi-html`) |
| **Refresher dev** | Wants to skip to gaps | Placement quiz per module; concepts can be "tested out" |

## 4. MVP Scope (Phase 1)

**In:**
- Account creation (email + password, plus GitHub OAuth which doubles as the push credential)
- One course: **HTML** (full curriculum in `08-content-plan-html.md`)
- Lesson reader with scroll-based read tracking
- Embedded editor (HTML/CSS/JS live preview) with autosave per user
- Quiz engine: MCQ, multi-select, fill-in-the-blank, "fix the code"
- Final practice task per lesson with **file upload field** and/or GitHub push
- Progress dashboard: per-lesson stage completion, course %, daily streak
- GitHub repo bootstrap + commit/push from site (via GitHub API — free)

**Out (explicitly, for Phase 1):**
- Payments of any kind
- Video content
- Server-side code execution (Python etc.) — HTML/CSS/JS run client-side, so no sandbox infra needed yet
- Social features (comments, forums)
- Mobile apps (responsive web only)
- AI tutor (Phase 3 candidate)

## 5. Non-Goals

- We are not a code-hosting platform; GitHub is the system of record for learner code.
- We are not building a general LMS for third-party authors (single content team initially; authoring pipeline is internal).

## 6. Success Metrics

- **Loop completion rate**: % of started concepts that reach "complete" (target ≥ 40%).
- **D7 retention** and **streak length** (the daily-push habit is the retention engine).
- **Quiz sufficiency**: % of users who report needing external practice (target: near zero — measured via a one-question survey at course end).
- **Repos created**: count of GitHub repos bootstrapped from the site.

## 7. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Scroll tracking gamed (scroll to bottom instantly) | Combine scroll depth with minimum dwell time per section + a checkpoint question |
| GitHub API rate limits / token misuse | Use user's own OAuth token (their quota), narrow `public_repo` scope, never store code server-side longer than needed |
| Quiz bank too small → answers memorized | Author 2–3× the served count; randomize selection and option order; parametrized questions where possible |
| Content authoring becomes bottleneck | Content-as-data pipeline (`04` + `08`): writers produce MDX/JSON, engine ingests without deploys |
