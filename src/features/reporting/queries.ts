import type { BusinessUnit } from "@/features/intelligence/model";
import {
  presentIdentity,
  type IdentityMode,
} from "@/features/demo/identity-policy";
import {
  commercialLine,
  total,
  programResults,
  type ManagementReport,
} from "./model";
import type { ReportPeriod } from "./period-control";
export function reportingRows(
  report: ManagementReport,
  units: BusinessUnit[],
  period: ReportPeriod,
  mode: IdentityMode,
) {
  const byId = new Map(report.profiles.map((p) => [p.unitId, p]));
  return units.flatMap((unit) => {
    const p = byId.get(unit.id);
    return p
      ? [
          {
            id: unit.id,
            label: presentIdentity(unit, mode).name,
            line: commercialLine(unit),
            value: total(p, period.year, period.month),
            target: p.targets[period.year] ?? 0,
            programs: programResults(p, total(p, period.year, period.month)),
          },
        ]
      : [];
  });
}
export function groupResults(rows: { label: string; value: number }[]) {
  const grouped = new Map<string, number>();
  for (const r of rows)
    grouped.set(r.label, (grouped.get(r.label) ?? 0) + r.value);
  return [...grouped]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}
