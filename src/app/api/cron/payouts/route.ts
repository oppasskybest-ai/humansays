// GET /api/cron/payouts
// Payout worker (A2U), serialized with a DB lock
// auth: CRON_SECRET | layer: L15 | suggested owner: Opeyemi
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L15, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function GET(_req: Request) {
  return notImplemented('L15', 'Opeyemi');
}
