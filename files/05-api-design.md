# 05 — API Design

Base: `https://api.beecodefi.dev/api/v1` · JSON only · Auth: httpOnly session cookie (web) — JWT access/refresh reserved for future mobile.

## Conventions

- Versioned path (`/v1`). Breaking changes → `/v2`.
- Errors: `{ "error": { "code": "QUIZ_ATTEMPT_EXPIRED", "message": "...", "details": {} } }` with proper HTTP status.
- All list endpoints paginated: `?cursor=&limit=`.
- Idempotency: mutation endpoints that clients may retry accept `Idempotency-Key` header.
- Rate limits: 60 req/min general, 10/min for auth, 5/min for GitHub pushes.

## Endpoints

### Auth
```
POST /auth/register            {email, password, displayName}
POST /auth/login               {email, password}
POST /auth/logout
GET  /auth/oauth/github        → redirect (scopes: read:user, user:email; public_repo requested later, lazily)
GET  /auth/oauth/github/callback
POST /auth/verify-email        {token}
POST /auth/password-reset[/confirm]
GET  /me                       profile + settings + connections summary
PATCH /me/settings             {theme, editorPrefs, dailyGoalMinutes}
DELETE /me                     GDPR delete (queued)
```

### Content (metadata only — bodies come from CDN)
```
GET /courses                                     published courses
GET /courses/:slug                               modules + lessons tree + user's per-lesson stage states (if authed)
GET /lessons/:id                                 metadata: cdnPath, sections[], quiz summary, task summary
```

### Progress
```
POST /progress/section-reads      batched: [{sectionId, dwellSeconds, maxScrollPct}]
POST /progress/checkpoint         {lessonId, questionId, answer}   inline checkpoint MCQ
GET  /progress/courses/:slug      full four-stage grid for dashboard
GET  /progress/summary            streak, xp, level, resume pointer
```

### Editor
```
GET  /editor/:lessonId/snapshot           latest snapshot (or starter pointer)
PUT  /editor/:lessonId/snapshot           {code:{html,css,js}, isManual}
```

### Quiz
```
POST /quizzes/:id/attempts                → {attemptId, questions:[{id, payloadCdnPath}]}
POST /quiz-attempts/:id/submit            {answers:[{questionId, answer}]}
                                          → {score, passed, results:[{questionId, correct, explanationCdnPath}]}
GET  /quizzes/:id/practice-pool           post-pass extra questions (ungraded mode)
GET  /quiz-attempts?quizId=               attempt history
```

### Tasks & Submissions
```
GET  /tasks/:id                           brief + rubric summary + submission history
POST /tasks/:id/submissions               multipart (method=upload, files[]) |
                                          json (method=onsite_editor|github, code or pushRef)
GET  /submissions/:id                     status + autoCheckReport
```

### GitHub
```
POST /github/connect/upgrade-scope        request public_repo scope if missing
GET  /github/status                        connected? login? repo per course?
POST /github/repos                         {courseId} → create/bootstrap repo (README, folder scaffold, .gitignore)
POST /github/pushes                        {lessonId, files:[{path, content}], message?}
                                           → {pushId, status:'queued'}     (worker executes)
GET  /github/pushes/:id                    poll status → {status, commitSha, htmlUrl}
```

### Gamification
```
GET /streaks/calendar?from=&to=            day states incl. push-day flag
GET /xp/events?cursor=                     ledger
```

## Module Boundaries (NestJS modules ↔ endpoint groups)

`AuthModule, ContentModule, ProgressModule, EditorModule, QuizModule, SubmissionModule, GithubModule, GamificationModule` — each owns its tables; cross-module access only via exported services (e.g., `SubmissionModule` calls `ProgressModule.markTaskComplete()`), never raw table access. This keeps the later service-split cheap.

## Async Jobs (worker, Redis-backed when introduced)

- `github.push` — executes commits via user token, updates `github_pushes`, then notifies `ProgressModule`.
- `submission.autocheck` — rubric evaluation for uploads.
- `streak.rollover` — daily per-timezone streak evaluation.
- `gdpr.delete` — purge cascade.
