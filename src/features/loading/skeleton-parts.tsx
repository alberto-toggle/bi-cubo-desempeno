import { DataTableLayout } from "@/components/layout/data-table-layout";
import {
  tableLayout,
  unitColumns,
  catalogColumns,
} from "@/features/intelligence/table-layout";
import { intelligenceLayout } from "@/features/intelligence/layout";
import type { ReactNode } from "react";

export function Bone({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton-bone ${className}`} />;
}
export function LoadingFrame({
  children,
  className = "space-y-7",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando vista"
      className={className}
    >
      <span className="sr-only">Cargando vista</span>
      <div aria-hidden="true" className={className}>
        {children}
      </div>
    </div>
  );
}
export function HeadingSkeleton({ action = false }: { action?: boolean }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="w-full max-w-xl space-y-3">
        <Bone className="h-3 w-36" />
        <Bone className="h-9 w-4/5" />
        <Bone className="h-5 w-full" />
      </div>
      {action && <Bone className="h-9 w-32" />}
    </header>
  );
}
export function HelpSkeleton() {
  return <Bone className="h-14 w-full rounded-xl" />;
}
export function FiltersSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: count }, (_, i) => (
          <Bone key={i} className="h-9 w-40" />
        ))}
      </div>
      <Bone className="h-9 w-9" />
    </div>
  );
}
export function MetricsSkeleton() {
  return (
    <div className={intelligenceLayout.metrics}>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className={intelligenceLayout.metricCard}>
          <Bone className="h-4 w-24" />
          <Bone className="mt-4 h-8 w-32" />
          <Bone className="mt-3 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}
export function ChartSkeleton() {
  return (
    <section className={intelligenceLayout.chartCard}>
      <div className={intelligenceLayout.chartHeader}>
        <Bone className="h-6 w-40" />
        <Bone className="h-4 w-32" />
      </div>
      <div
        className={`${intelligenceLayout.chartPlot} relative border-b border-l border-border`}
      >
        <div className="absolute inset-0 flex flex-col justify-between pb-6">
          {[0, 1, 2, 3].map((i) => (
            <Bone key={i} className="h-px w-full" />
          ))}
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 500 230"
          preserveAspectRatio="none"
          className="h-full w-full text-muted"
        >
          <path
            d="M0 190 L100 150 L200 170 L300 90 L400 110 L500 40 L500 230 L0 230 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <Bone className="mt-4 h-4 w-40" />
    </section>
  );
}
export function RankingSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <section className={intelligenceLayout.bentoCard}>
      <Bone className="h-6 w-40" />
      <Bone className="mt-1 h-4 w-4/5" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i}>
            <div className="mb-2 flex justify-between gap-5">
              <Bone className="h-4 w-3/5" />
              <Bone className="h-4 w-20" />
            </div>
            <Bone className="h-1 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
export function TableSkeleton({ catalog = false }: { catalog?: boolean }) {
  const columns = catalog ? catalogColumns : unitColumns;
  const cell = catalog ? tableLayout.catalogCell : tableLayout.unitCell;
  return (
    <section className="surface overflow-hidden">
      {!catalog && (
        <header className={intelligenceLayout.directoryHeader}>
          <Bone className="h-6 w-48" />
          <Bone className="h-9 w-52" />
        </header>
      )}
      <DataTableLayout
        columns={columns}
        className={catalog ? tableLayout.catalogs : tableLayout.units}
      >
        <thead
          className={catalog ? tableLayout.catalogHead : tableLayout.unitHead}
        >
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cell}>
                <Bone className="h-4 w-4/5" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: 10 }, (_, i) => (
            <tr key={i}>
              {columns.map((column) => (
                <td key={column.key} className={cell}>
                  <Bone className="h-4 w-4/5" />
                  {(column.key === "identity" || column.key === "name") && (
                    <Bone className="mt-1 h-4 w-3/4" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </DataTableLayout>
      <footer className={tableLayout.footer}>
        <Bone className="h-4 w-32" />
        <div className="flex gap-3">
          <Bone className="h-9 w-24" />
          <Bone className="h-9 w-24" />
        </div>
      </footer>
    </section>
  );
}
