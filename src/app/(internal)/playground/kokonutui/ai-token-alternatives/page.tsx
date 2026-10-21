import Demo from "@/components/blocks/kokonutui/ai-token-alternatives/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (item) => item.href === "/playground/kokonutui/ai-token-alternatives",
  )!;
  return <BlockPreview block={block}><Demo /></BlockPreview>;
}
