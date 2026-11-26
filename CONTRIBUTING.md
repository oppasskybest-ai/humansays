# Contributing

## The rules
1. **Never push to `main`.** Branch, push, open a pull request. Opeyemi reviews every PR.
2. **Small PRs.** One task per PR. Smaller PRs get reviewed faster.
3. **No secrets, ever.** No API keys, wallet seeds, passwords, tokens in code, logs, screenshots or chat. Secrets live in `.env.local` (git-ignored) and Vercel settings.
4. **Agree on the API first.** Change `docs/API_CONTRACT.md` in a PR before changing an endpoint.
5. **Money = integer stroops (`bigint`)**, sent over the API as strings. Never floats.

## Branch names
`<layer>/<short-description>`, e.g. `l4/campaign-builder-form`, `l3/me-endpoint`, `fix/feed-sorting`, `docs/privacy-copy`.

## Commit messages
Short, present tense, with a prefix: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
Example: `feat: add GET /api/me`

## Workflow
```bash
git checkout main && git pull
git checkout -b l3/me-endpoint
# ...work...
npm run lint && npm run typecheck && npm test
git add . && git commit -m "feat: add GET /api/me"
git push -u origin l3/me-endpoint
# open a Pull Request on GitHub, fill in the template
```

## Task board
Cards move **To Do -> Doing -> Done**. Put the card link in your PR. Pick work from `HUMANSAYS_BUILD_SPEC.md` section 6 (layers L0 to L17); tick the box in the spec and add a line to the Progress log in `PI_BUILD_ROADMAP.md` when a layer is finished.

## Pi-specific reminders
- `window.Pi` only exists inside Pi Browser. Public pages must work in any browser without Pi sign-in.
- Never trust the client's `user` or token. The only identity is the `uid` returned by `GET /v2/me`.
- Payment approve/complete routes get retried by Pi: make them idempotent.
- Read `PI_NETWORK_DEV_GUIDE.md` section 0 and 16 before touching Pi code.
