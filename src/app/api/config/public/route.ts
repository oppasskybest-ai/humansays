// GET /api/config/public: flags the UI is allowed to know. WORKING EXAMPLE of the route pattern.
// Pattern for protected routes:
//   const session = await requireUser(req);   // from '@/lib/auth/session'
//   const body = schema.parse(await req.json());  // zod-validate every body
//   ... do work ...  return json({ ... });
//   wrap everything in try/catch -> return handleError(err)
import { getPublicFlags } from '@/lib/config';
import { handleError, json } from '@/lib/http';

export const dynamic = 'force-dynamic'; // never pre-render API routes at build time

export async function GET() {
  try {
    return json(getPublicFlags());
  } catch (err) {
    return handleError(err);
  }
}
