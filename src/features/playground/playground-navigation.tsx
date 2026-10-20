"use client";

import Link from "next/link";
import { useState } from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronRight, Folder, FolderOpen, ListCollapse } from "lucide-react";
import type { PlaygroundBlock } from "@/lib/playground";

interface PlaygroundNavigationProps {
  groups: { category: string; blocks: readonly PlaygroundBlock[] }[];
  pathname: string;
  searching: boolean;
}

export function PlaygroundNavigation({
  groups,
  pathname,
  searching,
}: PlaygroundNavigationProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () =>
      new Set(
        groups
          .filter((group) =>
            group.blocks.some((block) => block.href === pathname),
          )
          .map((group) => group.category),
      ),
  );

  function toggleCategory(category: string, open: boolean) {
    setOpenCategories((current) => {
      const next = new Set(current);
      if (open) next.add(category);
      else next.delete(category);
      return next;
    });
  }

  return (
    <nav aria-label="Componentes del playground" className="mt-5 space-y-1">
      {!searching && (
        <button
          type="button"
          onClick={() => setOpenCategories(new Set())}
          disabled={openCategories.size === 0}
          className="mb-2 flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-xs text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-40"
        >
          <ListCollapse size={15} aria-hidden="true" />
          Colapsar todas
        </button>
      )}
      {groups.map(({ category, blocks }) => {
        const open = searching || openCategories.has(category);
        const Icon = open ? FolderOpen : Folder;
        return (
          <Collapsible.Root
            key={category}
            open={open}
            onOpenChange={(value) => toggleCategory(category, value)}
          >
            <h2>
              <Collapsible.Trigger
                disabled={searching}
                className="group flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <ChevronRight
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 transition-transform group-data-[panel-open]:rotate-90 motion-reduce:transition-none"
                />
                <Icon
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground"
                />
                <span className="flex-1">{category}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {blocks.length}
                </span>
              </Collapsible.Trigger>
            </h2>
            <Collapsible.Panel className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 data-[starting-style]:h-0 data-[ending-style]:h-0 motion-reduce:transition-none">
              <ul className="mb-3 ml-4 space-y-1 border-l border-border pl-2">
                {blocks.map((block) => (
                  <li key={block.href}>
                    <Link
                      href={block.href}
                      aria-current={
                        pathname === block.href ? "page" : undefined
                      }
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-background aria-[current=page]:font-semibold"
                    >
                      <span className="block">{block.title}</span>
                      <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">
                        {block.provider}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Collapsible.Panel>
          </Collapsible.Root>
        );
      })}
      {!groups.length && (
        <p className="text-sm text-muted-foreground">
          No hay componentes con ese nombre.
        </p>
      )}
    </nav>
  );
}
