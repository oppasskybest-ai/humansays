// POST /api/topups/intent
// Create a top-up payment intent (server computes amount)
// auth: user | layer: L5 | suggested owner: Opeyemi
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L5, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function POST(_req: Request) {
  return notImplemented('L5', 'Opeyemi');
}
