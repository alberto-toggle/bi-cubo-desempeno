"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FilterSelect } from "@/features/intelligence/filters";
import {
  chartOptions,
  setChartView,
  validView,
  type ChartFamily,
} from "./chart-preferences";
export function useChartView(key: string, family: ChartFamily) {
  const prefs = useAppSelector((s) => s.chartPreferences),
    dispatch = useAppDispatch();
  const verticalComparison =
    key === "unit-annual" || key === "unit-same-period";
  const horizontalGoal = key === "report-goal";
  const preferred = validView(family, prefs.overrides[key])
    ? prefs.overrides[key]
    : key === "unit-annual" || key === "unit-same-period"
      ? "columns"
      : horizontalGoal
        ? "bars"
        : prefs.defaults[family];
  const view =
    verticalComparison && preferred === "bars"
      ? "columns"
      : horizontalGoal
        ? "bars"
        : preferred;
  return {
    view,
    control: horizontalGoal ? null : (
      <FilterSelect
        label={`Visualización: ${key}`}
        value={view}
        onChange={(v) => {
          if (validView(family, v))
            dispatch(setChartView({ key, family, view: v }));
        }}
        options={chartOptions[family].filter(
          (option) =>
            (!verticalComparison || option.value !== "bars") &&
            (!horizontalGoal || option.value !== "columns"),
        )}
      />
    ),
  };
}
