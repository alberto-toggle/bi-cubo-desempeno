"use client";
import { DemoHelp } from "@/features/demo/demo-controls";
import Link from "next/link";
import { ArrowLeft, MapPin, Building2, Layers3 } from "lucide-react";
import { presentIdentity } from "@/features/demo/identity-policy";
import { usePortfolio } from "./use-portfolio";
import { Metrics, TrendChart, PortfolioState } from "./presentation";
export function UnitDetail({ id }: { id: string }) {
  const { data, status, error, reload, mode } = usePortfolio();
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
    <div className="space-y-7">
      <Link
        href="/establishments"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft size={16} /> Establecimientos
      </Link>
      <header>
        <p className="eyebrow">Detalle de unidad</p>
        <h1 className="page-title">{identity.name}</h1>
        <p className="page-copy flex items-center gap-2">
          <MapPin size={14} />
          {identity.location}
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
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
      <Metrics units={[unit]} />
      <TrendChart units={[unit]} />
      <section className="surface p-6">
        <h2 className="font-semibold">Centros de negocio</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La división indica adscripción; cada centro se analiza por su
          actividad económica.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {unit.centers.map((c) => (
            <article
              key={c.name}
              className="rounded-xl border border-border p-4"
            >
              <h3 className="text-sm font-semibold">{c.name}</h3>
              <dl className="mt-4 space-y-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Segmento operativo</dt>
                  <dd className="mt-1">{c.segment}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    Centro de costo ilustrativo
                  </dt>
                  <dd className="mt-1">{c.costCenter}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
      <DemoHelp>
        Valores ficticios · Corte enero–junio 2026 · {unit.status}
      </DemoHelp>
    </div>
  );
}
