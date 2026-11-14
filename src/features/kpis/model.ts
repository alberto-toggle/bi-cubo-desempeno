import type { BusinessUnit } from "@/features/intelligence/model";
import {
  commercialLine,
  result,
  type ManagementReport,
} from "@/features/reporting/model";
import type { PerformanceData } from "@/features/performance/model";
export type KpiPeriod = {
  year: number;
  month: number;
  window: "month" | "quarter" | "year";
};
export type KpiRow = {
  id: string;
  name: string;
  line: string;
  segment: string;
  achievement: number | null;
  averageChange: number | null;
  financial?: {
    revenue: number;
    utility: number;
    target: number;
    average: number | null;
    monthUtility: number;
  };
};
export function bounds(p: KpiPeriod) {
  const start =
    p.window === "year"
      ? 1
      : p.window === "quarter"
        ? Math.floor((p.month - 1) / 3) * 3 + 1
        : p.month;
  return {
    start,
    count: p.month - start + 1,
    from: `${p.year}-${String(start).padStart(2, "0")}`,
    to: `${p.year}-${String(p.month).padStart(2, "0")}`,
  };
}
export function financialKpis(
  units: BusinessUnit[],
  report: ManagementReport,
  period: KpiPeriod,
): KpiRow[] {
  const { from, to, count } = bounds(period);
  return units.flatMap((unit) => {
    const profile = report.profiles.find((p) => p.unitId === unit.id);
    if (!profile) return [];
    const months = profile.months.filter(
      (m) => m.period >= from && m.period <= to,
    );
    if (months.length !== count) return [];
    const utility = months.reduce((s, m) => s + result(m), 0);
    const revenue = months.reduce((s, m) => s + m.revenue, 0);
    const target = Math.round(
      ((profile.targets[period.year] ?? 0) * count) / 12,
    );
    const previous = profile.months
      .filter((m) => m.period < from)
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-12);
    const average =
      previous.length === 12
        ? previous.reduce((s, m) => s + result(m), 0) / 12
        : null;
    return [
      {
        id: unit.id,
        name: unit.name,
        line: commercialLine(unit),
        segment: unit.segment,
        achievement: target > 0 ? (utility / target) * 100 : null,
        averageChange:
          average !== null && average > 0
            ? (utility / count / average - 1) * 100
            : null,
        financial: {
          revenue,
          utility,
          target,
          average,
          monthUtility: result(months[months.length - 1]),
        },
      },
    ];
  });
}
// Staff consumes only the non-financial performance repository.
export function indicatorKpis(
  data: PerformanceData,
  period: KpiPeriod,
): KpiRow[] {
  const { start, count } = bounds(period);
  return data.units.flatMap((u) => {
    const current = u.periods.find(
      (p) => p.year === period.year && p.month === period.month,
    );
    const before =
      start === 1
        ? 0
        : u.periods.find((p) => p.year === period.year && p.month === start - 1)
            ?.achievement;
    if (!current || before === undefined) return [];
    return [
      {
        id: u.id,
        name: u.name,
        line: u.line,
        segment: u.segment,
        achievement: (current.achievement - before) / (count / 12),
        averageChange: null,
      },
    ];
  });
}
export type KpiView =
  "target" | "average" | "bottom" | "top" | "daily" | "sales" | "utility";
export function rankKpis(rows: KpiRow[], view: KpiView) {
  if (view === "average")
    return rows
      .filter((r) => r.averageChange !== null && r.averageChange < 0)
      .sort((a, b) => a.averageChange! - b.averageChange!);
  if (view === "sales" || view === "utility")
    return rows
      .filter((r) => r.financial)
      .sort((a, b) =>
        view === "sales"
          ? b.financial!.revenue - a.financial!.revenue
          : b.financial!.utility - a.financial!.utility,
      )
      .slice(0, 15);
  if (view === "daily")
    return [...rows].sort(
      (a, b) =>
        (b.financial?.monthUtility ?? 0) - (a.financial?.monthUtility ?? 0),
    );
  const ranked = rows
    .filter((r) => r.achievement !== null)
    .sort((a, b) => a.achievement! - b.achievement!);
  if (view === "target") return ranked.filter((r) => r.achievement! < 100);
  return view === "top" ? ranked.reverse().slice(0, 15) : ranked.slice(0, 15);
}

export type KpiGrouping = "all" | "line" | "segment";

export function kpiGroups(
  rows: KpiRow[],
  view: KpiView,
  grouping: KpiGrouping,
) {
  const grouped = ["top", "bottom", "sales", "utility"].includes(view);
  if (!grouped || grouping === "all")
    return [{ label: "", rows: rankKpis(rows, view) }];
  return [...new Set(rows.map((r) => r[grouping]))].sort().map((label) => ({
    label,
    rows: rankKpis(
      rows.filter((r) => r[grouping] === label),
      view,
    ),
  }));
}
