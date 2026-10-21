"use client";
import { AgentLanes, type AgentLane } from "@/components/analysis/agent-lanes";

const lanes: AgentLane[] = [
  { id: "response", name: "Respuesta", steps: [
    {label: "Preparar contexto y permisos del perfil", start: 0, end: .16},
    {label: "Preparar explicación y referencias", start: .8, end: 1},
  ]},
  { id: "data", name: "Datos", steps: [
    {label: "Consultar datos de la selección", start: .18, end: .48},
  ]},
  { id: "indicators", name: "Indicadores", steps: [
    {label: "Comparar periodo anterior y metas", start: .3, end: .76},
  ]},
];
export function AnalysisLanes({ progress }: { progress: number }) {
  return <AgentLanes lanes={lanes} progress={progress} />;
}
