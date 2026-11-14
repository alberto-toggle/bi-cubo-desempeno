"use client";
import type { ResponsiblePerformanceData } from "@/services/demo-responsible-performance";
import { ReportMetrics, ReportPanel } from "./report-layout";
import { formatPercent, percent, reportMoney, monthNames } from "./model";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
function periodLabel(period: string) {
  const [y, m] = period.split("-");
  return `${monthNames[Number(m) - 1]} ${y}`;
}
export function ResponsiblePerformance({
  data,
}: {
  data: ResponsiblePerformanceData | null;
}) {
  const money = usePrivateFormatter(reportMoney);
  if (!data)
    return (
      <ReportPanel title="Desempeño del responsable">
        <p className="text-sm text-muted-foreground">
          Selecciona un corte con tres meses completos posteriores al
          nombramiento para consultar esta gestión. No se atribuyen resultados
          anteriores a la persona actual.
        </p>
      </ReportPanel>
    );
  const change = data.salesGrowth;
  return (
    <div className="space-y-5">
      <ReportPanel
        title="Desempeño del responsable"
        description="Comparación de la misma persona entre asignaciones ficticias. Ventana de tres meses completos; no implica causalidad sobre los resultados."
      >
        <h3 className="text-xl font-semibold">{data.name}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs text-muted-foreground">
              Asignación actual · últimos 3 meses
            </p>
            <p className="mt-1 font-medium">{data.unitName}</p>
            <p className="mt-2 text-sm">
              {periodLabel(data.start)} – {periodLabel(data.end)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Nombramiento: {data.appointed}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">
              Gestión anterior de la misma persona
            </p>
            <p className="mt-1 font-medium">{data.previousUnitName}</p>
            <p className="mt-2 text-sm">
              {periodLabel(data.previousStart)} –{" "}
              {periodLabel(data.previousEnd)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Tres meses previos al cambio de asignación.
            </p>
          </div>
        </div>
      </ReportPanel>
      <ReportMetrics
        items={[
          {
            label: "Cumplimiento de meta de utilidad",
            value: formatPercent(data.achievement),
            note: `Meta de los 3 meses: ${money(data.target)}`,
          },
          {
            label: "Variación de ventas",
            value: formatPercent(change),
            note:
              change === null
                ? "Sin base comparable"
                : change >= 0
                  ? "Incremento frente a su gestión anterior"
                  : "Disminución frente a su gestión anterior",
          },
          {
            label: "Ventas de los últimos 3 meses",
            value: money(data.sales),
            note: `Gestión anterior: ${money(data.priorSales)}`,
          },
          {
            label: "Utilidad de los últimos 3 meses",
            value: money(data.utility),
            note: `Gestión anterior: ${money(data.priorUtility)}`,
          },
        ]}
      />
      <ReportPanel
        title="Seguimiento mensual"
        description="La meta corresponde a utilidad, no a ventas. Se prorratea la meta anual entre 12 meses."
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {data.entries.map((m) => (
            <article
              key={m.period}
              className="rounded-xl border border-border p-4"
            >
              <h3 className="font-semibold">{periodLabel(m.period)}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Ventas", money(m.revenue)],
                  ["Utilidad", money(m.utility)],
                  ["Meta de utilidad", money(m.target)],
                  ["Cumplimiento", formatPercent(percent(m.utility, m.target))],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-wrap justify-between gap-2"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </ReportPanel>
      <ReportPanel
        title="Comparación de gestiones"
        description="Misma duración para ambas ventanas. Las diferencias de instalación, capacidad y estacionalidad pueden influir en la variación."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3">Indicador</th>
                <th className="p-3">Gestión anterior</th>
                <th className="p-3">Gestión actual</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Ventas mensuales promedio",
                  money(data.priorSales / 3),
                  money(data.sales / 3),
                ],
                [
                  "Utilidad mensual promedio",
                  money(data.priorUtility / 3),
                  money(data.utility / 3),
                ],
                [
                  "Meta de utilidad (3 meses)",
                  money(data.priorTarget),
                  money(data.target),
                ],
                [
                  "Cumplimiento de meta",
                  formatPercent(data.priorAchievement),
                  formatPercent(data.achievement),
                ],
              ].map(([label, prior, current]) => (
                <tr key={label} className="border-b border-border">
                  <th className="p-3 font-medium">{label}</th>
                  <td className="p-3 tabular-nums">{prior}</td>
                  <td className="p-3 tabular-nums">{current}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {data.source} Importes simulados en MXN.
        </p>
      </ReportPanel>
    </div>
  );
}
