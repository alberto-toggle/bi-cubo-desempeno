import type { IdentityMode } from "@/features/demo/identity-policy";
import type { DemoRole } from "@/features/auth/access";
export type MonthlyResult = { month: string; revenue: number; cost: number };
export type BusinessCenter = {
  id: string;
  code: string;
  name: string;
  segment: string;
  costCenterCode: string;
  costCenter: string;
  sublineCode: string;
  subline: string;
  monthly: MonthlyResult[];
};
export type BusinessUnit = {
  id: string;
  code: string;
  name: string;
  alias: string;
  location: string;
  stateCode: string;
  region: string;
  division: string;
  segment: string;
  segmentCode: string;
  kind: string;
  sourcePage: number;
  status: "Al día" | "Por conciliar";
  monthly: MonthlyResult[];
  centers: BusinessCenter[];
  operations: { label: string; value: string; unit: string }[];
};
export type Portfolio = { units: BusinessUnit[]; updatedAt: string };
export type Filters = {
  segment: string;
  period: string;
  query: string;
  state: string;
  region: string;
  division: string;
};
export const initialFilters: Filters = {
  segment: "all",
  period: "all",
  query: "",
  state: "all",
  region: "all",
  division: "all",
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
function validMonthly(value: unknown): value is MonthlyResult[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    new Set(value.map((m) => m?.month)).size === value.length &&
    value.every(
      (m) =>
        m &&
        typeof m.month === "string" &&
        Number.isFinite(m.revenue) &&
        m.revenue >= 0 &&
        Number.isFinite(m.cost) &&
        m.cost >= 0,
    )
  );
}
export function parsePortfolio(value: unknown): Portfolio {
  const v = value as Portfolio;
  if (
    !v ||
    typeof v.updatedAt !== "string" ||
    !Array.isArray(v.units) ||
    new Set(v.units.map((u) => u?.id)).size !== v.units.length ||
    !v.units.every(
      (u) =>
        u &&
        [
          "id",
          "code",
          "name",
          "alias",
          "location",
          "stateCode",
          "region",
          "division",
          "segment",
          "segmentCode",
          "kind",
        ].every((k) => typeof u[k as keyof BusinessUnit] === "string") &&
        ["Al día", "Por conciliar"].includes(u.status) &&
        Number.isInteger(u.sourcePage) &&
        validMonthly(u.monthly) &&
        Array.isArray(u.operations) &&
        u.operations.every(
          (m) =>
            m &&
            typeof m.label === "string" &&
            typeof m.value === "string" &&
            typeof m.unit === "string",
        ) &&
        Array.isArray(u.centers) &&
        u.centers.length > 0 &&
        u.centers.every(
          (c) =>
            c &&
            [
              "id",
              "code",
              "name",
              "segment",
              "costCenterCode",
              "costCenter",
              "sublineCode",
              "subline",
            ].every((k) => typeof c[k as keyof BusinessCenter] === "string") &&
            validMonthly(c.monthly),
        ) &&
        u.monthly.every(
          (m) =>
            u.centers.reduce(
              (sum, c) =>
                sum +
                (c.monthly.find((x) => x.month === m.month)?.revenue ?? NaN),
              0,
            ) === m.revenue &&
            u.centers.reduce(
              (sum, c) =>
                sum + (c.monthly.find((x) => x.month === m.month)?.cost ?? NaN),
              0,
            ) === m.cost,
        ),
    )
  )
    throw new Error("No fue posible interpretar o conciliar el portafolio.");
  return v;
}
export const money = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
