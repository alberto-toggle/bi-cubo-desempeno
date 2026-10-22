"use client";
import { intelligenceLayout } from "@/features/intelligence/layout";
import { DemoHelp } from "@/features/demo/demo-controls";
import Link from "next/link";
import { ArrowLeft, MapPin, Building2, Layers3 } from "lucide-react";
import { presentIdentity } from "@/features/demo/identity-policy";
import { usePortfolio } from "./use-portfolio";
import { TraceabilityPanel } from "./traceability/traceability-panel";
import { FilterSelect } from "./filters";
import { useState } from "react";
import { unitTotals, money } from "./model";
import { UnitReport } from "@/features/reporting/unit-report";
import { Metrics, PortfolioState } from "./presentation";
export function UnitDetail({ id }: { id: string }) {
  const { data, status, error, reload, mode } = usePortfolio();
  const [period, setPeriod] = useState("all");
  if (!data || error)
    return (
      <PortfolioState
        kind="detail"
        status={status}
        error={error}
        reload={reload}
      />
    );
  const unit = data.units.find((u) => u.id === id);
  if (!unit)
    return (
      <div className="surface p-10">
        <h1 className="page-title">Unidad no encontrada</h1>
        <Link href="/establishments" className="primary-button mt-5">
          Volver al directorio
        </Link>
      </div>
    );
  const identity = presentIdentity(unit, mode);
  return (
    <div className={intelligenceLayout.page}>
      <Link
        href="/establishments"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft size={16} /> Establecimientos
      </Link>
      <header>
        <p className="eyebrow">{unit.kind} · Detalle de unidad</p>
        <h1 className="page-title">{identity.name}</h1>
        <p className="page-copy flex items-center gap-2">
          <MapPin size={14} />
          {identity.location}
        </p>
      </header>
      <div className={intelligenceLayout.detailIdentity}>
        {[
          {
            icon: Building2,
            label: "División organizacional",
            value: unit.division,
          },
          { icon: Layers3, label: "Segmento económico", value: unit.segment },
          {
            icon: MapPin,
            label: "Región",
            value: mode === "full" ? unit.region : "Región reservada",
          },
        ].map(({ icon: Icon, label, value }) => (
          <article key={label} className="surface p-5">
            <Icon size={17} className="text-primary" />
            <p className="mt-3 text-xs text-muted-foreground">{label}</p>
            <p className="mt-2 text-sm font-medium">{value}</p>
          </article>
        ))}
      </div>
      <FilterSelect
        label="Periodo de la unidad"
        value={period}
        onChange={setPeriod}
        options={[
          { value: "all", label: "Ene – Jun 2026" },
          ...["Ene", "Feb", "Mar", "Abr", "May", "Jun"].map((v) => ({
            value: v,
            label: v + " 2026",
          })),
        ]}
      />
      <Metrics units={[unit]} period={period} />
      <section className="surface p-5">
        <h2 className="text-sm font-semibold">
          Indicadores de operación{" "}
          <span className="font-normal text-muted-foreground">
            · Acumulado enero–junio 2026
          </span>
        </h2>
        <div className={intelligenceLayout.operations}>
          {unit.operations.map((m) => (
            <div key={m.label}>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {m.value}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {m.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Valores operativos ilustrativos del semestre; no cambian con el filtro
          financiero mensual.
        </p>
      </section>
      <UnitReport unitId={unit.id} mode={mode} />
      <section className="surface p-6">
        <h2 className="font-semibold">Centros de negocio</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La división indica adscripción; cada centro se analiza por su
          actividad económica.
        </p>
        <div className={intelligenceLayout.centers}>
          {unit.centers.map((c) => (
            <article
              key={c.name}
              className="rounded-xl border border-border p-4"
            >
              <h3 className="text-sm font-semibold">{c.name}</h3>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {c.code} · Asignación ilustrativa
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">Ingresos</p>
                  <p className="mt-1 text-sm font-semibold">
                    {money(
                      unitTotals({ ...unit, monthly: c.monthly }, period)
                        .revenue,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Contribución
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {money(
                      unitTotals({ ...unit, monthly: c.monthly }, period)
                        .contribution,
                    )}
                  </p>
                </div>
              </div>
              <dl className="mt-4 space-y-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Segmento operativo</dt>
                  <dd className="mt-1">{c.segment}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    Centro de costo ilustrativo
                  </dt>
                  <dd className="mt-1">
                    {c.costCenterCode} · {c.costCenter}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sublínea</dt>
                  <dd className="mt-1">
                    {c.sublineCode} · {c.subline}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
      {unit.id === "unit-017" && <TraceabilityPanel />}
      {mode === "full" && (
        <p className="text-xs text-muted-foreground">
          Clave propuesta: {unit.code} · Catálogos maestros, p.{" "}
          {unit.sourcePage}. Nombre y adscripción sujetos a validación
          institucional.
        </p>
      )}
      <DemoHelp>
        Identidad documental; cifras y centros asignados para simulación.
        Valores ficticios · Corte enero–junio 2026 · {unit.status}
      </DemoHelp>
    </div>
  );
}
