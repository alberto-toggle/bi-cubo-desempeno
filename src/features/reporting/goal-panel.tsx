"use client";
import { useChartView } from "./chart-view-control";
import { ReportPanel } from "./report-layout";
import { MetricChart } from "@/components/charts/metric-chart";
import { reportMoney, percent, formatPercent } from "./model";
export function GoalPanel({
  id,
  actual,
  target,
  month,
}: {
  id: string;
  actual: number;
  target: number;
  month: number;
}) {
  const { view, control } = useChartView(id, "goal"),
    planned = Math.round((target * month) / 12),
    advance = percent(actual, target);
  return (
    <ReportPanel
      title="Avance contra meta anual"
      description="Programación lineal para esta simulación. El avance real se calcula sobre la meta completa."
      control={control}
    >
      {view === "progress" ? (
        <div className="flex min-h-80 flex-col justify-center gap-6">
          <div className="flex items-end justify-between gap-3">
            <strong className="text-4xl tracking-tight tabular-nums">
              {formatPercent(advance)}
            </strong>
            <span className="text-xs text-muted-foreground">
              Meta {reportMoney(target)}
            </span>
          </div>
          <div
            className="relative h-5 rounded-full bg-muted"
            role="meter"
            aria-label="Cumplimiento de meta"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.max(0, Math.min(100, advance ?? 0))}
            aria-valuetext={formatPercent(advance)}
          >
            <div
              className="h-full rounded-full bg-chart-1"
              style={{ width: `${Math.max(0, Math.min(100, advance ?? 0))}%` }}
            />
            <span
              className="absolute -top-2 h-9 w-px bg-foreground"
              style={{ left: `${(month / 12) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Marca: avance programado a este corte (
            {formatPercent((month / 12) * 100)}).{" "}
            {actual > target
              ? "Meta superada."
              : actual < 0
                ? "Utilidades negativas al corte."
                : ""}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Utilidades acumuladas
              </p>
              <p className="mt-2 font-semibold">{reportMoney(actual)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pendiente de meta</p>
              <p className="mt-2 font-semibold">
                {reportMoney(Math.max(0, target - actual))}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <MetricChart
          data={
            view === "target"
              ? [{ label: "Utilidades", value: actual }]
              : [
                  { label: "Meta anual", value: target },
                  { label: "Programado", value: planned },
                  { label: "Utilidades", value: actual },
                ]
          }
          view={view === "target" ? "bars" : "columns"}
          reference={view === "target" ? target : undefined}
          formatValue={reportMoney}
        />
      )}
      <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-muted/40 p-4">
        <div>
          <dt className="text-xs text-muted-foreground">Porcentaje por recabar</dt>
          <dd className="mt-2 font-semibold tabular-nums">{formatPercent(advance === null ? null : Math.max(0, 100 - advance))}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Media mensual objetivo</dt>
          <dd className="mt-2 font-semibold tabular-nums">{reportMoney(Math.round(target / 12))}</dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
        Diferencia contra programado:{" "}
        <strong className="text-foreground">
          {reportMoney(actual - planned)}
        </strong>{" "}
        · Programado: {reportMoney(planned)}
        {view === "target" ? " · Línea: meta anual" : ""}
      </p>
    </ReportPanel>
  );
}
