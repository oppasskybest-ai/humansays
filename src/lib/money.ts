/**
 * money.ts: stroops helpers. RULE: money is ALWAYS stored as integer stroops (bigint). Never floats.
 * 1 Pi = 10,000,000 stroops.  Convert to a JS number ONLY at the Pi SDK boundary (stroopsToPi).
 * JSON cannot carry bigint: send stroops over the API as STRINGS.
 *
 * Owner: Opeyemi (L0).
 */
export const STROOPS_PER_PI = 10_000_000n;
const PI_DECIMALS = 7;

/** "1.5" | 1.5  ->  15000000n.  Max 7 decimals. Throws on bad input. */
export function piToStroops(pi: string | number): bigint {
  const s = typeof pi === 'number' ? pi.toFixed(PI_DECIMALS) : pi.trim();
  if (!/^\d+(\.\d{1,7})?$/.test(s)) throw new Error(`Invalid Pi amount: ${String(pi)}`);
  const [whole, frac = ''] = s.split('.');
  return BigInt(whole) * STROOPS_PER_PI + BigInt(frac.padEnd(PI_DECIMALS, '0'));
}

/** bigint stroops -> exact decimal string, e.g. 15000000n -> "1.5" */
export function stroopsToPiString(stroops: bigint): string {
  const neg = stroops < 0n;
  const abs = neg ? -stroops : stroops;
  const whole = abs / STROOPS_PER_PI;
  const frac = (abs % STROOPS_PER_PI).toString().padStart(PI_DECIMALS, '0').replace(/0+$/, '');
  return `${neg ? '-' : ''}${whole}${frac ? '.' + frac : ''}`;
}

/** Only for the Pi SDK boundary (Pi.createPayment amount is a JS number). */
export function stroopsToPi(stroops: bigint): number {
  return Number(stroopsToPiString(stroops));
}

/** Display unit when PAYOUT_MODE=points. stroopsPerPoint comes from config (default 10,000). */
export function stroopsToPoints(stroops: bigint, stroopsPerPoint: number): bigint {
  return stroops / BigInt(stroopsPerPoint);
}

/** fee = floor(budget * fee_bps / 10000)  (spec 8.2) */
export function computeFee(budget: bigint, feeBps: number): bigint {
  return (budget * BigInt(feeBps)) / 10_000n;
}

/** Live cost estimator for the campaign builder: budget = n * reward; total = budget + fee. */
export function campaignCost(targetResponses: number, rewardStroops: bigint, feeBps: number) {
  const budget = BigInt(targetResponses) * rewardStroops;
  const fee = computeFee(budget, feeBps);
  return { budget, fee, total: budget + fee };
}
