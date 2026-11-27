import Placeholder from '@/components/Placeholder';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export default function MePage() {
  return <Placeholder title="Me: profile, tier, streak" layer="L3" owner="Michael" />;
}
