import { kpiLayout as layout } from "./layout";
export function KpiSkeleton() {
  return (
    <div
      className={layout.page}
      aria-label="Cargando indicadores"
      role="status"
    >
      <div className="h-16 w-3/4 rounded-xl bg-muted motion-safe:animate-pulse" />
      <div className="h-12 rounded-xl bg-muted motion-safe:animate-pulse" />
      <div className="h-40 rounded-xl bg-muted motion-safe:animate-pulse" />
      <div className={layout.summary}>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-muted motion-safe:animate-pulse"
          />
        ))}
      </div>
      <div className="h-24 rounded-xl bg-muted motion-safe:animate-pulse" />
      <div className={layout.list}>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-52 rounded-xl bg-muted motion-safe:animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
