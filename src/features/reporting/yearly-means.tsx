"use client";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { yearColor } from "@/components/charts/year-colors";
import { reportMoney as originalMoney } from "./model";
import { reportLayout } from "./report-layout";

export function YearlyMeans({ items }: { items: { year: number; months: number; mean: number }[] }) {
  const reportMoney = usePrivateFormatter(originalMoney);
  return (
    <section aria-label="Medias mensuales por año">
      <h3 className="mb-3 text-sm font-semibold">Media mensual por ejercicio</h3>
      <div className={reportLayout.cards}>
        {items.map(item => (
          <article key={item.year} className="surface border-t-2 p-4" style={{ borderTopColor: yearColor(item.year) }}>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full" style={{ background: yearColor(item.year) }} aria-hidden="true" />
              {item.year} · {item.months === 12 ? "Ejercicio completo" : `${item.months} meses al corte`}
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums">{reportMoney(item.mean)}</p>
            <p className="mt-2 text-xs text-muted-foreground">Utilidades / {item.months} meses</p>
          </article>
        ))}
      </div>
    </section>
  );
}
