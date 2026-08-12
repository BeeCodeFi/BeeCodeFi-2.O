# 07 — GitHub Integration

Goal: a learner can bootstrap a clean, recruiter-ready repo and push every lesson's work **from the site**, free, using GitHub's REST API with the learner's own OAuth token (their rate quota: 5,000 req/hr — ample).

## 1. Connection & Scopes (progressive consent)

1. **Sign-in scope:** `read:user user:email` only — used at registration/login.
2. **Push scope:** when the learner first clicks "Push to GitHub", request scope upgrade to `public_repo` with a clear explainer ("lets BeeCodeFi create your learning repo and commit your lesson code — nothing else").
3. Token stored encrypted (`github_connections.access_token_enc`, AES-256-GCM); revocation button in settings + we honor GitHub-side revocation (401 → mark disconnected).

Phase 2 option: switch to a **GitHub App** with fine-grained, repo-scoped installation tokens (better security story); the `GithubModule` interface stays identical.

## 2. Repo Bootstrap ("well-maintained repo" by construction)

`POST /github/repos {courseId}` — worker performs, via user token:

1. `POST /user/repos` → `beecodefi-html` (public, auto_init off).
2. Initial commit with scaffold:

```
beecodefi-html/
├── README.md            ← generated: course badge, progress table (auto-updated), profile link
├── .gitignore
├── LICENSE (MIT, learner's name)
└── lessons/
    └── .gitkeep
```

3. README progress table is regenerated on every push (lesson name, date completed, link to folder) — the repo *documents itself*, which is exactly what "well maintained" looks like to a recruiter.

Conflict policy: repo name taken → suffix prompt (`beecodefi-html-2026`). Learner may also link an existing empty repo.

## 3. Push Flow (per lesson task)

Client sends `POST /github/pushes {lessonId, files, message?}` → job queued → worker:

1. Resolve repo + branch (`main`).
2. Use **Git Data API** for an atomic multi-file commit:
   - GET ref → base commit → base tree
   - `POST /git/blobs` per file (content base64)
   - `POST /git/trees` with paths under `lessons/{NN-module}/{NN-lesson}/`
   - `POST /git/commits` (message default: `feat(html): complete lesson 03 – Forms ✅ via BeeCodeFi`)
   - `PATCH /git/refs/heads/main`
3. Regenerate README progress table (same commit's tree — one atomic commit, clean history).
4. Update `github_pushes` (sha, url, status=pushed) → notify `ProgressModule` + streak service (gold day).

Failure handling: token invalid → prompt reconnect; non-fast-forward (learner pushed locally, which we *encourage*) → re-fetch base ref and retry once; still failing → surface "pull happened outside — we retried on top of latest" or mark failed with manual instructions.

## 4. Commit Hygiene Rules (enforced by the composer)

- One lesson = one folder = one commit (no dump commits).
- Conventional-commit style messages, editable before push.
- Path template from `practice_tasks.github_path_template` keeps every learner's repo identically structured → recruiters and our future auto-graders can rely on it.

## 5. Fallback Ladder (nobody blocked)

| Learner situation | Path |
|---|---|
| No GitHub account | Upload field or on-site submit; persistent nudge card → `/docs/git-basics` micro-course (create account → connect → first push, ~15 min) |
| GitHub but shy to connect | Download a generated zip with the exact folder structure + a `PUSH_INSTRUCTIONS.md` (manual `git` commands filled in) |
| Prefers local VS Code | Build locally, then either upload files or paste into PushComposer |

All three still complete the Build stage; only the streak "gold day" is GitHub-specific (incentive, not gate).

## 6. Security Notes

- Files pushed are the learner's own submission content only; server never executes them.
- Push endpoint rate-limited (5/min/user) and size-capped (total 2 MB/push).
- We never request private-repo or org scopes.
