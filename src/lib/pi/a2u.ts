/**
 * App-to-User (A2U) payouts: only used when PAYOUT_MODE=pi_a2u. Owner: Opeyemi (L11).
 *
 * DO NOT hand-roll signing. Use the official `pi-nodejs` backend SDK and follow its README
 * (add it to package.json when you start L11). Never run two payouts from the same wallet at
 * the same time (sequence-number clashes): serialize with a DB lock.
 */
export async function sendPayout(_params: { uid: string; amountStroops: bigint; memo: string }): Promise<{ paymentId: string; txid: string }> {
  throw new Error('A2U payouts not implemented yet (L11). Read the pi-nodejs README first.');
}
