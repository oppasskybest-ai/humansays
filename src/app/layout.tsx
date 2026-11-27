import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import PiProvider from '@/components/PiProvider';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

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
