# BeeCodeFi — Planning Documentation

**Tagline:** Free Premium Education For Everyone

BeeCodeFi is a full-stack learning platform where a learner completes one tight loop per concept:

**Read → Practice in editor → Quiz (exhaustively) → Build a mini-project → Push to GitHub (or save on-site) → Progress tracked**

This folder is the single source of truth for planning. Read in order:

| # | File | Purpose |
|---|------|---------|
| 01 | `01-vision-and-scope.md` | Product vision, personas, MVP scope, non-goals |
| 02 | `02-system-architecture.md` | High-level architecture, tech stack, scaling strategy |
| 03 | `03-database-schema.md` | What lives in the DB (traceable) vs static content, full schema |
| 04 | `04-learning-loop-spec.md` | The core learning loop: lessons, editor, quizzes, projects, submissions |
| 05 | `05-api-design.md` | REST API contract, auth, versioning |
| 06 | `06-frontend-plan.md` | Pages, components, scroll-based progress tracking, theme system |
| 07 | `07-github-integration.md` | OAuth, repo creation, daily push flow, fallback for non-git users |
| 08 | `08-content-plan-html.md` | Complete HTML course blueprint (first course) |
| 09 | `09-roadmap-and-phases.md` | Phased delivery plan, milestones, definition of done |

## Golden Rules (apply to every decision)

1. **Content is data, not code.** Lessons, quizzes, and tasks are authored as structured content (MDX/JSON) and versioned — never hardcoded into components.
2. **Traceable data goes in the database.** Anything tied to a user (progress, quiz attempts, submissions, streaks) is persisted server-side. Anything purely presentational (lesson text, quiz question bank, theme assets) is static/CDN-served.
3. **Course-agnostic engine.** The HTML course is course #1, not a special case. CSS, JS, Python, etc. must plug into the same engine with zero engine changes.
4. **Free tier is the product.** Every architectural choice must have a $0 or near-$0 operating mode (free-tier hosting, serverless, generous OSS tooling).
5. **Ship the loop, not the platform.** MVP = one complete learning loop for the HTML course. Everything else is Phase 2+.
