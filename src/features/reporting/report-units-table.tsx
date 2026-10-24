"use client";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DataTableLayout } from "@/components/layout/data-table-layout";
import { ReportPanel } from "./report-layout";
import { reportUnitColumns, reportTableClass } from "./report-table-layout";
import { formatPercent, percent, reportMoney as originalMoney } from "./model";
import type { ReportUnitRow } from "./model";
export type { ReportUnitRow } from "./model";
export function ReportUnitsTable({ rows }: { rows: ReportUnitRow[] }) {
  const reportMoney = usePrivateFormatter(originalMoney);
  const [page, setPage] = useState(0),
    pages = Math.max(1, Math.ceil(rows.length / 10)),
    current = Math.min(page, pages - 1);
  return (
    <ReportPanel
      title="Resultados por establecimiento"
      description="Selecciona una unidad para consultar su histórico y metas."
    >
      <DataTableLayout columns={reportUnitColumns} className={reportTableClass}>
        <thead>
          <tr>
            {[
              "Establecimiento",
              "Giro",
              "Utilidades",
              "Meta anual",
              "Avance",
            ].map((h) => (
              <th
                key={h}
                className="px-3 py-4 font-medium text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(current * 10, current * 10 + 10).map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-muted/40">
              <td className="px-3 py-4">
                <Link
                  className="inline-flex items-center gap-2 font-medium hover:text-primary"
                  href={`/establishments/${r.id}#reporte-gestion`}
                >
                  {r.label}
                  <ArrowUpRight size={14} className="shrink-0" />
                </Link>
              </td>
              <td className="px-3 py-4">{r.line}</td>
              <td className="px-3 py-4 tabular-nums">{reportMoney(r.value)}</td>
              <td className="px-3 py-4 tabular-nums">
                {reportMoney(r.target)}
              </td>
              <td className="px-3 py-4 tabular-nums">
                {formatPercent(percent(r.value, r.target))}
              </td>
            </tr>
          ))}
        </tbody>
      </DataTableLayout>
      {!rows.length && (
        <p className="p-6 text-sm text-muted-foreground">
          No hay unidades para esta selección.
        </p>
      )}
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
        <span>
          {rows.length} unidades · Página {current + 1} de {pages}
        </span>
        <div className="flex gap-2">
          <button
            className="secondary-button disabled:opacity-40"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            Anterior
          </button>
          <button
            className="secondary-button disabled:opacity-40"
            disabled={current + 1 === pages}
            onClick={() => setPage(current + 1)}
          >
            Siguiente
          </button>
        </div>
      </footer>
    </ReportPanel>
  );
}
