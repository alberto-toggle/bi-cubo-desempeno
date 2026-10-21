import Demo from "@/components/blocks/21st-dev/orbs-lens-kvnkld/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/21st-dev/orbs-lens-kvnkld",
  )!;
  return (
    <BlockPreview block={block}>
      <Demo />
    </BlockPreview>
  );
}
