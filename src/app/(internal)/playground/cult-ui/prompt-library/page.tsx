import Demo from "@/components/blocks/cult-ui/prompt-library/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find((item) => item.href === "/playground/cult-ui/prompt-library")!;
  return <BlockPreview block={block}><Demo /></BlockPreview>;
}
