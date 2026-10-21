import {
  presentIdentity,
  type IdentityMode,
} from "@/features/demo/identity-policy";
import { unitTotals, type BusinessUnit, type Filters } from "./model";
export function filterUnits(
  units: BusinessUnit[],
  filters: Filters,
  mode: IdentityMode,
) {
  const q = filters.query.trim().toLocaleLowerCase("es");
  return units
    .filter(
      (u) =>
        (mode !== "full" ||
          filters.state === "all" ||
          u.stateCode === filters.state) &&
        (mode !== "full" ||
          filters.region === "all" ||
          u.region === filters.region) &&
        (filters.division === "all" || u.division === filters.division) &&
        [
          presentIdentity(u, mode).name,
          presentIdentity(u, mode).location,
          u.segment,
          u.kind,
        ]
          .join(" ")
          .toLocaleLowerCase("es")
          .includes(q),
    )
    .flatMap((u) => {
      const centers =
        filters.segment === "all"
          ? u.centers
          : u.centers.filter((c) => c.segment === filters.segment);
      if (!centers.length) return [];
      return [
        {
          ...u,
          centers,
          monthly: u.monthly.map((m) => ({
            month: m.month,
            revenue: centers.reduce(
              (sum, c) =>
                sum +
                (c.monthly.find((x) => x.month === m.month)?.revenue ?? 0),
              0,
            ),
            cost: centers.reduce(
              (sum, c) =>
                sum + (c.monthly.find((x) => x.month === m.month)?.cost ?? 0),
              0,
            ),
          })),
        },
      ];
    });
}
function csvCell(value: string | number) {
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replaceAll('"', '""') + '"';
}
export function buildCsv(
  units: BusinessUnit[],
  mode: IdentityMode,
  period: string,
) {
  return [
    [
      "Establecimiento",
      "Ubicación",
      "Segmentos operativos incluidos",
      "Periodo",
      "Ingresos",
      "Costos",
      "Contribución",
    ],
    ...units.map((u) => {
      const view = presentIdentity(u, mode),
        t = unitTotals(u, period);
      return [
        view.name,
        view.location,
        [...new Set(u.centers.map((c) => c.segment))].join(" / "),
        period === "all" ? "Ene-Jun 2026" : period + " 2026",
        t.revenue,
        t.cost,
        t.contribution,
      ];
    }),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}
