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
  return units.filter(
    (u) =>
      (filters.segment === "all" || u.segment === filters.segment) &&
      [
        presentIdentity(u, mode).name,
        presentIdentity(u, mode).location,
        u.segment,
      ]
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(q),
  );
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
      "Segmento",
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
        u.segment,
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
