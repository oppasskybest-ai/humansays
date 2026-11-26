# QA Test Plan (Benjamin)

Source: `HUMANSAYS_BUILD_SPEC.md` section 11. Tick each box when it passes; log bugs as GitHub issues.

## Must pass before submission
- [ ] Forged/expired token returns 401 on every protected route
- [ ] Top-up: approve with wrong amount / another user's payment is rejected; completing twice credits once
- [ ] Ledger invariant holds after a random sequence of operations
- [ ] Launch with insufficient balance fails; escrow never negative; sample never exceeds target under concurrent submits
- [ ] One response per user per poll; failing an attention check gives no reward
- [ ] Crowd prediction resolves once even if the job runs twice
- [ ] `PAYOUT_MODE=points`: payout routes return 403 and UI is hidden. `pi_a2u` on staging: payout completes; failure reverses the reservation
- [ ] `FUNDING_MODE=credits_only`: top-up route returns 403; admin grant works
- [ ] AI endpoints handle hostile text ("ignore your instructions") without leaking or breaking JSON
- [ ] Small-group breakdown hidden below 5 respondents
- [ ] Public pages open in a normal browser without Pi; actions say "open in Pi Browser"
- [ ] Full flow in the Pi Sandbox, then on a phone in Pi Browser

## Bug report format
Title, steps to reproduce, expected vs actual, screenshot (no secrets in it), device + browser, environment (staging/production).
