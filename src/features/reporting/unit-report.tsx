"use client";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import {
  presentResponsible,
  type IdentityMode,
} from "@/features/demo/identity-policy";
import { ReportTabs } from "./report-tabs";
import { UnitFacts } from "./unit-facts";
import { YearlyMeans } from "./yearly-means";
import { unitReportSummary } from "./unit-report-summary";
import { useState } from "react";
import { useReport } from "./use-report";
import { ReportDetailSkeleton } from "./report-skeleton";
import { initialReportPeriod, ReportPeriodControl } from "./period-control";
import {
  formatPercent,
  growth,
  monthNames,
  reportMoney as originalMoney,
  timeline,
  total,
} from "./model";
import { reportLayout, ReportMetrics } from "./report-layout";
import { ReportChart } from "./report-chart";
import { GoalPanel } from "./goal-panel";
import { FilterSelect } from "@/features/intelligence/filters";
export function UnitReport({
  unitId,
  mode,
}: {
  unitId: string;
  mode: IdentityMode;
}) {
  const reportMoney = usePrivateFormatter(originalMoney);
  const report = useReport(),
    [period, setPeriod] = useState(initialReportPeriod),
    [window, setWindow] = useState("36");
  if (report.error)
    return (
      <div className="surface p-6" role="alert">
        <p>{report.error}</p>
        <button
          className="secondary-button mt-3"
          onClick={() => void report.reload()}
        >
          Reintentar reporte
        </button>
      </div>
    );
  if (!report.data) return <ReportDetailSkeleton />;
  const profile = report.data.profiles.find((p) => p.unitId === unitId);
  if (!profile)
    return (
      <p className="surface p-6 text-sm">
        Esta unidad aún no tiene histórico de gestión disponible.
      </p>
    );
  const amount = total(profile, period.year, period.month),
    prior = total(profile, period.year - 1, period.month),
    target = profile.targets[period.year];
  const sameCut = [period.year - 2, period.year - 1, period.year]
    .filter((y) => y >= 2023)
    .map((y) => ({
      year: y,
      label: `Ene–${monthNames[period.month - 1]} ${y}`,
      value: total(profile, y, period.month),
    }));
  const summary = unitReportSummary(profile, period);
  const responsible = presentResponsible(profile.staff, mode);
  const annual = summary.annual.map((row) => ({
    year: row.year,
    label:
      row.months === 12
        ? `${row.year} · completo`
        : `${row.year} · a ${monthNames[period.month - 1]}`,
    value: row.value,
  }));
  const series = timeline(
    profile,
    `${period.year}-${String(period.month).padStart(2, "0")}`,
  ).slice(-Number(window));
  return (
    <section
      id="reporte-gestion"
      className={`${reportLayout.page} scroll-mt-6`}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Reporte de gestión</p>
          <h2 className="mt-2 text-xl font-semibold">
            Histórico y cumplimiento de metas
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Cifras simuladas · Consulta por ejercicio y mes de corte · MXN
          </p>
        </div>
        <ReportPeriodControl value={period} onChange={setPeriod} />
      </header>
      <ReportTabs
        items={[
          {
            id: "history",
            label: "Histórico mensual",
            content: (
              <>
                {" "}
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <FilterSelect
                      label="Ventana del histórico"
                      value={window}
                      onChange={setWindow}
                      options={[
                        { value: "12", label: "Últimos 12 meses" },
                        { value: "24", label: "Últimos 24 meses" },
                        { value: "36", label: "Últimos 36 meses" },
                        { value: "48", label: "Todo el histórico" },
                      ]}
                    />
                  </div>
                  <YearlyMeans
                    items={summary.annual.filter((row) =>
                      series.some((point) => point.year === row.year),
                    )}
                  />
                  <ReportChart
                    id="unit-history"
                    title="Histórico mensual"
                    description="Utilidades y medias móviles de 6 y 24 meses. Las tendencias utilizan el histórico previo, aunque quede fuera de la ventana visible."
                    family="timeline"
                    data={series}
                  />
                </div>
              </>
            ),
          },
          {
            id: "comparison",
            label: "Comparativos",
            content: (
              <>
                {" "}
                {summary.annualMean !== undefined && (
                  <div className="surface flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <h3 className="text-sm font-semibold">
                        Media anual {summary.completedYears[0]}–
                        {summary.completedYears.at(-1)}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Promedio de utilidades de ejercicios completos · Excluye
                        el ejercicio seleccionado
                      </p>
                    </div>
                    <p className="text-2xl font-semibold tabular-nums">
                      {reportMoney(summary.annualMean)}
                    </p>
                  </div>
                )}
                <ReportChart
                  id="unit-annual"
                  title="Comparativo por ejercicio"
                  description="Ejercicios anteriores completos; el ejercicio seleccionado se muestra solo hasta el corte. La media excluye el ejercicio parcial."
                  data={annual}
                  reference={summary.annualMean}
                />
                <ReportChart
                  id="unit-same-period"
                  title="Comparativo al mismo corte"
                  description={`Enero–${monthNames[period.month - 1]} de cada ejercicio. Variación calculada contra el año anterior.`}
                  data={sameCut}
                />
              </>
            ),
          },
          {
            id: "goals",
            label: "Metas y resultados",
            content: (
              <>
                {" "}
                <ReportMetrics
                  items={[
                    {
                      label: "Utilidades al corte",
                      value: reportMoney(amount),
                      note: `Enero–${monthNames[period.month - 1]} ${period.year}`,
                    },
                    {
                      label: "Variación interanual",
                      value: formatPercent(growth(amount, prior)),
                      note: "Comparación de los mismos meses",
                    },
                    {
                      label: "Meta anual",
                      value: reportMoney(target),
                      note: `Media mensual objetivo: ${reportMoney(Math.round(target / 12))}`,
                    },
                    {
                      label: "Promedio mensual al corte",
                      value: reportMoney(Math.round(amount / period.month)),
                      note: "Utilidades acumuladas / meses transcurridos",
                    },
                  ]}
                />
                <GoalPanel
                  id="unit-goal"
                  actual={amount}
                  target={target}
                  month={period.month}
                />
              </>
            ),
          },
          {
            id: "facts",
            label: "Ficha del establecimiento",
            content: (
              <>
                {" "}
                <UnitFacts
                  data={{
                    responsible: responsible.name,
                    appointed: responsible.appointed,
                    officers: profile.staff.officers,
                    troops: profile.staff.troops,
                    civilians: profile.staff.civilians,
                  }}
                />
                {profile.premises && (
                  <ReportMetrics
                    items={[
                      {
                        label: "Ventas al corte",
                        value: reportMoney(summary.sales),
                        note: `Enero–${monthNames[period.month - 1]} ${period.year} · Sin rentas de locales`,
                      },
                      {
                        label: "Locales comerciales",
                        value: reportMoney(summary.premisesRevenue),
                        note: "Ingresos por rentas al corte · Incluidos en ingresos totales",
                      },
                      {
                        label: "Locales en operación",
                        value: String(profile.premises.count),
                        note: "Capacidad ilustrativa de la tienda",
                      },
                      {
                        label: "Ingresos totales al corte",
                        value: reportMoney(
                          summary.sales + summary.premisesRevenue,
                        ),
                        note: "Ventas + rentas · No equivale a utilidades",
                      },
                    ]}
                  />
                )}
                <div className="surface grid gap-5 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Capital de trabajo · simulado
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      {reportMoney(profile.workingCapital)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Fondo revolvente · simulado
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      {reportMoney(profile.revolvingFund)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground sm:col-span-2">
                    Saldos de referencia de la demo; no cambian con el corte
                    seleccionado. No se incluyen cuentas bancarias.
                  </p>
                </div>
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
