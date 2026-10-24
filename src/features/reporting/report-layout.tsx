import type { ReactNode } from "react";
export const reportLayout = {
  detail: "grid items-start gap-5 xl:grid-cols-[200px_minmax(0,1fr)]",
  story: "grid items-start gap-5 xl:grid-cols-[220px_minmax(0,1fr)]",
  page: "space-y-7",
  pair: "grid items-start gap-5 xl:grid-cols-2",
  cards: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
  plot: "min-h-80",
  header: "mb-6 flex flex-wrap items-start justify-between gap-3",
} as const;
export function ReportPanel({
  title,
  description,
  control,
  children,
}: {
  title: string;
  description?: string;
  control?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="surface min-w-0 p-5 sm:p-6">
      <header className={reportLayout.header}>
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description && (
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {control}
      </header>
      {children}
    </section>
  );
}
export function ReportMetrics({
  items,
}: {
  items: { label: string; value: string; note: string; color?: string }[];
}) {
  return (
    <div className={reportLayout.cards}>
      {items.map((i) => (
        <article key={i.label} className="surface p-5">
          <p className="text-xs text-muted-foreground">{i.label}</p>
          <p
            className="mt-3 text-2xl font-semibold tracking-tight tabular-nums"
            style={i.color ? { color: i.color } : undefined}
          >
            {i.value}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{i.note}</p>
        </article>
      ))}
    </div>
  );
}
