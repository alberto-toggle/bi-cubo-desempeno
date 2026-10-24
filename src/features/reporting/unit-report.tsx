"use client";
import { useState } from "react";
import { ResponsibleCard } from "./responsible-card";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import {
  presentResponsible,
  type IdentityMode,
} from "@/features/demo/identity-policy";
import { FilterSelect } from "@/features/intelligence/filters";
import { useReport } from "./use-report";
import { ReportDetailSkeleton } from "./report-skeleton";
import { initialReportPeriod, ReportPeriodControl } from "./period-control";
import {
  formatPercent,
  growth,
  monthNames,
  reportMoney,
  calendarTimeline,
  total,
} from "./model";
import { reportLayout, ReportMetrics } from "./report-layout";
import { ReportChart } from "./report-chart";
import { GoalPanel } from "./goal-panel";
import { goalColors } from "./report-palette";
import { ReportTabs } from "./report-tabs";
import { FinancialDetail } from "./financial-detail";
import { SportsDetail } from "./sports-detail";
import { unitReportSummary } from "./unit-report-summary";
export function UnitReport({
  unitId,
  mode,
  kind,
}: {
  unitId: string;
  mode: IdentityMode;
  kind: string;
}) {
  const money = usePrivateFormatter(reportMoney);
  const report = useReport();
  const [period, setPeriod] = useState(initialReportPeriod);
  const [window, setWindow] = useState("36");
  if (report.error)
    return (
      <div className="surface p-6" role="alert">
        {report.error}
        <button
          className="secondary-button mt-3"
          onClick={() => void report.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  if (!report.data) return <ReportDetailSkeleton />;
  const profile = report.data.profiles.find((p) => p.unitId === unitId);
  if (!profile) return <p className="surface p-6">Sin histórico disponible.</p>;
  const summary = unitReportSummary(profile, period),
    responsible = presentResponsible(profile.staff, mode);
  const amount = total(profile, period.year, period.month),
    prior = total(profile, period.year - 1, period.month),
    target = profile.targets[period.year];
  const firstYear = period.year - Number(window) / 12 + 1;
  const series = calendarTimeline(profile, period, Number(window));
  const comparison = (
    <div className={reportLayout.pair}>
      <ReportChart
        id="unit-annual"
        title={`Comparativo anual · Media ${summary.completedYears[0]}–${summary.completedYears.at(-1)}`}
        description="Ejercicios anteriores completos; ejercicio actual al corte. Línea: media de ejercicios completos."
        data={summary.annual.map((r) => ({
          year: r.year,
          label: String(r.year),
          value: r.value,
        }))}
        reference={summary.annualMean}
      />
      <ReportChart
        id="unit-same-period"
        title="Comparativo al mismo corte"
        description={`Enero–${monthNames[period.month - 1]} de cada año`}
        data={[period.year - 2, period.year - 1, period.year]
          .filter((y) => y >= 2023)
          .map((year) => ({
            year,
            label: String(year),
            value: total(profile, year, period.month),
          }))}
      />
    </div>
  );
  const history = (
    <>
      <div className="flex justify-end">
        <FilterSelect
          label="Años del histórico"
          value={window}
          onChange={setWindow}
          options={[
            { value: "12", label: "12 meses · año calendario" },
            { value: "24", label: "24 meses · 2 años" },
            { value: "36", label: "36 meses · 3 años" },
          ]}
        />
      </div>
      <ReportChart
        id="unit-history"
        title="Utilidades mensuales"
        description="Tres años calendario por defecto. Meses posteriores al corte sin barras. Medias calculadas sobre meses disponibles; tendencias de 6 y 24 meses."
        family="timeline"
        data={series}
        yearMeans={summary.annual.filter((r) => r.year >= firstYear)}
      />
      {comparison}
      <ReportMetrics
        items={[
          {
            label: `Variación ${period.year - 1}–${period.year}`,
            color: amount >= prior ? goalColors.target : goalColors.planned,
            value: formatPercent(growth(amount, prior)),
            note: `Enero–${monthNames[period.month - 1]} de ambos ejercicios`,
          },
          {
            label: "Capital de trabajo",
            value: money(profile.workingCapital),
            note: "Saldo simulado de referencia",
          },
          {
            label: "Fondo revolvente",
            value: money(profile.revolvingFund),
            note: "Saldo simulado de referencia",
          },
          {
            label: "Locales comerciales",
            value: money(summary.premisesRevenue),
            note: "Rentas al corte incluidas en ingresos",
          },
        ]}
      />
      <div className={reportLayout.pair}>
        <GoalPanel
          id="unit-goal"
          actual={amount}
          target={target}
          month={period.month}
        />
        <div className="surface p-6">
          <h3 className="mb-5 font-semibold">Resultados al corte</h3>
          <dl className="space-y-5">
            {[
              ["Ventas", summary.sales],
              ["Meta anual", target],
              ["Avance", amount],
              ["Pendiente", Math.max(0, target - amount)],
              ["Media mensual objetivo", Math.round(target / 12)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-3 border-b border-border pb-3 text-sm"
              >
                <dt>{label}</dt>
                <dd className="font-semibold tabular-nums">
                  {money(Number(value))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
  return (
    <section id="reporte-gestion" className={reportLayout.page}>
      <header className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="eyebrow">Detalle de unidad</p>
          <h2 className="mt-2 text-xl font-semibold">Resultados y operación</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Cifras y personas ficticias · MXN
          </p>
        </div>
        <ReportPeriodControl value={period} onChange={setPeriod} />
      </header>
      <div className={reportLayout.detail}>
        <ResponsibleCard
          name={responsible.name}
          appointed={responsible.appointed}
          staff={profile.staff}
        />
        <div className="min-w-0">
          <ReportTabs
            items={[
              ...(kind === "Centro deportivo"
                ? [
                    {
                      id: "sports",
                      label: "Operación deportiva",
                      content: (
                        <SportsDetail
                          profile={profile}
                          year={period.year}
                          month={period.month}
                        />
                      ),
                    },
                  ]
                : []),
              {
                id: "history",
                label: "Resultados y comparativos",
                content: history,
              },
              {
                id: "financial",
                label: "Información financiera",
                content: (
                  <FinancialDetail
                    profile={profile}
                    kind={kind}
                    year={period.year}
                    month={period.month}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
