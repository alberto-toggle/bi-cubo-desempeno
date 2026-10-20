import { Analytics3 } from "@/components/blocks/paceui/app-analytics-3/app-analytics-3";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockPreview } from "@/features/playground/block-preview";
import { playgroundBlocks } from "@/lib/playground";
export default function Page() {
  const block = playgroundBlocks.find(
    (b) => b.href === "/playground/paceui/app-analytics-3",
  )!;
  return (
    <BlockPreview block={block}>
      <div lang="en" className="min-w-0 overflow-x-auto">
        <TooltipProvider>
          <Analytics3 />
        </TooltipProvider>
      </div>
    </BlockPreview>
  );
}
