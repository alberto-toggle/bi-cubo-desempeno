/** Métricas operativas ficticias, estables por unidad y periodo; no proceden del cliente. */
export function demoUnitOperations(
  unitId: string,
  kind: string,
  year: number,
  month: number,
) {
  const seed = Number(unitId.replace(/\D/g, "")) || 1;
  const capacity = 40 + (seed % 12) * 12;
  const occupancy = 55 + ((seed + month) % 35);
  const days = (m: number) =>
    Array.from({ length: new Date(year, m, 0).getDate() }, (_, i) => ({
      label: `${String(i + 1).padStart(2, "0")}/${String(m).padStart(2, "0")}`,
      value:
        new Date(year, m - 1, i + 1).getDay() === 0
          ? 0
          : 30 + ((seed * 7 + i * 13 + m * 11) % 180),
    }));
  const daily = days(month);
  const monthly = Array.from({ length: 12 }, (_, i) => ({
    label: `${String(i + 1).padStart(2, "0")}/${year}`,
    value: i < month ? days(i + 1).reduce((s, d) => s + d.value, 0) : null,
  }));
  const active = 90 + seed * 3 + month * 2,
    delinquent = 8 + (seed % 15),
    inactive = 30 + (seed % 50);
  return {
    capacity,
    occupancy,
    hours: "08:00–20:00",
    premises: 4 + (seed % 8),
    vacant: seed % 3,
    rate: 120 + (seed % 9) * 15,
    daily,
    monthly,
    active,
    delinquent,
    inactive,
    inactiveHT: inactive - 7,
    inactiveNA: 7,
    accesses: daily.reduce((s, d) => s + d.value, 0),
    joins: 8 + month,
    manualLeaves: 2 + (seed % 4),
    automaticLeaves: seed % 2,
    reactivations: 5 + (month % 4),
    kind,
  };
}
