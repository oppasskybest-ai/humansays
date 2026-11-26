# Pi Next Hackathon: Build Roadmap and Progress Tracker

**What this file is:** a start-to-finish checklist. Tick each box `[x]` when done, so anyone (a teammate, or any AI assistant) can see what is finished and what is left.
**Companion file:** `PI_NETWORK_DEV_GUIDE.md` is the technical reference (code, rules, API details). This file says *what to do and in what order*.
**Final deadline:** Tue **5 Jan 2027, 11:59 PM PST** (= Wed 6 Jan 2027, 07:59 UTC = 08:59 AM Lagos). Aim to submit by **3 Jan 2027**.

---

## How to use this file (for anyone, including non-developers)

1. Work from top to bottom. Do not skip a phase unless it says "optional".
2. When a step is finished, change `[ ]` to `[x]` and add a line to the **Progress log** at the bottom (date, who, what).
3. Keep the **Project facts** block filled in. **Never write secrets in this file** (no API keys, wallet seeds, passphrases, passwords).
4. Legend:
   - 👤 = a human must do this (clicking in a website, signing in, deciding)
   - 🤖 = an AI assistant can do this (writing code, files, text)
   - 🔒 = involves a secret. Handle only on your own computer or server settings. Never paste into chat.

### Prompt to give ANY AI assistant (Claude, ChatGPT, Cursor, Claude Code, etc.)
```
Read PI_NETWORK_DEV_GUIDE.md and PI_BUILD_ROADMAP.md in this project.
Find the first unchecked [ ] step in the roadmap and help me complete it.
Follow the rules in the guide (section 0). Never ask me for API keys, seeds or passphrases.
When a step is done, tell me exactly which line to tick and what to write in the Progress log.
```

---

## Project facts (fill in as you go; NO secrets)

| Item | Value |
|---|---|
| App name (English) | |
| One-sentence idea | |
| Who it is for | |
| Daily-use loop (why users come back) | |
| Team members + Pi usernames | Opeyemi (@oppassky), |
| Who submits the final app (only ONE person) | |
| Prize split agreed (date, written where) | |
| GitHub repo URL | |
| Staging (Testnet) app ID | |
| Production (Mainnet) app ID | |
| Hosting URL (Vercel etc.) | |
| `pi_url` (https://....pinet.com) | |
| Demo video URL | |

---

## Overall status

| Phase | Name | Target date | Status |
|---|---|---|---|
| 0 | Team and decisions | by 24 Nov | Not started |
| 1 | Accounts and early approvals | by 27 Nov | Not started |
| 2 | Register the Staging app in the console | by 28 Nov | Not started |
| 3 | Project setup (code on your computer, GitHub) | by 1 Dec | Not started |
| 4 | Pi sign-in works | by 5 Dec | Not started |
| 5 | Test sign-in in the Pi Sandbox | by 6 Dec | Not started |
| 6 | Core feature and Pi payments | by 15 Dec | Not started |
| 7 | Hackathon must-haves (privacy policy, logo, etc.) | by 18 Dec | Not started |
| 8 | Deploy and verify the domain | by 20 Dec | Not started |
| 9 | Production (Mainnet) app and listing | by 29 Dec | Not started |
| 10 | Midpoint submission (optional) | date emailed by Pi | Not started |
| 11 | Demo video and final submission | submit by 3 Jan | Not started |

(Update the Status column to: Not started / In progress / Done.)

---

## Phase 0: Team and decisions

- [ ] 👤 Choose ONE app idea and write it in "Project facts" above. Keep it small: one clear daily-use loop.
- [ ] 👤 Decide team roles (suggested: lead developer, UI/UX designer, community/growth person).
- [ ] 👤 **Agree the prize split in writing** before building (message, doc or email). Note where in "Project facts".
- [ ] 👤 Decide who is the single person who will submit.
- [ ] 👤 Set up a team chat (WhatsApp/Discord) and a weekly check-in.

**Done when:** idea, roles, prize split and submitter are all written down.

---

## Phase 1: Accounts and early approvals

Do these early. Some take days or weeks.

- [ ] 👤 Everyone: install the **Pi app**, create an account, install **Pi Browser** and sign in.
- [ ] 👤 Everyone: **verify your email** in the Pi app (menu, Profile). Needed before registering apps.
- [ ] 👤 Everyone: start/continue **Pi KYC** in the Pi app. The Mainnet listing requires the developer to complete KYC. (Pi invites you when eligible; keep mining/using the app.)
- [ ] 👤 Open https://developers.minepi.com **on a computer** and sign in with Pi (signing in from Pi Browser on a phone is not supported).
- [ ] 👤 Everyone: open the **Hackathon** tab and **Register for Pi Next**. Anyone who doesn't register cannot win prizes.
- [ ] 👤 Create free accounts: **GitHub** and **Vercel** (or another host).
- [ ] 👤 Join the Pi developer community (Discord via the Brainstorm app in Pi Browser: `brainstorm.pinet.com`) to ask questions.

**Done when:** every teammate has registered for Pi Next and the lead can sign in to the console on a computer.

---

## Phase 2: Register the Staging (Testnet) app in the console

Staging = practice mode with fake "Test Pi". The network **cannot be changed later**, so register Staging first for development.

- [ ] 👤 In the console, open **My apps** and create a new app: App Name, Description, network = **Staging (Testnet)**.
- [ ] 👤 Set the **development URL** to `http://localhost:3000` (or your dev server address).
- [ ] 👤🔒 In the app **Settings**, generate the **Server API Key**. Copy it into your own `.env` file (next phase). Never paste it in chat, GitHub or the frontend.
- [ ] 👤🔒 Set up the **app wallet** (the console shows a wallet setup page). Save any secret it gives you safely. It cannot be recovered.
- [ ] 👤 Write the Staging app ID in "Project facts".

**Done when:** the app appears in My apps, with an API key generated and the wallet set up.

---

## Phase 3: Project setup (code on your computer and GitHub)

- [ ] 🤖 Create the project (suggested: Next.js + TypeScript, or Express + plain JS as in the guide, section 4).
- [ ] 🤖 Add `.env` (with `PI_API_KEY=...` or `PI_NETWORK_API_KEY=...`, choose one name) and add `.env` to `.gitignore` **before the first commit**.
- [ ] 🤖 Add the Pi SDK script tag in the page head: `<script src="https://sdk.minepi.com/pi-sdk.js"></script>`.
- [ ] 🤖 Add embed headers for the Sandbox: no `X-Frame-Options`, CSP `frame-ancestors 'self' https://*.pinet.com https://*.minepi.com`, `connect-src 'self' https://socialchain.app` (guide, section 20.5).
- [ ] 👤 Run it locally (`npm install`, `npm run dev`) and confirm the page opens at `http://localhost:3000`.
- [ ] 👤 Create a GitHub repo, push the code, and write the repo URL in "Project facts".
- [ ] 👤 (Optional) Open the repo in GitHub Codespaces for editing. Do Sandbox testing on your own computer if Codespaces gives trouble.

**Done when:** the project runs locally, is on GitHub, and no secret is in the repo (check `.env` is ignored).

---

## Phase 4: Pi sign-in works (code)

- [ ] 🤖 Call `Pi.init({ version: "2.0", sandbox: true })` before other Pi calls.
- [ ] 🤖 Add a "Sign in with Pi" button using `Pi.authenticate(['username','payments'], onIncompletePayment)`.
- [ ] 🤖 Send the `accessToken` to your backend. Backend calls `GET https://api.minepi.com/v2/me` (Bearer token) and uses only that `uid`.
- [ ] 🤖 Create your own session keyed on the verified `uid`. Use `Authorization: Bearer` headers rather than cookies (iOS Pi Browser blocks cookies).
- [ ] 🤖 Do **not** force Pi sign-in on first page load (needed for PiNet: visitors must be able to browse first).

**Done when:** the code is written and the backend rejects a fake token with 401.

---

## Phase 5: Test sign-in in the Pi Sandbox

- [ ] 👤 Run the app locally. In the console go to **Sandbox** and open the Sandbox link for your app.
- [ ] 👤 The Sandbox shows an authorization code. In the Pi app: **Pi Utilities**, **Authorize Sandbox**, enter the code.
- [ ] 👤 Click "Sign in with Pi" inside the Sandbox and confirm your Pi username appears.
- [ ] 👤 If the page is blank, check the embed headers (Phase 3) and that the development URL matches your running server.

**Done when:** you can sign in with Pi in the Sandbox and see your username.

---

## Phase 6: Core feature and Pi payments

- [ ] 🤖 Build the **core feature** of your idea (the daily-use loop). Keep scope small.
- [ ] 🤖 Add a payment button: `Pi.createPayment({amount, memo, metadata}, callbacks)`.
- [ ] 🤖 Backend route `/api/payments/approve`: check the order/price in your database, then call Pi `POST /v2/payments/{id}/approve` with `Authorization: Key <API key>`.
- [ ] 🤖 Backend route `/api/payments/complete`: call Pi `POST /v2/payments/{id}/complete` with `{txid}`. Deliver the feature **only if this succeeds**. Make it safe to run twice (idempotent).
- [ ] 🤖 Handle incomplete payments at login (`onIncompletePayment`).
- [ ] 👤 Before testing: confirm the **app wallet** is set up (payments fail with "App Wallet Misconfigured" otherwise).
- [ ] 👤 In the Sandbox, do **one full test payment** using Test Pi (approve and complete).
- [ ] 🤖 (Optional) Rewarded/interstitial ads, notifications. Ads need Pi approval, so don't rely on them.

**Done when:** a full test payment completes in the Sandbox and the feature unlocks only after completion.

---

## Phase 7: Hackathon must-haves

Every app must have all of these.

- [ ] 👤🤖 **English app name** (no "pi" at the start of the domain; don't use Pi's logo/colors).
- [ ] 👤🤖 **Accurate English description**.
- [ ] 👤🤖 **Logo** (1024x1024 PNG/JPG) that follows Pi's trademark guidelines.
- [ ] 👤 **Preview images** (screenshots of the real app interface).
- [ ] 🤖 **Privacy policy** page (say what data you collect; collect only what is needed, no emails/phones unless essential).
- [ ] 🤖 **PiNet-friendly design**: public pages work without Pi sign-in; Pi sign-in only for actions like paying or posting.
- [ ] 🤖 Check the Mainnet rules: Pi login only (no email/Google login), Pi-only payments (no fiat/other tokens), no links that send users to outside sites, minimal data.
- [ ] 👤 Mobile check: open the app on a phone-sized screen. Most Pi users are on phones.

**Done when:** all items above exist and are visible in the app or repo.

---

## Phase 8: Deploy and verify the domain

- [ ] 👤🤖 Deploy to Vercel (or another host) on a public **HTTPS** address (not localhost). Add the `.env` secrets in the host's settings (not in code).
- [ ] 🤖 Set `Pi.init({ version: "2.0", sandbox: false })` for production.
- [ ] 👤 In the console, set the app's **frontend/production URL** to the public address. **Do not** replace the local development URL with it.
- [ ] 👤 Start **domain verification**. The console gives a validation key. Save it as plain text in `public/validation-key.txt` so it opens at `https://yourdomain/validation-key.txt`. Redeploy and click Verify.
- [ ] 👤 When verified, open your **`pi_url`** (`https://...pinet.com`) in **Pi Browser on your phone** and test the app there.
- [ ] 👤 Write the hosting URL and `pi_url` in "Project facts".

**Done when:** domain is verified and the app works inside Pi Browser.

---

## Phase 9: Production (Mainnet) app and listing

Staging apps cannot be listed. The hackathon accepts Mainnet apps, so you need a Production app too.

- [ ] 👤 Confirm with hackathon support/Discord what they accept (Mainnet only? Is a PiNet subdomain needed before listing?).
- [ ] 👤 Create a **Production (Mainnet)** app in the console. Use a **different domain** from the Staging app.
- [ ] 👤🔒 Apply for the **Incoming Multisig Wallet** (needed for user-to-app payments). Pi Core Team review can take time. Connect it once approved.
- [ ] 👤🔒 Generate the Production API key and add it to the production host's settings.
- [ ] 👤 Verify the Production domain (same validation-key steps).
- [ ] 👤 Complete **KYC** (needed before listing).
- [ ] 👤 On a **computer**, open the app's **Listing** page: subtitle, screenshots, category, language, logo. Submit for Pi's review.
- [ ] 👤 (If eligible) register the **PiNet subdomain** in the app checklist.
- [ ] 👤 Do one real, small test payment in Pi Browser on the Production app.

**Done when:** the Production app is verified, wallet approved, and listing submitted.

---

## Phase 10: Midpoint submission (optional but recommended)

- [ ] 👤 Watch your email (registered with Pi Next) for midpoint instructions and date.
- [ ] 👤 Submit what you have for feedback and extra visibility.
- [ ] 👤 Note the feedback here and fix it:
  - Feedback:

---

## Phase 11: Demo video and final submission

- [ ] 👤 Record a demo video, **3 minutes or less**, covering: what the app is, a walkthrough of features, who it is for, the problem it solves, and how Pi is used (sign-in/payments).
- [ ] 👤 Upload it publicly (YouTube etc.) and put the link in "Project facts".
- [ ] 👤 Final test: fresh sign-in, a payment, and the privacy policy link all work in Pi Browser.
- [ ] 👤 Check every teammate is registered and listed.
- [ ] 👤 The ONE designated person submits in the console (Developer Web Console, Hackathon) with: app(s), demo video link, team members.
- [ ] 👤 Submit **early** (by 3 Jan), not at 11:59 PM on the last day.

**Done when:** the console shows your submission as received.

---

## Rules for AI assistants working on this project

1. Read `PI_NETWORK_DEV_GUIDE.md` first, especially section 0 (rules) and section 16 (common mistakes).
2. Continue from the first unchecked `[ ]` step. Do not repeat completed steps.
3. Never ask for, store, print or commit: Server API Key, wallet seed/passphrase, validation key, Pi access tokens, passwords.
4. Put secrets only in `.env` (git-ignored) or the host's secret settings.
5. Tell the human exactly what they must click, and where, for 👤 steps.
6. After finishing a step, state which checkbox to tick and propose the Progress log line.
7. If the docs and the live console disagree, trust the live console and note the difference in the log.

---

## Glossary (plain language)

- **Pi Browser**: a phone browser made by Pi Network. Pi apps run inside it.
- **Pioneer**: a Pi user.
- **SDK**: a small script from Pi that lets your website talk to Pi (sign-in, payments).
- **Backend / server**: the private part of your app (hidden from users) that talks to Pi using secret keys.
- **API key**: a secret password for your server to talk to Pi. Keep it private.
- **Testnet / Staging**: practice mode with fake "Test Pi".
- **Mainnet / Production**: real mode with real Pi.
- **Sandbox**: a Pi test page that runs your local app like Pi Browser, using Test Pi.
- **Wallet (app wallet)**: where your app receives Pi.
- **KYC**: identity verification.
- **PiNet**: lets people open parts of your app in a normal browser (Chrome) without Pi Browser.
- **Validation key**: a small text file you host to prove you own your website.
- **Idempotent**: safe to run twice without double-charging or double-delivering.

---

## Progress log (add newest at the bottom)

| Date | Who | What was done | Phase/Step |
|---|---|---|---|
| 21 Nov 2026 | Opeyemi | Signed in to Pi Developers console on computer; read docs; created guide and roadmap files | Phase 1 (partly) |
| 26 Nov 2026 | Opeyemi + Claude | Generated HumanSays repo scaffold (structure, config, API stubs, migration, docs, AI rules). Not yet installed/built | Phase 3 (partly) |
|  |  |  |  |
