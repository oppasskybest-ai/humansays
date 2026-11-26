// GET /api/admin/audit
// View audit log
// auth: admin | layer: L12 | suggested owner: Robiu
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L12, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function GET(_req: Request) {
  return notImplemented('L12', 'Robiu');
}
