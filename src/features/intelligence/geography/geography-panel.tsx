"use client";
import { useFinancialPrivacy } from "@/features/privacy/use-financial-privacy";
import { PrivateChartNotice } from "@/features/privacy/privacy-control";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { GeographyLayout } from "@/features/intelligence/geography/geography-layout";

import { useState } from "react";
import { LockKeyhole, Map } from "lucide-react";
import {
  MexicoMap,
  mexicanStates,
  type MapDatum,
} from "@/components/maps/mexico-map";
import type { IdentityMode } from "@/features/demo/identity-policy";
import { unitTotals, money as originalMoney, type BusinessUnit } from "../model";
import { FilterSelect } from "../filters";
export function GeographyPanel({
  units,
  period,
  mode,
  selected,
  onSelect,
}: {
  units: BusinessUnit[];
  period: string;
  mode: IdentityMode;
  selected: string;
  onSelect: (state: string) => void;
}) {
  const { hidden } = useFinancialPrivacy();
  const money = usePrivateFormatter(originalMoney);
  const [metric, setMetric] = useState("revenue");
  if (hidden) return <PrivateChartNotice />;
  if (mode !== "full")
    return (
      <section className="surface flex items-center gap-4 p-5">
        <LockKeyhole size={22} className="shrink-0 text-primary" />
        <div>
          <h2 className="text-sm font-semibold">
            Distribución territorial protegida
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Disponible con autorización para consultar ubicaciones. Los
            resultados se muestran sin desglose geográfico.
          </p>
        </div>
      </section>
    );
  const data: Record<string, MapDatum> = {};
  for (const u of units) {
    const t = unitTotals(u, period);
    const item = data[u.stateCode] ?? { count: 0, value: 0 };
    item.count++;
    item.value +=
      metric === "count"
        ? 1
        : metric === "contribution"
          ? t.contribution
          : t.revenue;
    data[u.stateCode] = item;
  }
  const format = (n: number) =>
    metric === "count" ? `${n} unidades` : money(n);
  const ranked = Object.entries(data)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 5);
  return (
    <GeographyLayout
      header={
        <>
          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <Map size={16} className="text-primary" />
              Distribución nacional
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {Object.keys(data).length} entidades con registros · Catálogo
              original
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect
              label="Indicador del mapa"
              value={metric}
              onChange={setMetric}
              options={[
                { value: "revenue", label: "Ingresos" },
                { value: "contribution", label: "Contribución" },
                { value: "count", label: "Unidades" },
              ]}
            />
            <FilterSelect
              label="Entidad federativa"
              value={selected}
              onChange={onSelect}
              options={[
                { value: "all", label: "Todo México" },
                ...mexicanStates.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          </div>
        </>
      }
      map={
        <>
          <MexicoMap
            data={data}
            selected={selected}
            onSelect={onSelect}
            formatValue={format}
            metricLabel={
              metric === "revenue"
                ? "Ingresos"
                : metric === "contribution"
                  ? "Contribución"
                  : "Unidades"
            }
          />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
            <span className="h-2 w-20 rounded bg-gradient-to-r from-chart-1/20 to-chart-1" />
            Menor → mayor{" "}
            {metric === "count" ? "número de unidades" : "importe"}
            <span>Sin registros ≠ cero ingresos</span>
          </div>
        </>
      }
      ranking={
        <>
          <p className="eyebrow">
            Mayor{" "}
            {metric === "count"
              ? "presencia"
              : metric === "revenue"
                ? "ingreso"
                : "contribución"}
          </p>
          <ul className="mt-4 space-y-1">
            {ranked.map(([id, item], i) => (
              <li key={id}>
                <button
                  onClick={() => onSelect(id === selected ? "all" : id)}
                  aria-pressed={id === selected}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left text-xs transition-colors hover:bg-accent ${id === selected ? "bg-accent" : ""}`}
                >
                  <span className="text-muted-foreground">0{i + 1}</span>
                  <span className="flex-1">
                    {mexicanStates.find((s) => s.id === id)?.name}
                    <small className="mt-1 block text-muted-foreground">
                      {item.count} unidades
                    </small>
                  </span>
                  <span className="tabular-nums">{format(item.value)}</span>
                </button>
              </li>
            ))}
          </ul>
          {!ranked.length && (
            <p className="py-8 text-sm text-muted-foreground">
              Sin registros para los filtros actuales.
            </p>
          )}
          <p className="mt-5 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
            Las cifras corresponden al periodo y actividad seleccionados.
            Seleccionar una entidad filtra el resumen y el directorio de abajo.
          </p>
        </>
      }
    />
  );
}
