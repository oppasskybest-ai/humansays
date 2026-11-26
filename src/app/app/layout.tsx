import Link from 'next/link';

// Signed-in area. Pi sign-in is requested only when the user ACTS (answer, create, top up), never on first load.
// Bottom nav per spec L2: Earn (feed), Predict, Create, Rewards, Me.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16">
      {/* TODO (Michael): mode-aware banners: "Test mode: Test Pi" (staging) / "Points have no cash value" (points mode) */}
      <main>{children}</main>
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t bg-white p-3 text-sm">
        <Link href="/app/feed">Earn</Link>
        <Link href="/app/predict">Predict</Link>
        <Link href="/app/create">Create</Link>
        <Link href="/app/rewards">Rewards</Link>
        <Link href="/app/me">Me</Link>
      </nav>
    </div>
  );
}
