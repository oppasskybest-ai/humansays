/**
 * Double-entry ledger (spec section 8). INVARIANT: for every tx_id the entries sum to ZERO.
 * Owner: Opeyemi (L5). Money code: every change needs a test (src/tests/ledger.test.ts).
 */
export type LedgerEntry = {
  account: string;
  deltaStroops: bigint;
  kind: string; // 'topup' | 'grant' | 'launch' | 'reward' | 'close' | 'withdraw' | 'payout_done' | 'payout_failed'
  refType?: string;
  refId?: string;
};

/** Throws unless the entries sum to exactly zero (and there are at least 2). */
export function assertBalanced(entries: LedgerEntry[]): void {
  if (entries.length < 2) throw new Error('Ledger transaction needs at least 2 entries');
  const sum = entries.reduce((acc, e) => acc + e.deltaStroops, 0n);
  if (sum !== 0n) throw new Error(`Ledger transaction is unbalanced (sum=${sum})`);
}

/**
 * TODO (Opeyemi): insert all entries in ONE database transaction with the same tx_id.
 * `unique (idempotency_key, account)` makes a repeat call a no-op: catch that and return the existing tx.
 * Suggested: a Postgres function (rpc) so the whole thing is atomic.
 */
export async function postTransaction(entries: LedgerEntry[], _idempotencyKey: string): Promise<{ txId: string }> {
  assertBalanced(entries);
  throw new Error('postTransaction not implemented yet (L5)');
}

/** TODO (Opeyemi): balance of one account = sum(delta_stroops) where account = $1. */
export async function getBalance(_account: string): Promise<bigint> {
  throw new Error('getBalance not implemented yet (L5)');
}
