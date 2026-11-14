"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { FundAllocation } from "@/services/demo-fund-allocation";
import { ReportPanel, ReportMetrics } from "@/features/reporting/report-layout";
import {
  reportMoney,
  formatPercent,
  percent,
} from "@/features/reporting/model";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { useFinancialPrivacy } from "@/features/privacy/use-financial-privacy";
import { PrivateChartNotice } from "@/features/privacy/privacy-control";

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];
export function FundSummary({ data }: { data: FundAllocation }) {
  const money = usePrivateFormatter(reportMoney);
  const { hidden } = useFinancialPrivacy();
  const [status, setStatus] = useState<"all" | "spent" | "committed">("all");
  const [category, setCategory] = useState("all");
  const portions = [
    { name: "Gastadas", value: data.spent },
    { name: "Comprometidas", value: data.committed },
    { name: "Disponibles", value: data.available },
  ];
  const projects = data.projects.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (status === "all" ? p.spent + p.committed > 0 : p[status] > 0),
  );
  const pct = (n: number, base = data.total) =>
    hidden ? "••••" : formatPercent(percent(n, base));
  return (
    <div className="space-y-5">
      <ReportPanel
        title="Utilidades del grupo"
        description="Acumulado del ejercicio al corte seleccionado · Distribución y proyectos de demostración."
      >
        <p className="text-3xl font-semibold tabular-nums sm:text-4xl">
          {money(data.total)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Total generado después de costos y gastos de las instalaciones.
        </p>
        {hidden ? (
          <PrivateChartNotice />
        ) : data.total <= 0 ? (
          <p className="mt-5 text-sm">
            No hay utilidades positivas disponibles para distribuir en este
            corte.
          </p>
        ) : (
          <div className="grid items-center gap-5 md:grid-cols-[240px_1fr]">
            <div
              className="h-60"
              role="img"
              aria-label="Distribución de utilidades en gastadas, comprometidas y disponibles; cifras en el desglose adjunto."
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portions}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={96}
                    paddingAngle={3}
                    isAnimationActive={false}
                  >
                    {portions.map((p, i) => (
                      <Cell
                        key={p.name}
                        fill={colors[i]}
                        stroke="var(--card)"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <dl className="space-y-3">
              {portions.map((p, i) => (
                <div
                  key={p.name}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-4"
                >
                  <dt className="flex items-center gap-2 text-sm">
                    <span
                      className="size-3 rounded-full"
                      style={{ background: colors[i] }}
                    />
                    {p.name}
                  </dt>
                  <dd className="text-right">
                    <strong className="block tabular-nums">
                      {money(p.value)}
                    </strong>
                    <span className="text-xs text-muted-foreground">
                      {pct(p.value)} del total
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <p className="mt-4 rounded-xl bg-muted p-4 text-sm">
          Disponible para nuevas decisiones:{" "}
          <strong>{money(data.available)}</strong>. Total generado − gastado −
          comprometido. Un compromiso no se vuelve a contar como gasto.
        </p>
      </ReportPanel>
      <ReportPanel
        title="Destino de las utilidades"
        description="Importes y porcentajes dentro de cada estado. Estos usos se financian con la utilidad neta; no se restan otra vez del resultado operativo."
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {data.categories.map((c) => (
            <article
              key={c.name}
              className="rounded-xl border border-border p-4"
            >
              <h3 className="font-semibold">{c.name}</h3>
              <dl className="mt-4 space-y-4 text-sm">
                {(["spent", "committed"] as const).map((s) => (
                  <div key={s}>
                    <dt className="text-muted-foreground">
                      {s === "spent" ? "Gastadas" : "Comprometidas"}
                    </dt>
                    <dd className="mt-1 font-medium">
                      {money(c[s])}{" "}
                      <span className="text-xs text-muted-foreground">
                        · {pct(c[s], data[s])} de{" "}
                        {s === "spent" ? "lo gastado" : "lo comprometido"}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <div className="my-5 flex flex-wrap gap-3">
          <label className="text-sm">
            Estado
            <select
              className="ml-2 min-h-11 rounded-lg border border-border bg-card p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              <option value="all">Todos</option>
              <option value="spent">Gastadas</option>
              <option value="committed">Comprometidas</option>
            </select>
          </label>
          <label className="text-sm">
            Rubro
            <select
              className="ml-2 min-h-11 rounded-lg border border-border bg-card p-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Todos</option>
              {data.categories.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
        <h3 className="mb-3 font-semibold">
          {projects.length} proyectos ·{" "}
          {status === "all"
            ? "gastados y comprometidos"
            : status === "spent"
              ? "con gasto aplicado"
              : "con compromisos pendientes"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <article key={p.id} className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">
                {p.category} · Proyecto ficticio
              </p>
              <h4 className="mt-1 font-medium">{p.name}</h4>
              <dl className="mt-3 space-y-2 text-sm">
                {status !== "committed" && (
                  <div>
                    <dt>Gastado</dt>
                    <dd className="font-semibold">
                      {money(p.spent)} · {pct(p.spent, data.spent)}
                    </dd>
                  </div>
                )}
                {status !== "spent" && (
                  <div>
                    <dt>Comprometido</dt>
                    <dd className="font-semibold">
                      {money(p.committed)} · {pct(p.committed, data.committed)}
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      </ReportPanel>
      <ReportPanel
        title="Proyección al cierre del ejercicio"
        description="Estimación condicionada a mantener la utilidad mensual media observada. No representa dinero disponible hoy ni incluye nuevos compromisos."
      >
        <ReportMetrics
          items={[
            {
              label: "Cumplimiento al corte",
              value: pct(data.total, data.expected),
              note: "Respecto a la meta programada",
            },
            {
              label: "Utilidad adicional estimada",
              value: money(data.projectedAdditional),
              note: `${data.remainingMonths} meses restantes`,
            },
            {
              label: "Utilidad estimada al cierre",
              value: money(data.projectedTotal),
              note: `Meta anual: ${money(data.annualTarget)}`,
            },
            {
              label: "Disponibilidad potencial al cierre",
              value: money(data.projectedAvailable),
              note: "Disponible actual + utilidad adicional estimada",
            },
          ]}
        />
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Cálculo: utilidad acumulada ÷ meses transcurridos × meses restantes.{" "}
          {data.total < data.expected
            ? "La tendencia actual está por debajo de la meta programada; esta proyección no supone que se recuperará la diferencia."
            : "La tendencia actual alcanza la meta programada; debe sostenerse para materializar esta estimación."}{" "}
          Los importes son simulados.
        </p>
      </ReportPanel>
    </div>
  );
}
