// POST /api/payouts
// Withdraw (only when PAYOUT_MODE=pi_a2u, else 403)
// auth: user | layer: L11 | suggested owner: Opeyemi
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L11, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function POST(_req: Request) {
  return notImplemented('L11', 'Opeyemi');
}
