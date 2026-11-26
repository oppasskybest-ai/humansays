// GET /api/campaigns/[id]/results
// Aggregates (small-group rule: hide groups < 5)
// auth: owner | layer: L10 | suggested owner: Robiu
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L10, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function GET(_req: Request) {
  return notImplemented('L10', 'Robiu');
}
