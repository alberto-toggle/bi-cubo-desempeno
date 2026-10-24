import type { ReportProfile } from "./model";
/** Desglose sintético conciliado con los importes del histórico, en centavos. */
export function financialRows(
  profile: ReportProfile,
  year: number,
  month: number,
) {
  return profile.months
    .filter(
      (m) =>
        m.period.startsWith(`${year}-`) && Number(m.period.slice(5)) <= month,
    )
    .map((m) => {
      const authorized = Math.round(m.expenses * 0.22);
      const adjustments = Math.round(m.expenses * 0.08);
      const other = Math.round(
        m.expenses * (Number(m.period.slice(5)) % 2 ? 0.03 : -0.02),
      );
      const general = m.expenses - authorized - adjustments + other;
      const rent = profile.premises
        ? Math.round((m.revenue * profile.premises.revenueShare) / 100)
        : 0;
      return {
        ...m,
        revenue: m.revenue - rent,
        general,
        authorized,
        adjustments,
        other: other + rent,
        gross: m.revenue - rent - m.cost,
        utility: m.revenue - m.cost - m.expenses,
      };
    });
}
