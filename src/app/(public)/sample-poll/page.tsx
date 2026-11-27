import Placeholder from '@/components/Placeholder';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export default function SamplePollPage() {
  return <Placeholder title="Sample poll (read-only preview)" layer="L2" owner="Michael" />;
}
