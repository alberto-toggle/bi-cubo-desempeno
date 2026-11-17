"use client";
import { FilterSelect } from "@/features/intelligence/filters";
import type { OccupancyPeriod } from "./model";

const months = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: new Intl.DateTimeFormat("es-MX", { month: "long", timeZone: "UTC" })
    .format(new Date(Date.UTC(2026, index, 1))),
}));

/** Month-level selection using the same Base UI controls as the app filters. */
export function PeriodPicker({ value, onChange }: {
  value: OccupancyPeriod;
  onChange: (value: OccupancyPeriod) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs text-muted-foreground">Mes del calendario</legend>
      <div className="flex flex-wrap gap-2">
        <FilterSelect label="Mes del calendario" value={String(value.month)}
          options={months} onChange={(month) => onChange({ ...value, month: Number(month) })} />
        <FilterSelect label="Año del calendario" value={String(value.year)}
          options={[2024, 2025, 2026, 2027].map((year) => ({ value: String(year), label: String(year) }))}
          onChange={(year) => onChange({ ...value, year: Number(year) })} />
      </div>
    </fieldset>
  );
}
