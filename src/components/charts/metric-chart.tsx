"use client";
import {
  Area,
  Bar,
  Cell,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useId } from "react";
import { yearColor } from "./year-colors";
import { useReducedMotion } from "motion/react";
export type MetricPoint = {
  label: string;
  year?: number;
  value: number | null;
  color?: string;
  short?: number | null;
  long?: number | null;
};
export type MetricChartView =
  "bars" | "columns" | "combo" | "line" | "area" | "table";
export function MetricChart({
  data,
  view,
  formatValue,
  valueLabel = "Resultado",
  reference,
  palette,
  yearMeans,
  baseColor = "var(--chart-1)",
  numericDivisor = 100,
  curve = "linear",
  showPoints = false,
}: {
  data: MetricPoint[];
  view: MetricChartView;
  formatValue: (v: number) => string;
  valueLabel?: string;
  reference?: number;
  palette?: { year: (year: number) => string; short: string; long: string };
  baseColor?: string;
  numericDivisor?: number;
  curve?: "linear" | "monotone";
  showPoints?: boolean;
  yearMeans?: { year: number; mean: number }[];
}) {
  const colorForYear = palette?.year ?? yearColor;
  const reduced = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const years = [
    ...new Set(
      data.flatMap((point) => (point.year === undefined ? [] : [point.year])),
    ),
  ].sort((a, b) => a - b);
  const byYear =
    years.length > 0 && data.every((point) => point.year !== undefined);
  const seriesColor = byYear ? `url(#${gradientId})` : baseColor;
  if (!data.length)
    return (
      <p className="flex h-80 items-center justify-center text-sm text-muted-foreground">
        Sin registros para esta selección.
      </p>
    );
  if (view === "table")
    return (
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th className="p-3">Periodo / categoría</th>
              <th className="p-3 text-right">{valueLabel}</th>
              {data.some((d) => d.short !== undefined) && (
                <>
                  <th className="p-3 text-right">Media 6 meses</th>
                  <th className="p-3 text-right">Media 24 meses</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-t border-border">
                <td className="p-3">{d.label}</td>
                <td className="p-3 text-right tabular-nums">
                  {d.value === null ? "—" : formatValue(d.value)}
                </td>
                {d.short !== undefined && (
                  <>
                    <td className="p-3 text-right">
                      {d.short === null ? "—" : formatValue(d.short)}
                    </td>
                    <td className="p-3 text-right">
                      {d.long == null ? "—" : formatValue(d.long)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  const horizontal = view === "bars",
    temporal =
      ["combo", "line", "area"].includes(view) &&
      data.some(
        (point) => point.short !== undefined || point.long !== undefined,
      );
  const height = horizontal ? Math.max(300, data.length * 43) : 320;
  const tick = { fill: "var(--muted-foreground)", fontSize: 11 };
  const compact = (v: number) =>
    new Intl.NumberFormat("es-MX", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(v / numericDivisor);
  return (
    <div className="min-w-0">
      {yearMeans && (
        <div
          className="mb-3 grid gap-2 pl-[62px] pr-5"
          style={{
            gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))`,
          }}
        >
          {years.map((year) => (
            <div
              key={year}
              className="rounded-lg border px-2 py-2 text-center text-xs"
              style={{
                borderColor: colorForYear(year),
                backgroundColor: colorForYear(year),
                color: "#fff",
              }}
            >
              <span className="block font-semibold">{year}</span>Media{" "}
              {yearMeans.find((m) => m.year === year)
                ? formatValue(yearMeans.find((m) => m.year === year)!.mean)
                : "—"}
            </div>
          ))}
        </div>
      )}
      {byYear && !yearMeans && (
        <ul
          aria-label="Colores por año"
          className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"
        >
          {years.map((year) => (
            <li key={year} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-sm"
                style={{ background: colorForYear(year) }}
              />
              {year}
            </li>
          ))}
        </ul>
      )}
      <div style={{ height }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 600, height }}
        >
          <ComposedChart
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ left: 0, right: 20, top: 12, bottom: 10 }}
            accessibilityLayer
          >
            {byYear && (
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  {data.flatMap((point, i) => {
                    const start =
                      data.length === 1
                        ? 0
                        : Math.max(0, (i - 0.5) / (data.length - 1)) * 100;
                    const end =
                      data.length === 1
                        ? 100
                        : Math.min(1, (i + 0.5) / (data.length - 1)) * 100;
                    return [
                      <stop
                        key={`${i}-start`}
                        offset={`${start}%`}
                        stopColor={colorForYear(point.year!)}
                      />,
                      <stop
                        key={`${i}-end`}
                        offset={`${end}%`}
                        stopColor={colorForYear(point.year!)}
                      />,
                    ];
                  })}
                </linearGradient>
              </defs>
            )}
            <CartesianGrid
              stroke="var(--border)"
              horizontal={!horizontal}
              vertical={horizontal}
            />
            {horizontal ? (
              <>
                <XAxis type="number" tickFormatter={compact} tick={tick} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={145}
                  tickFormatter={(label: string) =>
                    label.length > 22 ? `${label.slice(0, 21)}…` : label
                  }
                  tick={tick}
                  interval={0}
                />
              </>
            ) : (
              <>
                <XAxis dataKey="label" tick={tick} minTickGap={22} />
                <YAxis tickFormatter={compact} tick={tick} width={62} />
              </>
            )}
            <Tooltip
              formatter={(v) => formatValue(Number(v))}
              contentStyle={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
                borderRadius: 12,
              }}
            />
            <ReferenceLine
              {...(horizontal ? { x: 0 } : { y: 0 })}
              stroke="var(--border)"
            />
            {reference !== undefined && (
              <ReferenceLine
                {...(horizontal ? { x: reference } : { y: reference })}
                stroke={palette?.long ?? "var(--chart-2)"}
                strokeDasharray="5 4"
                ifOverflow="extendDomain"
              />
            )}
            {view === "area" ? (
              <Area
                type={curve}
                strokeWidth={2}
                dot={
                  showPoints
                    ? { r: 4, fill: "var(--card)", strokeWidth: 1.5 }
                    : false
                }
                name={valueLabel}
                dataKey="value"
                stroke={seriesColor}
                fill={seriesColor}
                fillOpacity={0.14}
                isAnimationActive={!reduced}
              />
            ) : view === "line" ? (
              <Line
                type={curve}
                name={valueLabel}
                dataKey="value"
                stroke={seriesColor}
                strokeWidth={2}
                dot={
                  showPoints
                    ? { r: 4, fill: "var(--card)", strokeWidth: 1.5 }
                    : false
                }
                isAnimationActive={!reduced}
              />
            ) : (
              <Bar
                name={valueLabel}
                dataKey="value"
                fill={seriesColor}
                radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                maxBarSize={40}
                isAnimationActive={!reduced}
              >
                {data.map((point) => (
                  <Cell
                    key={point.label}
                    fill={
                      point.color ??
                      (point.year === undefined
                        ? baseColor
                        : colorForYear(point.year))
                    }
                  />
                ))}
              </Bar>
            )}
            {temporal && (
              <>
                <Line
                  name="Media móvil · 6 meses"
                  dataKey="short"
                  stroke={palette?.short ?? "var(--foreground)"}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={!reduced}
                />
                <Line
                  name="Media móvil · 24 meses"
                  dataKey="long"
                  stroke={palette?.long ?? "var(--muted-foreground)"}
                  strokeWidth={3}
                  strokeDasharray="8 5"
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={!reduced}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
