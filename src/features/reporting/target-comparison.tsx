"use client";
import { ReportPanel } from "./report-layout";
import { reportMoney, formatPercent, percent } from "./model";
import { useFinancialPrivacy } from "@/features/privacy/use-financial-privacy";
import { PrivateChartNotice } from "@/features/privacy/privacy-control";
export type TargetComparisonRow = {
  label: string;
  value: number;
  target: number;
  color: string;
};
/** A shared scale preserves size comparisons; the marker denotes the period target. */
export function TargetComparison({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: TargetComparisonRow[];
}) {
  const { hidden } = useFinancialPrivacy();
  const max = Math.max(1, ...rows.flatMap((r) => [r.value, r.target]));
  return (
    <ReportPanel title={title} description={description}>
      {hidden ? (
        <PrivateChartNotice />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Color: utilidad generada</span>
            <span>Tramo tenue: pendiente de meta</span>
            <span>│ Marca: meta esperada</span>
          </div>
          <div className="space-y-6">
            {rows.map((r) => (
              <div key={r.label}>
                <div className="mb-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
                  <strong>{r.label}</strong>
                  <span className="tabular-nums">
                    {reportMoney(r.value)} ·{" "}
                    {formatPercent(percent(r.value, r.target))}
                  </span>
                </div>
                <div className="relative h-7" aria-hidden="true">
                  <div
                    className="absolute inset-y-0 left-0 rounded"
                    style={{
                      width: `${(Math.max(0, r.target) / max) * 100}%`,
                      background: "var(--chart-2)",
                      opacity: 0.2,
                    }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded"
                    style={{
                      width: `${(Math.max(0, r.value) / max) * 100}%`,
                      background: r.color,
                    }}
                  />
                  {r.target > 0 && (
                    <div
                      className="absolute -top-1 h-9 w-0.5 bg-foreground"
                      style={{ left: `${(r.target / max) * 100}%` }}
                    />
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Meta esperada: {reportMoney(r.target)} ·{" "}
                  {r.value >= r.target ? "Excedente" : "Por alcanzar"}:{" "}
                  {reportMoney(Math.abs(r.target - r.value))}
                  {r.value < 0 ? " · Resultado negativo" : ""}
                </p>
              </div>
            ))}
          </div>
          {!rows.length && (
            <p className="text-sm text-muted-foreground">
              Sin datos para este corte.
            </p>
          )}
        </>
      )}
    </ReportPanel>
  );
}
