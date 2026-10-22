export type PerformancePeriod = {
  year: number;
  month: number;
  achievement: number;
  change: number;
  availability: number;
  service: number;
  status: string;
};
export type PerformanceUnit = {
  id: string;
  name: string;
  segment: string;
  line: string;
  periods: PerformancePeriod[];
};
export type PerformanceData = { units: PerformanceUnit[] };
export function parsePerformance(raw: unknown): PerformanceData {
  const data = raw as PerformanceData;
  if (
    !data ||
    !Array.isArray(data.units) ||
    !data.units.every(
      (u) =>
        u &&
        [u.id, u.name, u.segment, u.line].every((v) => typeof v === "string") &&
        Array.isArray(u.periods) &&
        u.periods.every(
          (p) =>
            p && p.month >= 1 && p.month <= 12 &&
            [
              p.year,
              p.month,
              p.achievement,
              p.change,
              p.availability,
              p.service,
            ].every(Number.isFinite) && typeof p.status === "string",
        ),
    )
  )
    throw new Error("No se pudieron interpretar los indicadores.");
  // Explicit projection: never pass unrecognized fields to presentation.
  return {
    units: data.units.map(({ id, name, segment, line, periods }) => ({
      id,
      name,
      segment,
      line,
      periods: periods.map(
        ({
          year,
          month,
          achievement,
          change,
          availability,
          service,
          status,
        }) => ({
          year,
          month,
          achievement,
          change,
          availability,
          service,
          status,
        }),
      ),
    })),
  };
}
export function performanceStatus(achievement: number, month: number) {
  const ratio = achievement / ((month / 12) * 100);
  return ratio >= 1
    ? "En objetivo"
    : ratio >= 0.9
      ? "En seguimiento"
      : "Requiere atención";
}
