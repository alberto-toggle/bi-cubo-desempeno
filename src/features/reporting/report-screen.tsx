"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { usePortfolio } from "@/features/intelligence/use-portfolio";
import { useReport } from "./use-report";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
import { monthNames, reportMoney } from "./model";
import { reportingRows, groupResults } from "./queries";
import { initialReportPeriod, ReportPeriodControl } from "./period-control";
import { reportLayout } from "./report-layout";
import { ReportChart } from "./report-chart";
import { GoalPanel } from "./goal-panel";
import { ReportScreenSkeleton } from "./report-skeleton";
import {
  reportChapters,
  chapterTitles,
  documentColors,
  unitDocumentColors,
  programColor,
  unitDocumentOrder,
  programDocumentColors,
  programDocumentOrder,
} from "./report-palette";
import { ChapterDetails } from "./chapter-details";
export function ReportScreen() {
  const money = usePrivateFormatter(reportMoney);
  const portfolio = usePortfolio(),
    report = useReport();
  const [period, setPeriod] = useState(initialReportPeriod),
    [chapter, setChapter] = useState("all");
  if (portfolio.error || report.error)
    return (
      <div className="surface p-6" role="alert">
        {portfolio.error || report.error}
        <button
          className="secondary-button mt-4"
          onClick={() => {
            void portfolio.reload();
            void report.reload();
          }}
        >
          Reintentar
        </button>
      </div>
    );
  if (!portfolio.data || !report.data) return <ReportScreenSkeleton />;
  const all = reportingRows(
    report.data,
    portfolio.data.units,
    period,
    portfolio.mode,
  );
  const chapters = [
    { id: "all", label: "Utilidades por giro" },
    ...reportChapters
      .filter((c) => all.some((r) => r.line === c.line))
      .map((c) => ({ id: c.line, label: c.line })),
    { id: "goals", label: "Cumplimiento de metas" },
  ];
  const index = Math.max(
    0,
    chapters.findIndex((c) => c.id === chapter),
  );
  const rows = all.filter(
    (r) => chapter === "all" || chapter === "goals" || r.line === chapter,
  );
  const order = unitDocumentOrder[chapter] ?? [];
  const rank = (id: string) =>
    order.includes(id) ? order.indexOf(id) : order.length;
  rows.sort((a, b) => rank(a.id) - rank(b.id));
  const actual = rows.reduce((s, r) => s + r.value, 0),
    target = rows.reduce((s, r) => s + r.target, 0);
  const grouped = groupResults(
    all.map((r) => ({ label: r.line, value: r.value })),
  );
  const categories = reportChapters.flatMap((c) => {
    const row = grouped.find((r) => r.label === c.line);
    return row ? [{ ...row, color: c.color }] : [];
  });
  const programs = groupResults(rows.flatMap((r) => r.programs));
  const programOrder = programDocumentOrder[chapter] ?? [];
  programs.sort((a, b) => {
    const rank = (label: string) =>
      programOrder.includes(label)
        ? programOrder.indexOf(label)
        : programOrder.length;
    return rank(a.label) - rank(b.label);
  });
  const isProductive = chapter === "Granjas" || chapter === "Criadero";
  const programData = programs.map((r, i) => ({
    ...r,
    color:
      chapter === "Criadero" && r.label === "Bovinos"
        ? programDocumentColors.BOVINOS_CRIADERO
        : programColor(r.label, i),
  }));
  const isOverview = chapter === "all",
    isGoals = chapter === "goals";
  return (
    <div className={reportLayout.page}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Reporte de gestión</p>
          <h1 className="page-title">Resultados por giro comercial</h1>
          <p className="page-copy">
            Enero–{monthNames[period.month - 1]} {period.year} · Cifras
            simuladas · MXN
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ReportPeriodControl value={period} onChange={setPeriod} />
          <button
            className="secondary-button"
            aria-label="Actualizar reporte"
            onClick={() => {
              void portfolio.reload();
              void report.reload();
            }}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>
      <div className={reportLayout.story}>
        <nav
          aria-label="Índice de resultados"
          className="surface max-h-[70vh] overflow-auto p-2 xl:sticky xl:top-5"
        >
          <ol className="flex gap-1 xl:block">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <button
                  onClick={() => setChapter(c.id)}
                  aria-current={chapter === c.id ? "step" : undefined}
                  className={`flex w-full shrink-0 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-3 text-left text-sm xl:whitespace-normal ${chapter === c.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  <span className="text-[10px] tabular-nums opacity-70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="min-w-0 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {index + 1} / {chapters.length} · {chapters[index].label}
            </p>
            <div className="flex gap-2">
              <button
                className="secondary-button"
                disabled={index === 0}
                onClick={() => setChapter(chapters[index - 1].id)}
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Anterior</span>
              </button>
              <button
                className="secondary-button"
                disabled={index === chapters.length - 1}
                onClick={() => setChapter(chapters[index + 1].id)}
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          {isGoals ? (
            <GoalPanel
              id="report-goal"
              actual={actual}
              target={target}
              month={period.month}
              year={period.year}
            />
          ) : (
            <>
              <ReportChart
                id={isOverview ? "report-giro" : `report-units-${chapter}`}
                title={
                  isOverview
                    ? "Utilidades por giro comercial"
                    : (chapterTitles[chapter] ?? `Utilidades · ${chapter}`)
                }
                description={`Utilidades acumuladas: ${money(actual)} · Enero–${monthNames[period.month - 1]} ${period.year}`}
                data={
                  isOverview
                    ? categories
                    : isProductive
                      ? programData
                      : rows.map((r, i) => ({
                          label: r.label,
                          value: r.value,
                          color:
                            unitDocumentColors[r.id] ??
                            documentColors[i % documentColors.length],
                        }))
                }
              />
              {!isOverview && (
                <>
                  {!isProductive && programs.length > 0 && (
                    <ReportChart
                      id="report-programs"
                      title="Utilidades generadas por programa"
                      description="Distribución simulada del resultado; no se suma nuevamente al total."
                      data={programs.map((r, i) => ({
                        ...r,
                        color:
                          chapter === "Criadero" && r.label === "Bovinos"
                            ? programDocumentColors["BOVINOS_CRIADERO"]
                            : programColor(r.label, i),
                      }))}
                    />
                  )}
                  <ChapterDetails
                    line={chapter}
                    year={period.year}
                    month={period.month}
                    rows={rows.map((r, i) => ({
                      ...r,
                      color:
                        unitDocumentColors[r.id] ??
                        documentColors[i % documentColors.length],
                    }))}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
