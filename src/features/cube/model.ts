import type { BusinessUnit } from "@/features/intelligence/model";
import {
  presentIdentity,
  type IdentityMode,
} from "@/features/demo/identity-policy";
import {
  commercialLine,
  monthNames,
  result,
  type ManagementReport,
  type ReportMonth,
} from "@/features/reporting/model";
import type { ReportPeriod } from "@/features/reporting/period-control";
export type CubeMetric = "revenue" | "cost" | "expenses" | "maintenance" | "investment";
export const cubeMetrics: {
  id: CubeMetric;
  label: string;
  code: string;
  color: string;
  note?: string;
}[] = [
  { id: "revenue", label: "Ingresos", code: "4xxx", color: "var(--chart-1)" },
  {
    id: "cost",
    label: "Costos directos",
    code: "5xxx",
    color: "var(--chart-2)",
  },
  {
    id: "expenses",
    label: "Gastos operativos",
    code: "6xxx",
    color: "var(--chart-3)",
  },
  {
    id: "maintenance", label: "Mantenimiento", code: "61xx", color: "var(--chart-4)",
    note: "Mantenimiento está incluido en gastos operativos; no se descuenta de nuevo del resultado de gestión.",
  },
  {
    id: "investment", label: "Inversión", code: "8xxx", color: "var(--chart-5)",
    note: "Inversión se registra por separado y no se descuenta del resultado de gestión.",
  },
];
export type CubeFilters = ReportPeriod & {
  state: string;
  line: string;
  metric: CubeMetric;
};
export type CubeRow = {
  id: string;
  label: string;
  line: string;
  value: number;
  result: number;
  target: number;
  previous: number;
};
export type CubeSnapshot = {
  context: string;
  metric: string;
  metricNote?: string;
  period: string;
  count: number;
  value: number;
  previous: number;
  revenue: number;
  cost: number;
  expenses: number;
  result: number;
  target: number;
  month: number;
  rows: CubeRow[];
  groups: { label: string; value: number }[];
  timeline: {
    label: string;
    value: number;
    short?: number | null;
    long?: number | null;
  }[];
  geography: Record<string, { count: number; value: number }>;
};
export function cubeSnapshot(
  report: ManagementReport,
  units: BusinessUnit[],
  filters: CubeFilters,
  mode: IdentityMode,
  stateLabel: string,
): CubeSnapshot {
  const profiles = new Map(report.profiles.map((p) => [p.unitId, p]));
  const allowed = units.filter(
    (u) =>
      (mode !== "full" ||
        filters.state === "all" ||
        u.stateCode === filters.state) &&
      (filters.line === "all" || commercialLine(u) === filters.line),
  );
  const metric = cubeMetrics.find((m) => m.id === filters.metric)!;
  const period = `Enero–${monthNames[filters.month - 1]} ${filters.year}`;
  const snapshot: CubeSnapshot = {
    context: `${mode === "full" ? stateLabel : "Ámbito agregado · ubicaciones reservadas"} · ${filters.line === "all" ? "Todos los giros" : filters.line}`,
    metric: metric.label,
    metricNote: metric.note,
    period,
    count: 0,
    value: 0,
    previous: 0,
    revenue: 0,
    cost: 0,
    expenses: 0,
    result: 0,
    target: 0,
    month: filters.month,
    rows: [],
    groups: [],
    timeline: Array.from({ length: filters.month }, (_, i) => ({
      label: monthNames[i],
      value: 0,
    })),
    geography: {},
  };
  const groups = new Map<string, number>();
  const history = new Map<string, number>();
  for (const unit of allowed) {
    const p = profiles.get(unit.id);
    if (!p) continue;
    const inPeriod = (m: ReportMonth, year: number) =>
      m.period.startsWith(`${year}-`) &&
      Number(m.period.slice(5)) <= filters.month;
    for (const m of p.months)
      history.set(m.period, (history.get(m.period) ?? 0) + m[filters.metric]);
    const months = p.months.filter((m) => inPeriod(m, filters.year));
    const value = months.reduce((s, m) => s + m[filters.metric], 0);
    const previous = p.months
      .filter((m) => inPeriod(m, filters.year - 1))
      .reduce((s, m) => s + m[filters.metric], 0);
    const outcome = months.reduce((s, m) => s + result(m), 0);
    const target = p.targets[filters.year] ?? 0;
    snapshot.count++;
    snapshot.value += value;
    snapshot.previous += previous;
    snapshot.result += outcome;
    snapshot.target += target;
    for (const m of months) {
      snapshot.revenue += m.revenue;
      snapshot.cost += m.cost;
      snapshot.expenses += m.expenses;
      snapshot.timeline[Number(m.period.slice(5)) - 1].value +=
        m[filters.metric];
    }
    const line = commercialLine(unit);
    groups.set(line, (groups.get(line) ?? 0) + value);
    snapshot.rows.push({
      id: unit.id,
      label: presentIdentity(unit, mode).name,
      line,
      value,
      result: outcome,
      target,
      previous,
    });
    if (mode === "full") {
      const datum = snapshot.geography[unit.stateCode] ?? {
        count: 0,
        value: 0,
      };
      datum.count++;
      datum.value += value;
      snapshot.geography[unit.stateCode] = datum;
    }
  }
  const historic = [...history].sort(([a], [b]) => a.localeCompare(b));
  snapshot.timeline = snapshot.timeline.map((point, month) => {
    const at = historic.findIndex(
      ([period]) =>
        period === `${filters.year}-${String(month + 1).padStart(2, "0")}`,
    );
    const average = (window: number) =>
      at + 1 < window
        ? null
        : Math.round(
            historic
              .slice(at - window + 1, at + 1)
              .reduce((sum, [, value]) => sum + value, 0) / window,
          );
    return { ...point, short: average(6), long: average(24) };
  });
  snapshot.rows.sort((a, b) => b.value - a.value);
  snapshot.groups = [...groups]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  return snapshot;
}
