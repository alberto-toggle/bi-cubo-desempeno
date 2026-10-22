import { result, type ReportProfile } from "./model";
import type { ReportPeriod } from "./period-control";

/** Monthly means use the months actually present, never twelve for a partial year. */
export function unitReportSummary(profile: ReportProfile, period: ReportPeriod) {
  const cutoff = `${period.year}-${String(period.month).padStart(2, "0")}`;
  const years = [...new Set(profile.months.filter(m => m.period <= cutoff).map(m => Number(m.period.slice(0, 4))))].sort();
  const annual = years.map(year => {
    const months = profile.months.filter(m => m.period.startsWith(`${year}-`) && m.period <= cutoff);
    const value = months.reduce((sum, m) => sum + result(m), 0);
    return { year, value, months: months.length, mean: Math.round(value / months.length) };
  });
  const completed = annual.filter(row => row.year < period.year && row.months === 12);
  const annualMean = completed.length ? Math.round(completed.reduce((sum, row) => sum + row.value, 0) / completed.length) : undefined;
  const current = profile.months.filter(m => m.period.startsWith(`${period.year}-`) && m.period <= cutoff);
  const revenue = current.reduce((sum, m) => sum + m.revenue, 0);
  const premisesRevenue = profile.premises ? Math.round(revenue * profile.premises.revenueShare / 100) : 0;
  return { annual, annualMean, completedYears: completed.map(row => row.year), sales: revenue - premisesRevenue, premisesRevenue };
}
