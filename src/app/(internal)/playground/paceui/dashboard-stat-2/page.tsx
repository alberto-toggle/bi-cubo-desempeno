import { Stat2 } from "@/components/blocks/paceui/dashboard-stat-2/dashboard-stat-2";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/paceui/dashboard-stat-2",
  )!;
  return (
    <BlockPreview block={block}>
      <div lang="en" className="min-w-0 overflow-x-auto">
        <TooltipProvider>
          <Stat2
            title="Subscriptions"
            value="1,284"
            trendValue={8.4}
            footerLabel="Steady growth"
            footerSubtext="Compared with the previous month"
          />
        </TooltipProvider>
      </div>
    </BlockPreview>
  );
}
