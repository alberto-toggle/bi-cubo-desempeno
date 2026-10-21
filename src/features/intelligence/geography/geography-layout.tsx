import type { ReactNode } from "react";

/** Pure composition: callers supply either real content or placeholders. */
export function GeographyLayout({
  header,
  map,
  ranking,
}: {
  header: ReactNode;
  map: ReactNode;
  ranking: ReactNode;
}) {
  return (
    <section className="surface overflow-hidden [--geography-map-height:clamp(240px,30vw,380px)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        {header}
      </header>
      <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="min-w-0 p-5 sm:px-8">{map}</div>
        <div className="border-t border-border p-5 lg:border-t-0 lg:border-l">
          {ranking}
        </div>
      </div>
    </section>
  );
}
