"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  ReportPeriodControl,
  initialReportPeriod,
} from "@/features/reporting/period-control";
import { FilterSelect } from "@/features/intelligence/filters";
import { loadPerformance } from "./performance-slice";
import { performanceStatus } from "./model";
import { PerformanceSkeleton, performanceLayout } from "./performance-skeleton";
export function PerformanceScreen({ path }: { path: string }) {
  const dispatch = useAppDispatch();
  const { data, error } = useAppSelector((s) => s.performance);
  const [period, setPeriod] = useState(initialReportPeriod),
    [query, setQuery] = useState(""),
    [line, setLine] = useState("all");
  useEffect(() => {
    const task = dispatch(loadPerformance());
    return () => task.abort();
  }, [dispatch]);
  const [page, setPage] = useState(0);
  const id = path.startsWith("/establishments/") ? path.split("/")[2] : null;
  if (error)
    return (
      <div className="surface p-6" role="alert">
        {error}
        <button
          className="secondary-button ml-3"
          onClick={() => void dispatch(loadPerformance())}
        >
          Reintentar
        </button>
      </div>
    );
  if (!data) return <PerformanceSkeleton />;
  const unit = id ? data.units.find((u) => u.id === id) : null;
  if (id && !unit)
    return (
      <p className="surface p-6">
        Establecimiento no encontrado.{" "}
        <Link href="/establishments">Volver al directorio</Link>
      </p>
    );
  const rows = data.units
    .filter(
      (u) =>
        (!id || u.id === id) &&
        (line === "all" || u.line === line) &&
        u.name.toLowerCase().includes(query.toLowerCase()),
    )
    .flatMap((u) => {
      const metrics = u.periods.find(
        (p) => p.year === period.year && p.month === period.month,
      );
      return metrics ? [{ ...u, metrics }] : [];
    });
  const pages = Math.max(1, Math.ceil(rows.length / 10)),
    currentPage = Math.min(page, pages - 1);
  const mean = (key: "achievement" | "change" | "availability" | "service") =>
    rows.length
      ? (
          rows.reduce((sum, r) => sum + r.metrics[key], 0) / rows.length
        ).toLocaleString("es-MX", { maximumFractionDigits: 1 }) + "%"
      : "—";
  const title =
    unit?.name ??
    (path === "/reports"
      ? "Cumplimiento de objetivos"
      : path === "/cube"
        ? "Indicadores de desempeño"
        : path === "/establishments"
          ? "Establecimientos"
          : "Resumen de desempeño");
  return (
    <div className={performanceLayout.page}>
      {id && (
        <Link href="/establishments" className="text-sm text-primary">
          ← Establecimientos
        </Link>
      )}
      <header>
        <p className="eyebrow">Consulta operativa</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-copy">
          Seguimiento de objetivos, disponibilidad y atención. Datos ficticios.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        <ReportPeriodControl
          value={period}
          onChange={(value) => {
            setPeriod(value);
            setPage(0);
          }}
        />
        {!id && (
          <FilterSelect
            label="Giro"
            value={line}
            onChange={(value) => {
              setLine(value);
              setPage(0);
            }}
            options={[
              { value: "all", label: "Todos los giros" },
              ...[...new Set(data.units.map((u) => u.line))]
                .sort()
                .map((v) => ({ value: v, label: v })),
            ]}
          />
        )}
      </div>
      <div className={performanceLayout.cards}>
        {[
          [
            "Avance de objetivos",
            mean("achievement"),
            "Promedio de cumplimiento por establecimiento",
          ],
          [
            "Variación interanual",
            mean("change"),
            "Mismo corte del ejercicio anterior",
          ],
          [
            "Disponibilidad",
            mean("availability"),
            "Nivel de servicio del periodo",
          ],
          [
            "Atención dentro de plazo",
            mean("service"),
            "Solicitudes atendidas oportunamente",
          ],
        ].map(([label, value, note]) => (
          <article className="surface p-5" key={label}>
            <h2 className="text-xs text-muted-foreground">{label}</h2>
            <p className="my-3 text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{note}</p>
          </article>
        ))}
      </div>
      <section className="surface overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 p-5">
          <h2 className="font-semibold">Seguimiento por establecimiento</h2>
          {!id && (
            <input
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              aria-label="Buscar establecimiento"
              placeholder="Buscar establecimiento…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
          )}
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs">
              <tr>
                {[
                  "Establecimiento",
                  "Giro / segmento",
                  "Avance",
                  "Desempeño",
                  "Conciliación",
                ].map((h) => (
                  <th className="p-4" key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(currentPage * 10, currentPage * 10 + 10).map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-4">
                    <Link
                      className="font-medium text-primary"
                      href={`/establishments/${r.id}`}
                    >
                      {r.name}
                    </Link>
                  </td>
                  <td className="p-4 text-xs">
                    {r.line} · {r.segment}
                  </td>
                  <td className="p-4 tabular-nums">{r.metrics.achievement}%</td>
                  <td className="p-4">
                    <span className="pill">
                      {performanceStatus(r.metrics.achievement, period.month)}
                    </span>
                  </td>
                  <td className="p-4 text-xs">{r.metrics.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!id && (
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-xs">
            <span>
              {rows.length} establecimientos · Página {currentPage + 1} de{" "}
              {pages}
            </span>
            <div className="flex gap-2">
              <button
                className="secondary-button disabled:opacity-40"
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                Anterior
              </button>
              <button
                className="secondary-button disabled:opacity-40"
                disabled={currentPage + 1 >= pages}
                onClick={() => setPage(currentPage + 1)}
              >
                Siguiente
              </button>
            </div>
          </footer>
        )}
        {!rows.length && (
          <p className="p-8 text-center text-muted-foreground">
            Sin coincidencias para los filtros seleccionados.
          </p>
        )}
        <p className="border-t border-border p-4 text-xs text-muted-foreground">
          Desempeño comparado con el objetivo programado al corte. No se
          muestran importes financieros.
        </p>
      </section>
    </div>
  );
}
