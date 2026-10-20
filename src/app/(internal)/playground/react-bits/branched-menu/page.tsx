import Demo from "@/components/blocks/react-bits/branched-menu/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/react-bits/branched-menu",
  )!;
  return (
    <BlockPreview block={block}>
      <Demo />
    </BlockPreview>
  );
}
