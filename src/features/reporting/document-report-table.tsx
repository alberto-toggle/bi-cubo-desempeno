import Link from "next/link";
import type { ChapterCell, ChapterTable } from "./chapter-tables-model";
import { ReportPanel } from "./report-layout";
import { documentTableColors } from "./report-palette";

function ReportCell({
  cell,
  formatMoney,
  formatPercent,
}: {
  cell: ChapterCell;
  formatMoney: (v: number) => string;
  formatPercent: (v: number | null) => string;
}) {
  if (cell.type === "text")
    return (
      <div className="space-y-1">
        {cell.lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    );
  if (cell.type === "percent")
    return (
      <strong className="text-lg tabular-nums">
        {formatPercent(cell.value)}
      </strong>
    );
  if (cell.type === "parts")
    return (
      <dl className="space-y-2">
        {cell.parts.map((part) => (
          <div key={part.label}>
            <dt className="text-[11px]">{part.label}</dt>
            <dd className="font-semibold tabular-nums">
              {formatMoney(part.value)}
              {part.percent !== undefined && (
                <span className="ml-2 font-normal">
                  ({formatPercent(part.percent)})
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  return (
    <div className="space-y-1 tabular-nums">
      <p className="font-semibold">{formatMoney(cell.value)}</p>
      {cell.percent !== undefined && <p>({formatPercent(cell.percent)})</p>}
      {cell.note && <p className="text-[10px]">{cell.note}</p>}
    </div>
  );
}
export function DocumentReportTable({
  data,
  formatMoney,
  formatPercent,
}: {
  data: ChapterTable;
  formatMoney: (v: number) => string;
  formatPercent: (v: number | null) => string;
}) {
  return (
    <ReportPanel title={data.title} description={data.description}>
      <div
        className="overflow-x-auto rounded-lg border border-border"
        tabIndex={0}
        role="region"
        aria-label={data.title}
      >
        <table
          className={`w-full border-collapse text-left text-xs ${data.columns.length > 2 ? "min-w-[560px]" : ""}`}
        >
          <thead
            style={{
              background: documentTableColors.header,
              color: documentTableColors.headerText,
            }}
          >
            <tr>
              {data.columns.map((label) => (
                <th
                  scope="col"
                  key={label}
                  className="border-r border-black/15 px-4 py-3 font-semibold last:border-r-0"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr
                key={row.id}
                style={{
                  background: row.color,
                  color: documentTableColors.text,
                }}
                className="border-t border-black/20"
              >
                <th
                  scope="row"
                  style={
                    row.labelColor ? { background: row.labelColor } : undefined
                  }
                  className="min-w-44 border-r border-black/15 px-4 py-4 align-top font-medium"
                >
                  <Link
                    className="underline decoration-current/50 underline-offset-4 hover:decoration-current"
                    href={`/establishments/${row.id}#reporte-gestion`}
                  >
                    {row.label}
                  </Link>
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={data.columns[i + 1]}
                    className="border-r border-black/15 px-4 py-4 align-top last:border-r-0"
                  >
                    <ReportCell
                      cell={cell}
                      formatMoney={formatMoney}
                      formatPercent={formatPercent}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!data.rows.length && (
          <p className="p-5 text-sm">Sin instalaciones para este corte.</p>
        )}
      </div>
    </ReportPanel>
  );
}
