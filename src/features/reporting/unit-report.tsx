"use client";
import { useState } from "react";
import { useReport } from "./use-report";
import { ReportDetailSkeleton } from "./report-skeleton";
import { initialReportPeriod, ReportPeriodControl } from "./period-control";
import {
  formatPercent,
  growth,
  monthNames,
  reportMoney,
  timeline,
  total,
} from "./model";
import { reportLayout, ReportMetrics } from "./report-layout";
import { ReportChart } from "./report-chart";
import { GoalPanel } from "./goal-panel";
import { FilterSelect } from "@/features/intelligence/filters";
export function UnitReport({ unitId }: { unitId: string }) {
  const report = useReport(),
    [period, setPeriod] = useState(initialReportPeriod),
    [window, setWindow] = useState("24");
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
  const annual = [2023, 2024, 2025, 2026]
    .filter((y) => y <= period.year)
    .map((y) => ({
      year: y,
      label:
        y === period.year
          ? `${y} · a ${monthNames[period.month - 1]}`
          : `${y} · completo`,
      value: total(profile, y, y === period.year ? period.month : 12),
    }));
  const completed = annual.slice(0, -1),
    average = completed.length
      ? Math.round(
          completed.reduce((s, r) => s + r.value, 0) / completed.length,
        )
      : undefined;
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
            Cifras simuladas · Corte independiente del resumen financiero
            superior · MXN
          </p>
        </div>
        <ReportPeriodControl value={period} onChange={setPeriod} />
      </header>
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
        <ReportChart
          id="unit-history"
          title="Histórico mensual"
          description="Utilidades y medias móviles de 6 y 24 meses. Las tendencias utilizan el histórico previo, aunque quede fuera de la ventana visible."
          family="timeline"
          data={series}
        />
      </div>
      <div className={reportLayout.pair}>
        <GoalPanel
          id="unit-goal"
          actual={amount}
          target={target}
          month={period.month}
        />
        <ReportChart
          id="unit-same-period"
          title="Comparativo al mismo corte"
          description={`Enero–${monthNames[period.month - 1]} de cada ejercicio. Variación calculada contra el año anterior.`}
          data={sameCut}
        />
      </div>
      <ReportChart
        id="unit-annual"
        title="Comparativo por ejercicio"
        description="Ejercicios anteriores completos; el ejercicio seleccionado se muestra solo hasta el corte. La media excluye el ejercicio parcial."
        data={annual}
        reference={average}
      />
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
          Saldos de referencia de la demo; no cambian con el corte seleccionado.
          No se incluyen cuentas bancarias.
        </p>
      </div>
    </section>
  );
}
