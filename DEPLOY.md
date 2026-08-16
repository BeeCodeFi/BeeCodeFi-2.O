# Phase 0 Deploy Walkthrough — Vercel + Render/Fly + Neon

Free-tier-first per Golden Rule 4 (`files/README.md`). This wires the skeleton
built in this repo to real infrastructure. Do these in order — each step
produces a value the next step needs.

## 1. Neon (Postgres) — do this first

1. Go to https://neon.tech → sign up (GitHub sign-in is fine) → **New Project**.
   - Name: `beecodefi`, Postgres version: latest, region: closest to you.
2. On the project dashboard, copy the **pooled connection string** (Neon calls
   it "Connection string", make sure "Pooled connection" is toggled on — the
   API should talk to the pooler, not the direct endpoint, once you're past
   local dev).
3. In `apps/api/.env` (create it from `apps/api/.env.example`), set:
   ```
   DATABASE_URL=<paste the Neon connection string>
   ```
4. From `apps/api/`, apply the schema:
   ```
   pnpm exec prisma migrate deploy
   ```
   This runs the migration already committed at
   `apps/api/prisma/migrations/20260816000000_init/` — it creates the
   `users`, `user_auth_providers`, and `user_settings` tables and enables the
   `citext`/`pgcrypto` extensions Neon needs for them.

## 2. GitHub OAuth App (sign-in scope)

1. https://github.com/settings/developers → **New OAuth App**.
   - Application name: `BeeCodeFi (dev)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:4000/api/v1/auth/oauth/github/callback`
2. Copy the **Client ID**, generate a **Client secret**, and copy that too.
3. In `apps/api/.env`:
   ```
   GITHUB_CLIENT_ID=<client id>
   GITHUB_CLIENT_SECRET=<client secret>
   GITHUB_CALLBACK_URL=http://localhost:4000/api/v1/auth/oauth/github/callback
   ```
   You'll register a **second** OAuth App later (Phase 2) when the
   `public_repo` push scope is requested — keep sign-in and push credentials
   separate per `files/07-github-integration.md §1`.

## 3. Local secrets

Still in `apps/api/.env`, fill in:
```
SESSION_SECRET=<run: openssl rand -hex 32>
EMAIL_VERIFICATION_SECRET=<run: openssl rand -hex 32 — must differ from SESSION_SECRET>
WEB_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
```
And `apps/web/.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## 4. Confirm it runs locally before deploying anything

```
pnpm install
pnpm --filter @beecodefi/api exec prisma generate
pnpm dev:api    # in one terminal — http://localhost:4000
pnpm dev:web    # in another — http://localhost:3000
```
Register an account at `/auth/register`, then load `/dashboard` — you should
see "Welcome back, <name>." That's the Phase 0 exit criteria running locally.

## 5. Render (or Fly) — the API

Render is the simpler of the two for a first deploy; Fly is worth it later if
you want the app to live closer to users. Pick one:

### Render
1. https://render.com → **New +** → **Web Service** → connect this GitHub repo.
2. Root directory: `apps/api`.
3. Build command: `pnpm install --frozen-lockfile && pnpm exec prisma generate && pnpm build`
4. Start command: `pnpm exec prisma migrate deploy && pnpm start`
5. Instance type: **Free**.
6. Environment → add every var from `apps/api/.env` (use the **same** Neon
   `DATABASE_URL`, a **fresh** `SESSION_SECRET`/`EMAIL_VERIFICATION_SECRET`
   for production, and set `WEB_URL` to the Vercel URL from step 6 once you
   have it — Render lets you edit env vars and redeploy).
7. Deploy. Note the public URL, e.g. `https://beecodefi-api.onrender.com`.

### Fly.io (alternative)
1. Install `flyctl`, `fly auth login`.
2. From `apps/api/`: `fly launch` (say no to auto-deploy the first time so you
   can review the generated `fly.toml`; set the app to use a Dockerfile or
   Fly's Node buildpack).
3. `fly secrets set DATABASE_URL=... SESSION_SECRET=... EMAIL_VERIFICATION_SECRET=... GITHUB_CLIENT_ID=... GITHUB_CLIENT_SECRET=... GITHUB_CALLBACK_URL=... WEB_URL=...`
4. `fly deploy`.

## 6. Vercel — the frontend

1. https://vercel.com → **Add New** → **Project** → import this repo.
2. Root directory: `apps/web`.
3. Framework preset: Next.js (auto-detected).
4. Environment variable: `NEXT_PUBLIC_API_URL=<your Render/Fly API URL>/api/v1`.
5. Deploy. Note the public URL, e.g. `https://beecodefi.vercel.app`.
6. Go back to Render/Fly and set `WEB_URL` to this Vercel URL, and update the
   GitHub OAuth App's callback URL to
   `https://<your-api-domain>/api/v1/auth/oauth/github/callback` (GitHub OAuth
   Apps support only one callback URL per app in the free tier — you'll want
   a **second** OAuth App for production vs. local dev, both listed under the
   same GitHub account).

## 7. Verify the Phase 0 exit criteria in production

- Visit the Vercel URL → `/auth/register` → create an account.
- `/dashboard` should show "Welcome back, <name>."
- Push a trivial commit to `main` → confirm the CI workflow
  (`.github/workflows/ci.yml`) runs and, separately, that Render/Fly
  auto-deploys from `main` (both platforms support this out of the box once
  the GitHub connection is authorized).
- Break a migration on purpose (e.g. add a column with a bad type) on a
  branch → open a PR → confirm the `migration-check` CI job fails before you
  merge it. This is the second half of the Phase 0 exit criteria ("a broken
  migration fails CI").

## What's intentionally deferred

- Email verification currently logs the verification link to the API's
  server console (`apps/api/src/auth/mail.service.ts`) instead of sending a
  real email — no email provider account was in scope for this pass. Swap in
  Resend/Postmark/SES there when you're ready; the call site
  (`AuthService.register`) doesn't change.
- Design tokens, UI kit, and the LoopBar shell are in place
  (`apps/web/src/components/`), but they're not wired to any real lesson
  content yet — that's Phase 1.
