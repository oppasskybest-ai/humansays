import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import PiProvider from '@/components/PiProvider';

export const metadata: Metadata = {
  title: 'HumanSays',
  description: 'Get real answers from a Pi-verified community, and earn rewards for giving them.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Pi SDK must be loaded with a script tag in EVERY environment (the Pi Browser does not inject window.Pi) */}
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="beforeInteractive" />
        <PiProvider>{children}</PiProvider>
      </body>
    </html>
  );
}
