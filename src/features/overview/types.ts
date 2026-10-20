export interface MonthlyResult {
  month: string;
  revenue: number;
  cost: number;
}
export interface Overview {
  period: string;
  source: string;
  monthly: MonthlyResult[];
  activities: { name: string; value: number }[];
}
export function parseOverview(value: unknown): Overview {
  if (!value || typeof value !== "object")
    throw new Error("Formato de datos no válido.");
  const d = value as Overview;
  if (
    typeof d.period !== "string" ||
    typeof d.source !== "string" ||
    !Array.isArray(d.monthly) ||
    !Array.isArray(d.activities)
  )
    throw new Error("Formato de datos no válido.");
  if (
    !d.monthly.every(
      (x) =>
        typeof x.month === "string" &&
        Number.isFinite(x.revenue) &&
        Number.isFinite(x.cost) &&
        x.revenue >= 0 &&
        x.cost >= 0,
    ) ||
    !d.activities.every(
      (x) =>
        typeof x.name === "string" && Number.isFinite(x.value) && x.value >= 0,
    )
  )
    throw new Error("Indicadores no válidos.");
  return d;
}
export function summarize(data: Overview) {
  const revenue = data.monthly.reduce((n, m) => n + m.revenue, 0),
    cost = data.monthly.reduce((n, m) => n + m.cost, 0);
  return {
    revenue,
    cost,
    contribution: revenue - cost,
    margin: revenue ? ((revenue - cost) / revenue) * 100 : 0,
  };
}
