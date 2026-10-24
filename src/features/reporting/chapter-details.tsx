"use client";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { demoChapterTables } from "@/services/demo-chapter-tables";
import type { ChapterTable, ChapterUnitResult } from "./chapter-tables-model";
import { DocumentReportTable } from "./document-report-table";
import { formatPercent, monthNames, reportMoney } from "./model";
import { ReportMetrics, reportLayout } from "./report-layout";
import { documentTableColors } from "./report-palette";
export function ChapterDetails({
  line,
  rows,
  year,
  month,
}: {
  line: string;
  rows: ChapterUnitResult[];
  year: number;
  month: number;
}) {
  const money = usePrivateFormatter(reportMoney);
  const data = demoChapterTables(line, rows, year, month);
  const occupancyTable = (average: boolean): ChapterTable => ({
    title: average
      ? `Ocupación promedio · Ene–${monthNames[month - 1]} ${year}`
      : `Ocupación · ${monthNames[month - 1]} ${year}`,
    description: average
      ? "Habitaciones-noches ocupadas / disponibles durante el acumulado."
      : "Habitaciones-noches ocupadas / disponibles únicamente en el mes seleccionado.",
    columns: ["Instalación", "Ocupación"],
    rows: data.occupancy.map((row) => ({
      id: row.id,
      label: row.label,
      color: documentTableColors.occupancy,
      labelColor: row.color,
      cells: [{ type: "percent", value: average ? row.average : row.current }],
    })),
  });
  return (
    <div className="space-y-5">
      <DocumentReportTable
        data={data.main}
        formatMoney={money}
        formatPercent={formatPercent}
      />
      {!!data.occupancy.length && (
        <div className={reportLayout.pair}>
          {[true, false].map((average) => (
            <DocumentReportTable
              key={String(average)}
              data={occupancyTable(average)}
              formatMoney={money}
              formatPercent={formatPercent}
            />
          ))}
        </div>
      )}
      {data.supplementary && (
        <DocumentReportTable
          data={data.supplementary}
          formatMoney={money}
          formatPercent={formatPercent}
        />
      )}
      {line === "Criadero" && (
        <ReportMetrics
          items={[
            {
              label: `Meta ${year}`,
              value: money(data.target),
              note: "Meta anual simulada",
            },
            {
              label: "% avance",
              value: formatPercent(data.advance),
              note: "Utilidad acumulada / meta anual",
            },
            {
              label: "% por recabar",
              value: formatPercent(data.pending),
              note: "Porcentaje pendiente para alcanzar la meta",
            },
          ]}
        />
      )}
    </div>
  );
}
