"use client";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadOverview } from "./overview-slice";
import { summarize } from "./types";
import { IdentityPreview } from "@/features/demo/identity-preview";
import { OrbitalArtwork } from "./orbital-artwork";
const money = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
export function OverviewScreen() {
  const dispatch = useAppDispatch(),
    { data, status, error } = useAppSelector((s) => s.overview);
  useEffect(() => {
    const request = dispatch(loadOverview());
    return () => request.abort();
  }, [dispatch]);
  const totals = data ? summarize(data) : null;
  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Consulta administrativa</p>
          <h1 className="page-title">Resumen operativo y financiero</h1>
          <p className="page-copy">
            Panorama GTyG. Un espacio para conectar información y decisiones.
          </p>
        </div>
      </header>
      <section className="welcome-panel">
        <div className="max-w-xl">
          <span className="pill border-hero-control-border bg-hero-control-fill text-hero-foreground">
            Inteligencia conectada
          </span>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Resultados del periodo.
            <br />
            <span className="opacity-65">Consulta por unidad y segmento.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed opacity-80">
            Una perspectiva compartida para observar la operación, identificar
            tendencias y tomar mejores decisiones.
          </p>
          <Link
            href="/settings/appearance"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
          >
            Diseñar mi espacio <ArrowRight size={16} />
          </Link>
        </div>
        <OrbitalArtwork />
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Así puede verse tu información
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Ejemplo visual con datos sintéticos ·{" "}
            {data?.period ?? "Preparando indicadores"}
          </p>
        </div>
        <button
          className="secondary-button"
          disabled={status === "loading"}
          onClick={() => dispatch(loadOverview())}
        >
          <RefreshCw
            size={14}
            className={status === "loading" ? "animate-spin" : ""}
          />{" "}
          Actualizar
        </button>
      </div>
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 p-5 text-destructive"
        >
          {error}{" "}
          <button
            onClick={() => dispatch(loadOverview())}
            className="underline"
          >
            Reintentar
          </button>
        </div>
      ) : null}
      {status === "loading" && !data ? (
        <div role="status" className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
          <span className="sr-only">Cargando indicadores</span>
        </div>
      ) : null}
      {data && totals && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Ingresos del periodo",
                value: money(totals.revenue),
                note: "Escenario ilustrativo · MXN",
              },
              {
                label: "Costos del periodo",
                value: money(totals.cost),
                note: "Importes de la misma serie",
              },
              {
                label: "Contribución ilustrativa",
                value: money(totals.contribution),
                note:
                  totals.margin.toFixed(1) +
                  "% de los ingresos · antes de otros gastos",
              },
            ].map((m) => (
              <article className="surface p-5" key={m.label}>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
                  {m.value}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">{m.note}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
            <section className="surface p-5 sm:p-6">
              <div className="mb-7 flex items-center justify-between">
                <h3 className="font-semibold">Evolución del periodo</h3>
                <span className="text-xs text-muted-foreground">
                  Ingresos / costos
                </span>
              </div>
              <div
                className="h-64"
                role="img"
                aria-label="Evolución mensual de ingresos y costos"
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  initialDimension={{ width: 500, height: 256 }}
                >
                  <AreaChart
                    data={data.monthly}
                    margin={{ left: 0, right: 8, top: 5, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenue-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      width={45}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => v / 1000 + "k"}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: 12,
                      }}
                      formatter={(v) => money(Number(v))}
                    />
                    <Area
                      dataKey="revenue"
                      name="Ingresos"
                      type="monotone"
                      stroke="var(--chart-1)"
                      fill="url(#revenue-fill)"
                      strokeWidth={2.5}
                    />
                    <Area
                      dataKey="cost"
                      name="Costos"
                      type="monotone"
                      stroke="var(--chart-2)"
                      fill="transparent"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <details className="mt-4 text-xs text-muted-foreground">
                <summary className="cursor-pointer">
                  Ver datos de la gráfica
                </summary>
                <table className="mt-3 w-full text-left">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Ingresos</th>
                      <th>Costos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.monthly.map((m) => (
                      <tr key={m.month}>
                        <td>{m.month}</td>
                        <td>{money(m.revenue)}</td>
                        <td>{money(m.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </section>
            <section className="surface p-6">
              <h3 className="font-semibold">Distribución ilustrativa</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Participación por actividad · %
              </p>
              <div className="mt-7 h-56">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  initialDimension={{ width: 320, height: 224 }}
                >
                  <BarChart
                    data={data.activities}
                    layout="vertical"
                    margin={{ left: 0, right: 15 }}
                  >
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      width={125}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: 12,
                      }}
                      formatter={(v) => v + "%"}
                    />
                    <Bar
                      dataKey="value"
                      name="Participación"
                      fill="var(--chart-1)"
                      radius={[0, 5, 5, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </>
      )}
      <IdentityPreview />
    </div>
  );
}
