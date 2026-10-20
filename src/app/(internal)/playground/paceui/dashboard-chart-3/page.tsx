import { Chart3 } from "@/components/blocks/paceui/dashboard-chart-3/dashboard-chart-3";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/paceui/dashboard-chart-3",
  )!;
  return (
    <BlockPreview block={block}>
      <div lang="en" className="min-w-0 overflow-x-auto">
        <TooltipProvider>
          <Chart3 />
        </TooltipProvider>
      </div>
    </BlockPreview>
  );
}
