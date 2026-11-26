import { describe, expect, it } from 'vitest';
import { campaignCost, computeFee, piToStroops, stroopsToPi, stroopsToPiString, stroopsToPoints } from '@/lib/money';

describe('money', () => {
  it('converts Pi to stroops exactly', () => {
    expect(piToStroops('1')).toBe(10_000_000n);
    expect(piToStroops('1.5')).toBe(15_000_000n);
    expect(piToStroops(0.0000001)).toBe(1n);
    expect(piToStroops('0.1234567')).toBe(1_234_567n);
  });
  it('rejects bad input', () => {
    expect(() => piToStroops('1.12345678')).toThrow(); // > 7 decimals
    expect(() => piToStroops('-1')).toThrow();
    expect(() => piToStroops('abc')).toThrow();
  });
  it('formats stroops back to Pi', () => {
    expect(stroopsToPiString(15_000_000n)).toBe('1.5');
    expect(stroopsToPiString(1n)).toBe('0.0000001');
    expect(stroopsToPiString(0n)).toBe('0');
    expect(stroopsToPi(25_000_000n)).toBe(2.5);
  });
  it('computes points and fees with integer math', () => {
    expect(stroopsToPoints(100_000n, 10_000)).toBe(10n);
    expect(computeFee(1_000_000n, 1000)).toBe(100_000n); // 10%
    expect(computeFee(999n, 1000)).toBe(99n); // floor
  });
  it('estimates campaign cost', () => {
    const c = campaignCost(100, 50_000n, 1000);
    expect(c).toEqual({ budget: 5_000_000n, fee: 500_000n, total: 5_500_000n });
  });
});
