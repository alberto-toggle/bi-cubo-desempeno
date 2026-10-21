import type { TableColumnLayout } from "@/components/layout/data-table-layout";

export const unitColumns = [
  { key: "identity", width: "30%" },
  { key: "segment", width: "18%" },
  { key: "revenue", width: "15%" },
  { key: "contribution", width: "15%" },
  { key: "status", width: "17%" },
  { key: "detail", width: "5%" },
] as const satisfies readonly TableColumnLayout[];
export const catalogColumns = [
  { key: "code", width: "10%" },
  { key: "name", width: "35%" },
  { key: "relation", width: "25%" },
  { key: "source", width: "15%" },
  { key: "action", width: "15%" },
] as const satisfies readonly TableColumnLayout[];
export const tableLayout = {
  units: "w-full min-w-[960px] table-fixed text-left text-sm",
  catalogs: "w-full min-w-[880px] table-fixed text-left text-xs",
  unitCell: "px-5 py-4",
  catalogCell: "p-4",
  unitHead: "border-b border-border text-xs text-muted-foreground",
  catalogHead: "border-b border-border bg-muted/40 text-muted-foreground",
  footer:
    "flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-xs",
} as const;
