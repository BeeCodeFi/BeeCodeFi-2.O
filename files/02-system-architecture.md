# 02 — System Architecture

## 1. Architecture Principles

1. **Modular monolith first, services later.** One deployable backend with strictly separated internal modules (auth, content, progress, quiz, submissions, github). Split into services only when a module's load or team demands it.
2. **Static content on CDN, dynamic data via API.** Lesson bodies never hit the database at read time.
3. **Client-side code execution.** HTML/CSS/JS run in a sandboxed iframe in the browser — zero execution infrastructure cost, infinitely scalable. (Server-side runners are a Phase 3 add-on behind the same "Editor" interface.)
4. **Stateless API.** All state in Postgres + object storage; horizontal scaling is a knob, not a rewrite.

## 2. High-Level Diagram

```
                        ┌────────────────────────────┐
                        │        CDN / Edge          │
                        │  static lesson bundles,    │
                        │  images, JS app assets     │
                        └─────────────┬──────────────┘
                                      │
┌──────────────┐   HTTPS   ┌──────────▼──────────┐
│   Browser    │──────────▶│   Next.js Frontend  │  (SSR/SSG + React SPA)
│  - Reader    │           └──────────┬──────────┘
│  - Editor    │                      │ REST /api/v1
│    (iframe   │           ┌──────────▼──────────┐
│    sandbox)  │           │   API (Node/Nest    │  modular monolith
│  - Quiz UI   │           │   or Express+TS)    │
└──────┬───────┘           │  ┌───────────────┐  │
       │  OAuth            │  │ auth          │  │
       │                   │  │ content-meta  │  │
┌──────▼───────┐           │  │ progress      │  │
│  GitHub API  │◀──────────┤  │ quiz          │  │
│ (user token) │  push,    │  │ submissions   │  │
└──────────────┘  repo mgmt│  │ github-svc    │  │
                           │  │ gamification  │  │
                           │  └───────────────┘  │
                           └───┬──────────┬──────┘
                               │          │
                    ┌──────────▼───┐  ┌───▼──────────────┐
                    │ PostgreSQL   │  │ Object Storage   │
                    │ (all user &  │  │ (S3-compatible)  │
                    │  traceable   │  │ code uploads,    │
                    │  data)       │  │ submission files │
                    └──────────────┘  └──────────────────┘
                               │
                    ┌──────────▼───┐
                    │ Redis (opt.) │  sessions, rate limits,
                    │              │  quiz-attempt cache, leaderboards
                    └──────────────┘
```

## 3. Tech Stack (recommended, with rationale)

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js (React + TypeScript)** | SSG for lesson pages (SEO — critical for a W3Schools competitor), SPA for the app shell; one codebase |
| Styling | Tailwind CSS + design tokens | Fast theming (light/dark/"Bee" premium theme), consistent premium look |
| Editor | **Monaco Editor** (VS Code engine) + sandboxed `iframe srcdoc` preview | Familiar to learners headed toward VS Code; client-side = free |
| Backend | **Node.js + TypeScript (NestJS)** | Enforced module boundaries fit the modular monolith; same language across stack |
| DB | **PostgreSQL** | Relational fits progress/attempt data; JSONB for flexible quiz payloads |
| ORM | Prisma | Typed schema = living documentation of `03-database-schema.md` |
| Cache/queues | Redis (introduce when needed) | Sessions, streak counters, async GitHub push jobs |
| Object storage | S3-compatible (Cloudflare R2 free tier) | Uploaded submission files |
| Auth | Email/password (Argon2) + **GitHub OAuth** | GitHub OAuth doubles as push credential — one connection, two features |
| Hosting (Phase 1, $0) | Vercel (frontend) + Railway/Render/Fly free tier (API) + Neon/Supabase (Postgres) | Free-tier-first per Golden Rule 4 |
| Analytics | Self-hosted Plausible/Umami | Privacy-friendly, free |

## 4. Content Pipeline (static vs dynamic — see also `03`)

- **Authoring:** lessons written as **MDX** files + quiz banks as **JSON/YAML** in a private `beecodefi-content` git repo. PR review = editorial review.
- **Build step:** CI validates content against JSON Schemas, assigns stable `contentId`s, compiles MDX → static bundles deployed to the CDN, and **syncs only metadata** (ids, titles, order, versions, quiz answer keys) into Postgres.
- **Runtime:** browser fetches lesson bodies from CDN; API only answers "what has this user done" and "is this quiz answer correct".
- **Answer keys never ship to the client.** Question text/options are static; correct answers live only in the DB and are checked server-side.

## 5. Scaling Path

| Stage | Users | Action |
|---|---|---|
| 1 | 0–10k | Single API instance, managed Postgres, CDN. Nothing else. |
| 2 | 10k–100k | Add Redis (sessions, hot progress reads), read replica, background worker for GitHub pushes & streak jobs |
| 3 | 100k+ | Split `quiz` + `progress` into their own service if hot; queue-based submission processing; server-side code runners (Firecracker/containers) for non-web languages |

## 6. Security Baseline

- Sandboxed editor iframe: `sandbox="allow-scripts"` only, separate origin (`preview.beecodefi.dev`) so learner code can never touch app cookies.
- GitHub tokens encrypted at rest (AES-256-GCM, key in secret manager); scope limited to `public_repo`; revocable from settings.
- Uploads: size cap (e.g., 1 MB/file, whitelist extensions), virus/MIME sniffing, served back only from storage domain, never executed server-side.
- Standard: rate limiting per IP+user, OWASP headers, parameterized queries via ORM, audit log table for auth events.

## 7. Observability

- Structured JSON logs, request ids propagated frontend → API.
- Metrics: loop-stage conversion funnel is a first-class dashboard from day one.
- Error tracking: Sentry free tier.
