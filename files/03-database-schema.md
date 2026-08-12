# 03 — Database Schema & Data Placement

## 1. Placement Rule (the contract)

| Data | Lives in | Reason |
|---|---|---|
| Lesson bodies (MDX/HTML), images, starter code snippets, quiz question *text & options* | **Static / CDN** (built from content repo) | Display-only, identical for all users, cacheable forever per version |
| Course/module/lesson **metadata** (ids, order, titles, versions), quiz **answer keys**, task rubrics | **Postgres (content-meta tables)** | Needed server-side for grading & progress joins; small |
| Everything user-generated or traceable: accounts, progress, quiz attempts, editor saves, submissions, streaks, XP, GitHub links, audit events | **Postgres (user-data tables)** | Must be consistent, queryable, private |
| Uploaded code files / large submission blobs | **Object storage** (pointer row in Postgres) | Cheap, keeps DB lean |

Every content row carries a `content_version`; user records reference the version they interacted with, so content updates never corrupt history.

## 2. Entity-Relationship Overview

```
users ─┬─< user_auth_providers        courses ─< modules ─< lessons ─┬─< lesson_sections
       ├─< user_settings                                             ├─< quizzes ─< quiz_questions
       ├─< lesson_progress >─ lessons                                └─< practice_tasks
       ├─< section_reads   >─ lesson_sections
       ├─< editor_snapshots
       ├─< quiz_attempts ─< quiz_attempt_answers
       ├─< task_submissions ─< submission_files
       ├─< github_connections ─< github_repos ─< github_pushes
       ├─< user_streaks / streak_days
       ├─< xp_events
       └─< audit_events
```

## 3. Table Definitions (Postgres, key columns only)

### 3.1 Identity & Auth

```sql
users (
  id              uuid PK default gen_random_uuid(),
  email           citext UNIQUE NOT NULL,
  password_hash   text,                    -- null if OAuth-only
  display_name    text NOT NULL,
  avatar_url      text,
  role            text NOT NULL default 'learner',  -- learner|author|admin
  email_verified  boolean default false,
  created_at      timestamptz default now(),
  deleted_at      timestamptz              -- soft delete (GDPR export/delete supported)
)

user_auth_providers (
  id uuid PK, user_id uuid FK->users,
  provider text NOT NULL,                  -- 'github' | 'google'
  provider_user_id text NOT NULL,
  UNIQUE (provider, provider_user_id)
)

user_settings (
  user_id uuid PK FK->users,
  theme text default 'system',             -- light|dark|bee|system
  editor_prefs jsonb default '{}',         -- font size, keymap, tab size
  daily_goal_minutes int default 30
)
```

### 3.2 Content Metadata (synced from content repo by CI; read-mostly)

```sql
courses (
  id uuid PK, slug text UNIQUE,            -- 'html'
  title text, description text,
  status text default 'draft',             -- draft|published|archived
  version int NOT NULL default 1,
  order_index int
)

modules (
  id uuid PK, course_id FK->courses,
  slug text, title text, order_index int,
  UNIQUE (course_id, slug)
)

lessons (
  id uuid PK, module_id FK->modules,
  slug text, title text, order_index int,
  content_version int NOT NULL,
  cdn_path text NOT NULL,                  -- where the static bundle lives
  est_read_minutes int,
  UNIQUE (module_id, slug)
)

lesson_sections (                          -- scroll checkpoints within a lesson
  id uuid PK, lesson_id FK->lessons,
  anchor text NOT NULL,                    -- DOM anchor id, e.g. 'forms-validation'
  order_index int, min_dwell_seconds int default 10,
  UNIQUE (lesson_id, anchor)
)

quizzes (
  id uuid PK, lesson_id FK->lessons UNIQUE,
  questions_served int NOT NULL,           -- e.g. 20 served from a pool of 45
  pass_threshold numeric NOT NULL default 0.8,
  max_attempts int                          -- null = unlimited
)

quiz_questions (
  id uuid PK, quiz_id FK->quizzes,
  external_id text UNIQUE,                 -- stable id from content repo
  qtype text NOT NULL,                     -- mcq|multi|fill_blank|fix_code|order_steps
  difficulty text NOT NULL,                -- easy|medium|hard
  payload_cdn_path text NOT NULL,          -- question text/options are static
  answer_key jsonb NOT NULL,               -- SERVER-ONLY, never sent to client
  explanation_cdn_path text,
  active boolean default true
)

practice_tasks (
  id uuid PK, lesson_id FK->lessons UNIQUE,
  title text, brief_cdn_path text,
  starter_code_cdn_path text,
  rubric jsonb,                             -- auto-check rules (required tags, etc.)
  requires_upload boolean default true,
  github_path_template text                 -- 'lessons/{module}/{lesson}/'
)
```

### 3.3 Progress & Learning Trace (hot tables)

```sql
lesson_progress (
  id uuid PK, user_id FK, lesson_id FK,
  read_completed_at    timestamptz,
  editor_practiced_at  timestamptz,        -- first meaningful editor save
  quiz_passed_at       timestamptz,
  task_completed_at    timestamptz,
  completed_at         timestamptz,        -- set when all four are non-null
  content_version int NOT NULL,
  UNIQUE (user_id, lesson_id)
)
-- INDEX (user_id, completed_at); course % = completed lessons / published lessons

section_reads (                            -- scroll/dwell telemetry, one row per section
  id uuid PK, user_id FK, section_id FK->lesson_sections,
  dwell_seconds int NOT NULL,
  max_scroll_pct numeric NOT NULL,
  completed boolean default false,
  updated_at timestamptz,
  UNIQUE (user_id, section_id)
)

editor_snapshots (                         -- autosave; keep last N per (user, lesson)
  id uuid PK, user_id FK, lesson_id FK,
  code jsonb NOT NULL,                     -- {html, css, js}
  saved_at timestamptz default now(),
  is_manual boolean default false
)

quiz_attempts (
  id uuid PK, user_id FK, quiz_id FK,
  attempt_no int NOT NULL,
  question_ids uuid[] NOT NULL,            -- the randomized set actually served
  started_at timestamptz, submitted_at timestamptz,
  score numeric, passed boolean,
  UNIQUE (user_id, quiz_id, attempt_no)
)

quiz_attempt_answers (
  id uuid PK, attempt_id FK->quiz_attempts,
  question_id FK->quiz_questions,
  answer jsonb NOT NULL,
  is_correct boolean NOT NULL,
  time_taken_seconds int
)

task_submissions (
  id uuid PK, user_id FK, task_id FK->practice_tasks,
  method text NOT NULL,                    -- 'github' | 'upload' | 'onsite_editor'
  status text NOT NULL default 'submitted',-- submitted|auto_checked|passed|needs_rework
  auto_check_report jsonb,
  github_push_id uuid FK->github_pushes,   -- when method='github'
  submitted_at timestamptz default now()
)

submission_files (
  id uuid PK, submission_id FK->task_submissions,
  filename text, mime text, size_bytes int,
  storage_key text NOT NULL                -- object-storage pointer
)
```

### 3.4 GitHub Integration

```sql
github_connections (
  user_id uuid PK FK->users,
  github_user_id bigint NOT NULL,
  github_login text NOT NULL,
  access_token_enc bytea NOT NULL,         -- AES-256-GCM
  scopes text[], connected_at timestamptz
)

github_repos (
  id uuid PK, user_id FK, course_id FK,
  repo_full_name text NOT NULL,            -- 'jdoe/beecodefi-html'
  default_branch text default 'main',
  created_by_site boolean default true,
  UNIQUE (user_id, course_id)
)

github_pushes (
  id uuid PK, repo_id FK->github_repos, user_id FK,
  lesson_id FK->lessons,
  commit_sha text, commit_message text,
  files_count int, status text,            -- queued|pushed|failed
  pushed_at timestamptz
)
```

### 3.5 Gamification & Audit

```sql
user_streaks (
  user_id uuid PK, current_streak int default 0,
  longest_streak int default 0, last_active_date date, timezone text
)

xp_events (
  id uuid PK, user_id FK,
  source text NOT NULL,       -- lesson_read|quiz_pass|task_done|daily_push
  ref_id uuid, points int NOT NULL, created_at timestamptz,
  UNIQUE (user_id, source, ref_id)          -- idempotent awards
)

audit_events (
  id uuid PK, user_id FK NULL,
  event text NOT NULL,        -- login, token_refresh, repo_created, gdpr_export...
  ip inet, meta jsonb, created_at timestamptz
)
```

## 4. Data-Integrity Rules

1. `lesson_progress.completed_at` is set by a single service function that verifies all four stage timestamps — never by the client.
2. Quiz grading is server-side only; the client submits `{question_id, answer}` pairs and receives per-question correctness + explanation links after submission.
3. Editor snapshots pruned to last 20 per (user, lesson); latest one is the "resume" state.
4. All writes idempotent where retries are possible (XP unique constraint, `UNIQUE(user_id, lesson_id)` upserts).
5. Soft-delete users; hard-delete via GDPR job that also purges object storage and revokes GitHub token.

## 5. Retention & Volume Estimates (per 10k active users)

- `section_reads`: ~50 rows/user/course → 500k rows. Fine in Postgres; batch upserts (client flushes every 15s).
- `quiz_attempt_answers`: largest table; partition by month at Stage 2.
- `editor_snapshots`: capped by pruning.
