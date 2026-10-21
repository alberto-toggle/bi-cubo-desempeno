"use client";
/**
 * Adapted from AI Agent Lanes — @kokonutui, MIT.
 * https://kokonutui.com / https://github.com/kokonut-labs/kokonutui
 * Controlled progress; no provider demo, playback controls or internal clock.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
export type AgentStep = { label: string; start: number; end: number; result?: string };
export type AgentLane = { id: string; name: string; steps: AgentStep[] };
const LANE_H = 44;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const laneEnd = (lane: AgentLane) => lane.steps.at(-1)?.end ?? 0;

export function AgentLanes({ lanes, progress }: { lanes: AgentLane[]; progress: number }) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(lanes[0]?.id);
  const selectedLane = lanes.find(l => l.id === selected) ?? lanes[0];
  const now = clamp01(progress);
  const active = lanes.flatMap(l => l.steps).find(s => now >= s.start && now < s.end);
  if (!lanes.length) return null;
  return (
    <section aria-label="Etapas del análisis simulado" className="overflow-hidden rounded-2xl border border-border bg-background/50">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="text-xs font-medium">Procesando la selección</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Simulación</span>
      </div>
      <div className="flex p-4">
        <ul className="w-24 shrink-0 sm:w-28">
          {lanes.map(lane => (
            <li key={lane.id} style={{height: LANE_H}} className="flex items-center gap-2 text-xs">
              {now >= laneEnd(lane) ? <Check size={13} className="shrink-0 text-primary" /> :
                <span className="size-2 shrink-0 rounded-full border border-primary" />}
              <button type="button" onClick={()=>setSelected(lane.id)} aria-pressed={selected === lane.id}
                className="rounded px-1.5 py-1 text-left hover:bg-muted aria-pressed:bg-primary/10 aria-pressed:text-primary focus-visible:ring-2 focus-visible:ring-ring">{lane.name}</button>
            </li>
          ))}
        </ul>
        <div className="relative min-w-0 flex-1" aria-hidden="true">
          <Connectors lead={lanes[0]} subs={lanes.slice(1)} now={now} total={1} />
          {lanes.map((lane, i) => (
            <div key={lane.id} style={{height: LANE_H}} className="relative border-b border-dashed border-border last:border-0">
              {lane.steps.map(step => (
                <div key={step.label} title={step.label} className="absolute top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded"
                  style={{left: `${step.start * 100}%`, width: `${(step.end-step.start)*100}%`, background:"var(--muted)"}}>
                  <motion.div className="h-full origin-left rounded" initial={false}
                    animate={{scaleX: clamp01((now-step.start)/(step.end-step.start))}}
                    transition={{duration: reduced ? 0 : .12, ease:"linear"}}
                    style={{background: `var(--chart-${i+1})`}} />
                </div>
              ))}
            </div>
          ))}
          {!reduced && <div className="pointer-events-none absolute inset-y-0 w-px bg-primary/60" style={{left: `${now*100}%`}} />}
        </div>
      </div>
      <div className="flex justify-between px-4 pb-3 text-[10px] tabular-nums text-muted-foreground">
        <span>Inicio</span><span>{Math.round(now*100)}% del proceso simulado</span><span>Respuesta</span>
      </div>
      <div className="min-h-24 border-t border-border px-4 py-3">
        <p className="mb-2 text-xs font-medium">{selectedLane.name}</p>
        <ul className="space-y-2 text-xs text-muted-foreground">
          {selectedLane.steps.map(step => <li key={step.label} className="flex gap-2">
            <span className="shrink-0 text-primary">{now >= step.end ? "✓" : now >= step.start ? "●" : "○"}</span>
            <span>{step.label}{now >= step.end && step.result && <span className="mt-1 block text-foreground">{step.result}</span>}</span>
          </li>)}
        </ul>
      </div>
      <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground" role="status">
        {active?.label ?? "Preparando respuesta"}
      </p>
    </section>
  );
}
/** Lines from the lead out to each sub-agent, and back when they report. */
function Connectors({
  lead,
  subs,
  now,
  total,
}: {
  lead: AgentLane;
  subs: AgentLane[];
  now: number;
  total: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const observer = new ResizeObserver(() => setWidth(el.clientWidth));
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const fork = lead.steps[0]?.end ?? 0;
  const join = lead.steps.at(-1)?.start ?? total;
  const xAt = (t: number) => (t / total) * width;
  const yAt = (lane: number) => lane * LANE_H + LANE_H / 2;
  const reach = (from: number, to: number) =>
    clamp01((now - from) / (to - from));
  const top = yAt(0);
  const fx = xAt(fork);
  const jx = xAt(join);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      ref={ref}
    >
      {width > 0 && (
        <>
          {/* The lead waits on its sub-agents between handing off and writing. */}
          <line
            className="stroke-border"
            strokeDasharray="2 3"
            x1={fx}
            x2={xAt(Math.min(Math.max(now, fork), join))}
            y1={top}
            y2={top}
          />
          {subs.map((lane, i) => {
            const y = yAt(i + 1);
            const sx = xAt(lane.steps[0]?.start ?? fork);
            const ex = xAt(laneEnd(lane));
            const out = `M ${fx} ${top} C ${fx + 6} ${top} ${fx + 2} ${y} ${sx} ${y}`;
            const back = `M ${ex} ${y} C ${jx - 18} ${y} ${jx - 12} ${top} ${jx} ${top}`;
            return (
              <g
                className="fill-none stroke-muted-foreground/50"
                key={lane.id}
              >
                <path
                  d={out}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - reach(fork, fork + 0.2)}
                />
                <path
                  d={back}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - reach(join - 0.35, join)}
                />
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}

