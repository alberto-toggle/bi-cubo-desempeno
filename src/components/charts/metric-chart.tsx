"use client";
import {
  Area,
  Bar,
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
import { useReducedMotion } from "motion/react";
export type MetricPoint = {
  label: string;
  value: number;
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
}: {
  data: MetricPoint[];
  view: MetricChartView;
  formatValue: (v: number) => string;
  valueLabel?: string;
  reference?: number;
}) {
  const reduced = useReducedMotion();
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
                  {formatValue(d.value)}
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
    temporal = ["combo", "line", "area"].includes(view);
  const height = horizontal ? Math.max(300, data.length * 43) : 320;
  const tick = { fill: "var(--muted-foreground)", fontSize: 11 };
  const compact = (v: number) =>
    new Intl.NumberFormat("es-MX", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(v / 100);
  return (
    <div className="min-w-0" style={{ height }}>
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
              stroke="var(--chart-2)"
              strokeDasharray="5 4"
              ifOverflow="extendDomain"
            />
          )}
          {view === "area" ? (
            <Area
              name={valueLabel}
              dataKey="value"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.14}
              isAnimationActive={!reduced}
            />
          ) : view === "line" ? (
            <Line
              name={valueLabel}
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduced}
            />
          ) : (
            <Bar
              name={valueLabel}
              dataKey="value"
              fill="var(--chart-1)"
              radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              maxBarSize={40}
              isAnimationActive={!reduced}
            />
          )}
          {temporal && (
            <>
              <Line
                name="Media móvil · 6 meses"
                dataKey="short"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
                isAnimationActive={!reduced}
              />
              <Line
                name="Media móvil · 24 meses"
                dataKey="long"
                stroke="var(--chart-3)"
                strokeWidth={2}
                strokeDasharray="4 3"
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
  );
}
