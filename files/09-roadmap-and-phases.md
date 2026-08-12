# 09 — Roadmap & Delivery Phases

Solo-dev/small-team friendly plan. Each phase ends in something usable; nothing is built ahead of need.

## Phase 0 — Foundations (Week 1–2)
- Monorepo (pnpm workspaces): `apps/web`, `apps/api`, `packages/schemas` (shared zod types), `packages/content-tools`.
- CI: lint, typecheck, tests, content-schema validation.
- Deploy skeleton to free tiers (Vercel + Render/Fly + Neon Postgres) with hello-world end-to-end.
- Design tokens + base UI kit (buttons, cards, LoopBar shell) per `06 §1`.

**Exit:** empty app deployed, DB migrated with schema from `03`, auth register/login works.

## Phase 1 — The Loop, Single Lesson (Week 3–6) ← highest risk first
Build the entire loop for **one** hand-authored lesson (Lesson 3: Elements, tags, attributes):
- Lesson reader + section scroll/dwell tracking + checkpoint MCQ
- Monaco editor + sandboxed preview + autosave snapshots
- Quiz engine end-to-end (attempt → grade → review → retake, pool rotation)
- Task screen: on-site submit + **file upload field** + auto-check rubric
- `lesson_progress` state machine + LoopBar live states

**Exit:** a test user can complete one full loop and see it on a minimal dashboard.

## Phase 2 — GitHub & Habit Engine (Week 7–9)
- GitHub OAuth scope upgrade, repo bootstrap wizard, push composer + worker, README auto-table (`07`)
- Streaks (push = gold day), XP ledger, contribution-style calendar
- `/docs/git-basics` micro-course + fallback ladder UX

**Exit:** loop can end in a real commit on the learner's GitHub.

## Phase 3 — Content at Scale (Week 10–14, overlaps engineering)
- Content pipeline: MDX/YAML repo → CI validate → CDN bundles + DB metadata sync (`02 §4`)
- Author Modules 1–2 fully (Sprint C1); dashboard v1 (rings, stage grid, resume, weak topics)
- Landing page + SEO for public lesson pages; playground route

**Exit:** private beta — invite 20–50 learners, instrument the funnel.

## Phase 4 — Full HTML Course & Public Launch (Week 15–20)
- Sprints C2–C3 content; capstone flow (zip upload path)
- Hardening: rate limits, Sentry, load test hot endpoints (`section-reads`, quiz submit)
- Practice-more quiz mode; email verification + password reset polish; GDPR export/delete
- Public launch 🐝

## Phase 5+ — Growth (post-launch backlog, ordered)
1. CSS course (proves the course-agnostic claim)
2. Placement/"test out" quizzes per module
3. Redis + worker split when metrics demand (`02 §5`)
4. GitHub App migration (fine-grained tokens)
5. Certificates (verifiable URL) per course completion
6. Server-side runners → JavaScript/Node exercises, then Python
7. AI review of capstone submissions; community showcase

## Definition of Done (every feature)
- Typed API contract in `packages/schemas` shared FE/BE
- Unit tests on grading, progress state machine, rubric checker (the money paths)
- One e2e happy-path test (Playwright) per loop stage
- Telemetry event added to the funnel dashboard
- Docs: endpoint added to `05`, table changes migrated + reflected in `03`

## Immediate Next Actions (this week)
1. Approve/adjust these planning docs (especially stack choices in `02 §3` and quiz sizing in `08`).
2. Scaffold the monorepo + Prisma schema from `03`.
3. Hand-write Lesson 3 content (mdx + 45-question pool + task rubric) as the golden fixture for Phase 1.
