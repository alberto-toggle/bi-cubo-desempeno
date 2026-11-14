import { demoFundProjects } from "@/features/demo/fund-projects";

function split(amount: number, weights: number[]) {
  let allocated = 0;
  return weights.map((weight, i) => {
    const value =
      i === weights.length - 1
        ? amount - allocated
        : Math.floor((amount * weight) / 100);
    allocated += value;
    return value;
  });
}
/** Amounts in cents. Spent and committed are mutually exclusive portions. */
export function demoFundAllocation(
  total: number,
  annualTarget: number,
  month: number,
) {
  const pool = Math.max(0, total);
  const spent = Math.floor(pool * 0.38),
    committed = Math.floor(pool * 0.32);
  const available = pool - spent - committed;
  const spentParts = split(
    spent,
    demoFundProjects.map((p) => p.spentWeight),
  );
  const committedParts = split(
    committed,
    demoFundProjects.map((p) => p.committedWeight),
  );
  const projects = demoFundProjects.map((p, i) => ({
    ...p,
    spent: spentParts[i],
    committed: committedParts[i],
  }));
  const categories = [...new Set(projects.map((p) => p.category))].map(
    (name) => ({
      name,
      spent: projects
        .filter((p) => p.category === name)
        .reduce((s, p) => s + p.spent, 0),
      committed: projects
        .filter((p) => p.category === name)
        .reduce((s, p) => s + p.committed, 0),
    }),
  );
  const remainingMonths = 12 - month;
  const projectedAdditional = Math.round((total / month) * remainingMonths);
  return {
    total,
    spent,
    committed,
    available,
    projects,
    categories,
    annualTarget,
    expected: Math.round((annualTarget * month) / 12),
    remainingMonths,
    projectedAdditional,
    projectedTotal: total + projectedAdditional,
    projectedAvailable: available + projectedAdditional,
  };
}
export type FundAllocation = ReturnType<typeof demoFundAllocation>;
