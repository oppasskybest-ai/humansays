/**
 * App session = a short-lived JWT we issue AFTER verifying the Pi token with GET /v2/me.
 * Kept in memory on the client, sent as `Authorization: Bearer <jwt>`. NO COOKIES (iOS Pi Browser blocks them).
 * Owner: Opeyemi (L1).
 */
import { SignJWT, jwtVerify } from 'jose';
import { getServerConfig } from '@/lib/config';
import { HttpError } from '@/lib/http';

export type Session = { uid: string; username: string; isAdmin: boolean };

const ISSUER = 'humansays';
const TTL = '1h';
const key = () => new TextEncoder().encode(getServerConfig().sessionSecret);

export async function signSession(s: Session): Promise<string> {
  return new SignJWT({ username: s.username, isAdmin: s.isAdmin })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(s.uid)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(TTL)
    .sign(key());
}

export async function verifySession(token: string): Promise<Session> {
  try {
    const { payload } = await jwtVerify(token, key(), { issuer: ISSUER });
    if (!payload.sub) throw new Error('no sub');
    return { uid: payload.sub, username: String(payload.username ?? ''), isAdmin: payload.isAdmin === true };
  } catch {
    throw new HttpError(401, 'invalid_session', 'Session expired or invalid');
  }
}

function bearer(req: Request): string {
  const h = req.headers.get('authorization') ?? '';
  const m = /^Bearer (.+)$/i.exec(h);
  if (!m) throw new HttpError(401, 'missing_token', 'Missing Authorization header');
  return m[1];
}

/** Use at the top of every protected route. TODO (L7): also reject blocked users on write routes. */
export async function requireUser(req: Request): Promise<Session> {
  return verifySession(bearer(req));
}

/** Admin = JWT says admin AND uid is in ADMIN_UIDS (double check). */
export async function requireAdmin(req: Request): Promise<Session> {
  const s = await requireUser(req);
  if (!s.isAdmin || !getServerConfig().adminUids.includes(s.uid)) throw new HttpError(403, 'forbidden', 'Admins only');
  return s;
}

/** Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. */
export function requireCron(req: Request): void {
  if (bearer(req) !== getServerConfig().cronSecret) throw new HttpError(401, 'unauthorized', 'Bad cron secret');
}
