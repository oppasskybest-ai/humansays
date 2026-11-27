'use client';
// Initialises the Pi SDK once and tells the UI whether we are inside Pi Browser.
// Owner: Michael (L1). TODO: add usePi() with login(), session JWT kept IN MEMORY (no cookies), and
// the onIncompletePaymentFound -> POST /api/payments/recover handler.
import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { initPi, isPiAvailable } from '@/lib/pi/client';

type PiState = { piAvailable: boolean };
const PiContext = createContext<PiState>({ piAvailable: false });
export const usePiState = () => useContext(PiContext);

// window.Pi is set by the SDK <script> before the app hydrates and never changes afterwards,
// so there is nothing to subscribe to. useSyncExternalStore avoids calling setState inside an effect.
const subscribe = () => () => {};
const getServerSnapshot = () => false;

export default function PiProvider({ children }: { children: ReactNode }) {
  const piAvailable = useSyncExternalStore(subscribe, isPiAvailable, getServerSnapshot);
  useEffect(() => {
    if (piAvailable) initPi();
  }, [piAvailable]);
  return <PiContext.Provider value={{ piAvailable }}>{children}</PiContext.Provider>;
}
