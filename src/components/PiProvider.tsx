'use client';
// Initialises the Pi SDK once and tells the UI whether we are inside Pi Browser.
// Owner: Michael (L1). TODO: add usePi() with login(), session JWT kept IN MEMORY (no cookies), and
// the onIncompletePaymentFound -> POST /api/payments/recover handler.
import { createContext, useContext, useEffect, useState } from 'react';
import { initPi, isPiAvailable } from '@/lib/pi/client';

type PiState = { piAvailable: boolean };
const PiContext = createContext<PiState>({ piAvailable: false });
export const usePiState = () => useContext(PiContext);

export default function PiProvider({ children }: { children: React.ReactNode }) {
  const [piAvailable, setPiAvailable] = useState(false);
  useEffect(() => {
    if (isPiAvailable()) {
      initPi();
      setPiAvailable(true);
    }
  }, []);
  return <PiContext.Provider value={{ piAvailable }}>{children}</PiContext.Provider>;
}
