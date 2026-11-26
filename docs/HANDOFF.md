# HANDOFF: project status and session log

> **Maintained by the AI assistants and tools, not by hand.** Every AI session must update this file (rules: `AGENTS.md`).
> Opeyemi only needs to read it and confirm. NO SECRETS in this file, ever.

**Confirmed by Opeyemi:** [x] _(2026-11-26)_

---

## Current state (the AI rewrites this section each session so it is always true NOW)

**Last updated:** 2026-11-26 by Opeyemi (Human)

**Current layer:** L0 Foundations (Complete). Next: L1 Pi integration and session.

**Done**
- Repo scaffold generated (`humansays.zip`): folder structure, config, API route stubs, SQL migration, docs, GitHub files, AI rules.
- Unit tests written and passing in a sandbox run: money (5), ledger invariant (3), prediction scoring (3).
- Working code (not just stubs): `src/lib/config.ts`, `money.ts`, `http.ts`, `pi/server.ts` (`/me` + payment helpers), `pi/client.ts`, `auth/session.ts` (JWT), `ledger/ledger.ts` (`assertBalanced` only), `predictions/scoring.ts`, `GET /api/config/public`.
- Everything else is a stub: API routes return `501`, pages are placeholders, `postTransaction`, `quality/checks.ts`, `ai/*`, `pi/a2u.ts` are not built.
- **Repo pushed to GitHub:** `https://github.com/oppasskybest-ai/humansays`
- **Repository is Public.** Branch protection is active on `main`: requires a Pull Request and 1 approval. "Restrict deletions" and "Block force pushes" are enabled.
- **Local setup verified:** `npm install` ran successfully. `npm run dev` compiles without errors and the landing page loads.

**In progress**
- Inviting team members (Robiu, Michael, Paul, Benjamin, Oluwatosin) as collaborators.

**Next 3 tasks**
1. Team: Accept GitHub invites, clone the repo, and create `.env.local` locally.
2. Robiu: Create the Supabase staging project, apply `supabase/migrations/0001_init.sql`, write `src/lib/db/queries/`.
3. Build `POST /api/auth/verify` (L1): verify Pi token via `/me`, upsert user, return app JWT, reject blocked users.

**Decisions made**
- Stack: Next.js 14 App Router + TypeScript, Tailwind, Supabase (database only), Vercel (two projects: staging and production).
- Monorepo, one codebase; network and reward mode switched by env vars (spec section 2).
- Suggested owners are in `docs/TEAM.md` (Robiu starts with the database layer).
- **Repo visibility:** Public (to allow free branch protection on GitHub).
- **Workflow:** No direct pushes to `main`. All work must be done on branches (e.g., `l3/me-endpoint`) and merged via Pull Request with at least 1 approval.

**Open questions (waiting on Pi or the team)**
- Testnet or Mainnet accepted for the hackathon submission?
- Can we pay users in Pi (A2U) on Mainnet?
- Is the Incoming Multisig Wallet approved?
- Current switches: `FUNDING_MODE=credits_only`, `PAYOUT_MODE=points` (safe defaults until Pi answers).
- GitHub usernames for `.github/CODEOWNERS` placeholders (need to be updated with the real usernames of the team).

**Known bugs / blockers**
- None currently. Local dev server is running.

**Environment status (names only, no values)**
- Staging Pi app registered: unknown | Staging deployed: no | Production app: no
- Supabase staging migrated: no | Supabase production migrated: no

---

## Session log (append-only, NEWEST FIRST)

### 2026-11-26, Opeyemi (Human), working with AI Guide
- Goal: Complete L0 setup (install, run locally) and set up GitHub security.
- Done: Initialized Git, pushed to public GitHub repo, enabled branch protection on `main` (Require PR, 1 approval). Ran `npm install` successfully. Created `.env.local` with placeholders. Ran `npm run dev` and verified the landing page loads without errors.
- Verified: `npm run dev` works. The page loads.
- NOT verified: Typecheck, lint, or build commands. Supabase connection (placeholder URL used).
- Decisions: Chose a public repo over a private one to access free branch protection rules.
- Spec/contract changes: None.
- Problems / blockers: None.
- Next: Team onboarding. Begin L1 (`POST /api/auth/verify`).
- Status: CONFIRMED by Opeyemi [x] _(2026-11-26)_

### 2026-11-26, Claude (claude.ai chat), working with Opeyemi
- Goal: create the full codebase structure for HumanSays so the team can start on their parts.
- Done: created the repo scaffold (108 files): Next.js + TS + Tailwind config; `src/lib/*`; 36 API route stubs from the spec's route index; page placeholders; `supabase/migrations/0001_init.sql` (all tables + RLS); `.env.example`; `next.config.js` with Pi CSP and no `X-Frame-Options`; `vercel.json` crons; CODEOWNERS, PR/issue templates, CI workflow; `docs/` (TEAM, API_CONTRACT, ARCHITECTURE, design, marketing, QA); `AGENTS.md`, `CLAUDE.md`, MASTER_PROMPT and this file.
- Verified: 11 unit tests pass (run with a temporary vitest shim); JSON configs parse; CSP header output checked; secret scan of the repo found nothing.
- NOT verified: `npm install`, `next build`, `tsc` full typecheck (remaining errors were only missing-package types), ESLint, anything in a browser, anything against Pi or Supabase.
- Decisions: small deviations from the spec, logged in spec section 17: `NEXT_PUBLIC_STROOPS_PER_POINT`, extra route `GET /api/config/public`, extra admin sub-routes, daily-only cron schedules.
- Spec/contract changes: see spec section 17 and `docs/API_CONTRACT.md`.
- Problems / blockers: none known yet.
- Next: Opeyemi installs and runs typecheck/lint/build; then build `POST /api/auth/verify` (L1) or the ledger/top-up flow (L5).
- Status: CONFIRMED by Opeyemi [x] _(2026-11-26)_