// POST /api/auth/verify
// Verify Pi token with /v2/me, upsert user, return app JWT + profile
// auth: Bearer Pi token | layer: L1 | suggested owner: Opeyemi
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L1, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function POST(_req: Request) {
  return notImplemented('L1', 'Opeyemi');
}
