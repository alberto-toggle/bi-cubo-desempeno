"use client";
import { useFinancialPrivacy } from "@/features/privacy/use-financial-privacy";
import { PrivateChartNotice } from "@/features/privacy/privacy-control";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { useState } from "react";
import Link from "next/link";
import { Box, LockKeyhole, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "@/features/intelligence/use-portfolio";
import { useReport } from "@/features/reporting/use-report";
import { FilterSelect } from "@/features/intelligence/filters";
import {
  ReportPeriodControl,
  initialReportPeriod,
} from "@/features/reporting/period-control";
import { ReportMetrics, ReportPanel } from "@/features/reporting/report-layout";
import { ReportChart } from "@/features/reporting/report-chart";
import {
  commercialLine,
  reportMoney as originalMoney,
  growth,
  formatPercent,
  percent,
} from "@/features/reporting/model";
import { MexicoMap, mexicanStates } from "@/components/maps/mexico-map";
import { cubeMetrics, cubeSnapshot, type CubeFilters } from "./model";
import { ReportTabs } from "@/features/reporting/report-tabs";
import { CubeVisual } from "./cube-visual";
import { CubeSkeleton } from "./cube-skeleton";
import { AnalysisPanel } from "./analysis-panel";
import { cubeLayout } from "./layout";
export function CubeScreen() {
  const { hidden } = useFinancialPrivacy();
  const reportMoney = usePrivateFormatter(originalMoney);
  const portfolio = usePortfolio(),
    report = useReport();
  const [filters, setFilters] = useState<CubeFilters>({
    ...initialReportPeriod,
    state: "all",
    line: "all",
    metric: "revenue",
  });
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
  if (!portfolio.data || !report.data)
    return <CubeSkeleton geographyAllowed={portfolio.mode === "full"} />;
  const admin = portfolio.mode === "full";
  const stateLabel =
    mexicanStates.find((s) => s.id === filters.state)?.name ?? "Nacional";
  const snapshot = cubeSnapshot(
    report.data,
    portfolio.data.units,
    filters,
    portfolio.mode,
    stateLabel,
  );
  const allStates = cubeSnapshot(
    report.data,
    portfolio.data.units,
    { ...filters, state: "all" },
    portfolio.mode,
    "Nacional",
  );
  const chartGroups =
    snapshot.groups.length > 7
      ? [
          ...snapshot.groups.slice(0, 6),
          {
            label: "Otros giros",
            value: snapshot.groups
              .slice(6)
              .reduce((sum, row) => sum + row.value, 0),
          },
        ]
      : snapshot.groups;
  const contextKey = JSON.stringify([
    filters,
    portfolio.mode,
    snapshot.rows,
    portfolio.data.updatedAt,
  ]);
  return (
    <div className={cubeLayout.page}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Consulta / Explorador multidimensional</p>
          <h1 className="page-title">Cubo nacional de desempeño</h1>
          <p className="page-copy">
            Cruza periodo, giro e indicador para consultar resultados.
          </p>
        </div>
        {!hidden && <AnalysisPanel key={contextKey} snapshot={snapshot} />}
      </header>
      <div className="flex flex-wrap items-center gap-3">
        <ReportPeriodControl
          value={filters}
          onChange={(period) => setFilters((f) => ({ ...f, ...period }))}
        />
        <FilterSelect
          label="Giro del cubo"
          value={filters.line}
          onChange={(line) => setFilters((f) => ({ ...f, line }))}
          options={[
            { value: "all", label: "Todos los giros" },
            ...[...new Set(portfolio.data.units.map(commercialLine))]
              .sort()
              .map((v) => ({ value: v, label: v })),
          ]}
        />
        {admin && (
          <FilterSelect
            label="Estado del cubo"
            value={filters.state}
            onChange={(state) => setFilters((f) => ({ ...f, state }))}
            options={[
              { value: "all", label: "Todo el país" },
              ...mexicanStates
                .filter((s) =>
                  portfolio.data!.units.some((u) => u.stateCode === s.id),
                )
                .map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        )}
      </div>
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        Cifras simuladas · {snapshot.period} · {snapshot.context} · MXN.
        Utilidades = ingresos − costos − gastos.
        {snapshot.metricNote && (
          <span className="mt-1 block">{snapshot.metricNote}</span>
        )}
      </p>
      <ReportTabs
        items={[
          {
            id: "cube",
            label: "Cubo de desempeño",
            content: (
              <>
                {" "}
                <div className={cubeLayout.hero}>
                  <section className={cubeLayout.visual}>
                    <header className="flex items-center gap-2 text-sm font-semibold">
                      <Box size={17} className="text-primary" />
                      Cuatro indicadores · tres dimensiones
                    </header>
                    <CubeVisual
                      value={filters.metric}
                      onChange={(metric) =>
                        setFilters((f) => ({ ...f, metric }))
                      }
                    />
                    <div
                      className="mt-5 flex flex-wrap justify-center gap-2"
                      aria-label="Cuenta del cubo"
                    >
                      {cubeMetrics.map((m) => (
                        <button
                          key={m.id}
                          aria-pressed={filters.metric === m.id}
                          className={`rounded-full border px-3 py-2 text-xs ${filters.metric === m.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                          onClick={() =>
                            setFilters((f) => ({ ...f, metric: m.id }))
                          }
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </section>
                  <ReportChart
                    id="cube-giro"
                    title={`${snapshot.metric} por giro`}
                    description="Importe acumulado de la selección · Los giros de menor importe se agrupan en Otros."
                    data={chartGroups.map((point) => ({
                      ...point,
                      year: filters.year,
                    }))}
                    valueLabel={snapshot.metric}
                  />
                </div>
                {!snapshot.count && (
                  <p role="status" className="surface p-6 text-sm">
                    No hay registros para esta combinación. Cambia el estado o
                    el giro.
                  </p>
                )}
              </>
            ),
          },
          {
            id: "summary",
            label: "Resumen",
            content: (
              <>
                {" "}
                <ReportMetrics
                  items={[
                    {
                      label: snapshot.metric,
                      value: reportMoney(snapshot.value),
                      note: `${snapshot.count} establecimientos en la selección`,
                    },
                    {
                      label: "Variación al mismo corte",
                      value: formatPercent(
                        growth(snapshot.value, snapshot.previous),
                      ),
                      note: `Año anterior: ${reportMoney(snapshot.previous)}`,
                    },
                    {
                      label:
                        filters.metric === "profit"
                          ? "Margen de utilidades"
                          : "Utilidades",
                      value:
                        filters.metric === "profit"
                          ? formatPercent(
                              percent(snapshot.result, snapshot.revenue),
                            )
                          : reportMoney(snapshot.result),
                      note:
                        filters.metric === "profit"
                          ? "Utilidades / ingresos; sin impuestos ni otros ajustes"
                          : "Ingresos menos costos y gastos",
                    },
                    {
                      label: "Avance de meta anual",
                      value: formatPercent(
                        percent(snapshot.result, snapshot.target),
                      ),
                      note: `Meta: ${reportMoney(snapshot.target)}`,
                    },
                  ]}
                />
              </>
            ),
          },
          {
            id: "evolution",
            label: "Evolución y establecimientos",
            content: (
              <>
                {" "}
                <div className={cubeLayout.pair}>
                  <ReportChart
                    id="cube-monthly"
                    title="Evolución mensual"
                    description={`${snapshot.metric} · ${filters.year} · Cada punto corresponde a un mes, no al acumulado.`}
                    data={snapshot.timeline.map((point) => ({
                      ...point,
                      year: filters.year,
                    }))}
                    valueLabel={snapshot.metric}
                    family="timeline"
                  />
                  <ReportPanel
                    title="Establecimientos de mayor importe"
                    description={`${snapshot.metric} · Primeros cinco de la selección; no es una clasificación de rentabilidad.`}
                  >
                    <ol className="divide-y divide-border">
                      {snapshot.rows.slice(0, 5).map((r, i) => (
                        <li key={r.id} className="flex items-center gap-3 py-5">
                          <span className="text-xs text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/establishments/${r.id}#reporte-gestion`}
                              className="flex items-center gap-1 text-sm font-medium hover:text-primary"
                            >
                              {r.label}
                              <ArrowUpRight size={13} className="shrink-0" />
                            </Link>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {r.line}
                            </p>
                          </div>
                          <span className="text-sm tabular-nums">
                            {reportMoney(r.value)}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <Link
                      href="/reports"
                      className="mt-5 inline-block text-xs text-primary underline"
                    >
                      Abrir reporte de utilidades y metas ↗
                    </Link>
                  </ReportPanel>
                </div>
              </>
            ),
          },
          {
            id: "territory",
            label: "Distribución territorial",
            content: (
              <>
                {" "}
                {admin ? (
                  <ReportPanel
                    title="Distribución territorial"
                    description={`${snapshot.metric} · El mapa conserva todos los estados del giro seleccionado para comparar y cambiar la selección.`}
                  >
                    {hidden ? (
                      <PrivateChartNotice />
                    ) : (
                      <MexicoMap
                        data={allStates.geography}
                        selected={filters.state}
                        onSelect={(state) =>
                          setFilters((f) => ({ ...f, state: state || "all" }))
                        }
                        formatValue={reportMoney}
                        metricLabel={snapshot.metric}
                      />
                    )}
                  </ReportPanel>
                ) : (
                  <div className="surface flex items-center gap-3 p-5 text-sm">
                    <LockKeyhole size={18} className="shrink-0 text-primary" />
                    <p>
                      Ubicaciones reservadas. El análisis y los reportes
                      utilizan alias y datos agregados.
                    </p>
                  </div>
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
