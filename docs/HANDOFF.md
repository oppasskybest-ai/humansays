# HANDOFF: project status and session log

> **Maintained by the AI assistants and tools, not by hand.** Every AI session must update this file (rules: `AGENTS.md`).
> Opeyemi only needs to read it and confirm. NO SECRETS in this file, ever.

**Confirmed by Opeyemi:** [ ] _(tick and add the date after you have read the newest log entry and it looks right)_

---

## Current state (the AI rewrites this section each session so it is always true NOW)

**Last updated:** 2026-11-26 by Claude (claude.ai chat)

**Current layer:** L0 Foundations (scaffold written; not yet installed/verified on a real machine). Next: L1 Pi integration and session.

**Done**
- Repo scaffold generated (`humansays.zip`): folder structure, config, API route stubs, SQL migration, docs, GitHub files, AI rules.
- Unit tests written and passing in a sandbox run: money (5), ledger invariant (3), prediction scoring (3).
- Working code (not just stubs): `src/lib/config.ts`, `money.ts`, `http.ts`, `pi/server.ts` (`/me` + payment helpers), `pi/client.ts`, `auth/session.ts` (JWT), `ledger/ledger.ts` (`assertBalanced` only), `predictions/scoring.ts`, `GET /api/config/public`.
- Everything else is a stub: API routes return `501`, pages are placeholders, `postTransaction`, `quality/checks.ts`, `ai/*`, `pi/a2u.ts` are not built.

**In progress**
- Nothing yet.

**Next 3 tasks**
1. Opeyemi: `npm install`, commit `package-lock.json`, run `npm run typecheck`, `npm run lint`, `npm run build`, and report any errors to the AI.
2. Build `POST /api/auth/verify` (L1): verify Pi token via `/me`, upsert user, return app JWT, reject blocked users. Needs the Supabase staging project and migration applied.
3. Robiu: create the Supabase staging project, apply `supabase/migrations/0001_init.sql`, write `src/lib/db/queries/`.

**Decisions made**
- Stack: Next.js 14 App Router + TypeScript, Tailwind, Supabase (database only), Vercel (two projects: staging and production).
- Monorepo, one codebase; network and reward mode switched by env vars (spec section 2).
- Suggested owners are in `docs/TEAM.md` (Robiu starts with the database layer).

**Open questions (waiting on Pi or the team)**
- Testnet or Mainnet accepted for the hackathon submission?
- Can we pay users in Pi (A2U) on Mainnet?
- Is the Incoming Multisig Wallet approved?
- Current switches: `FUNDING_MODE=credits_only`, `PAYOUT_MODE=points` (safe defaults until Pi answers).
- GitHub usernames for `.github/CODEOWNERS` placeholders.

**Known bugs / blockers**
- `npm install`, typecheck, lint and build have never been run (the sandbox had no network). Dependency versions were chosen from memory and may need adjusting.

**Environment status (names only, no values)**
- Staging Pi app registered: unknown | Staging deployed: no | Production app: no
- Supabase staging migrated: no | Supabase production migrated: no

---

## Session log (append-only, NEWEST FIRST)

### 2026-11-26, Claude (claude.ai chat), working with Opeyemi
- Goal: create the full codebase structure for HumanSays so the team can start on their parts.
- Done: created the repo scaffold (108 files): Next.js + TS + Tailwind config; `src/lib/*`; 36 API route stubs from the spec's route index; page placeholders; `supabase/migrations/0001_init.sql` (all tables + RLS); `.env.example`; `next.config.js` with Pi CSP and no `X-Frame-Options`; `vercel.json` crons; CODEOWNERS, PR/issue templates, CI workflow; `docs/` (TEAM, API_CONTRACT, ARCHITECTURE, design, marketing, QA); `AGENTS.md`, `CLAUDE.md`, MASTER_PROMPT and this file.
- Verified: 11 unit tests pass (run with a temporary vitest shim); JSON configs parse; CSP header output checked; secret scan of the repo found nothing.
- NOT verified: `npm install`, `next build`, `tsc` full typecheck (remaining errors were only missing-package types), ESLint, anything in a browser, anything against Pi or Supabase.
- Decisions: small deviations from the spec, logged in spec section 17: `NEXT_PUBLIC_STROOPS_PER_POINT`, extra route `GET /api/config/public`, extra admin sub-routes, daily-only cron schedules.
- Spec/contract changes: see spec section 17 and `docs/API_CONTRACT.md`.
- Problems / blockers: none known yet.
- Next: Opeyemi installs and runs typecheck/lint/build; then build `POST /api/auth/verify` (L1) or the ledger/top-up flow (L5).
- Status: UNCONFIRMED by Opeyemi
