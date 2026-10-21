import type { ReactNode } from "react";

export function Bone({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton-bone ${className}`} />;
}
export function LoadingFrame({
  children,
  className = "space-y-7",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando vista"
      className={className}
    >
      <span className="sr-only">Cargando vista</span>
      <div aria-hidden="true" className={className}>
        {children}
      </div>
    </div>
  );
}
export function HeadingSkeleton({ action = false }: { action?: boolean }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="w-full max-w-xl space-y-3">
        <Bone className="h-3 w-36" />
        <Bone className="h-9 w-4/5" />
        <Bone className="h-5 w-full" />
      </div>
      {action && <Bone className="h-9 w-32" />}
    </header>
  );
}
export function HelpSkeleton() {
  return <Bone className="h-14 w-full rounded-xl" />;
}
export function FiltersSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: count }, (_, i) => (
          <Bone key={i} className="h-9 w-40" />
        ))}
      </div>
      <Bone className="h-9 w-9" />
    </div>
  );
}
export function MetricsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="surface p-5">
          <Bone className="h-4 w-24" />
          <Bone className="mt-4 h-8 w-32" />
          <Bone className="mt-3 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}
export function ChartSkeleton() {
  return (
    <section className="surface p-6">
      <div className="mb-6 flex flex-wrap justify-between gap-3">
        <Bone className="h-6 w-40" />
        <Bone className="h-4 w-32" />
      </div>
      <div className="relative h-64 border-b border-l border-border">
        <div className="absolute inset-0 flex flex-col justify-between pb-6">
          {[0, 1, 2, 3].map((i) => (
            <Bone key={i} className="h-px w-full" />
          ))}
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 500 230"
          preserveAspectRatio="none"
          className="h-full w-full text-muted"
        >
          <path
            d="M0 190 L100 150 L200 170 L300 90 L400 110 L500 40 L500 230 L0 230 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <Bone className="mt-4 h-4 w-40" />
    </section>
  );
}
export function RankingSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <section className="surface p-5 sm:p-6">
      <Bone className="h-6 w-40" />
      <Bone className="mt-1 h-4 w-4/5" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i}>
            <div className="mb-2 flex justify-between gap-5">
              <Bone className="h-4 w-3/5" />
              <Bone className="h-4 w-20" />
            </div>
            <Bone className="h-1 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
export function TableSkeleton({ catalog = false }: { catalog?: boolean }) {
  const columns = catalog ? 5 : 6;
  return (
    <section className="surface overflow-hidden">
      {!catalog && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <Bone className="h-6 w-48" />
          <Bone className="h-9 w-52" />
        </header>
      )}
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div
            className="grid gap-5 border-b border-border p-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }, (_, i) => (
              <Bone key={i} className="h-4" />
            ))}
          </div>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="grid items-center gap-5 border-b border-border px-5 py-4"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              <div className="space-y-2">
                <Bone className="h-4" />
                <Bone className="h-3 w-4/5" />
              </div>
              {Array.from({ length: columns - 1 }, (_, j) => (
                <Bone key={j} className="h-4 w-4/5" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 p-4">
        <Bone className="h-4 w-32" />
        <div className="flex gap-3">
          <Bone className="h-9 w-24" />
          <Bone className="h-9 w-24" />
        </div>
      </footer>
    </section>
  );
}
