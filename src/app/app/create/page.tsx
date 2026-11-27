import Placeholder from '@/components/Placeholder';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export default function CreatePage() {
  return <Placeholder title="Create a poll" layer="L4" owner="Michael" />;
}
