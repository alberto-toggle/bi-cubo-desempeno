/** Stable year-to-theme mapping; filtering never reassigns an exercise's color. */
export function yearColor(year: number): string {
  const slot = ((year - 2023) % 5 + 5) % 5;
  return `var(--chart-${slot + 1})`;
}
