import type { CubeSnapshot } from "@/features/cube/model";
import {
  reportMoney,
  formatPercent,
  growth,
  percent,
} from "@/features/reporting/model";
export type AnalysisIntent = "summary" | "compare" | "goals" | "report";
export const analysisActions: { id: AnalysisIntent; label: string }[] = [
  { id: "summary", label: "Resumir resultados" },
  { id: "compare", label: "Comparar periodos" },
  { id: "goals", label: "Revisar metas" },
  { id: "report", label: "Preparar reporte" },
];
export type AnalysisResult = {
  title: string;
  paragraphs: string[];
  references: { id: string; label: string }[];
  report: boolean;
};
export function inferIntent(query: string): AnalysisIntent | null {
  const q = query
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/reporte|informe|borrador/.test(q)) return "report";
  if (/meta|rezag|objetivo/.test(q)) return "goals";
  if (/compar|anterior|variaci|aumento|caida/.test(q)) return "compare";
  if (/resum|resultado|ingreso|costo|gasto|utilidad|ganancia|analiza/.test(q)) return "summary";
  return null;
}
function compose(s: CubeSnapshot, intent: AnalysisIntent): AnalysisResult {
  const summary = `${s.metric}: ${reportMoney(s.value)} en ${s.count} establecimientos. Las utilidades son ${reportMoney(s.result)}: ingresos (${reportMoney(s.revenue)}) menos costos (${reportMoney(s.cost)}) y gastos (${reportMoney(s.expenses)}). ${s.metricNote ?? ""}`;
  const change = `Respecto al mismo corte del año anterior, ${s.metric.toLowerCase()} pasa de ${reportMoney(s.previous)} a ${reportMoney(s.value)}. Variación: ${formatPercent(growth(s.value, s.previous))}. ${s.metric !== "Ingresos" ? "Una variación del importe seleccionado, por sí sola, no demuestra una mejora de desempeño." : "La comparación no identifica las causas de la variación."}`;
  const advance = `Las utilidades cubren ${formatPercent(percent(s.result, s.target))} de la meta anual de ${reportMoney(s.target)}. La referencia lineal al corte es ${formatPercent((s.month / 12) * 100)}; es una programación ilustrativa, sin ajuste por estacionalidad.`;
  const behind = s.rows
    .filter((r) => r.target > 0 && r.result / r.target < s.month / 12)
    .sort((a, b) => a.result / a.target - b.result / b.target);
  const goalDetail = behind.length
    ? `${behind.length} establecimientos están por debajo de esa referencia. Revisar primero: ${behind
        .slice(0, 3)
        .map(
          (r) => `${r.label} (${formatPercent(percent(r.result, r.target))})`,
        )
        .join("; ")}.`
    : "Ningún establecimiento con meta está por debajo de la referencia lineal al corte.";
  const leader = s.rows[0];
  const concentration = leader
    ? `Mayor importe de ${s.metric.toLowerCase()}: ${leader.label}, ${reportMoney(leader.value)} (${formatPercent(percent(leader.value, s.value))} del total seleccionado). Esto describe importe, no rentabilidad ni calidad del servicio.`
    : "No hay establecimientos en esta selección.";
  return {
    title:
      intent === "report"
        ? "Borrador de reporte ejecutivo"
        : analysisActions.find((a) => a.id === intent)!.label,
    paragraphs:
      intent === "compare"
        ? [change, ...(s.metricNote ? [s.metricNote] : []), concentration]
        : intent === "goals"
          ? [advance, goalDetail]
          : intent === "report"
            ? [
                `${s.context} · ${s.period}`,
                summary,
                change,
                advance,
                goalDetail,
                "Siguiente revisión sugerida: contrastar variaciones con registros operativos y validar metas antes de tomar decisiones.",
              ]
            : [summary, concentration, advance],
    references: (intent === "goals" || intent === "report" ? behind : s.rows)
      .slice(0, 3)
      .map((r) => ({ id: r.id, label: r.label })),
    report: intent === "report",
  };
}
/** Local deterministic simulation. Receives only already-projected identities, never raw units. */
export async function requestCubeAnalysis(
  snapshot: CubeSnapshot,
  intent: AnalysisIntent,
  signal: AbortSignal,
  onProgress?: (progress: number) => void,
): Promise<AnalysisResult> {
  await new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Cancelado", "AbortError"));
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
      reject(new DOMException("Cancelado", "AbortError"));
    };
    const started = performance.now();
    const duration = 6200;
    const progressTimer = setInterval(() => {
      onProgress?.(Math.min(.98, (performance.now() - started) / duration));
    }, 80);
    const timer = setTimeout(() => {
      clearInterval(progressTimer);
      onProgress?.(1);
      signal.removeEventListener("abort", abort);
      resolve();
    }, duration);
    signal.addEventListener("abort", abort, { once: true });
  });
  return compose(snapshot, intent);
}
export function analysisText(result: AnalysisResult, snapshot: CubeSnapshot) {
  return [
    result.title,
    snapshot.context,
    snapshot.period,
    "DEMO · Análisis simulado. Cifras ilustrativas, no validación contable.",
    ...result.paragraphs,
    "Fuente: reporte de gestión simulado de Panorama. Importes en MXN. Utilidades calculadas como ingresos menos costos y gastos, sin impuestos ni otros ajustes contables.",
  ].join("\n\n");
}
