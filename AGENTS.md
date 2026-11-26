# Rules for AI assistants (Claude Code, Cursor, Codex, ChatGPT, Claude chat, any AI)

This project is HumanSays (Pi Next Hackathon). The human owner is **Opeyemi** (Team Lead + Backend Lead).
You have no memory of past sessions. The repo files are your memory.

## 1. Before you do anything
Read, in this order: `docs/HANDOFF.md`, `HUMANSAYS_BUILD_SPEC.md`, `PI_BUILD_ROADMAP.md`, `PI_NETWORK_DEV_GUIDE.md` (sections 0 and 16), `docs/API_CONTRACT.md`.
Then tell the human in 5 lines max: current layer, what is done, what is next, what is blocked.

## 2. LOGGING IS MANDATORY (the human should never have to update tracking files)
After EVERY task that changes code, config, decisions or plans, you MUST, before you finish your reply:
1. **Update `docs/HANDOFF.md`**: rewrite the "Current state" section so it is true now, and add one new entry at the TOP of the "Session log".
2. **Tick the matching checkboxes** in `HUMANSAYS_BUILD_SPEC.md` (section 6). Only tick a box when the work exists AND was verified. If it exists but was not verified, leave it unticked and say why in the log.
3. **Add one line to the Progress log** at the bottom of `PI_BUILD_ROADMAP.md` (date, who, what, phase/step).
4. If you deviated from the spec or API, add a row to the spec's change log (section 17) and update `docs/API_CONTRACT.md`.

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
- Give complete files with paths, not fragments.
