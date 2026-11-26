// POST /api/campaigns/[id]/questions
// Add / edit questions
// auth: owner | layer: L4 | suggested owner: Robiu
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L4, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function POST(_req: Request) {
  return notImplemented('L4', 'Robiu');
}
