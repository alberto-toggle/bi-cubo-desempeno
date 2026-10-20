"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, RefreshCw, Search } from "lucide-react";
import { DemoHelp } from "@/features/demo/demo-controls";
import { OrbitalArtwork } from "@/features/overview/orbital-artwork";
import { presentIdentity } from "@/features/demo/identity-policy";
import { useAppSelector } from "@/store/hooks";
import { usePortfolio } from "./use-portfolio";
import { initialFilters, unitTotals } from "./model";
import {
  Metrics,
  TrendChart,
  UnitsTable,
  PortfolioState,
} from "./presentation";
import { PortfolioFilters } from "./filters";
import { filterUnits, buildCsv } from "./queries";
export function PortfolioScreen({
  directory = false,
}: {
  directory?: boolean;
}) {
  const { data, status, error, reload, mode } = usePortfolio(),
    [filters, setFilters] = useState(initialFilters),
    [notice, setNotice] = useState(""),
    role = useAppSelector((s) => s.auth.session?.role);
  const units = filterUnits(data?.units ?? [], filters, mode);
  function exportCsv() {
    const blob = new Blob(["\uFEFF" + buildCsv(units, mode, filters.period)], {
        type: "text/csv;charset=utf-8;",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "panorama-demo.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Exportación lista con la visibilidad y filtros actuales.");
  }
  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            {directory
              ? "Operación / Directorio"
              : role === "admin"
                ? "Consulta administrativa"
                : "Consulta operativa"}
          </p>
          <h1 className="page-title">
            {directory ? "Establecimientos" : "Resumen operativo y financiero"}
          </h1>
          <p className="page-copy">
            {directory
              ? "Consulta de resultados y estructura de las unidades."
              : "Ingresos, costos y contribución por periodo y segmento."}
          </p>
        </div>
        <button
          className="secondary-button"
          disabled={!data || !units.length}
          onClick={exportCsv}
        >
          <Download size={15} /> Exportar CSV
        </button>
      </header>
      {!directory && (
        <section className="welcome-panel">
          <div className="max-w-xl">
            <span className="pill border-hero-control-border bg-hero-control-fill text-hero-foreground">
              {role === "admin" ? "Acceso administrador" : "Acceso staff"}
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight">
              Consulta y comparación de resultados
              <br />
              <span className="opacity-65">
                por periodo, segmento y establecimiento.
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              {role === "admin"
                ? "Filtra ingresos y costos, revisa centros de costo y exporta resultados. Puedes consultar nombres y ubicaciones, catálogos y apariencia."
                : "Filtra ingresos y costos y exporta resultados. Los nombres y ubicaciones permanecen protegidos con alias o datos ofuscados."}
            </p>
            <Link
              href="/establishments"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
            >
              Explorar establecimientos
              <ArrowRight size={16} />
            </Link>
          </div>
          <OrbitalArtwork />
        </section>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PortfolioFilters
          value={filters}
          onChange={setFilters}
          segments={[...new Set(data?.units.map((u) => u.segment))]}
        />
        <button
          className="secondary-button"
          onClick={reload}
          disabled={status === "loading"}
          aria-label="Actualizar información"
        >
          <RefreshCw
            size={14}
            className={status === "loading" ? "animate-spin" : ""}
          />
        </button>
      </div>
      {notice && (
        <p className="text-xs text-muted-foreground" role="status">
          {notice}
        </p>
      )}
      <DemoHelp>
        Datos sintéticos · Enero–junio 2026 · Muestra ilustrativa, no padrón
        oficial.
      </DemoHelp>
      {!data || error ? (
        <PortfolioState
          kind={directory ? "directory" : "overview"}
          status={status}
          error={error}
          reload={reload}
        />
      ) : (
        <>
          <Metrics units={units} period={filters.period} />
          {!directory && (
            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              <TrendChart units={units} period={filters.period} />
              <section className="surface p-6">
                <h2 className="font-semibold">Contribución por unidad</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Participación en la muestra filtrada
                </p>
                <ul className="mt-6 space-y-5">
                  {[...units]
                    .sort(
                      (a, b) =>
                        unitTotals(b, filters.period).contribution -
                        unitTotals(a, filters.period).contribution,
                    )
                    .map((u) => {
                      const value = unitTotals(u, filters.period).contribution,
                        max = Math.max(
                          ...units.map(
                            (v) => unitTotals(v, filters.period).contribution,
                          ),
                          1,
                        );
                      return (
                        <li key={u.id}>
                          <div className="mb-2 flex justify-between gap-3 text-xs">
                            <Link
                              className="hover:text-primary"
                              href={"/establishments/" + u.id}
                            >
                              {presentIdentity(u, mode).name}
                            </Link>
                            <span className="text-muted-foreground">
                              {(value / 1000).toFixed(1)}k
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: (value / max) * 100 + "%" }}
                            />
                          </div>
                        </li>
                      );
                    })}
                </ul>
                {!units.length && (
                  <p className="mt-8 text-sm text-muted-foreground">
                    Sin resultados para esta selección.
                  </p>
                )}
              </section>
            </div>
          )}
          <section className="surface overflow-hidden">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <h2 className="font-semibold">
                {directory
                  ? "Directorio de unidades"
                  : "Detalle de la operación"}{" "}
                <span className="ml-2 text-xs text-muted-foreground">
                  {units.length}
                </span>
              </h2>
              <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                <Search size={14} />
                <input
                  className="w-44 bg-transparent text-xs outline-none"
                  placeholder="Buscar nombre visible…"
                  aria-label="Buscar establecimiento"
                  value={filters.query}
                  onChange={(e) =>
                    setFilters({ ...filters, query: e.target.value })
                  }
                />
              </label>
            </header>
            <UnitsTable units={units} mode={mode} period={filters.period} />
          </section>
        </>
      )}
    </div>
  );
}
