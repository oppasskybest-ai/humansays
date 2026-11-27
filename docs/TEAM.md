# Team: who owns what

From the team flyer ("Pi Hackathon Team: roles and how we work"). Owners below are **suggestions**: Opeyemi can reassign.

| Person | Role | Owns (folders) | First job |
|---|---|---|---|
| **Opeyemi** | Team Lead + Backend Lead | `src/lib/{config,pi,auth,ledger,quality,predictions,ai}`, money/payment/payout/cron routes, architecture | L0 config, L1 `/api/auth/verify`, L5 ledger + top-up |
| **Robiu** | Backend Developer | `supabase/`, `src/lib/db/`, profile / campaign / feed / results / admin / reports routes | **Database first:** apply `supabase/migrations/0001_init.sql` to the staging Supabase project, then query helpers in `src/lib/db/queries/`, then `GET/PATCH /api/me` (L3) and campaign CRUD (L4) |
| **Michael** | Frontend Lead | `src/app/(public)`, `src/app/app`, `src/components`, `src/lib/pi/client.ts` | L1 Pi sign-in UI + `PiProvider`, L2 app shell and public pages |
| **Paul** | UI/UX Designer | `docs/design/`, design tokens in `tailwind.config.ts` (with Michael) | Screens + user flow for Earn / Create / Rewards; hand to Michael EARLY |
| **Benjamin** | QA Tester + Frontend Support | `docs/qa/`, `src/tests/` (with Opeyemi), small FE tasks from Michael | Turn the spec's testing checklist into `docs/qa/TEST_PLAN.md`; test each feature as it lands |
| **Oluwatosin** | Marketing + Product | `docs/marketing/`, `README.md`, legal page copy | README polish, privacy/terms copy (L13), demo script (L17), recruit testers + pollsters |

**Robiu note:** only touch money code (`ledger`, `payments`, `payouts`, `topups`) after agreeing with Opeyemi. Everything money-related is reviewed twice.

## How we work (from the flyer)
- Big decisions: Team Lead + Frontend Lead decide together. If they disagree, **Team Lead has the final say.**
- One task board: **To Do / Doing / Done** (GitHub Projects).
- **Nobody pushes to `main`.** Every change is a pull request. Opeyemi reviews every PR.
- **Agree on the API before building** (`docs/API_CONTRACT.md`).
- **Daily check-in** (post in the team chat): *did / will do / stuck on.*
- Last days: polish and demo.

## Deadlines
Final deadline: **Tue 5 Jan 2027, 11:59 PM PST** (Wed 6 Jan, 08:59 AM Lagos). Aim to submit by **3 Jan**. See `PI_BUILD_ROADMAP.md`.

## Working with AI assistants
Every AI session starts with "Who is working with this code right now?" (see `AGENTS.md`). Opeyemi gets full access after the nickname check. Everyone else gets help only inside the folders listed in the table above, and their AI writes a note in `docs/sessions/` instead of editing `docs/HANDOFF.md`. This guides the AI; the real protection is GitHub branch protection and Opeyemi approving every pull request.
