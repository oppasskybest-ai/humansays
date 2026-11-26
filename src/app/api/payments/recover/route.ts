// POST /api/payments/recover
// Complete interrupted payments from onIncompletePaymentFound
// auth: none (validated server-side) | layer: L1 | suggested owner: Opeyemi
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L1, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function POST(_req: Request) {
  return notImplemented('L1', 'Opeyemi');
}
