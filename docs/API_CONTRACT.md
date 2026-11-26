# API Contract

**Rule from the team flyer: agree on the API before building.** Frontend (Michael) and backend (Opeyemi, Robiu)
use THIS file as the agreement. To change an endpoint: edit this file in a pull request and get Opeyemi + Michael to approve.

## Conventions
- Base path: `/api`. JSON in, JSON out.
- Auth: `Authorization: Bearer <app JWT>` from `POST /api/auth/verify`. **No cookies** (iOS Pi Browser blocks them).
- **Money is sent as strings of integer stroops** (e.g. `"15000000"` = 1.5 Pi). JSON cannot carry BigInt. Never floats.
- Errors: `{ "error": "<code>", "message": "<human text>", "details"?: any }` with status 400/401/403/404/409/500/501.
- `501 not_implemented` = route exists but is not built yet (see Owner / Layer).
- Every request body is validated with `zod` on the server.

## Endpoints
(Source: HUMANSAYS_BUILD_SPEC.md section 7. Owners are suggestions: reassign in `docs/TEAM.md`.)

| Methods | Path | Auth | Layer | Suggested owner | Purpose |
|---|---|---|---|---|---|
| `GET` | `/api/config/public` | none | L0 | Opeyemi | Flags the UI may know (test mode, funding/payout mode, points rate) |
| `POST` | `/api/auth/verify` | Bearer Pi token | L1 | Opeyemi | Verify Pi token with /v2/me, upsert user, return app JWT + profile |
| `GET, PATCH, DELETE` | `/api/me` | user | L3 | Robiu | Profile, optional demographics + consent, delete my data |
| `GET` | `/api/feed` | user | L6 | Robiu | Eligible live polls for this user |
| `POST` | `/api/campaigns` | user | L4 | Robiu | Create a campaign (draft) |
| `GET, PATCH` | `/api/campaigns/[id]` | owner | L4 | Robiu | Read / edit own campaign |
| `POST` | `/api/campaigns/[id]/questions` | owner | L4 | Robiu | Add / edit questions |
| `POST` | `/api/campaigns/[id]/launch` | owner | L5 | Opeyemi | Lock escrow, submit for review / go live |
| `POST` | `/api/campaigns/[id]/close` | owner | L5 | Opeyemi | Close early, refund unspent escrow |
| `GET` | `/api/campaigns/[id]/results` | owner | L10 | Robiu | Aggregates (small-group rule: hide groups < 5) |
| `POST` | `/api/campaigns/[id]/start` | user | L6 | Opeyemi | Begin responding (creates response row) |
| `POST` | `/api/responses/[id]/submit` | user | L6 | Opeyemi | Submit answers, run quality checks, approve/flag |
| `POST` | `/api/responses/[id]/review` | owner/admin | L7 | Opeyemi | Approve / reject a FLAGGED response |
| `POST` | `/api/topups/intent` | user | L5 | Opeyemi | Create a top-up payment intent (server computes amount) |
| `POST` | `/api/payments/approve` | user | L5 | Opeyemi | Server approval (Key auth to Pi), idempotent |
| `POST` | `/api/payments/complete` | user | L5 | Opeyemi | Server completion + ledger credit, idempotent |
| `POST` | `/api/payments/recover` | none (validated server-side) | L1 | Opeyemi | Complete interrupted payments from onIncompletePaymentFound |
| `GET` | `/api/wallet` | user | L11 | Opeyemi | Balances and history from the ledger |
| `POST` | `/api/payouts` | user | L11 | Opeyemi | Withdraw (only when PAYOUT_MODE=pi_a2u, else 403) |
| `GET, POST` | `/api/predictions` | user | L8 | Robiu | List open items / make a prediction |
| `GET` | `/api/leaderboard` | user | L8 | Robiu | Weekly / all-time leaderboard |
| `POST` | `/api/ai/question-check` | owner | L9 | Opeyemi | Claude: question quality check |
| `POST` | `/api/ai/summary` | owner | L9 | Opeyemi | Claude: results summary |
| `POST` | `/api/reports` | user | L12 | Robiu | Report a poll or response |
| `POST` | `/api/admin/grant-credits` | admin | L5 | Opeyemi | Grant TEST credits (ledger: external:grant -> business balance) |
| `POST` | `/api/admin/campaigns/[id]/review` | admin | L12 | Robiu | Approve / reject a campaign (with note) |
| `POST` | `/api/admin/users/[uid]/block` | admin | L12 | Robiu | Block / unblock a user |
| `POST` | `/api/admin/events` | admin | L8 | Robiu | Create a prediction Event |
| `POST` | `/api/admin/events/[id]/resolve` | admin | L8 | Robiu | Resolve a prediction Event (plain-text source note) |
| `POST` | `/api/admin/payouts/pause` | admin | L11 | Opeyemi | Pause / resume payouts |
| `GET` | `/api/admin/audit` | admin | L12 | Robiu | View audit log |
| `GET` | `/api/cron/close-campaigns` | CRON_SECRET | L15 | Opeyemi | Close expired/full campaigns, refund unspent escrow |
| `GET` | `/api/cron/auto-approve` | CRON_SECRET | L15 | Opeyemi | Auto-approve flagged responses older than 72h |
| `GET` | `/api/cron/predictions` | CRON_SECRET | L15 | Opeyemi | Resolve crowd predictions, close events, weekly leaderboard |
| `GET` | `/api/cron/payouts` | CRON_SECRET | L15 | Opeyemi | Payout worker (A2U), serialized with a DB lock |
| `GET` | `/api/cron/ai-flags` | CRON_SECRET | L15 | Opeyemi | Low-effort text classifier (adds flags only) |

## Request/response shapes
Add each endpoint's shape below as it gets built (owner writes it in the same PR as the code):

### POST /api/auth/verify
- Request header: `Authorization: Bearer <Pi accessToken>`
- Response `200`: `{ "token": "<app JWT>", "user": { "uid": "...", "username": "...", "reputation": 0, "tier": "Bronze" } }`
- `401` for a bad Pi token or a blocked user.

### GET /api/config/public
- Response `200`: `{ "isTestMode": true, "fundingMode": "credits_only", "payoutMode": "points", "pointsMode": true, "creditsOnly": true, "stroopsPerPoint": 10000, "platformFeeBps": 1000 }`

_(add the rest here)_
