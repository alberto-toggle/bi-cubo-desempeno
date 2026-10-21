"use client";
import { useState } from "react";
import { UnitsTable } from "./presentation";
import type { BusinessUnit } from "./model";
import type { IdentityMode } from "@/features/demo/identity-policy";
export function PaginatedUnits({
  units,
  mode,
  period,
}: {
  units: BusinessUnit[];
  mode: IdentityMode;
  period: string;
}) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(units.length / 10));
  const current = Math.min(page, pages - 1);
  return (
    <>
      <UnitsTable
        units={units.slice(current * 10, current * 10 + 10)}
        mode={mode}
        period={period}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-xs">
        <span className="text-muted-foreground">
          {units.length
            ? `${current * 10 + 1}–${Math.min(current * 10 + 10, units.length)}`
            : "0"}{" "}
          de {units.length} unidades
        </span>
        <div className="flex items-center gap-3">
          <button
            className="secondary-button disabled:opacity-40"
            disabled={!current}
            onClick={() => setPage(current - 1)}
          >
            Anterior
          </button>
          <span aria-live="polite">
            {current + 1} / {pages}
          </span>
          <button
            className="secondary-button disabled:opacity-40"
            disabled={current + 1 === pages}
            onClick={() => setPage(current + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
}
