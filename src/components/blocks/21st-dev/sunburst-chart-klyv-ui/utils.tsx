"use client";

import { useEffect, useState, type ReactNode } from "react";
export { ChevronRight as ChevronRightIcon } from "lucide-react";

// Local equivalents for auxiliary files omitted by the provider registry.
export const SERIES_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
export const formatTick = (value: number) =>
  new Intl.NumberFormat("en", { notation: "compact" }).format(value);
export const DRAW_IN_CLASS =
  "duration-500 ease-out motion-reduce:transition-none";

export function useDrawIn() {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return drawn;
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <div className="sr-only">{children}</div>;
}

export function PlotAnnouncer({ message }: { message: string }) {
  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}

export function PlotTip({
  x,
  y,
  width,
  height,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <div
      className="pointer-events-none absolute z-10 w-max max-w-full"
      style={{
        left: `${(x / width) * 100}%`,
        top: `${(y / height) * 100}%`,
        transform: `translate(${x > width / 2 ? "-100%" : "0"}, ${y > height / 2 ? "-100%" : "0"})`,
      }}
    >
      {children}
    </div>
  );
}

export function ChartTooltip({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; color?: string }[];
}) {
  return (
    <div className="max-w-64 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg">
      <p className="mb-2 font-semibold">{title}</p>
      <dl className="space-y-1">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4"
          >
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              {row.color && (
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: row.color }}
                />
              )}
              {row.label}
            </dt>
            <dd className="font-medium tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
