import Link from 'next/link';

// PUBLIC pages must work in ANY browser with NO Pi sign-in (needed for PiNet).
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between border-b p-4">
        <Link href="/" className="font-bold">HumanSays</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/app/feed">Open app</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="mt-10 flex flex-wrap gap-4 border-t p-4 text-xs text-gray-500">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/content-policy">Content policy</Link>
        <Link href="/rewards-disclosure">Rewards disclosure</Link>
      </footer>
    </>
  );
}
