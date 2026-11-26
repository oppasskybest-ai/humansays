// Temporary placeholder so every route renders while the real screens are built.
// Delete usages as real screens land.
export default function Placeholder({ title, layer, owner }: { title: string; layer: string; owner: string }) {
  return (
    <section className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        Placeholder ({layer}). Suggested owner: {owner}. See HUMANSAYS_BUILD_SPEC.md.
      </p>
    </section>
  );
}
