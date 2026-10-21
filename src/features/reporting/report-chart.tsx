"use client";
import {
  MetricChart,
  type MetricPoint,
} from "@/components/charts/metric-chart";
import { useChartView } from "./chart-view-control";
import { ReportPanel } from "./report-layout";
import { reportMoney } from "./model";
export function ReportChart({
  id,
  title,
  description,
  data,
  family = "comparison",
  reference,
  valueLabel,
}: {
  id: string;
  title: string;
  description: string;
  data: MetricPoint[];
  family?: "comparison" | "timeline";
  reference?: number;
  valueLabel?: string;
}) {
  const { view, control } = useChartView(id, family);
  // Narrow to this renderer’s supported families after preference validation.
  if (view === "progress" || view === "target") return null;
  return (
    <ReportPanel title={title} description={description} control={control}>
      <MetricChart
        valueLabel={valueLabel}
        data={data}
        view={view}
        formatValue={reportMoney}
        reference={reference}
      />
      {reference !== undefined && (
        <p className="mt-3 text-xs text-muted-foreground">
          Línea de referencia · Media: {reportMoney(reference)}
        </p>
      )}
      {view !== "table" && (
        <details className="mt-4 text-xs text-muted-foreground">
          <summary className="cursor-pointer">Consultar datos exactos</summary>
          <MetricChart
            data={data}
            view="table"
            formatValue={reportMoney}
            valueLabel={valueLabel}
          />
        </details>
      )}
    </ReportPanel>
  );
}
