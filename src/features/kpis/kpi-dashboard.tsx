"use client";
import { useState } from "react";
import { AlertTriangle, TrendingDown, Trophy, Search } from "lucide-react";
import { useFinancialPrivacy } from "@/features/privacy/use-financial-privacy";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { reportMoney, monthNames } from "@/features/reporting/model";
import { demoDailyUtility } from "@/services/demo-kpi-daily";
import {
  kpiGroups,
  bounds,
  type KpiPeriod,
  type KpiRow,
  type KpiView,
} from "./model";
import { KpiCard } from "./kpi-card";
import { kpiLayout as layout } from "./layout";

const initial: KpiPeriod = { year: 2026, month: 9, window: "month" };
export function KpiDashboard({
  rowsFor,
  financial,
}: {
  rowsFor: (period: KpiPeriod) => KpiRow[];
  financial: boolean;
}) {
  const [period, setPeriod] = useState(initial),
    [view, setView] = useState<KpiView>("bottom"),
    [grouping, setGrouping] = useState<"line" | "segment">("line"),
    [line, setLine] = useState("all"),
    [segment, setSegment] = useState("all"),
    [query, setQuery] = useState(""),
    [limit, setLimit] = useState(15);
  const { hidden } = useFinancialPrivacy(),
    money = usePrivateFormatter(reportMoney);
  const all = rowsFor(period),
    rows = all.filter(
      (r) =>
        (line === "all" || r.line === line) &&
        (segment === "all" || r.segment === segment) &&
        r.name
          .toLocaleLowerCase("es")
          .includes(query.trim().toLocaleLowerCase("es")),
    );
  const groups = kpiGroups(rows, view, grouping);
  const grouped = ["top", "bottom", "sales", "utility"].includes(view);
  const ranked = groups.flatMap((g) => g.rows),
    below = rows.filter(
      (r) => r.achievement !== null && r.achievement < 100,
    ).length,
    average = rows.filter(
      (r) => r.averageChange !== null && r.averageChange < 0,
    ).length;
  const bestUtility = financial
    ? [...rows].sort((a, b) => b.financial!.utility - a.financial!.utility)[0]
    : undefined;
  const bestRevenue = financial
    ? [...rows].sort((a, b) => b.financial!.revenue - a.financial!.revenue)[0]
    : undefined;
  const choices: { id: KpiView; label: string }[] = [
    { id: "target", label: "Debajo de meta" },
    ...(financial
      ? [{ id: "average" as const, label: "Debajo del promedio" }]
      : []),
    { id: "bottom", label: "Peores 15 por rubro" },
    { id: "top", label: "Top 15 por rubro" },
    ...(financial
      ? [
          { id: "sales" as const, label: "Más ventas por rubro" },
          { id: "utility" as const, label: "Mayor utilidad por rubro" },
          { id: "daily" as const, label: "Utilidades diarias" },
        ]
      : []),
  ];
  const { start, count } = bounds(period);
  const label = `${monthNames[start - 1]}${count > 1 ? ` – ${monthNames[period.month - 1]}` : ""} ${period.year}`;
  function updatePeriod(next: KpiPeriod) {
    setPeriod(next);
    setLimit(15);
  }
  return (
    <div className={layout.page}>
      <header>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Seguimiento de establecimientos
        </p>
        <h1 className="page-title">KPIs de rendimiento</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Identifica dónde intervenir y consulta el avance de cada
          establecimiento.
        </p>
      </header>
      <section className="surface p-4" aria-label="Filtros de rendimiento">
        <div className="mb-4 grid grid-cols-3 gap-2">
          {(
            [
              ["month", "Mes"],
              ["quarter", "Trimestre"],
              ["year", "Año"],
            ] as const
          ).map(([value, title]) => (
            <button
              key={value}
              aria-pressed={period.window === value}
              className={
                "min-h-11 rounded-lg border text-sm font-medium " +
                (period.window === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card")
              }
              onClick={() => updatePeriod({ ...period, window: value })}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Filter
            label="Año"
            value={String(period.year)}
            onChange={(v) =>
              updatePeriod({
                ...period,
                year: Number(v),
                month: Math.min(period.month, Number(v) === 2026 ? 9 : 12),
              })
            }
            options={[2024, 2025, 2026].map((y) => ({
              value: String(y),
              label: String(y),
            }))}
          />
          <Filter
            label="Mes de corte"
            value={String(period.month)}
            onChange={(v) => updatePeriod({ ...period, month: Number(v) })}
            options={monthNames
              .slice(0, period.year === 2026 ? 9 : 12)
              .map((m, i) => ({ value: String(i + 1), label: m }))}
          />
          <Filter
            label="Giro"
            value={line}
            onChange={(v) => {
              setLine(v);
              setLimit(15);
            }}
            options={[
              { value: "all", label: "Todos los giros" },
              ...[...new Set(all.map((r) => r.line))]
                .sort()
                .map((v) => ({ value: v, label: v })),
            ]}
          />
          <Filter
            label="Rubro / segmento"
            value={segment}
            onChange={(v) => {
              setSegment(v);
              setLimit(15);
            }}
            options={[
              { value: "all", label: "Todos los rubros" },
              ...[...new Set(all.map((r) => r.segment))]
                .sort()
                .map((v) => ({ value: v, label: v })),
            ]}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {label} ·{" "}
          {period.window === "month"
            ? "Mes completo"
            : "Acumulado al mes de corte"}{" "}
          · Datos de demostración al 30 sep 2026
        </p>
      </section>
      <div className={layout.summary}>
        <button
          className={layout.card + " text-left"}
          onClick={() => {
            setView("target");
            setLimit(15);
          }}
        >
          <AlertTriangle size={18} className="mb-3 text-destructive" />
          <strong className="block text-3xl tabular-nums">{below}</strong>
          <span className="text-xs text-muted-foreground">
            Debajo de meta · de {rows.length}
          </span>
        </button>
        <button
          className={layout.card + " text-left"}
          onClick={() => {
            setView(financial ? "average" : "top");
            setLimit(15);
          }}
        >
          <TrendingDown size={18} className="mb-3 text-warning" />
          <strong className="block text-3xl tabular-nums">
            {financial
              ? average
              : rows.filter(
                  (r) => r.achievement !== null && r.achievement >= 100,
                ).length}
          </strong>
          <span className="text-xs text-muted-foreground">
            {financial ? "Debajo del promedio mensual" : "En objetivo"}
          </span>
        </button>
        {financial &&
          [
            {
              title: "Mayor utilidad",
              row: bestUtility,
              value: bestUtility?.financial?.utility,
            },
            {
              title: "Más ventas",
              row: bestRevenue,
              value: bestRevenue?.financial?.revenue,
            },
          ].map((x) => (
            <div key={x.title} className={layout.card}>
              <Trophy size={18} className="mb-3 text-primary" />
              <p className="text-xs text-muted-foreground">{x.title}</p>
              <strong className="mt-1 block break-words text-xl tabular-nums">
                {x.value === undefined ? "—" : money(x.value)}
              </strong>
              <p className="mt-2 text-xs">{x.row?.name ?? "Sin resultados"}</p>
            </div>
          ))}
      </div>
      <section aria-label="Consulta de indicadores" className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {choices.map((c) => (
            <button
              key={c.id}
              aria-pressed={view === c.id}
              onClick={() => {
                setView(c.id);
                setLimit(15);
              }}
              className={
                "min-h-12 rounded-xl border px-3 py-2 text-sm font-medium " +
                (view === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card")
              }
            >
              {c.label}
            </button>
          ))}
        </div>
        {grouped && (
          <Filter
            label="Agrupar rankings por"
            value={grouping}
            onChange={(v) => setGrouping(v as "line" | "segment")}
            options={[
              { value: "line", label: "Giro comercial" },
              { value: "segment", label: "Rubro / segmento" },
            ]}
          />
        )}
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 focus-within:ring-2 focus-within:ring-ring">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <input
            aria-label="Buscar establecimiento"
            placeholder="Buscar establecimiento…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(15);
            }}
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
          />
        </label>
        <div aria-live="polite">
          <h2 className="text-lg font-semibold">
            {choices.find((c) => c.id === view)?.label}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {ranked.length} establecimientos ·{" "}
            {view === "average"
              ? "Comparación de la utilidad mensual media del periodo con los 12 meses anteriores."
              : view === "daily"
                ? `Desglose de ${monthNames[period.month - 1]} ${period.year}. Abre cada tarjeta para consultar los días.`
                : view === "sales"
                  ? "Ordenados por ventas; se muestra también cumplimiento de la meta de utilidad."
                  : view === "utility"
                    ? "Ordenados por utilidad del periodo, con su cumplimiento de meta."
                    : "Ordenados por cumplimiento de la meta de utilidad programada del periodo."}
          </p>
        </div>
        {groups.map((group) => (
          <section key={group.label || "results"} className="space-y-3">
            {group.label && (
              <h3 className="pt-4 text-lg font-semibold">
                {group.label}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  · {group.rows.length} establecimientos
                </span>
              </h3>
            )}
            <div className={layout.list}>
              {group.rows.slice(0, grouped ? 15 : limit).map((r, index) => (
                <KpiCard
                  key={r.id}
                  data={{
                    id: r.id,
                    name: r.name,
                    subtitle: `${r.line} · ${r.segment}`,
                    position: index + 1,
                    achievement: r.achievement,
                    featured:
                      r.financial && (view === "sales" || view === "utility")
                        ? {
                            label:
                              view === "sales"
                                ? "Ventas del periodo"
                                : "Utilidad del periodo",
                            value: money(
                              view === "sales"
                                ? r.financial.revenue
                                : r.financial.utility,
                            ),
                          }
                        : undefined,
                    comparison:
                      view === "average"
                        ? `${Math.abs(r.averageChange ?? 0).toFixed(1)}% por debajo de su promedio mensual.`
                        : r.achievement === null
                          ? "No hay una meta comparable para este periodo."
                          : r.achievement < 100
                            ? `Faltan ${(100 - r.achievement).toFixed(1)} puntos porcentuales para alcanzar la meta.`
                            : "Meta programada alcanzada.",
                    amounts: r.financial
                      ? [
                          {
                            label: "Utilidad del periodo",
                            value: money(r.financial.utility),
                          },
                          {
                            label: "Meta programada",
                            value: money(r.financial.target),
                          },
                          {
                            label: "Ventas del periodo",
                            value: money(r.financial.revenue),
                          },
                          {
                            label: "Promedio mensual previo (12 meses)",
                            value:
                              r.financial.average === null
                                ? "Sin histórico suficiente"
                                : money(r.financial.average),
                          },
                          ...(view === "daily"
                            ? [
                                {
                                  label: "Utilidad del mes de corte",
                                  value: money(r.financial.monthUtility),
                                },
                              ]
                            : []),
                        ]
                      : undefined,
                    days:
                      view === "daily" && r.financial
                        ? demoDailyUtility(
                            r.id,
                            period.year,
                            period.month,
                            r.financial.monthUtility,
                          ).map((d) => ({
                            day: d.day,
                            value: hidden ? "••••" : reportMoney(d.value),
                          }))
                        : undefined,
                    dailyLabel: `${monthNames[period.month - 1]} ${period.year}`,
                  }}
                />
              ))}
            </div>
          </section>
        ))}
        {!ranked.length && (
          <div className="surface p-8 text-center">
            <p className="font-medium">Sin establecimientos en esta consulta</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba otro giro, rubro o periodo.
            </p>
            <button
              className="secondary-button mt-4 min-h-11"
              onClick={() => {
                setLine("all");
                setSegment("all");
                setQuery("");
              }}
            >
              Limpiar búsqueda y filtros
            </button>
          </div>
        )}
        {!grouped && ranked.length > limit && (
          <button
            className="secondary-button min-h-12 w-full"
            onClick={() => setLimit((v) => v + 15)}
          >
            Ver siguientes 15 · {ranked.length - limit} pendientes
          </button>
        )}
      </section>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {financial
          ? "Importes ficticios en MXN. Meta anual distribuida proporcionalmente entre los meses del periodo. Top y peores comparan cumplimiento de la meta de utilidad. Ventas y utilidad ordenan por importe dentro de cada grupo; hasta 15 registros disponibles. El desglose diario es ilustrativo y concilia con el total mensual."
          : "Indicadores de demostración. Acceso sin importes financieros."}
      </p>
    </div>
  );
}
function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="min-w-0 text-xs font-medium text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-12 w-full min-w-0 rounded-lg border border-border bg-card px-2 text-sm text-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
