import type { IdentityMode } from "@/features/demo/identity-policy";
import type { DemoRole } from "@/features/auth/access";
export type BusinessUnit = {
  id: string;
  name: string;
  alias: string;
  location: string;
  region: string;
  division: string;
  segment: string;
  status: "Al día" | "Por conciliar";
  monthly: { month: string; revenue: number; cost: number }[];
  centers: { name: string; segment: string; costCenter: string }[];
};
export type Portfolio = { units: BusinessUnit[]; updatedAt: string };
export type Filters = { segment: string; period: string; query: string };
export const initialFilters: Filters = {
  segment: "all",
  period: "all",
  query: "",
};
export function effectiveIdentity(
  role: DemoRole | null,
  requested: IdentityMode,
): IdentityMode {
  return role === "admin"
    ? requested
    : requested === "hidden"
      ? "hidden"
      : "alias";
}
export function unitTotals(unit: BusinessUnit, period = "all") {
  const rows = unit.monthly.filter(
    (m) => period === "all" || m.month === period,
  );
  const revenue = rows.reduce((n, m) => n + m.revenue, 0),
    cost = rows.reduce((n, m) => n + m.cost, 0);
  return {
    revenue,
    cost,
    contribution: revenue - cost,
    margin: revenue ? ((revenue - cost) / revenue) * 100 : 0,
  };
}
export function aggregate(units: BusinessUnit[], period = "all") {
  return units.reduce(
    (total, u) => {
      const t = unitTotals(u, period);
      return {
        revenue: total.revenue + t.revenue,
        cost: total.cost + t.cost,
        contribution: total.contribution + t.contribution,
      };
    },
    { revenue: 0, cost: 0, contribution: 0 },
  );
}
export function parsePortfolio(value: unknown): Portfolio {
  const v = value as Portfolio;
  if (
    !v ||
    typeof v.updatedAt !== "string" ||
    !Array.isArray(v.units) ||
    !v.units.every(
      (u) =>
        u &&
        [
          "id",
          "name",
          "alias",
          "location",
          "region",
          "division",
          "segment",
        ].every((k) => typeof u[k as keyof BusinessUnit] === "string") &&
        ["Al día", "Por conciliar"].includes(u.status) &&
        Array.isArray(u.centers) &&
        u.centers.every(
          (c) =>
            c &&
            typeof c.name === "string" &&
            typeof c.segment === "string" &&
            typeof c.costCenter === "string",
        ) &&
        Array.isArray(u.monthly) &&
        u.monthly.every(
          (m) =>
            m &&
            typeof m.month === "string" &&
            Number.isFinite(m.revenue) &&
            m.revenue >= 0 &&
            Number.isFinite(m.cost) &&
            m.cost >= 0,
        ),
    )
  )
    throw new Error("No fue posible interpretar el portafolio.");
  return v;
}
export const money = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
