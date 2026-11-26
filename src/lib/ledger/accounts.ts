/** Ledger account names (spec 8.1). Always build names through these helpers: no string typos. */
export const ACCOUNTS = {
  externalPi: 'external:pi',
  externalGrant: 'external:grant',
  platformFees: 'platform:fees',
  payoutPending: 'payout:pending',
  businessBalance: (uid: string) => `business:${uid}:balance`,
  escrow: (campaignId: string) => `escrow:${campaignId}`,
  userRewards: (uid: string) => `user:${uid}:rewards`,
} as const;

/** Idempotency key builders (spec 8.1). Same key twice = same effect once. */
export const IDEM = {
  topup: (intentId: string) => `topup:${intentId}`,
  launch: (campaignId: string) => `launch:${campaignId}`,
  reward: (responseId: string) => `reward:${responseId}`,
  close: (campaignId: string) => `close:${campaignId}`,
  payoutDone: (payoutId: string) => `payout-done:${payoutId}`,
} as const;
