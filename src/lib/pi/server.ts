/**
 * Pi Platform API, SERVER SIDE ONLY. See PI_NETWORK_DEV_GUIDE.md sections 0, 6, 7, 8.
 *
 * Two auth schemes (mixing them up = 401):
 *   Bearer <user accessToken>  -> GET /me
 *   Key <PI_API_KEY>           -> payments approve/complete, etc.
 *
 * Owner: Opeyemi (L1, L5).
 */
import { PI_API_BASE, getServerConfig } from '@/lib/config';
import { HttpError } from '@/lib/http';

export type PiMe = { uid: string; username: string };

export type PiPayment = {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  direction: 'user_to_app' | 'app_to_user';
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | { txid: string; verified: boolean; _link: string };
};

/** Verify a user's accessToken with Pi. The returned uid is the ONLY identity we trust. */
export async function verifyPiToken(accessToken: string): Promise<PiMe> {
  const res = await fetch(`${PI_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new HttpError(401, 'invalid_pi_token', 'Pi sign-in could not be verified');
  const me = (await res.json()) as Partial<PiMe>;
  if (!me.uid || !me.username) throw new HttpError(401, 'invalid_pi_token', 'Pi sign-in could not be verified');
  return { uid: me.uid, username: me.username };
}

async function piKeyFetch(path: string, init: RequestInit = {}) {
  const { piApiKey } = getServerConfig();
  const res = await fetch(`${PI_API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Key ${piApiKey}`, ...init.headers },
    cache: 'no-store',
  });
  return res;
}

export async function getPayment(paymentId: string): Promise<PiPayment> {
  const res = await piKeyFetch(`/payments/${encodeURIComponent(paymentId)}`);
  if (!res.ok) throw new HttpError(502, 'pi_error', `Pi getPayment failed (${res.status})`);
  return (await res.json()) as PiPayment;
}

export async function approvePayment(paymentId: string): Promise<PiPayment> {
  const res = await piKeyFetch(`/payments/${encodeURIComponent(paymentId)}/approve`, { method: 'POST' });
  if (!res.ok) throw new HttpError(502, 'pi_error', `Pi approve failed (${res.status})`);
  return (await res.json()) as PiPayment;
}

export async function completePayment(paymentId: string, txid: string): Promise<PiPayment> {
  const res = await piKeyFetch(`/payments/${encodeURIComponent(paymentId)}/complete`, {
    method: 'POST',
    body: JSON.stringify({ txid }),
  });
  if (!res.ok) throw new HttpError(502, 'pi_error', `Pi complete failed (${res.status})`);
  return (await res.json()) as PiPayment;
}
