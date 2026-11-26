/** Small shared helpers for API route handlers. */
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

export const badRequest = (message: string, details?: unknown) =>
  json({ error: 'bad_request', message, details }, 400);

export const unauthorized = (message = 'Unauthorized') => json({ error: 'unauthorized', message }, 401);
export const forbidden = (message = 'Forbidden') => json({ error: 'forbidden', message }, 403);
export const notFound = (message = 'Not found') => json({ error: 'not_found', message }, 404);

/** Used by route stubs. Replace with the real handler. */
export const notImplemented = (layer: string, owner: string) =>
  json({ error: 'not_implemented', layer, owner, message: `Not built yet (${layer}, owner: ${owner}). See docs/API_CONTRACT.md` }, 501);

/** Turns thrown errors into safe JSON. Never leaks stack traces or secrets. */
export function handleError(err: unknown) {
  if (err instanceof HttpError) return json({ error: err.code, message: err.message }, err.status);
  if (err instanceof ZodError) return badRequest('Invalid request body', err.flatten());
  console.error('Unhandled API error:', err instanceof Error ? err.message : 'unknown'); // no tokens/PII in logs
  return json({ error: 'server_error', message: 'Something went wrong' }, 500);
}

export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}
