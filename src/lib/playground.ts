import catalog from "./playground-catalog.json";
// Central catalog shared by the sidebar, index and block previews.
export interface PlaygroundBlock {
  title: string;
  category: string;
  href: string;
  provider: string;
  description: string;
  sourceUrl: string;
}
export const playgroundBlocks: readonly PlaygroundBlock[] = catalog;
export function groupBlocks(blocks: readonly PlaygroundBlock[]) {
  return [...new Set(blocks.map((b) => b.category))]
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((category) => ({
      category,
      blocks: blocks
        .filter((b) => b.category === category)
        .sort((a, b) => a.title.localeCompare(b.title, "es")),
    }));
}
