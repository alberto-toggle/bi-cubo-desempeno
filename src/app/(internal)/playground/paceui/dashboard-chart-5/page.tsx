import { Chart5 } from "@/components/blocks/paceui/dashboard-chart-5/dashboard-chart-5";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/paceui/dashboard-chart-5",
  )!;
  return (
    <BlockPreview block={block}>
      <div lang="en" className="min-w-0 overflow-x-auto">
        <TooltipProvider>
          <Chart5 />
        </TooltipProvider>
      </div>
    </BlockPreview>
  );
}
