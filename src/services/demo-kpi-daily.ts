/** Synthetic daily allocation, in cents. Its sum equals the existing monthly utility. */
export function demoDailyUtility(
  unitId: string,
  year: number,
  month: number,
  total: number,
) {
  const days = new Date(year, month, 0).getDate();
  const seed = [...unitId].reduce((n, c) => n + c.charCodeAt(0), 0);
  const weights = Array.from(
    { length: days },
    (_, i) => 70 + ((seed + i * 17) % 61),
  );
  const sum = weights.reduce((a, b) => a + b, 0);
  let assigned = 0;
  return weights.map((weight, i) => {
    const value =
      i === days - 1 ? total - assigned : Math.round((total * weight) / sum);
    assigned += value;
    return { day: i + 1, value };
  });
}
