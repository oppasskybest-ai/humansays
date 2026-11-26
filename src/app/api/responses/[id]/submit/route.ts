// POST /api/responses/[id]/submit
// Submit answers, run quality checks, approve/flag
// auth: user | layer: L6 | suggested owner: Opeyemi
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L6, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function POST(_req: Request) {
  return notImplemented('L6', 'Opeyemi');
}
