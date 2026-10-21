import type { BusinessUnit } from "@/features/intelligence/model";
export type ReportMonth = {
  period: string;
  revenue: number;
  cost: number;
  expenses: number;
  maintenance: number;
  investment: number;
};
export type ReportProfile = {
  unitId: string;
  months: ReportMonth[];
  targets: Record<string, number>;
  programs: { name: string; weight: number }[];
  workingCapital: number;
  revolvingFund: number;
};
export type ManagementReport = {
  source: string;
  cutoff: string;
  profiles: ReportProfile[];
};
export const reportYears = [2024, 2025, 2026];
export const monthNames = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
export const reportMoney = (cents: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(cents / 100);
export const result = (m: ReportMonth) => m.revenue - m.cost - m.expenses;
export function total(profile: ReportProfile, year: number, month: number) {
  return profile.months
    .filter(
      (m) =>
        m.period.startsWith(`${year}-`) && Number(m.period.slice(5)) <= month,
    )
    .reduce((sum, m) => sum + result(m), 0);
}
export function percent(value: number, base: number) {
  return base > 0 ? (value / base) * 100 : null;
}
export function growth(value: number, previous: number) {
  return previous > 0 ? ((value - previous) / previous) * 100 : null;
}
export function formatPercent(n: number | null) {
  return n === null
    ? "Sin base comparable"
    : `${n.toLocaleString("es-MX", { maximumFractionDigits: 1 })}%`;
}
export function commercialLine(unit: BusinessUnit) {
  if (unit.kind.startsWith("Granja")) return "Granjas";
  if (unit.kind.startsWith("Tienda")) return "Tiendas";
  if (unit.kind.startsWith("Centro comercial")) return "Centros comerciales";
  if (unit.kind.startsWith("Centinela")) return "Centinelas";
  return unit.kind;
}
export function timeline(profile: ReportProfile, end: string) {
  return profile.months
    .filter((m) => m.period <= end)
    .map((m, i, all) => {
      const average = (window: number) =>
        i + 1 < window
          ? null
          : Math.round(
              all
                .slice(i - window + 1, i + 1)
                .reduce((s, r) => s + result(r), 0) / window,
            );
      return {
        label: `${monthNames[Number(m.period.slice(5)) - 1]} ${m.period.slice(0, 4)}`,
        value: result(m),
        short: average(6),
        long: average(24),
      };
    });
}
export function programResults(profile: ReportProfile, amount: number) {
  let assigned = 0;
  return profile.programs.map((p, i) => {
    const value =
      i === profile.programs.length - 1
        ? amount - assigned
        : Math.round((amount * p.weight) / 100);
    assigned += value;
    return { label: p.name, value };
  });
}
export function parseReport(value: unknown): ManagementReport {
  if (!value || typeof value !== "object")
    throw new Error("Reporte no disponible.");
  const r = value as ManagementReport;
  const amount = (n: unknown) =>
    typeof n === "number" && Number.isSafeInteger(n) && n >= 0;
  if (
    r.cutoff !== "2026-09" ||
    typeof r.source !== "string" ||
    !Array.isArray(r.profiles) ||
    !r.profiles.length ||
    new Set(r.profiles.map((p) => p?.unitId)).size !== r.profiles.length ||
    !r.profiles.every(
      (p) =>
        p &&
        typeof p.unitId === "string" &&
        Array.isArray(p.months) &&
        p.months.length >= 24 &&
        new Set(p.months.map((m) => m?.period)).size === p.months.length &&
        p.months.every(
          (m) =>
            m &&
            /^202[3-6]-(0[1-9]|1[0-2])$/.test(m.period) &&
            m.period <= r.cutoff &&
            [m.revenue, m.cost, m.expenses, m.maintenance, m.investment].every(amount) &&
            m.maintenance <= m.expenses,
        ) &&
        p.targets &&
        reportYears.every((y) => amount(p.targets[y])) &&
        amount(p.workingCapital) &&
        amount(p.revolvingFund) &&
        Array.isArray(p.programs) &&
        p.programs.every(
          (x) => x && typeof x.name === "string" && amount(x.weight),
        ) &&
        (!p.programs.length ||
          p.programs.reduce((s, x) => s + x.weight, 0) === 100),
    )
  )
    throw new Error("No fue posible interpretar el reporte de demostración.");
  return r;
}
