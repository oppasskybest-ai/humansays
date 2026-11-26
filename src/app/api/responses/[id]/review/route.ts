// POST /api/responses/[id]/review
// Approve / reject a FLAGGED response
// auth: owner/admin | layer: L7 | suggested owner: Opeyemi
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L7, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function POST(_req: Request) {
  return notImplemented('L7', 'Opeyemi');
}
