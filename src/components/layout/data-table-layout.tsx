import type { ReactNode } from "react";

/** Table geometry only; headers, rows and loading content belong to the caller. */
export type TableColumnLayout = { key: string; width: string };
export function DataTableLayout({
  columns,
  children,
  className,
}: {
  columns: readonly TableColumnLayout[];
  children: ReactNode;
  className: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={className}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        {children}
      </table>
    </div>
  );
}
