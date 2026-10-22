"use client";
import { useFinancialPrivacy } from "@/features/privacy/use-financial-privacy";
import { PrivateChartNotice } from "@/features/privacy/privacy-control";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { DataTableLayout } from "@/components/layout/data-table-layout";
import { tableLayout, unitColumns } from "@/features/intelligence/table-layout";

import { intelligenceLayout } from "@/features/intelligence/layout";
import { ViewSkeleton, type ViewKind } from "@/features/loading/skeletons";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  presentIdentity,
  type IdentityMode,
} from "@/features/demo/identity-policy";
import { aggregate, money as originalMoney, unitTotals, type BusinessUnit } from "./model";
export function PortfolioState({
  kind = "overview",
  error,
  reload,
}: {
  status: string;
  kind?: ViewKind;
  error: string;
  reload: () => void;
}) {
  return error ? (
    <div className="surface p-6" role="alert">
      <p>{error}</p>
      <button className="secondary-button mt-3" onClick={reload}>
        Reintentar
      </button>
    </div>
  ) : (
    <ViewSkeleton
      kind={kind}
      bodyOnly={kind === "overview" || kind === "directory"}
    />
  );
}
export function Metrics({
  units,
  period = "all",
}: {
  units: BusinessUnit[];
  period?: string;
}) {
  const money = usePrivateFormatter(originalMoney);
  const t = aggregate(units, period);
  return (
    <div className={intelligenceLayout.metrics}>
      {[
        {
          label: "Ingresos",
          value: units.length ? money(t.revenue) : "—",
          note: "Periodo seleccionado",
        },
        {
          label: "Costos",
          value: units.length ? money(t.cost) : "—",
          note: "Costos ilustrativos registrados",
        },
        {
          label: "Contribución",
          value: units.length ? money(t.contribution) : "—",
          note: "Ingresos menos costos; no utilidad neta",
        },
        {
          label: "Unidades analizadas",
          value: String(units.length),
          note: "En el periodo seleccionado",
        },
      ].map((m) => (
        <article key={m.label} className={intelligenceLayout.metricCard}>
          <p className="text-xs text-muted-foreground">{m.label}</p>
          <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
            {m.value}
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground">{m.note}</p>
        </article>
      ))}
    </div>
  );
}
export function TrendChart({
  units,
  period = "all",
}: {
  units: BusinessUnit[];
  period?: string;
}) {
  const { hidden } = useFinancialPrivacy();
  const money = usePrivateFormatter(originalMoney);
  if (hidden) return <PrivateChartNotice />;
  if (!units.length)
    return (
      <section className={intelligenceLayout.chartCard}>
        <h2 className="font-semibold">Evolución financiera</h2>
        <p className="flex h-64 items-center justify-center text-center text-sm text-muted-foreground">
          Sin registros para esta selección.
        </p>
      </section>
    );
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"].filter(
    (m) => period === "all" || m === period,
  );
  const rows = months.map((month) => ({ month, ...aggregate(units, month) }));
  return (
    <section className={intelligenceLayout.chartCard}>
      <div className={intelligenceLayout.chartHeader}>
        <h2 className="font-semibold">Evolución financiera</h2>
        <p className="text-xs text-muted-foreground">Ingresos y costos · MXN</p>
      </div>
      <div className={intelligenceLayout.chartPlot}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 500, height: 256 }}
        >
          <AreaChart data={rows} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              width={46}
              tickFormatter={(v) => v / 1000 + "k"}
              axisLine={false}
              tickLine={false}
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
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.12}
              strokeWidth={2.5}
              dot={rows.length === 1 ? { r: 5 } : false}
            />
            <Area
              dataKey="cost"
              name="Costos"
              stroke="var(--chart-2)"
              fill="transparent"
              strokeWidth={2}
              dot={rows.length === 1 ? { r: 4 } : false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-4 text-xs text-muted-foreground">
        <summary className="cursor-pointer">Ver datos de la gráfica</summary>
        <table className="mt-3 w-full text-left">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Ingresos</th>
              <th>Costos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month}>
                <td>{r.month}</td>
                <td>{money(r.revenue)}</td>
                <td>{money(r.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
export function UnitsTable({
  units,
  mode,
  period = "all",
}: {
  units: BusinessUnit[];
  mode: IdentityMode;
  period?: string;
}) {
  const money = usePrivateFormatter(originalMoney);
  return (
    <>
      <DataTableLayout columns={unitColumns} className={tableLayout.units}>
        <thead className={tableLayout.unitHead}>
          <tr>
            {[
              "Establecimiento",
              "Segmento",
              "Ingresos",
              "Contribución",
              "Estado",
              "",
            ].map((h, i) => (
              <th key={i} className={`${tableLayout.unitCell} font-medium`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {units.map((u) => {
            const identity = presentIdentity(u, mode),
              t = unitTotals(u, period);
            return (
              <tr key={u.id} className="hover:bg-muted/40">
                <td className={tableLayout.unitCell}>
                  <Link
                    href={"/establishments/" + u.id}
                    className="font-medium hover:text-primary"
                  >
                    {identity.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {identity.location}
                  </p>
                </td>
                <td
                  className={`${tableLayout.unitCell} text-xs text-muted-foreground`}
                >
                  {u.segment}
                </td>
                <td
                  className={`${tableLayout.unitCell} tabular-nums whitespace-nowrap`}
                >
                  {money(t.revenue)}
                </td>
                <td
                  className={`${tableLayout.unitCell} tabular-nums whitespace-nowrap`}
                >
                  {money(t.contribution)}
                </td>
                <td className={tableLayout.unitCell}>
                  <span
                    className={
                      "pill whitespace-nowrap " +
                      (u.status === "Por conciliar"
                        ? "text-warning"
                        : "text-primary")
                    }
                  >
                    {u.status}
                  </span>
                </td>
                <td className={tableLayout.unitCell}>
                  <Link
                    href={"/establishments/" + u.id}
                    aria-label={"Ver detalle de " + identity.name}
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </DataTableLayout>
      {!units.length && (
        <p className="p-10 text-center text-sm text-muted-foreground">
          No hay establecimientos para estos filtros.
        </p>
      )}
    </>
  );
}
