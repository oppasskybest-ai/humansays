# HANDOFF: project status and session log

> **Maintained by the AI assistants and tools, not by hand.** Every AI session must update this file (rules: `AGENTS.md`).
> Opeyemi only needs to read it and confirm. NO SECRETS in this file, ever.

**Confirmed by Opeyemi:** [x] _(2026-11-26)_

---

## Current state (the AI rewrites this section each session so it is always true NOW)

**Last updated:** 2026-11-27 by Claude (claude.ai chat)

**Current layer:** L0 Foundations (mostly done: repo, install and dev server verified. Still unverified: typecheck, lint, tests and build on a real machine; Supabase projects not created yet). Next: L1 Pi integration and session.

**Done**
- Repo scaffold generated (`humansays.zip`): folder structure, config, API route stubs, SQL migration, docs, GitHub files, AI rules.
- Unit tests written and passing in a sandbox run: money (5), ledger invariant (3), prediction scoring (3).
- Working code (not just stubs): `src/lib/config.ts`, `money.ts`, `http.ts`, `pi/server.ts` (`/me` + payment helpers), `pi/client.ts`, `auth/session.ts` (JWT), `ledger/ledger.ts` (`assertBalanced` only), `predictions/scoring.ts`, `GET /api/config/public`.
- Everything else is a stub: API routes return `501`, pages are placeholders, `postTransaction`, `quality/checks.ts`, `ai/*`, `pi/a2u.ts` are not built.
- **Repo pushed to GitHub:** `https://github.com/oppasskybest-ai/humansays`
- **Repository is Public.** Branch protection is active on `main`: requires a Pull Request and 1 approval. "Restrict deletions" and "Block force pushes" are enabled.
- `package-lock.json` committed (573 packages, lockfileVersion 3), so CI's `npm ci` can run.
- **Local setup verified:** `npm install` ran successfully. `npm run dev` compiles without errors and the landing page loads.

**In progress**
- Inviting team members (Robiu, Michael, Paul, Benjamin, Oluwatosin) as collaborators.

**Next 3 tasks**
1. Opeyemi: in a GitHub Codespace, apply this update zip on a branch (see chat), then open the latest CI run on GitHub and run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` in the Codespace terminal; send any error text to the AI.
2. Opeyemi: upgrade the whole stack to current versions BEFORE anything is deployed, in the Codespace on branch `chore/upgrade-deps` (steps given in chat: `npx @next/codemod@canary upgrade latest`, `npx @tailwindcss/upgrade`, then the other packages with `@latest`), commit the new `package-lock.json`, and send the AI any errors. Target: Next.js 16.4.x (latest stable 16.4.6 on 9 Nov 2026).
3. Team: accept GitHub invites, clone, create `.env.local`. Robiu: Supabase staging project + apply `supabase/migrations/0001_init.sql` + `src/lib/db/queries/`. Then build `POST /api/auth/verify` (L1).

**Decisions made**
- **AI identity check (2026-11-27):** every AI session first asks who is working. Opeyemi + correct nickname = Lead mode (full access). Everyone else = Contributor mode (only their folders from `docs/TEAM.md`, notes in `docs/sessions/`). This steers the AI and is not real security; GitHub branch protection is the real guard.
- **Environment:** all commands are for the Codespaces terminal.
- Stack: Next.js App Router (currently 14.2.18, upgrading to 16) + TypeScript, Tailwind, Supabase (database only), Vercel (two projects: staging and production).
- Monorepo, one codebase; network and reward mode switched by env vars (spec section 2).
- Suggested owners are in `docs/TEAM.md` (Robiu starts with the database layer).
- **Repo visibility:** Public (to allow free branch protection on GitHub).
- **Workflow:** No direct pushes to `main`. All work must be done on branches (e.g., `l3/me-endpoint`) and merged via Pull Request with at least 1 approval.

**Open questions (waiting on Pi or the team)**
- Pi Sandbox with Codespaces: Opeyemi has no local machine, so the dev app runs on a Codespaces forwarded URL (port 3000) and not on `localhost`. Whether the Pi developer console accepts that as the development URL (port may need to be Public) is NOT verified. Test in roadmap Phase 5.
- Testnet or Mainnet accepted for the hackathon submission?
- Can we pay users in Pi (A2U) on Mainnet?
- Is the Incoming Multisig Wallet approved?
- Current switches: `FUNDING_MODE=credits_only`, `PAYOUT_MODE=points` (safe defaults until Pi answers).
- GitHub usernames for `.github/CODEOWNERS` placeholders (need to be updated with the real usernames of the team).

**Known bugs / blockers**
- **Next.js 14.2.18 is end-of-support.** Per a Nov 2026 source, only Next 16 (Active LTS) and Next 15 (security fixes until 31 Jan 2027) still get security fixes; 14.x gets none. Target is Next 16. Not deployed yet, so no live exposure. Fix before first deploy (Next task 2). README/ARCHITECTURE/spec still say Next.js 14 until the upgrade is verified, then update them.
- CI status on the new lockfile not yet seen. Lint, typecheck, tests and build have never been run on a real machine and may show real errors.
- `.github/CODEOWNERS` still has placeholder usernames.

**Environment status (names only, no values)**
- Dev environment: GitHub Codespaces only (no local machine). Teammates' setups: unknown.
- Staging Pi app registered: unknown | Staging deployed: no | Production app: no
- Supabase staging migrated: no | Supabase production migrated: no

---

## Session log (append-only, NEWEST FIRST)

### 2026-11-27, Claude (claude.ai chat), working with Opeyemi
- Goal: clean single update package; add Codespaces-only workflow and an identity check for AI sessions.
- Done: rewrote `docs/MASTER_PROMPT.md`; added identity check (section 0) and Codespaces rules (section 0b) to `AGENTS.md`; added `docs/sessions/` (one note per teammate session, merged into HANDOFF by Lead mode); updated `docs/TEAM.md`, `README.md` (Codespaces note) and this file. Included Opeyemi's `package-lock.json` and the zod-safe `src/lib/config.ts` from the previous session.
- Verified: file diff against Opeyemi's uploaded zip shows only intended files changed; no secrets scan hits.
- NOT verified: nothing was installed or built (sandbox has no network). The Next 16 upgrade, lint, typecheck, tests and build still have to be run in the Codespace. The Pi Sandbox working through a Codespaces URL is unverified.
- Decisions: identity check is behavior-steering only (nickname is visible in this public repo); teammates log to `docs/sessions/` to avoid HANDOFF merge conflicts.
- Spec/contract changes: none.
- Problems / blockers: none new.
- Next: Opeyemi applies this zip on branch `chore/upgrade-deps` in a Codespace, runs the upgrade, reports errors; then L1 `/api/auth/verify`.
- Status: UNCONFIRMED by Opeyemi

### 2026-11-26 (night), Claude (claude.ai chat), working with Opeyemi
- Goal: upgrade everything to current 2026 versions (Opeyemi's request).
- Done: web research: Next.js latest stable is 16.4.6 (9 Nov 2026); Next 14 no longer receives security fixes; Next 15 only until 31 Jan 2027. Replaced the earlier "upgrade to 14.2.35" advice with "upgrade to Next 16". Edited `src/lib/config.ts` so its zod defaults (`bool`, `stroops`) use `.optional().transform(...)`, which behaves the same in zod 3 and zod 4. Added Next 16 rules (async `params`, ESLint CLI) to `AGENTS.md`.
- Verified: nothing run (sandbox has no network and no installed packages). The config.ts edit was not type-checked.
- NOT verified: the upgrade itself; that Next 16 + React 19 works in the Pi Browser/Sandbox on older phones (Next 16 raised minimum browser versions, check the upgrade guide); that all other packages' latest majors install together without peer-dependency conflicts.
- Decisions: do the upgrade now on a branch via the official codemods, not by hand-editing package.json (a hand edit would desync package-lock.json and break `npm ci` in CI).
- Spec/contract changes: none.
- Problems / blockers: Opeyemi must run the upgrade locally; unknown what errors appear.
- Next: Opeyemi runs the upgrade steps and sends the output; AI fixes any errors; then update README/ARCHITECTURE/spec to say Next 16; then L1 `/api/auth/verify`.
- Status: UNCONFIRMED by Opeyemi

### 2026-11-26 (evening), Claude (claude.ai chat), working with Opeyemi
- Goal: read the repo Opeyemi updated and uploaded; check it is safe and consistent.
- Done: compared the uploaded zip with the original scaffold. Only differences: `package-lock.json` added, HANDOFF.md updated by Opeyemi, `.git` history included (2 commits). Merged his HANDOFF/roadmap as the base and updated them (repo URL, ticked GitHub push + local run in the roadmap, progress-log lines). Kept `ci.yml` as the original (it works now that the lockfile exists).
- Verified: no `.env*` files except `.env.example`; no tokens in `.git/config` or anywhere in the tree (pattern scan); lockfile resolves next 14.2.18, react 18.3.1, zod 3.25.76, jose 5.10.0, supabase-js 2.119.2, typescript 5.9.3, vitest 2.1.9. Web search on Next.js advisories.
- NOT verified: lint, typecheck, unit tests and build against the real installed packages (the sandbox cannot install them); CI run result; that branch protection settings match what HANDOFF says (taken from Opeyemi's notes).
- Decisions: recommend upgrading Next.js before deployment; do not require CI in branch protection until CI is green.
- Spec/contract changes: none.
- Problems / blockers: Next 14.2.18 is outdated and has known advisories (App Router affected).
- Next: Opeyemi runs the four checks and the Next upgrade + `npm audit`, then reports results; then L1 `/api/auth/verify`.
- Status: UNCONFIRMED by Opeyemi

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