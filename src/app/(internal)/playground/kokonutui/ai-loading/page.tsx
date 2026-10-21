import Demo from "@/components/blocks/kokonutui/ai-loading/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find((item) => item.href === "/playground/kokonutui/ai-loading")!;
  return <BlockPreview block={block}><Demo /></BlockPreview>;
}
