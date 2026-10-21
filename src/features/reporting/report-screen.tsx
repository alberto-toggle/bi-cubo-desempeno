"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { usePortfolio } from "@/features/intelligence/use-portfolio";
import { FilterSelect } from "@/features/intelligence/filters";
import { useReport } from "./use-report";
import {
  reportMoney,
  percent,
  formatPercent,
  commercialLine,
  monthNames,
} from "./model";
import { groupResults, reportingRows } from "./queries";
import { initialReportPeriod, ReportPeriodControl } from "./period-control";
import { ReportMetrics, reportLayout } from "./report-layout";
import { ReportChart } from "./report-chart";
import { GoalPanel } from "./goal-panel";
import { ReportScreenSkeleton } from "./report-skeleton";
import { ReportUnitsTable } from "./report-units-table";
export function ReportScreen() {
  const portfolio = usePortfolio(),
    report = useReport();
  const [period, setPeriod] = useState(initialReportPeriod),
    [line, setLine] = useState("all");
  if (portfolio.error || report.error)
    return (
      <div className="surface p-6" role="alert">
        <p>{portfolio.error || report.error}</p>
        <button
          className="secondary-button mt-4"
          onClick={() => {
            void portfolio.reload();
            void report.reload();
          }}
        >
          Reintentar
        </button>
      </div>
    );
  if (!portfolio.data || !report.data) return <ReportScreenSkeleton />;
  const all = reportingRows(
      report.data,
      portfolio.data.units,
      period,
      portfolio.mode,
    ),
    rows = all.filter((r) => line === "all" || r.line === line);
  const actual = rows.reduce((s, r) => s + r.value, 0),
    target = rows.reduce((s, r) => s + r.target, 0);
  const categories = groupResults(
      rows.map((r) => ({ label: r.line, value: r.value })),
    ),
    programs = groupResults(rows.flatMap((r) => r.programs));
  const ranked = [...rows].sort((a, b) => b.value - a.value);
  return (
    <div className={reportLayout.page}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Consulta / Reporte de gestión</p>
          <h1 className="page-title">Utilidades y metas</h1>
          <p className="page-copy">
            Resultados por giro, establecimiento y programa productivo.
          </p>
        </div>
        <button
          className="secondary-button"
          aria-label="Actualizar reporte"
          disabled={
            report.status === "loading" || portfolio.status === "loading"
          }
          onClick={() => {
            void report.reload();
            void portfolio.reload();
          }}
        >
          <RefreshCw size={16} />
        </button>
      </header>
      <div className="flex flex-wrap gap-3">
        <ReportPeriodControl value={period} onChange={setPeriod} />
        <FilterSelect
          label="Giro comercial"
          value={line}
          onChange={setLine}
          options={[
            { value: "all", label: "Todos los giros" },
            ...[...new Set(portfolio.data.units.map(commercialLine))]
              .sort()
              .map((v) => ({ value: v, label: v })),
          ]}
        />
      </div>
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        Cifras simuladas · Enero–{monthNames[period.month - 1]} {period.year} ·
        MXN. Resultado de gestión: ingresos menos costos y gastos operativos.
        Las metas son ilustrativas.
      </p>
      <ReportMetrics
        items={[
          {
            label: "Resultado acumulado",
            value: reportMoney(actual),
            note: `${rows.length} unidades en esta selección`,
          },
          {
            label: "Meta anual",
            value: reportMoney(target),
            note: `Ejercicio ${period.year} completo`,
          },
          {
            label: "Avance de meta",
            value: formatPercent(percent(actual, target)),
            note: `Programado: ${formatPercent((period.month / 12) * 100)}`,
          },
          {
            label: "Pendiente de meta",
            value: reportMoney(Math.max(0, target - actual)),
            note:
              actual > target
                ? "Meta superada"
                : "Diferencia respecto a la meta anual",
          },
        ]}
      />
      <div className={reportLayout.pair}>
        <ReportChart
          id="report-giro"
          title="Resultado por giro comercial"
          description="Comparativo del acumulado al corte · MXN"
          data={categories}
        />
        <GoalPanel
          id="report-goal"
          actual={actual}
          target={target}
          month={period.month}
        />
      </div>
      {line !== "all" && (
        <ReportChart
          id="report-units"
          title="Resultado por establecimiento"
          description="Nombres visibles según tu rol · Acumulado al corte · MXN"
          data={ranked.map((r) => ({ label: r.label, value: r.value }))}
        />
      )}
      {programs.length > 0 && (
        <ReportChart
          id="report-programs"
          title="Programas productivos"
          description="Distribución ilustrativa del resultado de granjas y criadero; no se suma nuevamente al total."
          data={programs}
        />
      )}
      <ReportUnitsTable
        key={`${line}-${period.year}-${period.month}-${portfolio.mode}`}
        rows={ranked}
      />
    </div>
  );
}
