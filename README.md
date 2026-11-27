# HumanSays

**Real answers from a Pi-verified community.** Businesses, researchers and creators run polls; people earn rewards for giving real answers; free predictions and a leaderboard bring them back every day.

Built for the **Pi Next Hackathon** by the Pi Hackathon Team. Deadline: Tue 5 Jan 2027, 11:59 PM PST (aim to submit by 3 Jan).

> **Start here, in this order:**
> 1. [`PI_NETWORK_DEV_GUIDE.md`](PI_NETWORK_DEV_GUIDE.md): Pi technical reference (rules, SDK, API)
> 2. [`PI_BUILD_ROADMAP.md`](PI_BUILD_ROADMAP.md): step-by-step checklist and progress log
> 3. [`HUMANSAYS_BUILD_SPEC.md`](HUMANSAYS_BUILD_SPEC.md): what we build, layer by layer (L0 to L17)
> 4. [`docs/TEAM.md`](docs/TEAM.md): who owns what and how we work
> 5. [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md): the API we agree on **before** building
> 6. [`docs/HANDOFF.md`](docs/HANDOFF.md) + [`docs/MASTER_PROMPT.md`](docs/MASTER_PROMPT.md): current status, and the prompt that restarts any AI chat with full context

## Working with AI assistants
Any AI used on this repo must follow [`AGENTS.md`](AGENTS.md): it reads `docs/HANDOFF.md` first and **updates it (and the spec/roadmap checkboxes) after every task**. Humans only read and confirm.

## Tech stack
Next.js 14 (App Router) + TypeScript, Tailwind CSS, Supabase Postgres (database only), Pi SDK + Pi Platform API, Claude API (server side), Vercel hosting, Vitest.

## Quick start
```bash
git clone <repo-url> && cd humansays
npm install                      # first person: commit the generated package-lock.json
cp .env.example .env.local       # fill in YOUR values. NEVER commit this file
npm run dev                      # http://localhost:3000
```
Other commands: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

### Working in GitHub Codespaces (no local setup needed)
On the repo page click **Code, Codespaces, Create codespace on main**. The terminal there already has git and Node. Run the commands above, work on a branch, push, and open a pull request. Keep secrets in `.env.local` or in Codespaces secrets, never in git. Stop the Codespace when you are done to save your free hours.

Env var names and meanings are in [`.env.example`](.env.example) and spec section 13. All env/flags are read only in `src/lib/config.ts`.

### Testing with Pi
- Open the Pi Developer console **on a computer**, go to your Staging app, open the **Sandbox** link, and authorize it from the Pi app (Pi Utilities, Authorize Sandbox). Details: roadmap Phase 5.
- The Sandbox needs `http://localhost:3000` as the app's development URL and the headers already set in `next.config.js`.

## Project structure
```
src/app/(public)/   public pages: work in ANY browser, no Pi sign-in (needed for PiNet)
src/app/app/        signed-in screens (Earn, Predict, Create, Rewards, Me, Admin)
src/app/api/        route handlers: stubs return 501 until built (see docs/API_CONTRACT.md)
src/lib/            config, money, pi, auth, db, ledger, quality, predictions, ai
src/components/     shared UI
src/tests/          unit tests (Vitest)
supabase/migrations SQL schema
docs/               team, API contract, architecture, design, marketing, QA
.github/            CODEOWNERS, PR template, CI
```

## Non-negotiables
- Pi login only (no email/social login). The only identity is the verified Pi `uid` from `GET /v2/me`.
- All database access is server-side. The browser never talks to Supabase.
- Money is integer stroops (`bigint`); every payment/ledger operation is idempotent.
- Nobody pushes to `main`. Every change is a pull request. See [`CONTRIBUTING.md`](CONTRIBUTING.md).
- Never commit secrets (Pi API key, wallet seed, service keys, session secret).

## Status
Layer progress is tracked in `HUMANSAYS_BUILD_SPEC.md` (section 6 checkboxes) and the Progress log in `PI_BUILD_ROADMAP.md`.
