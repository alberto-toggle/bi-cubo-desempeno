"use client";
import { sportsColors } from "./report-palette";
import { MetricChart } from "@/components/charts/metric-chart";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { demoUnitOperations } from "@/services/demo-unit-operations";
import { ReportMetrics, ReportPanel, reportLayout } from "./report-layout";
import { monthNames, type ReportProfile } from "./model";
import { demoSportsIncome } from "@/services/demo-sports-income";
import { IncomeBreakdownCard } from "./income-breakdown-card";
const incomeMoney = (cents: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
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
  const money = usePrivateFormatter(incomeMoney);
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
  const income = demoSportsIncome(revenue);
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
        ].map((item) => ({ ...item, color: sportsColors.positive }))}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Altas",
            value: data.joins,
            note: "Altas del mes",
            color: sportsColors.positive,
            background: sportsColors.positiveSurface,
          },
          {
            label: "Bajas",
            value: data.manualLeaves + data.automaticLeaves,
            note: `Manual ${data.manualLeaves} · Automático ${data.automaticLeaves}`,
            color: sportsColors.negative,
            background: sportsColors.negativeSurface,
          },
          {
            label: "Reactivaciones",
            value: data.reactivations,
            note: `AC ${data.reactivations} · RC 0 · ST 0`,
            color: sportsColors.registration,
            background: sportsColors.registrationSurface,
          },
        ].map((m) => (
          <article
            key={m.label}
            className="surface p-5"
            style={{
              background: m.background,
              color: m.color,
              borderColor: m.background,
            }}
          >
            <p className="text-sm">{m.label}</p>
            <p className="my-2 text-3xl font-semibold">{m.value}</p>
            <p className="text-xs">{m.note}</p>
          </article>
        ))}
      </div>
      <div className={reportLayout.pair}>
        {[
          {
            label: "Ingresos mensualidades",
            title: "Desglose de Mensualidades",
            data: income.monthly,
            background: sportsColors.incomeBackground,
          },
          {
            label: "Inscripciones",
            title: "Ingresos por Inscripciones",
            data: income.registrations,
            background: sportsColors.registrationBackground,
          },
        ].map((card) => (
          <IncomeBreakdownCard
            key={card.label}
            label={card.label}
            title={card.title}
            total={money(card.data.total)}
            background={card.background}
            period={`${monthNames[month - 1]} ${year}`}
            items={card.data.items.map((item) => ({
              label: item.label,
              value: money(item.value),
            }))}
          />
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
            curve="monotone"
            showPoints
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
