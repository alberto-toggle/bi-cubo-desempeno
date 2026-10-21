"use client";
import { FilterSelect } from "@/features/intelligence/filters";
import { monthNames, reportYears } from "./model";
export type ReportPeriod = { year: number; month: number };
export const initialReportPeriod: ReportPeriod = { year: 2026, month: 9 };
export function ReportPeriodControl({
  value,
  onChange,
}: {
  value: ReportPeriod;
  onChange: (value: ReportPeriod) => void;
}) {
  const limit = value.year === 2026 ? 9 : 12;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterSelect
        label="Ejercicio del reporte"
        value={String(value.year)}
        onChange={(v) =>
          onChange({
            year: Number(v),
            month: Math.min(value.month, Number(v) === 2026 ? 9 : 12),
          })
        }
        options={reportYears.map((y) => ({
          value: String(y),
          label: `Ejercicio ${y}`,
        }))}
      />
      <FilterSelect
        label="Mes de corte"
        value={String(value.month)}
        onChange={(v) => onChange({ ...value, month: Number(v) })}
        options={monthNames
          .slice(0, limit)
          .map((m, i) => ({ value: String(i + 1), label: `Acumulado a ${m}` }))}
      />
    </div>
  );
}
