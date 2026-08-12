# BeeCodeFi — Master Roadmap: All Phases in Sequence

This is the single long-term plan, from empty repo to a large-scale platform. Each phase has a **goal**, **deliverables**, **exit criteria** (you don't move on until these are true), and **scaling notes**. Phases are sequenced so nothing is built before it's needed and nothing needs a rewrite later.

**The rule for smooth scaling:** infrastructure upgrades are triggered by _metrics_, not by excitement. Each phase lists its trigger.

---

## Phase 0 — Foundations (Week 1–2)

**Goal:** a deployable skeleton with the right shape, so everything after is adding features, not restructuring.

**Deliverables**

- Monorepo (pnpm workspaces): `apps/web` (Next.js), `apps/api` (NestJS), `packages/schemas` (shared zod types), `packages/content-tools`.
- Postgres schema migrated (from `03-database-schema.md`) via Prisma.
- Auth: register, login, logout, email verification (email/password + GitHub OAuth sign-in scope only).
- CI: lint, typecheck, tests, migration check on every PR.
- Free-tier deploys wired end-to-end: Vercel (web) + Render/Fly (api) + Neon (db).
- Design tokens + base UI kit (buttons, cards, nav, LoopBar shell, dark/light theme switch).

**Exit criteria**

- A user can register, verify email, log in, and see an empty dashboard on the production URL.
- `main` branch auto-deploys; a broken migration fails CI.

---

## Phase 1 — The Complete Loop, One Lesson (Week 3–6)

**Goal:** prove the entire product on a single hand-authored lesson (highest-risk work first). If the loop feels good with one lesson, the platform works.

**Deliverables**

- **Read:** lesson reader (MDX), section scroll/dwell tracking (IntersectionObserver + batched telemetry), inline checkpoint MCQ, honey progress rail.
- **Practice:** Monaco editor (lazy-loaded) + sandboxed live-preview iframe + autosave snapshots + resume.
- **Quiz:** full engine — randomized attempt from pool, server-side grading, review screen with explanations, retakes with rotated questions.
- **Build:** task screen with rubric auto-check + two submission methods: on-site editor submit and **file upload field** (GitHub comes in Phase 2).
- Progress state machine (`lesson_progress`) + live LoopBar states + minimal dashboard.
- Golden fixture content: one lesson fully authored (MDX + 45-question pool + rubric).

**Exit criteria**

- One real test user completes Read → Practice → Quiz → Build end-to-end with zero manual DB edits, and the dashboard reflects it.
- Grading, progress transitions, and rubric checker have unit tests.

---

## Phase 2 — GitHub & Habit Engine (Week 7–9)

**Goal:** the loop ends in a real commit; daily habit mechanics make people come back.

**Deliverables**

- GitHub scope upgrade flow (`public_repo`, progressive consent).
- Repo bootstrap wizard → `beecodefi-html` with scaffold + auto-updating README progress table.
- Push composer + background worker (atomic multi-file commits via Git Data API), push status polling.
- Fallback ladder complete: upload / on-site / download-zip-with-instructions + `/docs/git-basics` micro-course.
- Streaks (any loop activity = streak day; GitHub push = gold day), XP ledger, contribution-style calendar.

**Exit criteria**

- A learner with a fresh GitHub account can connect, bootstrap a repo, and push a lesson from the site in under 5 minutes.
- Push failures (revoked token, non-fast-forward) recover gracefully with clear messages.

---

## Phase 3 — Content Pipeline & Private Beta (Week 10–14)

**Goal:** content becomes data flowing through a pipeline, not code; real learners generate real funnel data.

**Deliverables**

- `beecodefi-content` repo: MDX/YAML authoring format, JSON Schema validation in CI, build step → CDN bundles + DB metadata sync. Adding a lesson requires **zero app deploys**.
- Author Modules 1–2 of the HTML course (9 lessons) through the pipeline.
- Dashboard v1: course ring, per-lesson four-stage grid, resume deep-link, weak-topics review.
- Public SEO-ready lesson pages (Read stage open without login) + landing page + public playground.
- Funnel instrumentation: loop-stage conversion dashboard (read→practice→quiz→build).
- Private beta: 20–50 invited learners; feedback channel; weekly triage.

**Exit criteria**

- A content author can ship a new lesson via PR alone.
- Beta funnel data exists; top 5 friction points identified and fixed.
- Loop completion rate for beta users measured (baseline for the ≥40% target).

---

## Phase 4 — Full HTML Course & Public Launch (Week 15–20)

**Goal:** the complete promise delivered for one course; hardened for strangers on the internet.

**Deliverables**

- All 7 modules / 32 lessons authored (Sprints C2–C3), including capstone with zip upload path.
- "Practice more" quiz mode (post-pass endless pool) — the external-quiz-site killer.
- Hardening: rate limits everywhere, Sentry, OWASP headers audit, load test on hot endpoints (`section-reads`, quiz submit), backup + restore drill on Postgres.
- Account lifecycle polish: password reset, GDPR export/delete jobs.
- Launch assets: SEO sitemap for all lesson pages, OG images, launch post.
- **Public launch.** 🐝

**Exit criteria**

- A stranger can go signup → capstone pushed to GitHub with no support intervention.
- p95 API latency < 300ms under simulated 500 concurrent learners; error rate < 0.5%.
- Daily backups verified restorable.

---

## Phase 5 — Second Course: CSS (Month 6–7)

**Goal:** prove the engine is truly course-agnostic — the single most important scaling claim.

**Deliverables**

- CSS course authored entirely through the existing pipeline (target: **zero engine changes**; any engine change discovered = fix the engine generically, not per-course).
- Multi-course dashboard (course switcher, per-course repos: `beecodefi-css`).
- Cross-course learning paths ("Frontend Path: HTML → CSS → JS") as a thin metadata layer.
- Placement / "test out" quizzes per module (skip-ahead for refresher devs).

**Exit criteria**

- CSS course live with no schema or engine migrations forced by course-specific hacks.
- ≥30% of HTML completers start CSS within 2 weeks (path retention metric).

**Scaling trigger check:** if DAU > ~5–10k or p95 latency creeping → begin Phase 6 infra items early.

---

## Phase 6 — Scale Stage 2: Performance & Reliability (Month 7–9, metric-triggered)

**Goal:** absorb growth without architecture change — this is the "add knobs" phase.

**Deliverables (in order of impact)**

1. **Redis** introduced: sessions, hot progress reads, rate-limit counters, quiz-attempt cache.
2. **Dedicated worker process** (already queue-shaped from Phase 2): GitHub pushes, submission auto-checks, streak rollover, GDPR jobs move off the API path.
3. Postgres: read replica for dashboard/analytics queries; partition `quiz_attempt_answers` by month; connection pooling (pgBouncer).
4. CDN cache audit: lesson bundles immutable + versioned; quiz payloads edge-cached.
5. Autoscaling API instances (still one deployable — monolith stays).
6. Status page + on-call basics (uptime alerts, runbook per failure mode).

**Exit criteria**

- 10× current peak load sustained in load test with p95 < 300ms.
- Zero user-facing impact when the worker or a replica dies (chaos test).

---

## Phase 7 — JavaScript Course & Interactive Depth (Month 9–12)

**Goal:** the flagship course — and the first that needs richer exercise types.

**Deliverables**

- JS course content (largest course; ~45 lessons).
- **In-browser JS test-runner**: exercises graded by running learner code against test cases inside the sandboxed iframe (still client-side, still $0 execution cost) — results verified server-side by re-checking submitted code with the same test spec.
- New question type: `code_output` ("what does this print?") and console-enabled preview panel.
- Expanded Git course (branches, PRs, merge conflicts) — learners now push feature branches for JS projects.

**Exit criteria**

- JS exercises auto-grade reliably; cheating vector (posting fake results) closed by server-side re-verification.
- Combined path HTML→CSS→JS completable end-to-end; certificates ship at path completion (verifiable URL, stored + signed server-side).

---

## Phase 8 — Community & Retention Layer (Month 12–15)

**Goal:** learners keep each other coming back; support load drops.

**Deliverables (sequenced, each behind a flag)**

1. **Showcase**: capstone gallery (opt-in, links to learners' GitHub repos — content lives on GitHub, not our storage).
2. Per-lesson **Q&A/discussion** threads (moderation tooling + report flow shipped the same day, not after).
3. Public profiles: streak, certificates, completed courses, pinned repos.
4. Leaderboards (weekly XP, Redis sorted sets) — opt-in, friendly, no global shame boards.

**Exit criteria**

- Moderation queue + abuse reporting functional before any social feature is public.
- Measured lift: D30 retention of community-active users vs non-active.

---

## Phase 9 — Server-Side Execution & Backend Courses (Month 15–20)

**Goal:** break out of browser-runnable languages — Python, SQL, Node backend courses.

**Deliverables**

- **Execution service** (first true second service, justified by genuinely different workload): container/Firecracker sandbox pool, hard CPU/mem/time limits, no network, queue-fed. Exposed to the monolith behind the same `Editor`/grading interface from Phase 7 — courses don't know or care where code runs.
- Python course first (largest audience), then SQL (sandboxed per-user Postgres schemas).
- Cost controls: per-user daily execution quota; burst queueing with honest wait UI.

**Exit criteria**

- Sandbox escapes attempted and blocked in a security review/pentest.
- Execution cost per active learner known and sustainable at free tier (quota tuned to keep it so).

---

## Phase 10 — Sustainability & Long-Term Scale (Month 18+, ongoing)

**Goal:** keep "free premium for everyone" alive forever by making the platform self-sustaining without paywalling the loop.

**Deliverables (principles, in priority order)**

- **Never paywall the core loop.** Sustainability options that respect the theme: optional supporter tier (cosmetic themes, supporter badge), verified certificates fee, team/classroom admin dashboards for schools & bootcamps, GitHub Sponsors/OpenCollective.
- AI-assisted features (behind quota): capstone code review, "explain my mistake" on quiz misses, personalized weak-topic drills.
- Localization framework (content pipeline already separates content from code — add locale dimension to bundles).
- Org architecture review: split further services **only** if a module's team or load demands it (candidates by then: quiz-grading, progress). Otherwise the modular monolith remains — boring is a feature.
- Yearly: dependency/security audit, data-retention pruning jobs, cost-per-learner review.

**Standing exit criteria (health bar, checked quarterly)**

- Loop completion ≥ 40%, D7 retention trending up, infra cost per monthly-active learner flat or falling, zero paid gate on Read/Practice/Quiz/Build.

---

## Sequence Summary (one glance)

| Phase | Theme                                        | Rough timing | Scaling trigger          |
| ----- | -------------------------------------------- | ------------ | ------------------------ |
| 0     | Foundations                                  | Wk 1–2       | —                        |
| 1     | The loop, one lesson                         | Wk 3–6       | —                        |
| 2     | GitHub + streaks                             | Wk 7–9       | —                        |
| 3     | Content pipeline + beta                      | Wk 10–14     | —                        |
| 4     | Full HTML + **launch**                       | Wk 15–20     | —                        |
| 5     | CSS course (engine proof)                    | Mo 6–7       | —                        |
| 6     | Perf & reliability (Redis, worker, replicas) | Mo 7–9       | DAU ~5–10k or p95 rising |
| 7     | JS course + test runner                      | Mo 9–12      | —                        |
| 8     | Community layer                              | Mo 12–15     | healthy retention base   |
| 9     | Server-side execution (Python/SQL)           | Mo 15–20     | demand + budget model    |
| 10    | Sustainability & long-term                   | Mo 18+       | ongoing                  |

**Golden sequencing rules**

1. Riskiest first (the loop), audience-facing polish later.
2. Content scale (3) before user scale (4) before infra scale (6) before workload-type scale (9).
3. Every social feature ships with moderation on day one.
4. No service split, cache, or queue is added without a metric demanding it.
5. The core loop is free at every phase, forever — that's the brand.
