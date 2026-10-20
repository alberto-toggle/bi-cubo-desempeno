import Demo from "@/components/blocks/21st-dev/funnel-chart-big-reaviz/demo";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/21st-dev/funnel-chart-big-reaviz",
  )!;
  return (
    <BlockPreview block={block}>
      <div lang="en" className="min-w-0 overflow-x-auto">
        <Demo />
      </div>
    </BlockPreview>
  );
}
