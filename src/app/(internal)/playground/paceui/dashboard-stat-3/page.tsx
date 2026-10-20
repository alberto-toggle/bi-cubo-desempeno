import { Stat3 } from "@/components/blocks/paceui/dashboard-stat-3/dashboard-stat-3";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/paceui/dashboard-stat-3",
  )!;
  return (
    <BlockPreview block={block}>
      <div lang="en" className="min-w-0 overflow-x-auto">
        <TooltipProvider>
          <Stat3
            title="Active users"
            value="8,492"
            growthValue={12.5}
            timeText="vs. last month"
          />
        </TooltipProvider>
      </div>
    </BlockPreview>
  );
}
