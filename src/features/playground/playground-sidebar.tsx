"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { groupBlocks, playgroundBlocks } from "@/lib/playground";
import { PlaygroundNavigation } from "./playground-navigation";
export function PlaygroundSidebar() {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const groups = groupBlocks(
    playgroundBlocks.filter((b) =>
      [b.title, b.provider, b.category]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
  );
  return (
    <div className="sidebar-catalog mt-7">
      <input
        type="search"
        aria-label="Buscar componentes"
        placeholder="Buscar componente…"
        className="w-full rounded-lg border border-white/15 p-3 text-xs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <PlaygroundNavigation
        groups={groups}
        pathname={pathname}
        searching={Boolean(query.trim())}
      />
    </div>
  );
}
