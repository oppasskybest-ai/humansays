// GET / PATCH / DELETE /api/me
// Profile, optional demographics + consent, delete my data
// auth: user | layer: L3 | suggested owner: Robiu
// Contract: docs/API_CONTRACT.md | Spec: HUMANSAYS_BUILD_SPEC.md (L3, section 7)
import { notImplemented } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function GET(_req: Request) {
  return notImplemented('L3', 'Robiu');
}

export async function PATCH(_req: Request) {
  return notImplemented('L3', 'Robiu');
}

export async function DELETE(_req: Request) {
  return notImplemented('L3', 'Robiu');
}
