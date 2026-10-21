"use client";

import { Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AI_ORB_LABELS,
  AI_ORB_STATES,
  AiOrb,
  type AiOrbState,
} from "./component";

const settings = {
  showGallery: true,
  stepMs: 1600,
};

/** One scripted agent turn: the person types, the agent thinks, uses a tool and answers. */
const TURN: AiOrbState[] = [
  "listening",
  "thinking",
  "tool-call",
  "tool-result",
  "reasoning",
  "streaming",
  "done",
];

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [state, setState] = useState<AiOrbState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    for (const timer of timers.current) {
      clearTimeout(timer);
    }
    timers.current = [];
  }, []);
  useEffect(() => clear, [clear]);

  const play = () => {
    clear();
    TURN.forEach((next, index) => {
      timers.current.push(setTimeout(() => setState(next), index * s.stepMs));
    });
  };

  const reset = () => {
    clear();
    setState("idle");
  };

  return (
    <div className="flex min-h-[560px] w-full items-center justify-center bg-background px-6 pt-16 pb-6 text-foreground">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
          <div className="flex min-w-0 flex-1 basis-56 items-center gap-5">
            <AiOrb decorative size="lg" state={state} />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm">Operations assistant</p>
              <p aria-live="polite" className="text-muted-foreground text-sm">
                {AI_ORB_LABELS[state]}
                <span className="ml-2 inline-block whitespace-nowrap rounded-full border border-border px-2 py-0.5 font-mono text-xs">
                  {state}
                </span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 font-medium text-primary-foreground text-sm shadow-xs outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
              onClick={play}
              type="button"
            >
              <Play aria-hidden="true" className="size-4" />
              Run a turn
            </button>
            <button
              aria-label="Reset to idle"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={reset}
              type="button"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
        {s.showGallery ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {AI_ORB_STATES.map((item) => (
              <li
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-2 py-4 text-card-foreground"
                key={item}
              >
                <AiOrb settleMs={60_000} size="lg" state={item} />
                <span className="font-mono text-muted-foreground text-xs">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
