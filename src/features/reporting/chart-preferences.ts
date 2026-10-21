import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export const chartOptions = {
  comparison: [
    { value: "bars", label: "Barras" },
    { value: "columns", label: "Columnas" },
    { value: "table", label: "Tabla" },
  ],
  timeline: [
    { value: "combo", label: "Columnas y tendencias" },
    { value: "line", label: "Líneas" },
    { value: "area", label: "Área y tendencias" },
    { value: "table", label: "Tabla" },
  ],
  goal: [
    { value: "progress", label: "Progreso" },
    { value: "target", label: "Barra con objetivo" },
    { value: "columns", label: "Columnas" },
  ],
} as const;
export type ChartFamily = keyof typeof chartOptions;
export type ChartView = (typeof chartOptions)[ChartFamily][number]["value"];
export const chartDefaults: Record<ChartFamily, ChartView> = {
  comparison: "bars",
  timeline: "combo",
  goal: "progress",
};
export type ChartPreferences = {
  defaults: Record<ChartFamily, ChartView>;
  overrides: Record<string, ChartView>;
};
export const chartStorageKey = "gtyg.charts.v1";
export function validView(
  family: ChartFamily,
  value: unknown,
): value is ChartView {
  return chartOptions[family].some((o) => o.value === value);
}
export function parseChartPreferences(value: unknown): ChartPreferences {
  const clean: ChartPreferences = {
    defaults: { ...chartDefaults },
    overrides: {},
  };
  if (!value || typeof value !== "object") return clean;
  const candidate = value as Partial<ChartPreferences>;
  for (const family of Object.keys(chartOptions) as ChartFamily[]) {
    const view = candidate.defaults?.[family];
    if (validView(family, view)) clean.defaults[family] = view;
  }
  if (candidate.overrides && typeof candidate.overrides === "object")
    for (const [key, v] of Object.entries(candidate.overrides))
      if (
        key.length < 100 &&
        Object.values(chartOptions).some((options) =>
          options.some((o) => o.value === v),
        )
      )
        clean.overrides[key] = v;
  return clean;
}
const slice = createSlice({
  name: "chartPreferences",
  initialState: parseChartPreferences(null),
  reducers: {
    restoreCharts: (_, a: PayloadAction<unknown>) =>
      parseChartPreferences(a.payload),
    setChartView: (
      s,
      a: PayloadAction<{ key: string; family: ChartFamily; view: ChartView }>,
    ) => {
      if (validView(a.payload.family, a.payload.view))
        s.overrides[a.payload.key] = a.payload.view;
    },
    setChartDefault: (
      s,
      a: PayloadAction<{ family: ChartFamily; view: ChartView }>,
    ) => {
      if (validView(a.payload.family, a.payload.view))
        s.defaults[a.payload.family] = a.payload.view;
    },
    resetChartOverrides: (s) => {
      s.overrides = {};
    },
  },
});
export const {
  restoreCharts,
  setChartView,
  setChartDefault,
  resetChartOverrides,
} = slice.actions;
export default slice.reducer;
