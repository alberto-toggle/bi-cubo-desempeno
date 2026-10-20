import { Stat4 } from "@/components/blocks/paceui/dashboard-stat-4/dashboard-stat-4";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/paceui/dashboard-stat-4",
  )!;
  return (
    <BlockPreview block={block}>
      <div lang="en" className="min-w-0 overflow-x-auto">
        <TooltipProvider>
          <Stat4 />
        </TooltipProvider>
      </div>
    </BlockPreview>
  );
}
