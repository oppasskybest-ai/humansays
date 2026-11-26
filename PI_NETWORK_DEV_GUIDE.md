# Pi Network Developer Guide (Project Reference)

> Compiled from the official Pi Developers docs (`developers.minepi.com/docs`) and the Pi Next hackathon page, on 21 Nov 2026.
> Keep this file in the repo root. If you use an AI coding agent (Claude Code, Cursor), tell it to read this file first.
> Docs change. When something fails, re-check the live docs: https://developers.minepi.com/docs/

---

## 0. Rules for humans and AI agents (read first)

1. A Pi app = **web app + backend**. Both halves are required. The frontend only *starts* flows; the backend verifies users and settles payments.
2. Load the SDK with a script tag in **every** environment, including production. The Pi Browser does **not** inject `window.Pi`.
   `<script src="https://sdk.minepi.com/pi-sdk.js"></script>`
3. Call `Pi.init({ version: "2.0", sandbox: true })` before any other SDK call. Use `sandbox: false` in production.
4. Do not use a wrapper library instead of the SDK. Always call `Pi.authenticate()`; do not invent another auth path.
5. **Never trust** the `user` object or `accessToken` from the client. Send `accessToken` to your backend and verify with `GET https://api.minepi.com/v2/me` (`Authorization: Bearer <accessToken>`). Use only the `uid` returned by `/me`.
6. Use **two** auth schemes correctly:
   - `Authorization: Bearer <user accessToken>` for user endpoints like `/me`.
   - `Authorization: Key <PI_API_KEY>` for server-only endpoints (approve/complete payments, ads status, notifications). Mixing them up is the most common cause of 401s.
7. The **Server API Key** and any wallet **secret seed / passphrase** live only in server environment variables. Never in frontend code, git, logs, URLs or chat.
8. Payments need a **server-side handshake**: approve, then complete. Deliver the purchased feature **only after** `/complete` returns 200.
9. Approve/complete routes are retried (about every 10 s), so make them **idempotent**.
10. Rewarded ads: verify `adId` on the server and reward only if `mediator_ack_status === "granted"`.
11. Mainnet-listing rules: Pi authentication only, Pi-only transactions, no external redirects, minimal data collection, no "pi" at the start of your domain, no Pi logo/colors misuse (see section 14).
12. For the Pi Sandbox, the app must be embeddable: **no `X-Frame-Options` header**, and CSP `frame-ancestors 'self' https://*.pinet.com https://*.minepi.com` (section 20.4).
13. iOS Pi Browser treats app iFrames as third-party, so **cookies and session storage can be blocked**. Prefer `Authorization: Bearer` token headers over cookie sessions.

---

## 1. Architecture

```
App Frontend (browser, Pi SDK)  <-->  App Backend (your server)  <-->  Pi Platform API (api.minepi.com/v2)
        |                                                                      |
        +---- Pioneer confirms payment in Pi Wallet UI --> Pi Blockchain ------+
```

- **Frontend**: loads the SDK; `Pi.init()`, `Pi.authenticate()`, `Pi.createPayment()`.
- **Backend**: verifies identity via `GET /v2/me`; approves/completes payments via the Platform API using the Server API Key.
- A Pi app is a web app that runs inside the **Pi Browser**. Any framework works (React, Next.js, etc.).
- Reference demo app (open source): https://github.com/pi-apps/demo ("Pi Bakery", testnet demo).

---

## 2. Accounts and registration

### 2.1 Set up your accounts
1. Install the **Pi app** (Google Play / App Store) and register (a referral code is optional).
2. Install **Pi Browser** and sign in.
3. **Verify your email address** (required before registering apps): Pi app, menu (hamburger), Profile, confirm email.

### 2.2 Developer Portal
- The docs say the Developer Portal is opened in Pi Browser at `pi://develop.pinet.com` (older docs also say `pi://develop.pi`, `develop.pinet.com`). There is also a **web console**: `https://developers.minepi.com/devconsole` (tabs: Agents, Docs, Sandbox, My apps).
- Observed: signing in to the web console **from Pi Browser on a phone is not supported**. Open it on a **computer**.
- Never type your Pi wallet passphrase into any website.

### 2.3 Register an app
Required fields: **App Name**, **Description**, **App Network** (Pi Mainnet or Pi Testnet).
- **App Network cannot be changed after registration.** Register two apps: one Testnet for development, one Mainnet for production.
- Registering gives you: an app record, a **Server API Key**, and an **app wallet** to receive Pi payments.
- Set a **Development URL** (e.g. `http://localhost:3000`). Pi maps it to a Sandbox URL.
- From the app dashboard tap **API Key** to generate the Server API Key. Keep it on the server only.
- Create the **app wallet**; store its private key securely (cannot be recovered).
- Testnet apps show a black-and-yellow stripe at the top in Pi Browser.
- Legacy projects created before 26/07/2022 point at Testnet and cannot be changed. Create new projects.
- If no team member has a Mainnet wallet, contact Pi Core Team via the Pi Support Portal ("Pi Mainnet SDK Wallet").

---

## 3. Environments and URLs

| URL | Meaning |
|---|---|
| Localhost | e.g. `http://localhost:3000`. Your dev machine. |
| Hosted URL | Where your deployed app lives (Vercel, AWS...). Basis of the App URL. |
| Sandbox URL | `https://sandbox.minepi.com`. Pi-provided; maps your localhost to Pi Testnet for desktop testing. |
| App URL | Final `https://` URL Pioneers open in Pi Browser. Must follow Pi trademark rules. |

### 3.1 Sandbox (desktop development)
1. `Pi.init({ version: "2.0", sandbox: true })`.
2. Configure the **Development URL** in the portal. The Sandbox URL appears under "Run Development App in the Sandbox" in the app checklist.
3. Open the sandbox URL in a desktop browser. It shows an **authorization code**. In the Pi app go to **Pi Utilities**, bottom of screen, **Authorize Sandbox**, enter the code.
4. Tip: set the flag from env, e.g. `sandbox: process.env.NODE_ENV !== 'production'`.
5. Complete one full payment in the Sandbox before deploying.

### 3.2 Production app access
1. Set `Pi.init({ version: "2.0", sandbox: false })` (leaving sandbox on breaks real auth and payments).
2. Deploy; enter the **Production URL** in the portal (`https://`, trademark compliant).
3. **Validate domain ownership**: place the portal's validation key in `validation-key.txt` at the domain root (`https://yourapp.com/validation-key.txt`) and trigger verification. Keep the file in place permanently.
4. Run a real **User-to-App payment** in Pi Browser at the production URL to confirm frontend, backend, API key and app wallet are wired.

### 3.3 Pi Browser constraints
- `.pi` domains are Web3 DNS; not resolved by Chrome/Safari etc.
- The native Pi Wallet only works inside Pi Browser.
- **iOS**: third-party cookies/session tokens are disabled by default for iFrame-loaded apps. Use header tokens.
- **Enclosed Mainnet firewall**: apps in the browser can only talk to whitelisted blockchain APIs. No connectivity to other blockchains/exchanges. Call third-party services (e.g. the Claude API) from **your backend**, not from the browser.
- Works outside Pi Browser: normal web browsing; public Mainnet ledger viewing; hosting your dApp logic on non-Pi domains/servers.

---

## 4. Reference implementation (Express + plain JS)

```
my-pi-app/
  public/index.html
  public/app.js
  server.js
  .env            # PI_API_KEY=your_key_here  (never commit)
```

```bash
npm init -y && npm install express
node --env-file=.env server.js
```

### server.js
```js
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const PI_API_BASE = 'https://api.minepi.com/v2';
const PI_API_KEY = process.env.PI_API_KEY;

// Verify user (Bearer token from Pi.authenticate)
app.post('/api/verify', async (req, res) => {
  const accessToken = req.headers.authorization?.replace('Bearer ', '');
  const piRes = await fetch(`${PI_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!piRes.ok) return res.status(401).json({ error: 'Unauthorized' });
  const user = await piRes.json();
  // create your own session/JWT for user.uid here
  res.json({ uid: user.uid, username: user.username });
});

app.post('/api/payments/approve', async (req, res) => {
  const { paymentId } = req.body;
  // Confirm order + price in your DB before approving.
  const approval = await fetch(`${PI_API_BASE}/payments/${paymentId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Key ${PI_API_KEY}` },
  });
  res.status(approval.status).json(await approval.json());
});

app.post('/api/payments/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  const completion = await fetch(`${PI_API_BASE}/payments/${paymentId}/complete`, {
    method: 'POST',
    headers: { Authorization: `Key ${PI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ txid }),
  });
  const data = await completion.json();
  if (completion.ok) {
    // Deliver the purchased feature here, ONCE, guarded by payment state in your DB.
  }
  res.status(completion.status).json(data);
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
```

### public/index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Pi App</title>
    <script src="https://sdk.minepi.com/pi-sdk.js"></script>
  </head>
  <body>
    <button id="login">Sign in with Pi</button>
    <button id="pay" disabled>Pay 1 Pi</button>
    <p id="status"></p>
    <script src="/app.js"></script>
  </body>
</html>
```

### public/app.js
```js
Pi.init({ version: "2.0", sandbox: true }); // sandbox:false in production

let accessToken = null;

document.getElementById('login').onclick = async () => {
  try {
    const auth = await window.Pi.authenticate(['username', 'payments'], onIncompletePayment);
    accessToken = auth.accessToken;
    await verifyOnServer(accessToken);
    document.getElementById('status').innerText = `Hello, ${auth.user.username}`;
    document.getElementById('pay').disabled = false;
  } catch (err) { console.error('Auth failed', err); }
};

async function verifyOnServer(token) {
  const res = await fetch('/api/verify', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Server could not verify this user');
  return res.json();
}

// Fires DURING authenticate(), so accessToken is still null here.
// Authorize on the server by looking the payment up (GET /payments/{id}) with the Server API Key
// and confirming it belongs to your app, then complete it.
function onIncompletePayment(payment) {
  return fetch('/api/payments/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction?.txid }),
  });
}

document.getElementById('pay').onclick = () => {
  window.Pi.createPayment(
    { amount: 1, memo: 'Unlock Premium', metadata: { feature: 'premium' } },
    {
      onReadyForServerApproval: async (paymentId) => {
        await fetch('/api/payments/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ paymentId }),
        });
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        const res = await fetch('/api/payments/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ paymentId, txid }),
        });
        if (res.ok) document.getElementById('status').innerText = 'Payment complete';
      },
      onCancel: (paymentId) => console.log('Cancelled:', paymentId),
      onError: (error, payment) => console.error('Payment error:', error, payment),
    }
  );
};
```

---

## 5. Client SDK reference (`window.Pi`)

The client SDK starts user flows. Your backend verifies identity, approves/completes payments, verifies rewarded ads, and protects the Server API Key.

### 5.1 `Pi.init(config)`
- `version` (string, required): `"2.0"`.
- `sandbox` (boolean, optional): `true` for sandbox.
- Must run before any other SDK call, on every page that uses the SDK.

### 5.2 `Pi.authenticate(scopes, onIncompletePaymentFound): Promise<AuthResult>`
```ts
type AuthResult = { accessToken: string; user: { uid: string; username: string } };
```
| Scope | Gives |
|---|---|
| `username` | user's Pi username |
| `payments` | needed to make payments with the user |
| `wallet_address` | user's wallet address |
| `in_app_notifications` | lets your server send in-app notifications (listed in docs text; the `Scope` type in the SDK reference lists only the first three) |

- `uid` is app-local: specific to this user **and this app**; it changes if the user revokes permissions.
- Request only the scopes you use. Ask for `payments` only if you charge users.
- `onIncompletePaymentFound(payment)` is called when a submitted-but-not-completed payment exists. You must complete it (send to server) before a new payment can be requested.
- Wrap in `try/catch`; a user cancelling will reject.

### 5.3 `Pi.createPayment(paymentData, callbacks): void`
```ts
type PaymentData = { amount: number; memo: string; metadata: Object };
type PaymentCallbacks = {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: PaymentDTO) => void;
};
```
- `memo`: shown to the user on the confirmation screen. `metadata`: any object for your own bookkeeping (not read by Pi).
- Concurrent payments: if an open payment exists and the user has not yet made the blockchain tx, it is cancelled; if they already did, the new one is rejected (`onError`) and `onIncompletePaymentFound` fires.
- `onReadyForServerApproval` / `onReadyForServerCompletion` are retried about every 10 s until their timer ends.

### 5.4 Types
```ts
type PaymentDTO = {
  identifier: string; user_uid: string; amount: number; memo: string; metadata: Object;
  from_address: string; to_address: string;
  direction: "user_to_app" | "app_to_user";
  created_at: string;
  network: "Pi Network" | "Pi Testnet";
  status: { developer_approved: boolean; transaction_verified: boolean; developer_completed: boolean;
            cancelled: boolean; user_cancelled: boolean };
  transaction: null | { txid: string; verified: boolean; _link: string };
};
type Scope = "username" | "payments" | "wallet_address";
type NativeFeature = "inline_media" | "request_permission" | "ad_network";
```

### 5.5 Other SDK methods
- `Pi.nativeFeaturesList(): Promise<NativeFeature[]>`: detect Pi Browser feature support (e.g. `ad_network`).
- `Pi.openShareDialog(title, message)`: native OS share dialog.
- `Pi.openUrlInSystemBrowser(url): Promise<void>`: errors: `"Failed to open URL"`, `"No minimal requirements"` (old Pi Browser, ask user to update), `"Unexpected error"`.
- Utilities listed in docs (no signatures given): `Pi.openConversation(conversationId)`, `Pi.requestPermission(permissionName)`, `Pi.copyText(text)`. Full list: https://github.com/pi-apps/pi-platform-docs
- `Pi.Wallet.*`: wallet/blockchain operations in Pi Browser. Call only after authentication. Transactions must be **pre-signed XDR** (the SDK does not build/sign). The docs page's method list is empty; check the GitHub platform docs.
- `Pi.signIn({...})`: OAuth helper for normal browsers (section 11).
- `Pi.SmartContract.Subscription.*`: subscriptions, testnet only (section 9).

---

## 6. Authentication

### 6.1 Flow
1. Include SDK, `Pi.init`.
2. On login click: `Pi.authenticate(['username','payments'], onIncompletePayment)`.
3. Send `accessToken` to backend immediately.
4. Backend: `GET https://api.minepi.com/v2/me` with `Authorization: Bearer <accessToken>`. 401 means invalid/forged token.
5. Backend creates its own session/JWT keyed on the **verified** `uid`.

### 6.2 Access token facts
- The token is dynamic and changes at set intervals; **do not store it** or use it to create records. Store records by verified `uid`.
- `uid` and `user` from the client are for **display only**.
- No sign-in screen is needed in your app: every visit calls `authenticate`, the token is verified, and the `uid` finds the user's record. Show a loading screen until verified.

### 6.3 PiService wrapper pattern
```js
class PiService {
  constructor() { this.user = null; }
  async login(scopes = ['username']) {
    try {
      const auth = await window.Pi.authenticate(scopes, this.onIncompletePaymentFound);
      this.user = auth.user;
      return { success: true, accessToken: auth.accessToken, user: auth.user };
    } catch (error) { return { success: false, error: error.message }; }
  }
  onIncompletePaymentFound(payment) { /* send payment.identifier to backend to complete */ }
}
export const piService = new PiService();
```

---

## 7. Payments

### 7.1 Two directions
- **U2A** (User-to-App): `Pi.createPayment` on frontend + backend approve/complete.
- **A2U** (App-to-User): backend creates payment to a user (payouts/rewards). **Testnet only** (plus selected Mainnet apps).

### 7.2 U2A flow (3 phases)
1. **Create + approve**: `Pi.createPayment` -> `onReadyForServerApproval(paymentId)` -> frontend sends `paymentId` to backend -> backend `POST /v2/payments/{id}/approve` (Key auth). Payment UI is not interactive until approved.
2. **User + blockchain**: user confirms/signs in Pi Wallet; tx submitted to blockchain. Nothing for you to do.
3. **Complete**: `onReadyForServerCompletion(paymentId, txid)` -> frontend sends both to backend -> backend `POST /v2/payments/{id}/complete` body `{ "txid": "..." }` -> flow closes. Then deliver the feature.

**Security**: never mark a payment complete/paid unless `/complete` returned success. A hacked SDK can fake a payment on the client.

### 7.3 Rules
- Callback URLs on the frontend must match the routes your backend exposes (typo/mismatch = 404 = stuck payment).
- Always handle incomplete payments during authentication.
- Include `Authorization: Bearer ${accessToken}` on authenticated backend calls (except the incomplete-payment path during authenticate, where no token exists yet; authorize via `GET /payments/{id}` + Key).
- Make `/approve` and `/complete` idempotent; guard delivery on payment state in your DB.
- Check order and price in your DB before approving.

### 7.4 A2U (testnet)
- Backend SDKs: `pi-nodejs` (official), `pi-ruby` (official); Python/PHP community (TBD).
- Flow: backend creates payment (`POST /payments` with `uid`), checks user wallet, builds and signs the tx locally with the app wallet secret seed, broadcasts. Benefits: user privacy (wallet only accessed when sending), accurate wallet, recovery from server faults (avoids double payments), shows as from your app in user's wallet.
- Outgoing wallet application needed for Mainnet A2U.

### 7.5 Metadata
Optional arbitrary JSON object attached to a payment; stored by the Pi platform (not on-chain); returned in `PaymentDTO`. Use it to link payments to orders/users. Pi does not interpret it.

### 7.6 Pi Wallet (users)
- Non-custodial; secret key derived from a passphrase (24 words). Pi never has it. Biometrics can store it on the phone.
- Testnet/Mainnet switch via dropdown in the wallet. Same wallet for both.
- Mainnet wallet needs Pi KYC. Testnet faucet gives 100 Test-Pi (no value, may be reset).
- Developer wallet feature "coming soon" on that page; see section 13 for current app wallet process.

---

## 8. Platform API (server-side, base `https://api.minepi.com/v2`)

| Purpose | Endpoint | Auth |
|---|---|---|
| Verify user | `GET /me` | Bearer user token |
| Get payment | `GET /payments/{payment_id}` | Key |
| Approve (U2A) | `POST /payments/{payment_id}/approve` | Key |
| Complete | `POST /payments/{payment_id}/complete` body `{txid}` | Key |
| Cancel | `POST /payments/{payment_id}/cancel` | Key |
| Create A2U payment | `POST /payments` body `{payment:{amount,memo,metadata,uid}}` | Key |
| Incomplete server payments | `GET /payments/incomplete_server_payments` | Key |
| Verify rewarded ad | `GET /ads_network/status/:adId` | Key |
| Send notifications | `POST /in_app_notifications/notify` | Key |

- Versioning: currently v2; breaking changes are normally released as new majors, but may occur without notice for security/privacy fixes.
- Bearer endpoints can be called from frontend or backend. Key endpoints: **backend only**.

### 8.1 DTOs
```ts
UserDTO { uid: string; credentials: { scopes: Scope[]; valid_until: { timestamp: number; iso8601: string } }; username?: string /* needs username scope */ }
RewardedAdStatusDTO { identifier: string; mediator_ack_status: "granted"|"revoked"|"failed"|null;
                      mediator_granted_at: string|null; mediator_revoked_at: string|null }
```
`PaymentDTO`: see section 5.4.

### 8.2 In-app notifications
- User must have granted the `in_app_notifications` scope via `Pi.authenticate`.
- Body: `{ notifications: [{ title, body, user_uid, subroute /* starts with "/" */ }] }`.
- Limits: 256 per request; 48 per user per 24 h per app.
- Delivery is best effort (skipped if user hasn't consented/disabled). Statuses: 201, 400 (too many), 403 (quota), 422 (invalid), 500. Error shape `{ "error": "string" }`.

---

## 9. Subscriptions (TESTNET ONLY, contract v1)

- Not available on Mainnet yet; v1 will be replaced (new contract address, re-register services, re-subscribe).
- No `Pi.createPayment`, no approve/complete. Rules live in the Subscription smart contract. User approves once in Pi Wallet; the merchant collects renewals by calling `process`.
- Init: `await Pi.init({ version: "2.0" })` (contract preconfigured for Testnet). Auth with `payments` scope.
- Amounts in **stroops**: 1 Pi = 10,000,000. Pass as strings/BigInt. Times in seconds. Portal month = 2,629,746 s; week = 604,800 s.
- Max billing period ~180 days; an approval lasts just under 180 days regardless of periods count. Use `periods` = 5 (monthly) or 25 (weekly).
- Register services in the **Developer Portal** (app, Subscription Services, Register New Service), not via SDK `registerService`, so the plan links to your app in Pi Wallet. Trial 0 to 90 days.
- `Pi.authenticate` does not return the wallet address; ask the user to enter their `G...` address and **verify ownership on your backend** (look up the subscribe tx hash on Testnet, check source account, contract, service) before unlocking anything.

### 9.1 Modes
`{ mode: "simulate" }` (no signature, no fee; reads default to this) vs `{ mode: "submit" }` (opens Pi Wallet; writes default to this). Simulate writes first to catch errors.

### 9.2 Wait for transactions
```js
async function waitForTransaction(submitted) {
  const result = await Pi.SmartContract.pollTransaction(submitted.hash); // up to 10 checks
  if (result.status === "SUCCESS") return result;
  if (result.status === "FAILED") throw new Error(`Transaction ${submitted.hash} failed`);
  throw new Error(`Transaction ${submitted.hash} not confirmed yet`); // NOT_FOUND = pending, not failed
}
```

### 9.3 Core methods
```js
// Subscriber
Pi.SmartContract.Subscription.subscribe(subscriber, serviceId, autoRenew, periods, options?)
// Merchant
Pi.SmartContract.Subscription.process(merchant, serviceId, offset, limit, options?)
```
```js
const APPROVAL_SECS = 180 * 86_400;
function periodsFor(service) {
  const fit = Math.floor((APPROVAL_SECS - 1 - Number(service.trial_period_secs)) / Number(service.period_secs));
  return String(Math.max(1, fit));
}
```
- First period is charged at subscribe unless a free trial applies (trial only on a user's first subscription to a service).
- `subscribe` fails with `AlreadySubscribed` if one is still renewing or within its paid period.
- `process` must run **at least once per billing period** (renewal can only be collected up to one period late, else auto-renew is turned off). Batch with `offset`/`limit` (e.g. 20); result `{ charged, failed, skipped, total }`.
- Collect from the Pi Browser (manual, merchant wallet passphrase each time) or from your **server** (automatic).

### 9.4 Server-side `process` (Node.js 20+, package `pi-backend@next`)
```js
import { SmartContract, PiSubscriptionError } from "pi-backend";
const merchantSecret = process.env.PI_MERCHANT_SECRET; // S... secret seed, server only
const preview = await SmartContract.Subscription.process(merchantSecret, serviceId, 0, 20, { mode: "simulate" });
for (let offset = 0; offset < preview.total; offset += 20) {
  const { txid, result } = await SmartContract.Subscription.process(merchantSecret, serviceId, offset, 20);
}
```
- Schedule with cron (e.g. `0 */12 * * *`). Process every service. Alert on errors.
- Do not process and send A2U payouts from the same wallet at the same moment (sequence number clash, `txBadSeq`).
- Keep only fee money in the merchant wallet (about 0.01 to 0.02 Pi per call on Testnet).
- Ruby: gem `pinetwork` `0.2.0.pre.1`.
- Server error codes: `invalid_*` args, `account_not_found`, `simulation_failed` (e.g. `NotServiceOwner`), `state_archived`, `fee_too_high`, `transaction_rejected` (`txInsufficientBalance`, `txBadSeq`, `TRY_AGAIN_LATER`), `transaction_failed`, `transaction_not_confirmed` (check txid before rerunning), `unexpected_response`, `rpc_error`.

### 9.5 Additional methods
Merchant: `registerService`, `getMerchantServices`, `getMerchantSubscriptions`.
Subscriber/anyone: `getService`, `isSubscriptionActive`, `getSubscriberSubscriptions`, `getSubscription`, `getSubscriptionReservation`, `extendSubscription`, `toggleAutoRenew`, `cancel`.
- `isSubscriptionActive`: also check from backend for valuable features (client can fake `true`).
- `cancel` only works while auto-renew is on (`AlreadyCancelled` otherwise). No refunds; access until period end.
- `extendSubscription` fails with `SubscriptionExpired` if the period ended.
- Contract errors: 1 InvalidPrice, 2 InvalidPeriod, 3 AlreadySubscribed, 4 SubscriptionNotFound, 5 ServiceNotFound, 6 Unauthorized, 7 AlreadyCancelled, 8 TimestampOverflow, 9 NotServiceOwner, 10 InvalidServiceName, 11 SubscriptionExpired, 12 ServiceNotActive.

---

## 10. Ads

- Types: **interstitial** (full-screen between content), **rewarded** (user must be authenticated; for a reward), **banner** (not in SDK; only "Loading Banner Ads" toggle in Developer Portal, Dev Ad Network, Settings; shown while app loads).
- Only apps **approved by the Pi Core Team** for the Developer Ad Network can be monetized. The application process page says "Coming soon".
- Check support: `(await Pi.nativeFeaturesList()).includes("ad_network")`. `"ADS_NOT_SUPPORTED"` means the user's Pi Browser is old; ask them to update.

```ts
Pi.Ads.showAd("interstitial" | "rewarded") // result: AD_CLOSED | AD_REWARDED | AD_DISPLAY_ERROR | AD_NETWORK_ERROR | AD_NOT_AVAILABLE | ADS_NOT_SUPPORTED | USER_UNAUTHENTICATED (+ adId for rewarded)
Pi.Ads.isAdReady(type)  // { type, ready }
Pi.Ads.requestAd(type)  // result: AD_LOADED | AD_FAILED_TO_LOAD | AD_NOT_AVAILABLE
```
```js
// Rewarded flow
const r = await Pi.Ads.showAd('rewarded');
if (r.result === 'AD_REWARDED' && r.adId) {
  const res = await fetch('/api/ads/reward', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ adId: r.adId }),
  });
  if ((await res.json()).rewarded) grantReward();
}
// Backend: GET /v2/ads_network/status/{adId} (Key auth); reward only if mediator_ack_status === "granted".
```
- If the app is not approved for the Ad Network, `adId` is missing: do not reward.
- Pi Browser auto-loads/reloads ads. Use `requestAd` only to retry manually.

---

## 11. Pi Sign-in (OAuth for normal browsers)

Lets a site outside Pi Browser offer "Sign in with Pi". User authenticates inside Pi Browser; your site gets a short-lived token. Server: `accounts.pinet.com` (OAuth 2.0, **implicit flow only**, `client_id` only, no secret/PKCE).

**Portal setup**
1. Set Your App's URL; verify the domain (`validation-key.txt`) under Checklist, App Domain. Without verification only loopback redirect URIs are allowed.
2. Enable Pi Sign-in; copy the public **oAuth Client ID**.
3. Register redirect URIs (full URIs, one per line, list replaced on save). Production: `https://` on your verified domain. Loopback (`localhost`, `127.0.0.1`, `[::1]`) allowed with `http://`. A URI becomes inert if its host stops being verified.

**Scopes**: `username` (default), `wallet_address`. `payments` is **not** available for Pi Sign-in.

**SDK way**
```js
Pi.init({ version: "2.0" });
const state = crypto.randomUUID();
sessionStorage.setItem("pi_oauth_state", state);
Pi.signIn({ clientId: "YOUR_CLIENT_ID", redirectUri: "https://yourapp.com/signin/callback",
            scopes: ["username"], state });
```

**Plain OAuth**: redirect to
`https://accounts.pinet.com/oauth/authorize?response_type=token&client_id=...&redirect_uri=...&scope=username%20wallet_address&state=...`

**Callback** (token in URL fragment, so read it in frontend JS):
`https://yourapp.com/signin/callback#access_token=...&token_type=Bearer&expires_in=3600&state=...`
Errors: `#error=access_denied | expired | cancelled | server_error`.
```js
const params = new URLSearchParams(window.location.hash.slice(1));
if (params.get("state") !== sessionStorage.getItem("pi_oauth_state")) throw new Error("State mismatch");
const me = await fetch("https://api.minepi.com/v2/me", {
  headers: { Authorization: `Bearer ${params.get("access_token")}` } }).then(r => r.json());
history.replaceState(null, "", window.location.pathname); // clear token from URL
```
- No refresh token; re-run sign-in on expiry. `uid` is app-specific and stable.

---

## 12. PiNet (use your app outside Pi Browser)

- Gives an app a public URL like `AppExample12345.pinet.com` (random 4-5 digits appended to prevent squatting) so **any browser** can view parts of it.
- Eligibility: the app must be **listed in the Ecosystem app**. Register a "PiNet Subdomain" in the app checklist; it must be a subdomain of your verified app domain and follow trademark rules.
- User flow: PiNet visitors can browse, but once your app calls `Pi.authenticate` (or anything needing the SDK) they are blocked and must switch to Pi Browser.
- **Design implication**: do **not** call `Pi.authenticate` on first load, and do not use a landing page that blocks non-Pi-Browser access. Let visitors browse public content first, require Pi only for actions (post, buy, etc.).
- `wallet.pinet.com` is the official web Pi Wallet (`wallet.pi` redirects). Always check the exact domain to avoid phishing.

---

## 13. Launching on Mainnet and listing requirements

### 13.1 Launch steps
1. Create a **new Mainnet app** in the portal and complete the app checklist.
2. Verify the app URL (cannot match a URL verified by another Pi app).
3. Generate an app wallet keypair ("Connect App Wallet"), then **apply for an Incoming Multisig Wallet** (for U2A payments). Pi Core Team review can take time; connect it once approved.
4. For A2U on Mainnet, apply for an **Outgoing Wallet** (testnet and selected mainnet apps only).

### 13.2 Mainnet listing requirements (Ecosystem directory)
- **Fully functional app, professional UI**.
- **KYC** completed by the developer before submitting for listing.
- **No trademark violations**: URL/domain must not start with "pi"; no Pi logo/colors/design elements. (`bananas.com` ok, `pibananas.com` not.)
- **Pi Authentication only**: no email or third-party logins.
- **Pi-only transactions**: no non-Pi tokens or fiat.
- **No redirects to external sites/apps/services** (case-by-case if truly necessary).
- **Limit data collection** to what the app needs (no emails/phones unless required).
- Don't act as a funnel to external platforms; keep users in the ecosystem.

---

## 14. Other native features

- **Public chat rooms**: only for apps listed in the Ecosystem; "Create Chat Room" button appears in the app dashboard. You moderate (no vulgarity, spam, scams, personal info, wallet passphrases); Pi auto-moderation deletes banned words/unapproved links. Free for now.
- **Tokens (Testnet)**: need two Testnet wallets (Issuer, Distributor). Distributor creates a trustline (`changeTrust`), Issuer sends a payment to mint. To list in Pi Wallet: set issuer `homeDomain` and host `https://<domain>/.well-known/pi.toml` (text/plain) with `[[CURRENCIES]]` fields `code`, `issuer`, `name`, `desc`, `image` (https, reachable). Uses `@stellar/stellar-sdk`, Horizon `https://api.testnet.minepi.com`, passphrase `"Pi Testnet"`. Distribution via direct payment or liquidity pool. Consider locking the issuer and setting max supply.
- **Share dialog**: `Pi.openShareDialog(title, message)`.
- **Microphone/other permissions**: `Pi.requestPermission(...)`, depends on Pi Browser; mic is only for voice features in apps.
- **App keys flow** (user wallet passphrase, mainnet migration queue, 14-day pending period, lockups): user-facing information; not needed for development.

---

## 15. Concepts

- **Mainnet**: live Pi blockchain (launched Dec 28, 2021). Enclosed Network period: firewalled; no connectivity with other blockchains/exchanges; allowed: Pi for goods/services in apps and between Pioneers; prohibited: Pi for fiat, Pi for other crypto, Pi for future promises of fiat/crypto. Open Network later removes the firewall.
- **Testnet**: mimic of Mainnet for testing, Test-Pi has **no value** and may be reset; faucet in Pi Wallet. Apps can connect to one network only.
- **Sandbox**: local dev environment using Testnet + your local app.
- **PiOS** (Pi Open Source): license for community open-source apps/libraries; registry at https://github.com/pi-apps/PiOS.
- Use of Pi dev tools is subject to the **Pi Network Developer Terms of Use**.

---

## 16. Common mistakes

1. **Missing SDK script tag / `Pi.init()`** -> `window.Pi` undefined.
2. **Never sending `accessToken` to backend** (trusting the client `user`). Always verify via `/me`.
3. **Granting the feature before server-side completion** (e.g. `setIsPremium(true)` right after `createPayment`). Only after `/complete` succeeds.
4. **Callback path mismatch** (frontend calls `/pi_payment/approve`, backend exposes `/api/payments/approve`) -> 404, payment stalls.
5. **No auth header** on protected backend calls -> `current_user` is empty. Send `Authorization: Bearer ${accessToken}`.
6. **Not verifying rewarded ads server-side**. Check `mediator_ack_status === "granted"`.
7. **Reading the token from undocumented properties** (`window.PiSdkBase?.accessToken`). Use the `authenticate()` return value.
8. **Completing with empty `paymentId`/`txid`**. Use the callback arguments.

### Final integration checklist
- [ ] `pi-sdk.js` script tag in HTML; `Pi.init({version:"2.0", sandbox})` before other calls
- [ ] `authenticate(['username','payments'], onIncompletePaymentFound)` (`payments` only if charging)
- [ ] `accessToken` from the return value, sent to backend; backend verifies with `GET /v2/me` (Bearer)
- [ ] Backend uses `Key <PI_API_KEY>` for Platform API server calls; key in env vars
- [ ] `onReadyForServerApproval` -> backend `/approve`; `onReadyForServerCompletion(paymentId, txid)` -> backend `/complete`
- [ ] Feature delivered only after successful completion; handlers idempotent
- [ ] Incomplete payments handled at login
- [ ] Rewarded ads verified server-side
- [ ] `sandbox:false` in production; domain verified with `validation-key.txt`
- [ ] Tested on Sandbox, then a real U2A payment in Pi Browser

---

## 17. Pi Next hackathon requirements (separate from the docs above)

- Starts **Nov 19, 2026**. Deadline **Tue Jan 5, 2027 11:59 PM PST** (Wed Jan 6, 07:59 UTC). Up to **3 apps** per team (Mainnet Pi apps and SoloHost apps).
- **Every team member must register** (Developer Web Console, Hackathon tab, signed in on a computer). **One member submits** each app.
- Optional midpoint submission (details emailed to registrants) for visibility and feedback.
- Prizes: Judges' Pick 50,000 USDT (25k / 15k / 10k); Community Engagement Awards 150,000 USDT to up to 2 teams (judges + real engagement, retention, traction); up to 20M Pi marketing incentives.
- Judging: Mainnet Listing Guidelines alignment, Pi utility and ecosystem fit, technical completeness and innovation, UI/UX and accessibility, long-term Mainnet utility, uniqueness. Judges check whether users **come back**.
- Every app must have: English name, logo following Pi trademark guidelines, accurate English description, preview images of the UI, **PiNet integration**, **privacy policy**.
- Demo video: public (YouTube etc.), **3 minutes or less**: what it is, feature walkthrough, who it is for, problem solved, how Pi is used (sign-in, payments).
- Console supports AI coding agents via MCP ("Build with your coding agent"). Pi mentions an `agents.md` for coding agents on the registration page.

---

## 18. Gaps and inconsistencies in the source docs (verify before relying)

- **Not captured here**: the **Sandbox** tab, **App Studio** (no-code), SoloHost docs, Pi Trademark Guidelines, Developer Terms, the GitHub `pi-platform-docs`, and the images/diagrams. Read them directly when needed. (The Agents page and `agents.md` ARE captured in section 20.)
- Env var naming differs: the docs examples use `PI_API_KEY`, `agents.md` uses `PI_NETWORK_API_KEY`. Pick one name and use it consistently (the agent's generated code will use `PI_NETWORK_API_KEY`).
- Developer Portal addresses vary across pages: `pi://develop.pinet.com`, `pi://develop.pi`, `develop.pinet.com`, and the web console `developers.minepi.com/devconsole`.
- Several pages have missing examples ("No examples!" on Access Token, empty `Pi.Wallet` method list, "Developer Ad Network Application: Coming soon", "Developer wallet: coming soon").
- `in_app_notifications` is an authenticate scope in the text but absent from the SDK `Scope` type.
- PiNet needs an Ecosystem-listed app, while the hackathon requires PiNet integration. Clarify with hackathon support what is expected before submission.
- Mainnet needs KYC and wallet approvals that can take time. Start early, or confirm whether Testnet is accepted for hackathon demos.
- Ignore unrelated fluff in some pages: the "PI System (Industrial Information Management)" section on the Metadata page (a different product), the "Pi-Agent-Browser-Native wrapper" link on Pi Browser Constraints (not a Pi Network tool), and generic user-facing text on Microphone, Native Share and App Keys pages.
- Docs are for the Pi Browser SDK. For regular browsers use Pi Sign-in (section 11) or PiNet (section 12).

---

## 19. Links

- Docs home: https://developers.minepi.com/docs/
- Web console: https://developers.minepi.com/devconsole
- SDK: https://sdk.minepi.com/pi-sdk.js
- Platform API: https://api.minepi.com/v2
- Demo app: https://github.com/pi-apps/demo
- Platform docs: https://github.com/pi-apps/pi-platform-docs
- PiOS: https://github.com/pi-apps/PiOS
- Community: Pi Ecosystem Discord (via Brainstorm app: `brainstorm.pinet.com` in Pi Browser), Developer chat room in the Pi app

---

## 20. Building with a coding agent (official MCP workflow)

Source: `https://developers.minepi.com/agents` and `https://developers.minepi.com/agents.md` (fetched 21 Nov 2026). Pi's agent handles SDK setup, app registration, Sandbox link, URL verification and listing steps.

### 20.1 Connect your agent
Sign in at developers.minepi.com **on a computer**, then run in your project folder:

- **Claude Code**
  ```bash
  claude mcp add --transport http pi-developers https://developers.minepi.com/mcp
  ```
- **Cursor** (`.cursor/mcp.json`; if the file exists, add `pi-developers` inside the existing `mcpServers`)
  ```json
  { "mcpServers": { "pi-developers": { "url": "https://developers.minepi.com/mcp" } } }
  ```
- **Any client with remote MCP support (including Codex)**: add a remote MCP server named `pi-developers` with URL `https://developers.minepi.com/mcp`.

On first use a browser tab opens to sign in and allow the agent. If tools don't appear: fully quit and reopen the agent, reopen the same project, paste the prompt again. You can see and revoke connected agents in the console.

### 20.2 Onboarding prompt (paste into the agent, same project)
```
Read https://developers.minepi.com/agents.md and follow its instructions to onboard this app to Pi Network.
```
Works for a new app or an existing one. The agent asks you before registering an app, adding a staging/production URL, setting up a wallet or payments, or submitting for review.

### 20.3 MCP tools
`whoami`, `terms_accept`, `create_app`, `list_apps`, `get_app`, `update_app`, `verify_app_url_ownership`, `prepare_app_logo_upload`, `set_app_logo`, `prompt_payments`, `logout`.

### 20.4 Ordered funnel
1. **Register/select the app** (`list_apps` or `create_app`). The agent must ask: **Staging (Testnet, Test Pi)** or **Production (Mainnet, Real Pi)**.
   - Network **cannot be changed** later (new app needed).
   - **Only Production apps can be listed** in the Pi Ecosystem. Staging apps stop at "Deployed".
   - Hackathon note: the hackathon accepts "Mainnet Pi apps", so build/test on Staging, then create a Production app (optionally link with `testnet_app_id`, which copies listing settings, logo and screenshots; the Production app must use a **different domain**).
2. **Staging only**: fix iframe/CSP so the Sandbox can embed the app, integrate **Pi Login**, open `sandbox_url` and test sign-in. Production apps are tested in **Pi Browser** after deployment, not the Sandbox.
3. **Pi Payments** (`prompt_payments` after confirming direction `user_to_app`, `app_to_user` or both).
4. **Deploy**: public **HTTPS** URL (not localhost). `update_app` with `frontend_url` **only**, then `verify_app_url_ownership`, then open `pi_url` (`https://<subdomain>.pinet.com`) in **Pi Browser**.
5. **Listing (Production only)**: open `listing_url` (Developers `/listing` page) **on a computer**: subtitle, screenshots, **category**, **language**, submit for review. The agent does not submit the listing itself.
6. **Logo (Production only)**: `prepare_app_logo_upload` returns `logo_prompt` + `requirements` (1024x1024 PNG/JPG); generate it, show it to you, run the `upload_command`, then `set_app_logo` with `file_key`. Remember the Pi trademark rules (no Pi logo/colors).

### 20.5 Sandbox vs Pi Browser (important rules)
- `development_url` = your **local** dev server (e.g. `http://localhost:3000`, or a tunnel like ngrok). Never invent one.
- The Sandbox is **only for localhost development**. Do **not** deploy to Vercel/Netlify/Firebase just to open the Sandbox, and do not set `development_url` to a public host.
- Required headers for Sandbox embedding:
  - do **not** send `X-Frame-Options`;
  - CSP `frame-ancestors` only: `'self'`, `https://*.pinet.com`, `https://*.minepi.com`;
  - avoid CSP wildcards;
  - CSP `connect-src` must include `'self'` and `https://socialchain.app` (Pi SDK API calls).
- Once deployed, `update_app` with `frontend_url` **only** (never pass `development_url` in the same call, never overwrite it with the public host). Test `frontend_url` in Pi Browser.

Example (Next.js `next.config.js` headers; adapt to your own CSP):
```js
module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy',
          value: "frame-ancestors 'self' https://*.pinet.com https://*.minepi.com; connect-src 'self' https://socialchain.app" },
        // do NOT add X-Frame-Options
      ],
    }];
  },
};
```
(If your app also calls other APIs from the browser, add them to `connect-src`.)

### 20.6 Console links in app payloads
`developers_url` (overview), `settings_url` (API key, URLs), `sandbox_url`, `wallet_setup_url`, `publish_url` (deploy a verified public URL), `listing_url` (Production only), `pi_url`/`pinet_subdomain`. Lifecycle: **Draft -> Deployed -> Listed** (Staging stops at Deployed). Networks are called **Staging (Testnet)** and **Production (Mainnet)** in the console.

### 20.7 Domain verification
1. `update_app` with `frontend_url` only.
2. `verify_app_url_ownership`. If setup is needed, deploy `/validation-key.txt` whose body is **exactly** the returned `validation_key` (plain text). Do not log or commit it; re-run the tool after deploying.
3. On success you get `pi_url`; open it in Pi Browser.

### 20.8 Payments with the agent
1. Agent proposes a concrete payment plan for your app (what is paid, amounts, when, direction) and confirms it with you.
2. Payments need **trusted server-side code**; no backend means add one first.
3. `prompt_payments` returns the instructions the agent applies to the code. Use only this tool for payment instructions.
4. **Before any payment test** (even in the Sandbox): `get_app` and check `checklist.create_wallet`. Both directions need a configured **app wallet** plus the server-only API key. An API key alone causes "App Wallet Misconfigured". If false, open the exact `wallet_setup_url` and finish setup yourself.
5. API key: `settings_url` -> Generate new key (replaces the old one) -> store as `PI_NETWORK_API_KEY` in your server's secret manager.
   - `user_to_app` needs **no wallet seed** on the app server.
   - `app_to_user` also needs `PI_WALLET_SEED` (stored by you from wallet setup), and `Pi.authenticate` must request `payments` and `wallet_address` (plus `username`); re-authenticate after adding scopes.

### 20.9 Secrets
- MCP never returns the API key. **Never** paste API keys, seeds, passphrases or recovery secrets into chat, send them through MCP, put them in frontend config, log them or commit them.
- The agent must not request or store your Pi credentials or access token.

### 20.10 Project file and completion criteria
- Agent writes `.pi-onboard.json` in the project root with the selected app ID. The agent uses it to resume. agents.md does not say whether to commit it; it holds an app ID, not a secret, but check before publishing a public repo.
- Done means: local lint/type/tests pass; `.pi-onboard.json` exists; `developers_url` shown; (Staging) `development_url` still local, CSP allows Sandbox embed, Pi Login tested via `sandbox_url`; payments suggested with a concrete plan (or declined); (Production listing) public HTTPS `frontend_url` set, ownership verified, `pi_url` tested in Pi Browser, `listing_url` given.
