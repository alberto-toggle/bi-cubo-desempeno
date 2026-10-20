import { Stat1 } from "@/components/blocks/paceui/dashboard-stat-1/dashboard-stat-1";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/paceui/dashboard-stat-1",
  )!;
  return (
    <BlockPreview block={block}>
      <div lang="en" className="min-w-0 overflow-x-auto">
        <TooltipProvider>
          <Stat1
            title="Revenue"
            value="$24,580"
            changeValue="12.8% this month"
          />
        </TooltipProvider>
      </div>
    </BlockPreview>
  );
}
