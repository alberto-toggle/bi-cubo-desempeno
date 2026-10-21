"use client";
import type { Ref } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { AiOrb, type AiOrbState } from "./ai-orb";

/** Pill → orb → pill composition adapted from anark17r's AI Thinking Orb & Input.
 * Uses AI Orb's state renderer; request lifecycle stays in the feature.
 */
export function OrbComposer({value, onChange, onSend, state, busy, disabled, inputRef}: {
  inputRef?: Ref<HTMLInputElement>;
  value: string; onChange: (value: string) => void; onSend: () => void;
  state: AiOrbState; busy: boolean; disabled?: boolean;
}) {
  const reduced = useReducedMotion();
  const expanded = state === "thinking" || state === "reasoning";
  return (
    <div className="relative flex justify-center py-2">
      <motion.div layout transition={{duration: reduced ? 0 : .55, ease: [.22,1,.36,1]}}
        className="relative flex items-center overflow-hidden border border-primary/20 bg-background shadow-sm"
        style={{width: expanded ? 148 : "100%", borderRadius: expanded ? 42 : 30, minHeight: expanded ? 148 : 60}}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_70%)]" />
        <motion.div layout className={expanded ? "relative mx-auto flex flex-col items-center py-3" : "relative shrink-0 px-2"}>
          <AiOrb size={expanded ? "lg" : "md"} state={state} className={expanded ? "my-3 scale-125" : undefined} />
          {expanded && <span className="mt-1 text-xs font-medium text-primary">{state === "reasoning" ? "Razonando" : "Consultando"}</span>}
        </motion.div>
        <AnimatePresence initial={false}>
          {!expanded && <motion.form autoComplete="off" key="input" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            transition={{duration: reduced ? 0 : .2}}
            className="relative flex min-w-0 flex-1 items-center gap-2 py-2 pr-2"
            onSubmit={e=>{e.preventDefault();if(!busy && value.trim()) onSend();}}>
            <label className="sr-only" htmlFor="analysis-query">Consulta sobre esta selección</label>
            <input ref={inputRef} autoComplete="off" id="analysis-query" value={value} maxLength={500} disabled={disabled || busy}
              onChange={e=>onChange(e.target.value)}
              placeholder={busy ? "Escribiendo respuesta…" : "Pregunta sobre esta selección…"}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring rounded" />
            <button type="submit" aria-label="Enviar consulta" disabled={disabled || busy || !value.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowUp size={17}/>
            </button>
          </motion.form>}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
