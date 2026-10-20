import Demo from "@/components/blocks/react-bits/infinite-menu/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/react-bits/infinite-menu",
  )!;
  return (
    <BlockPreview block={block}>
      <Demo />
    </BlockPreview>
  );
}
