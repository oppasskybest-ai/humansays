# Architecture (short version)

Full detail: `HUMANSAYS_BUILD_SPEC.md` sections 2 to 8.

```
Pi Browser (React UI + Pi SDK)
   | 1 Pi.authenticate -> accessToken
   v
Next.js API routes --2 GET /v2/me--> Pi Platform API  => verified uid
   | 3 issue app JWT (1h, kept in memory, sent as Authorization: Bearer)
   v
Supabase Postgres (service key, server only)     Claude API (server only)
   ^
   | Pi payments: server-created intent -> Pi.createPayment -> approve -> complete
Vercel Cron: payouts, close campaigns, resolve predictions, AI flags
```

- **One codebase, two switchable decisions**: network (Staging/Production env vars) and rewards (`FUNDING_MODE`, `PAYOUT_MODE`). All flags are read in `src/lib/config.ts` only.
- **All DB access is server-side.** The browser never talks to Supabase. RLS is on with no policies.
- **Identity** is only the verified Pi `uid`. No Supabase Auth, no email login.
- **Ledger**: double-entry, every transaction sums to zero, every operation idempotent.

## Folder map
```
src/app/(public)/   public pages (work without Pi sign-in)
src/app/app/        signed-in screens
src/app/api/        route handlers (stubs return 501 until built)
src/lib/            config, money, pi, auth, db, ledger, quality, predictions, ai
src/components/     shared UI
src/tests/          vitest unit tests
supabase/migrations SQL schema
docs/               API contract, team, design, marketing, QA
```
