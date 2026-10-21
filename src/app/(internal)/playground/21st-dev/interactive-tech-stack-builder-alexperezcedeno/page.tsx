import Demo from "@/components/blocks/21st-dev/interactive-tech-stack-builder-alexperezcedeno/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/21st-dev/interactive-tech-stack-builder-alexperezcedeno",
  )!;
  return (
    <BlockPreview block={block}>
      <Demo />
    </BlockPreview>
  );
}
