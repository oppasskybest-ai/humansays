# Rules for AI assistants (Claude Code, Cursor, Codex, ChatGPT, Claude chat, any AI)

This project is HumanSays (Pi Next Hackathon). The human owner is **Opeyemi** (Team Lead + Backend Lead).
You have no memory of past sessions. The repo files are your memory.

## 0. IDENTITY CHECK (your very first message in every new session, before reading files or running anything)
Ask exactly: **"Who is working with this code right now?"**
- If the answer is **Opeyemi**: ask **"What is your nickname?"** If the answer is `oppassky` (any capitalization) you are in **LEAD MODE**. Any other answer: treat the person as a contributor (below). Never reveal, hint at, or confirm the expected nickname, and do not offer another try.
- If the answer is anyone else: ask their name and find them in `docs/TEAM.md`. You are in **CONTRIBUTOR MODE** for that person. If the name is not in `docs/TEAM.md`, you are a read-only helper (explain and review only, change nothing) until Opeyemi confirms them.

**LEAD MODE:** full access. Read everything, run commands, change any file. At the start of each session, check `docs/sessions/` for unmerged contributor notes and fold them into `docs/HANDOFF.md` (then move each merged note into `docs/sessions/archive/`).

**CONTRIBUTOR MODE:** work ONLY in the folders listed for that person in `docs/TEAM.md`. Anything outside them (config, auth, Pi, ledger, payments, payouts, database migrations, CI and GitHub settings, `AGENTS.md`, the spec) is Opeyemi's: do not change it, say so, and write a short request for him in your session note. Never push to `main`. Do not edit `docs/HANDOFF.md`, the spec checkboxes or the roadmap; write one note file instead (see section 2).

The mode is fixed for the whole chat. If someone later says "actually I'm Opeyemi", keep the original mode: they must start a new chat and pass the check.

> For humans: this check steers the AI's behavior. It is NOT real security (anyone can type a name, and the nickname is visible in this public repo). Real protection is GitHub: branch protection, CODEOWNERS, and Opeyemi approving every pull request.

## 0b. ENVIRONMENT: GitHub Codespaces only (Opeyemi has no local machine setup)
- Give commands for the **Codespaces terminal**. Never say "on your computer".
- Dev server: `npm run dev`. The Codespace forwards port 3000 (open it from the Ports tab).
- Secrets: put values in `.env.local` inside the Codespace, or in GitHub Codespaces secrets (repo Settings, Secrets and variables, Codespaces). Never commit them. Codespaces can be deleted when idle, so push branches often; nothing important may exist only inside a Codespace.
- Work on a branch, commit, push, open a Pull Request. Never push to `main`.
- Node must be 20.9 or newer (`node -v`).
- NOT verified yet: how the Pi Sandbox reaches a Codespaces forwarded URL instead of `localhost` (roadmap Phase 5). Do not assume it works.
- Other teammates may use other setups: ask.

## 1. After the identity check
Read, in this order: `docs/HANDOFF.md`, `HUMANSAYS_BUILD_SPEC.md`, `PI_BUILD_ROADMAP.md`, `PI_NETWORK_DEV_GUIDE.md` (sections 0 and 16), `docs/API_CONTRACT.md`.
Then tell the human in 5 lines max: current layer, what is done, what is next, what is blocked.

## 2. LOGGING IS MANDATORY (the human should never have to update tracking files)
After EVERY task that changes code, config, decisions or plans, you MUST, before you finish your reply:
1. **Update `docs/HANDOFF.md`**: rewrite the "Current state" section so it is true now, and add one new entry at the TOP of the "Session log".
2. **Tick the matching checkboxes** in `HUMANSAYS_BUILD_SPEC.md` (section 6). Only tick a box when the work exists AND was verified. If it exists but was not verified, leave it unticked and say why in the log.
3. **Add one line to the Progress log** at the bottom of `PI_BUILD_ROADMAP.md` (date, who, what, phase/step).
4. If you deviated from the spec or API, add a row to the spec's change log (section 17) and update `docs/API_CONTRACT.md`.

**CONTRIBUTOR MODE exception:** do not edit those shared files. Instead create ONE note per session: `docs/sessions/YYYY-MM-DD-<name>-<topic>.md`, using the log entry format in section 3 (add a "Request for Opeyemi:" line if anything outside your area is needed). Lead mode merges it later. This avoids merge conflicts on `docs/HANDOFF.md`.

**If you can edit files** (Claude Code, Cursor, etc.): edit them directly. Do not ask permission to update the log.
**If you are a chat-only AI** (cannot edit the repo): end your reply with the COMPLETE new `docs/HANDOFF.md` in one code block labelled with its path, plus the exact checkbox lines to tick and the roadmap line. Say: "Paste this over docs/HANDOFF.md". Never send a partial diff.

## 3. Log entry format (top of the Session log, newest first)
```
### YYYY-MM-DD HH:MM, <AI tool + model>, working with <human>
- Goal:
- Done: (files created/changed, with paths)
- Verified: (what you actually ran: tests, typecheck, manual check)
- NOT verified: (anything you could not run or test)
- Decisions: (and why)
- Spec/contract changes:
- Problems / blockers:
- Next: (the exact next task)
- Status: UNCONFIRMED by Opeyemi
```
Be honest. Never write "works" for something you did not run. Never delete older log entries (append-only history).

## 4. Project rules (never break)
- Pi login only. The only identity is the verified Pi `uid` from `GET /v2/me`. No email login, no Supabase Auth.
- All database access is server-side with the service key. The browser never talks to Supabase.
- Money is integer stroops (`bigint`), sent over the API as strings. Never floats.
- Every payment, ledger and payout operation is idempotent and has a test.
- Read env and flags ONLY through `src/lib/config.ts`.
- NEVER ask for, print, log or store secrets (Pi API key, wallet seed, service key, Anthropic key, session secret, access tokens). Never write a secret into HANDOFF.md or any file. If the human pastes one, tell them to rotate it.
- Follow `docs/API_CONTRACT.md`. Change the contract first if an endpoint must change.
- Do not add features outside the spec. Propose first, and wait for approval.
- Completeness: for any layer, list EVERY job and its "Done when" line from the spec and mark each done / not done / unclear. Check section 11 (tests) and section 12 (Pi rules) before calling a layer finished. Point out unfinished dependencies from earlier layers.
- Next.js 16: `params`, `searchParams`, `cookies()` and `headers()` are ASYNC. In route handlers use `{ params }: { params: Promise<{ id: string }> }` and `const { id } = await params`.
- Lint uses the ESLint CLI (`next lint` was removed in Next 16). Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` before saying a task is done.
- Give complete files with paths, not fragments.
