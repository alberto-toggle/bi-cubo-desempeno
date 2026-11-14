import assignments from "@/features/demo/responsible-assignments.json";
import {
  result,
  growth,
  percent,
  type ManagementReport,
  type ReportProfile,
} from "@/features/reporting/model";
import type { ReportPeriod } from "@/features/reporting/period-control";
function shift(period: string, delta: number) {
  const [y, m] = period.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function months(profile: ReportProfile, end: string) {
  return profile.months
    .filter((m) => m.period >= shift(end, -2) && m.period <= end)
    .sort((a, b) => a.period.localeCompare(b.period));
}
export function demoResponsiblePerformance(
  report: ManagementReport,
  profile: ReportProfile,
  period: ReportPeriod,
) {
  const assignment = assignments.find((a) => a.unitId === profile.unitId);
  const previous = report.profiles.find(
    (p) => p.unitId === assignment?.previousUnitId,
  );
  if (!assignment || !previous) return null;
  const end = `${period.year}-${String(period.month).padStart(2, "0")}`;
  const start = shift(end, -2),
    appointed = profile.staff.appointed.slice(0, 7);
  const current = months(profile, end);
  const prior = months(previous, shift(appointed, -1));
  // Compare the same person in two explicitly simulated assignments, never two managers.
  if (start < appointed || current.length !== 3 || prior.length !== 3)
    return null;
  const entries = current.map((m) => ({
    period: m.period,
    revenue: m.revenue,
    utility: result(m),
    target: Math.round((profile.targets[m.period.slice(0, 4)] ?? 0) / 12),
  }));
  const sales = entries.reduce((s, m) => s + m.revenue, 0),
    utility = entries.reduce((s, m) => s + m.utility, 0),
    target = entries.reduce((s, m) => s + m.target, 0);
  const priorSales = prior.reduce((s, m) => s + m.revenue, 0);
  const priorUtility = prior.reduce((s, m) => s + result(m), 0);
  const priorTarget = prior.reduce(
    (s, m) =>
      s + Math.round((previous.targets[m.period.slice(0, 4)] ?? 0) / 12),
    0,
  );
  return {
    ...assignment,
    name: profile.staff.manager,
    appointed: profile.staff.appointed,
    start,
    end,
    previousStart: prior[0].period,
    previousEnd: prior[2].period,
    entries,
    sales,
    utility,
    target,
    achievement: percent(utility, target),
    priorSales,
    priorUtility,
    priorTarget,
    priorAchievement: percent(priorUtility, priorTarget),
    salesGrowth: growth(sales, priorSales),
  };
}
export type ResponsiblePerformanceData = NonNullable<
  ReturnType<typeof demoResponsiblePerformance>
>;
