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
  const view = validView(family, prefs.overrides[key])
    ? prefs.overrides[key]
    : prefs.defaults[family];
  return {
    view,
    control: (
      <FilterSelect
        label={`Visualización: ${key}`}
        value={view}
        onChange={(v) => {
          if (validView(family, v))
            dispatch(setChartView({ key, family, view: v }));
        }}
        options={[...chartOptions[family]]}
      />
    ),
  };
}
