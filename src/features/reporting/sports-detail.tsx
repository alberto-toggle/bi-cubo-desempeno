"use client";
import { sportsColors } from "./report-palette";
import { MetricChart } from "@/components/charts/metric-chart";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { demoUnitOperations } from "@/services/demo-unit-operations";
import { ReportMetrics, ReportPanel, reportLayout } from "./report-layout";
import { reportMoney, type ReportProfile } from "./model";
const count = (n: number) => n.toLocaleString("es-MX");
export function SportsDetail({
  profile,
  year,
  month,
}: {
  profile: ReportProfile;
  year: number;
  month: number;
}) {
  const money = usePrivateFormatter(reportMoney);
  const data = demoUnitOperations(
    profile.unitId,
    "Centro deportivo",
    year,
    month,
  );
  const revenue =
    profile.months.find(
      (m) => m.period === `${year}-${String(month).padStart(2, "0")}`,
    )?.revenue ?? 0;
  const subscriptions = Math.round(revenue * 0.88);
  return (
    <div className={reportLayout.page}>
      <ReportMetrics
        items={[
          { label: "Socios activos", value: count(data.active), note: "AC" },
          {
            label: "Socios morosos",
            value: count(data.delinquent),
            note: "ST",
          },
          {
            label: "Socios inactivos",
            value: count(data.inactive),
            note: `HT ${data.inactiveHT} · NA ${data.inactiveNA}`,
          },
          {
            label: "Total accesos",
            value: count(data.accesses),
            note: "Mes seleccionado",
          },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Altas",
            value: data.joins,
            note: "Altas del mes",
            color: sportsColors.positive,
          },
          {
            label: "Bajas",
            value: data.manualLeaves + data.automaticLeaves,
            note: `Manual ${data.manualLeaves} · Automático ${data.automaticLeaves}`,
            color: sportsColors.negative,
          },
          {
            label: "Reactivaciones",
            value: data.reactivations,
            note: `AC ${data.reactivations} · RC 0 · ST 0`,
            color: sportsColors.registration,
          },
        ].map((m) => (
          <article
            key={m.label}
            className="surface border-t-4 p-5"
            style={{ borderTopColor: m.color }}
          >
            <p className="text-sm">{m.label}</p>
            <p className="my-2 text-3xl font-semibold">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.note}</p>
          </article>
        ))}
      </div>
      <div className={reportLayout.pair}>
        {[
          {
            label: "Ingresos mensualidades",
            value: subscriptions,
            color: sportsColors.positive,
          },
          {
            label: "Inscripciones",
            value: revenue - subscriptions,
            color: sportsColors.registration,
          },
        ].map((m) => (
          <article
            key={m.label}
            className="rounded-xl p-6 text-white"
            style={{ background: m.color }}
          >
            <h3>{m.label}</h3>
            <p className="mt-3 text-3xl font-semibold">{money(m.value)}</p>
          </article>
        ))}
      </div>
      {[
        { title: "Accesos por día", points: data.daily },
        { title: "Accesos por mes", points: data.monthly },
      ].map((chart) => (
        <ReportPanel
          key={chart.title}
          title={chart.title}
          description="Datos operativos simulados; meses posteriores al corte sin información."
        >
          <MetricChart
            data={chart.points}
            view="area"
            formatValue={count}
            valueLabel="Accesos"
            baseColor={sportsColors.positive}
            numericDivisor={1}
          />
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer">
              Consultar accesos exactos
            </summary>
            <MetricChart
              data={chart.points}
              view="table"
              formatValue={count}
              valueLabel="Accesos"
            />
          </details>
        </ReportPanel>
      ))}
    </div>
  );
}
