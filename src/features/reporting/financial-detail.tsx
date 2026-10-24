"use client";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { reportMoney, monthNames, type ReportProfile } from "./model";
import { financialRows } from "./financial-detail-model";
import { ReportPanel } from "./report-layout";
export function FinancialDetail({
  profile,
  kind,
  year,
  month,
}: {
  profile: ReportProfile;
  kind: string;
  year: number;
  month: number;
}) {
  const money = usePrivateFormatter(reportMoney);
  const farm = kind.startsWith("Granja") || kind === "Criadero";
  const rows = financialRows(profile, year, month);
  const columns = [
    { key: "revenue", label: kind === "Restaurante" ? "Ingresos" : "Ventas" },
    { key: "cost", label: "Costo de ventas" },
    ...(farm ? [{ key: "gross", label: "Utilidades brutas" }] : []),
    { key: "general", label: "Generales" },
    { key: "authorized", label: "Autorizados" },
    ...(!farm
      ? [
          {
            key: "adjustments",
            label: kind === "Hotel" ? "Finiquitos" : "Mermas",
          },
        ]
      : []),
    { key: "other", label: "Otros ing. y gastos" },
    { key: "utility", label: "Utilidades" },
  ] as const;
  const value = (row: (typeof rows)[number], key: string) =>
    key === "general" && farm
      ? row.general + row.adjustments
      : row[
          key as
            | "revenue"
            | "cost"
            | "gross"
            | "general"
            | "authorized"
            | "adjustments"
            | "other"
            | "utility"
        ];
  return (
    <ReportPanel
      title={`Información financiera · ${year}`}
      description="Importes ficticios conciliados con el histórico. Otros ingresos y gastos conservan su signo."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-right text-xs">
          <thead>
            <tr className="border-b border-border">
              <th rowSpan={2} className="p-3 text-left">
                Mes
              </th>
              <th rowSpan={2}>{columns[0].label}</th>
              <th rowSpan={2}>Costo de ventas</th>
              {farm && <th rowSpan={2}>Utilidades brutas</th>}
              <th
                colSpan={farm ? 2 : 3}
                className="bg-muted/50 p-3 text-center"
              >
                Gastos de operación
              </th>
              <th rowSpan={2}>Otros ing. y gastos</th>
              <th rowSpan={2}>Utilidades</th>
            </tr>
            <tr>
              {columns
                .filter((c) =>
                  ["general", "authorized", "adjustments"].includes(c.key),
                )
                .map((c) => (
                  <th key={c.key} className="p-3">
                    {c.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.period} className="border-b border-border">
                <th className="p-3 text-left font-normal">
                  {monthNames[Number(row.period.slice(5)) - 1]}
                </th>
                {columns.map((c) => (
                  <td key={c.key} className="p-3 tabular-nums">
                    {money(value(row, c.key))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/40 font-semibold">
              <th className="p-3 text-left">Total</th>
              {columns.map((c) => (
                <td key={c.key} className="p-3 tabular-nums">
                  {money(rows.reduce((s, r) => s + value(r, c.key), 0))}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </ReportPanel>
  );
}
