"use client";
import { useState } from "react";
import { Download, RefreshCw, Search } from "lucide-react";
import { DemoHelp } from "@/features/demo/demo-controls";
import { GeographyPanel } from "./geography/geography-panel";
import { PaginatedUnits } from "./paginated-units";
import { OperationalBento } from "./operational-bento";
import { useAppSelector } from "@/store/hooks";
import { usePortfolio } from "./use-portfolio";
import { initialFilters } from "./model";
import { Metrics, PortfolioState } from "./presentation";
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PortfolioFilters
          value={filters}
          onChange={setFilters}
          segments={[
            ...new Set(
              data?.units.flatMap((u) => u.centers.map((c) => c.segment)),
            ),
          ]}
          units={data?.units ?? []}
          geographyAllowed={mode === "full"}
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
        54 unidades del catálogo propuesto · Identidades documentadas;
        resultados y asignaciones operativas simulados · Enero–junio 2026. La
        relación de instalaciones adicional requiere conciliación.
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
          <GeographyPanel
            units={filterUnits(data.units, { ...filters, state: "all" }, mode)}
            period={filters.period}
            mode={mode}
            selected={filters.state}
            onSelect={(state) => setFilters({ ...filters, state })}
          />
          {filters.segment !== "all" && (
            <p className="text-xs text-muted-foreground">
              Resultados de los centros de negocio de {filters.segment}; la
              división y el segmento principal de cada unidad se conservan.
            </p>
          )}
          {directory ? (
            <Metrics units={units} period={filters.period} />
          ) : (
            <OperationalBento
              units={units}
              period={filters.period}
              mode={mode}
              role={role}
            />
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
            <PaginatedUnits
              key={JSON.stringify(filters) + mode}
              units={units}
              mode={mode}
              period={filters.period}
            />
          </section>
        </>
      )}
    </div>
  );
}
