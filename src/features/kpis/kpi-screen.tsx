"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePortfolio } from "@/features/intelligence/use-portfolio";
import { useReport } from "@/features/reporting/use-report";
import { loadPerformance } from "@/features/performance/performance-slice";
import { financialKpis, indicatorKpis } from "./model";
import { KpiSkeleton } from "./kpi-skeleton";
import { KpiDashboard } from "./kpi-dashboard";
export function KpiScreen() {
  const role = useAppSelector((s) => s.auth.session?.role);
  return role === "admin" ? (
    <FinancialKpis />
  ) : role === "staff" ? (
    <StaffKpis />
  ) : (
    <KpiSkeleton />
  );
}
function FinancialKpis() {
  const portfolio = usePortfolio(),
    report = useReport();
  if (portfolio.error || report.error)
    return (
      <LoadError
        message={portfolio.error || report.error}
        retry={() => {
          portfolio.reload();
          report.reload();
        }}
      />
    );
  if (!portfolio.data || !report.data) return <KpiSkeleton />;
  const units = portfolio.data.units;
  const reportData = report.data;
  return (
    <KpiDashboard
      rowsFor={(p) => financialKpis(units, reportData, p)}
      financial
    />
  );
}
function StaffKpis() {
  const dispatch = useAppDispatch(),
    { data, error } = useAppSelector((s) => s.performance);
  useEffect(() => {
    const request = dispatch(loadPerformance());
    return () => request.abort();
  }, [dispatch]);
  if (error)
    return (
      <LoadError
        message={error}
        retry={() => void dispatch(loadPerformance())}
      />
    );
  if (!data) return <KpiSkeleton />;
  return (
    <KpiDashboard rowsFor={(p) => indicatorKpis(data, p)} financial={false} />
  );
}
function LoadError({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div role="alert" className="surface space-y-4 p-6">
      <p>{message}</p>
      <button className="secondary-button min-h-11" onClick={retry}>
        Reintentar carga
      </button>
    </div>
  );
}
