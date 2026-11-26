import { describe, expect, it } from 'vitest';
import { assertBalanced } from '@/lib/ledger/ledger';
import { ACCOUNTS } from '@/lib/ledger/accounts';

describe('ledger invariant', () => {
  it('accepts a balanced top-up', () => {
    expect(() =>
      assertBalanced([
        { account: ACCOUNTS.externalPi, deltaStroops: -100n, kind: 'topup' },
        { account: ACCOUNTS.businessBalance('u1'), deltaStroops: 100n, kind: 'topup' },
      ]),
    ).not.toThrow();
  });
  it('accepts a balanced launch (balance -> escrow + fee)', () => {
    expect(() =>
      assertBalanced([
        { account: ACCOUNTS.businessBalance('u1'), deltaStroops: -110n, kind: 'launch' },
        { account: ACCOUNTS.escrow('c1'), deltaStroops: 100n, kind: 'launch' },
        { account: ACCOUNTS.platformFees, deltaStroops: 10n, kind: 'launch' },
      ]),
    ).not.toThrow();
  });
  it('rejects unbalanced or single-entry transactions', () => {
    expect(() => assertBalanced([{ account: 'a', deltaStroops: 5n, kind: 'x' }])).toThrow();
    expect(() =>
      assertBalanced([
        { account: 'a', deltaStroops: -5n, kind: 'x' },
        { account: 'b', deltaStroops: 4n, kind: 'x' },
      ]),
    ).toThrow(/unbalanced/);
  });
});
