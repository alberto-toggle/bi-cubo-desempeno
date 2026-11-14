import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { kpiLayout } from "./layout";
export type KpiCardData = {
  id: string;
  name: string;
  subtitle: string;
  position: number;
  achievement: number | null;
  comparison: string;
  featured?: { label: string; value: string };
  amounts?: { label: string; value: string }[];
  days?: { day: number; value: string }[];
  dailyLabel?: string;
};
export function KpiCard({ data }: { data: KpiCardData }) {
  const attention = data.achievement !== null && data.achievement < 100;
  return (
    <article className={kpiLayout.card}>
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-xs text-muted-foreground">
          {String(data.position).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/establishments/${data.id}`}
            className="inline-flex min-h-11 items-center gap-2 font-semibold leading-snug hover:text-primary"
          >
            {data.name}
            <ArrowUpRight size={16} className="shrink-0" />
          </Link>
          <p className="text-xs text-muted-foreground">{data.subtitle}</p>
        </div>
      </div>
      {data.featured && (
        <p className="mt-4 text-sm text-muted-foreground">
          {data.featured.label}
          <strong className="mt-1 block text-xl text-foreground tabular-nums">
            {data.featured.value}
          </strong>
        </p>
      )}
      <div className="mt-5 flex items-end justify-between gap-3">
        <span
          className={
            attention
              ? "text-sm font-medium text-destructive"
              : "text-sm font-medium text-primary"
          }
        >
          {data.achievement === null
            ? "Sin meta disponible"
            : attention
              ? "Debajo de meta"
              : "En objetivo"}
        </span>
        <strong className="text-2xl tabular-nums">
          {data.achievement === null ? "—" : `${data.achievement.toFixed(1)}%`}
        </strong>
      </div>
      <div
        className="my-3 h-2 overflow-hidden rounded-full bg-muted"
        aria-hidden="true"
      >
        <div
          className={
            "h-full rounded-full " +
            (attention ? "bg-destructive" : "bg-primary")
          }
          style={{
            width: `${Math.max(0, Math.min(100, data.achievement ?? 0))}%`,
          }}
        />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {data.comparison}
      </p>
      {data.amounts && (
        <details className="mt-4 border-t border-border pt-2">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between text-sm font-medium">
            {data.days ? "Ver utilidades por día" : "Ver cifras y referencia"}
            <ChevronDown size={16} />
          </summary>
          <dl className="space-y-2 py-3">
            {data.amounts.map((a) => (
              <div
                key={a.label}
                className="flex flex-wrap justify-between gap-2 text-sm"
              >
                <dt className="text-muted-foreground">{a.label}</dt>
                <dd className="font-medium tabular-nums">{a.value}</dd>
              </div>
            ))}
          </dl>
          {data.days && (
            <>
              <p className="mb-3 text-xs text-muted-foreground">
                {data.dailyLabel} · Distribución diaria simulada.
              </p>
              <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-xl bg-muted p-3">
                {data.days.map((d) => (
                  <div
                    key={d.day}
                    className="flex flex-wrap justify-between gap-1 text-xs"
                  >
                    <span>Día {d.day}</span>
                    <strong className="tabular-nums">{d.value}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </details>
      )}
    </article>
  );
}
