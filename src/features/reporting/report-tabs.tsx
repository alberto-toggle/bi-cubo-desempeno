"use client";
import type { ReactNode } from "react";
import { Tabs } from "@base-ui/react/tabs";
export function ReportTabs({
  items,
}: {
  items: { id: string; label: string; content: ReactNode }[];
}) {
  return (
    <Tabs.Root defaultValue={items[0].id}>
      <Tabs.List
        aria-label="Secciones del reporte"
        className="mb-6 flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1"
      >
        {items.map((item) => (
          <Tabs.Tab
            key={item.id}
            value={item.id}
            className="shrink-0 rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground data-[active]:bg-card data-[active]:text-foreground data-[active]:shadow-sm"
          >
            {item.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Panel
          key={item.id}
          value={item.id}
          className="space-y-6 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {item.content}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
