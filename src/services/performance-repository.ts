import { parsePerformance } from "@/features/performance/model";
export async function loadPerformanceData(signal?: AbortSignal) {
  const response = await fetch("/demo/performance.json", { signal });
  if (!response.ok) throw new Error("No pudimos cargar los indicadores.");
  return parsePerformance(await response.json());
}
