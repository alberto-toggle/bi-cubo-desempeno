"use client";
import { useFinancialPrivacy } from "@/features/privacy/use-financial-privacy";
import { PrivateChartNotice } from "@/features/privacy/privacy-control";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import {
  MetricChart,
  type MetricPoint,
} from "@/components/charts/metric-chart";
import { reportPalette } from "./report-palette";
import { useChartView } from "./chart-view-control";
import { ReportPanel } from "./report-layout";
import { reportMoney as originalMoney } from "./model";
export function ReportChart({
  id,
  title,
  description,
  data,
  family = "comparison",
  reference,
  valueLabel,
  yearMeans,
}: {
  id: string;
  title: string;
  description: string;
  data: MetricPoint[];
  family?: "comparison" | "timeline";
  reference?: number;
  valueLabel?: string;
  yearMeans?: { year: number; mean: number }[];
}) {
  const { hidden } = useFinancialPrivacy();
  const reportMoney = usePrivateFormatter(originalMoney);
  const { view, control } = useChartView(id, family);
  // Narrow to this renderer’s supported families after preference validation.
  if (view === "progress" || view === "target") return null;
  if (hidden)
    return (
      <ReportPanel title={title}>
        <PrivateChartNotice />
      </ReportPanel>
    );
  return (
    <ReportPanel title={title} description={description} control={control}>
      <MetricChart
        palette={reportPalette}
        yearMeans={yearMeans}
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
