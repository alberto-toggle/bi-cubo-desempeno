"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FilterSelect } from "@/features/intelligence/filters";
import {
  chartOptions,
  setChartDefault,
  resetChartOverrides,
  validView,
  type ChartFamily,
} from "./chart-preferences";
import { ReportPanel } from "./report-layout";
const families: { id: ChartFamily; title: string; description: string }[] = [
  {
    id: "comparison",
    title: "Comparativos",
    description:
      "Giros, establecimientos, programas y ejercicios. Conservan las categorías y sus importes.",
  },
  {
    id: "timeline",
    title: "Series temporales",
    description:
      "Históricos mensuales con medias móviles. Se conserva el orden cronológico y las ventanas de cálculo.",
  },
  {
    id: "goal",
    title: "Cumplimiento de metas",
    description:
      "Utilidades acumuladas, meta anual y avance programado. Se mantiene la misma escala y definición del indicador.",
  },
];
export function ChartSettingsScreen() {
  const preferences = useAppSelector((s) => s.chartPreferences),
    dispatch = useAppDispatch(),
    [notice, setNotice] = useState("");
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <header>
        <p className="eyebrow">Administración / Visualización</p>
        <h1 className="page-title">Preferencias de gráficas</h1>
        <p className="page-copy">
          Define la presentación inicial de cada familia de indicadores.
        </p>
      </header>
      {families.map((f) => (
        <ReportPanel key={f.id} title={f.title} description={f.description}>
          <FilterSelect
            label={`Predeterminado para ${f.title}`}
            value={preferences.defaults[f.id]}
            onChange={(v) => {
              if (validView(f.id, v)) {
                dispatch(setChartDefault({ family: f.id, view: v }));
                setNotice("Preferencia guardada en este navegador.");
              }
            }}
            options={[...chartOptions[f.id]]}
          />
        </ReportPanel>
      ))}
      <div className="surface space-y-4 p-5">
        <p className="text-sm text-muted-foreground">
          Cada gráfica permite una elección puntual. Los valores predeterminados
          se aplican cuando no existe una elección guardada. Tema, tipografía y
          datos se conservan.
        </p>
        <button
          className="secondary-button"
          onClick={() => {
            dispatch(resetChartOverrides());
            setNotice("Todas las gráficas usarán los valores predeterminados.");
          }}
        >
          Aplicar predeterminados a todas las gráficas
        </button>
        <p className="text-xs text-muted-foreground">
          Configuración local de demostración, compartida por las sesiones de
          este navegador; no modifica preferencias de otros dispositivos.
        </p>
      </div>
      <p role="status" className="text-sm text-primary">
        {notice}
      </p>
    </div>
  );
}
