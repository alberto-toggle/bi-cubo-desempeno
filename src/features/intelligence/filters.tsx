"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Filters as FilterValues } from "./model";
export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v);
      }}
      items={options}
    >
      <SelectTrigger aria-label={label} className="min-w-40 bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="min-w-52">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function PortfolioFilters({
  value,
  onChange,
  segments,
}: {
  value: FilterValues;
  onChange: (v: FilterValues) => void;
  segments: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterSelect
        label="Periodo"
        value={value.period}
        onChange={(period) => onChange({ ...value, period })}
        options={[
          { value: "all", label: "Ene – Jun 2026" },
          ...["Ene", "Feb", "Mar", "Abr", "May", "Jun"].map((v) => ({
            value: v,
            label: v + " 2026",
          })),
        ]}
      />
      <FilterSelect
        label="Segmento"
        value={value.segment}
        onChange={(segment) => onChange({ ...value, segment })}
        options={[
          { value: "all", label: "Todos los segmentos" },
          ...segments.map((v) => ({ value: v, label: v })),
        ]}
      />
      {(value.segment !== "all" || value.period !== "all" || value.query) && (
        <button
          className="text-xs text-primary underline"
          onClick={() => onChange({ segment: "all", period: "all", query: "" })}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
