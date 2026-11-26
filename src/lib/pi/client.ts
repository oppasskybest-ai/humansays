'use client';
/**
 * Browser-side Pi SDK wrapper. Owner: Michael (Frontend Lead), L1.
 * The SDK <script> is loaded in src/app/layout.tsx. `window.Pi` does NOT exist in a normal browser:
 * always check isPiAvailable() and show "Open HumanSays in Pi Browser" instead of crashing.
 */
import { publicConfig } from '@/lib/config';

export type PiUser = { uid: string; username: string };
export type PiAuthResult = { accessToken: string; user: PiUser };
export type PiPaymentData = { amount: number; memo: string; metadata: Record<string, unknown> };
export type PiPaymentCallbacks = {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
};
type PiSdk = {
  init: (cfg: { version: string; sandbox?: boolean }) => void;
  authenticate: (scopes: string[], onIncompletePaymentFound: (payment: { identifier: string }) => void) => Promise<PiAuthResult>;
  createPayment: (data: PiPaymentData, cb: PiPaymentCallbacks) => void;
  openShareDialog?: (title: string, message: string) => void;
};

declare global {
  interface Window {
    Pi?: PiSdk;
  }
}

let initialised = false;

export const isPiAvailable = () => typeof window !== 'undefined' && !!window.Pi;

/** Call once (see PiProvider). Must run before any other Pi call. */
export function initPi() {
  if (initialised || !window.Pi) return;
  window.Pi.init({ version: '2.0', sandbox: publicConfig.sandbox });
  initialised = true;
}

/** Scopes: request only what we use. 'payments' is needed for top-ups. */
export async function piLogin(onIncompletePayment: (paymentId: string) => void): Promise<PiAuthResult> {
  if (!window.Pi) throw new Error('PI_NOT_AVAILABLE');
  initPi();
  return window.Pi.authenticate(['username', 'payments'], (p) => onIncompletePayment(p.identifier));
}

export function piCreatePayment(data: PiPaymentData, callbacks: PiPaymentCallbacks) {
  if (!window.Pi) throw new Error('PI_NOT_AVAILABLE');
  window.Pi.createPayment(data, callbacks);
}
