"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  initialFilters,
  type BusinessUnit,
  type Filters as FilterValues,
} from "./model";
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
  units,
  geographyAllowed,
}: {
  value: FilterValues;
  onChange: (v: FilterValues) => void;
  segments: string[];
  units: BusinessUnit[];
  geographyAllowed: boolean;
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
      <FilterSelect
        label="División"
        value={value.division}
        onChange={(division) => onChange({ ...value, division })}
        options={[
          { value: "all", label: "Todas las divisiones" },
          ...[...new Set(units.map((u) => u.division))].map((v) => ({
            value: v,
            label: v,
          })),
        ]}
      />
      {geographyAllowed && (
        <FilterSelect
          label="Región"
          value={value.region}
          onChange={(region) => onChange({ ...value, region, state: "all" })}
          options={[
            { value: "all", label: "Todas las regiones" },
            ...[...new Set(units.map((u) => u.region))].map((v) => ({
              value: v,
              label: v,
            })),
          ]}
        />
      )}
      {(value.segment !== "all" ||
        value.period !== "all" ||
        value.division !== "all" ||
        value.region !== "all" ||
        value.state !== "all" ||
        value.query) && (
        <button
          className="text-xs text-primary underline"
          onClick={() => onChange(initialFilters)}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
