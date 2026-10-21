import Demo from "@/components/blocks/cult-ui/ai-instructions/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find((item) => item.href === "/playground/cult-ui/ai-instructions")!;
  return <BlockPreview block={block}><Demo /></BlockPreview>;
}
