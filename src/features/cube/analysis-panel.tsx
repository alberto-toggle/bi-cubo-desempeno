"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Plus,
  Check,
  Download,
  Sparkles,
  X,
  FileText,
  Square,
  ArrowUpRight,
} from "lucide-react";
import { AnalysisLanes } from "./analysis-lanes";
import { OrbComposer } from "@/components/analysis/orb-composer";
import { StatusIsland } from "@/components/analysis/status-island";
import { StreamedResponse } from "@/components/analysis/streamed-response";
import {
  analysisActions,
  analysisText,
  inferIntent,
  type AnalysisIntent,
} from "@/services/demo-cube-analysis";
import { AnalysisPrompts } from "./analysis-prompts";
import { useAnalysis } from "./use-analysis";
import type { CubeSnapshot } from "./model";
export function AnalysisPanel({ snapshot }: { snapshot: CubeSnapshot }) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [hint, setHint] = useState("");
  const analysis = useAnalysis(snapshot);
  const focusNewQuery = useRef(false);
  const inputRef = useCallback((input: HTMLInputElement | null) => {
    if (input && focusNewQuery.current) {
      input.focus({ preventScroll: true });
      focusNewQuery.current = false;
    }
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const followResponse = useRef(true);
  useEffect(() => {
    const element = scrollRef.current;
    if (element && followResponse.current && analysis.answer)
      element.scrollTop = element.scrollHeight;
  }, [analysis.visibleWords, analysis.complete, analysis.answer]);
  const reduced = useReducedMotion();
  const run = (intent: AnalysisIntent, text: string) => {
    setHint("");
    followResponse.current = true;
    void analysis.run(intent, text);
  };
  const reset = () => {
    focusNewQuery.current = true;
    analysis.reset();
    setQuery("");
    setHint("");
    followResponse.current = true;
    scrollRef.current?.scrollTo({ top: 0 });
  };
  const send = () => {
    const intent = inferIntent(query);
    if (!intent) {
      setHint(
        "La demo admite resúmenes, comparativos, metas y reportes. Elige una consulta sugerida.",
      );
      return;
    }
    run(intent, query);
    setQuery("");
  };
  const download = () => {
    if (!analysis.answer || !analysis.complete) return;
    const url = URL.createObjectURL(
      new Blob([analysisText(analysis.answer, snapshot)], {
        type: "text/plain;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "borrador-reporte-demo.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger
          className="primary-button flex items-center gap-2"
          disabled={!snapshot.count}
        >
          <Sparkles size={16} />
          Analizar esta vista
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-overlay" />
          <Dialog.Popup className="fixed inset-y-2 right-2 z-50 flex w-[calc(100%_-_1rem)] max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-xl sm:inset-y-4 sm:right-4 sm:w-[calc(100%_-_2rem)] sm:rounded-3xl">
            <header className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
              <div className="flex min-w-0 items-center gap-3">
                <div>
                  <Dialog.Title className="text-lg font-semibold">
                    Asistente de análisis
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-xs leading-5 text-muted-foreground">
                    {snapshot.context} · {snapshot.period} · {snapshot.metric}
                  </Dialog.Description>
                  {analysis.question && (
                    <button type="button" onClick={reset}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
                      <Plus size={14} /> Nueva consulta
                    </button>
                  )}
                </div>
              </div>
              <Dialog.Close
                aria-label="Cerrar análisis"
                className="rounded-lg p-2 hover:bg-muted"
              >
                <X size={18} />
              </Dialog.Close>
            </header>
            <div
              ref={scrollRef}
              onScroll={(event) => {
                const el = event.currentTarget;
                followResponse.current =
                  el.scrollHeight - el.clientHeight - el.scrollTop < 80;
              }}
              className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6"
            >
              <p className="text-[11px] leading-5 text-muted-foreground">
                DEMO · Análisis simulado con los filtros actuales. No está
                conectado a IA ni modifica los datos.
              </p>
              {!analysis.question && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5 py-5"
                >
                  <h2 className="text-xl font-semibold tracking-tight">
                    ¿Qué quieres explorar?
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Revisa el desempeño de esta selección o prepara un reporte
                    con sus cifras.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {analysisActions.map((a) => (
                      <button
                        key={a.id}
                        className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-background/50 p-4 text-left text-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
                        onClick={() => run(a.id, a.label)}
                      >
                        {a.label}
                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-muted-foreground group-hover:text-primary"
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {analysis.question && (
                <motion.div
                  key={`question-${analysis.requestId}`}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-8 rounded-2xl rounded-tr-sm border border-border bg-muted/50 px-4 py-3 text-sm"
                >
                  {analysis.question}
                </motion.div>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {analysis.busy ? (
                  <motion.div
                    key={`loading-${analysis.requestId}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.15 }}
                  >
                    <AnalysisLanes progress={analysis.progress} />
                  </motion.div>
                ) : analysis.answer ? (
                  <motion.article
                    key={`answer-${analysis.requestId}`}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check size={14} className="text-primary" /> Análisis completado
                    </div>
                    <h2 className="flex items-center gap-2 font-semibold">
                      <FileText size={17} className="text-primary" />
                      {analysis.answer.title}
                    </h2>
                    <StreamedResponse
                      paragraphs={analysis.answer.paragraphs}
                      visibleWords={analysis.visibleWords}
                      streaming={analysis.streaming}
                    />
                    {analysis.complete && (
                      <motion.div
                        initial={reduced ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="border-t border-border pt-4">
                          <h3 className="mb-3 text-xs font-semibold">
                            Consultar establecimientos citados
                          </h3>
                          {analysis.answer.references.map((r) => (
                            <Link
                              key={r.id}
                              href={`/establishments/${r.id}#reporte-gestion`}
                              className="mb-2 block text-xs text-primary underline"
                            >
                              {r.label} ↗
                            </Link>
                          ))}
                        </div>
                        <p className="text-xs leading-5 text-muted-foreground">
                          Fuente: reporte de gestión simulado · MXN.
                          Las
                          diferencias no demuestran causalidad.
                        </p>
                        {analysis.answer.report && (
                          <button
                            className="secondary-button flex items-center gap-2"
                            onClick={download}
                          >
                            <Download size={15} />
                            Descargar borrador (.txt)
                          </button>
                        )}
                      </motion.div>
                    )}
                  </motion.article>
                ) : null}
              </AnimatePresence>
              {analysis.error && (
                <p role="alert" className="text-sm text-destructive">
                  {analysis.error}
                </p>
              )}
              {analysis.stopped && !analysis.complete && (
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>Respuesta detenida.</p>
                  {analysis.answer && (
                    <button className="underline" onClick={analysis.finish}>
                      Mostrar respuesta completa
                    </button>
                  )}
                </div>
              )}
              <span className="sr-only" role="status">
                {analysis.busy
                  ? "Preparando análisis"
                  : analysis.streaming
                    ? "Escribiendo respuesta"
                    : analysis.complete
                      ? "Respuesta completa"
                      : analysis.stopped
                        ? "Respuesta detenida"
                        : ""}
              </span>
            </div>
            <div className="space-y-3 border-t border-border bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <AnalysisPrompts
                  disabled={analysis.working}
                  onInsert={(text) => {
                    setQuery(text);
                    setHint("");
                  }}
                />
                {analysis.streaming && (
                  <button className="text-xs text-primary underline" onClick={analysis.finish}>
                    Mostrar completa
                  </button>
                )}
                {analysis.working && (
                  <button
                    className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
                    onClick={analysis.cancel}
                  >
                    <Square size={11} fill="currentColor" />
                    Detener
                  </button>
                )}
              </div>
              <OrbComposer
                key={analysis.requestId}
                inputRef={inputRef}
                value={query}
                onChange={setQuery}
                onSend={send}
                busy={analysis.working}
                disabled={!snapshot.count}
                state={analysis.error ? "error" : analysis.busy
                  ? analysis.progress < .25 ? "thinking" : "reasoning"
                  : analysis.streaming ? "streaming"
                  : analysis.complete ? "done" : query.trim() ? "listening" : "idle"}
              />
              {hint && (
                <p role="status" className="text-xs text-muted-foreground">
                  {hint}
                </p>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      {!open &&
        (analysis.working ||
          (analysis.answer?.report && analysis.complete)) && (
          <div className="fixed right-5 bottom-24 z-40">
            <StatusIsland
              tasks={[
                {
                  id: "cube-analysis",
                  label: analysis.working
                    ? analysis.busy
                      ? "Preparando análisis"
                      : "Escribiendo respuesta"
                    : "Borrador listo",
                  status: analysis.working ? "running" : "done",
                  action: { label: "Ver", onClick: () => setOpen(true) },
                },
              ]}
            />
          </div>
        )}
    </>
  );
}
