"use client";
import { useState } from "react";
import { Orb, VARIANTS, type OrbLook, type OrbState } from "./thinking-orbs";
import OriginalDemo from "./original-demo";

export default function Demo() {
  const [state, setState] = useState<OrbState>("reasoning");
  const [variant, setVariant] = useState("default");
  const [size, setSize] = useState(96);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const look = { state, variant } as OrbLook;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label>
          Estado{" "}
          <select
            className="rounded border border-border bg-card p-2"
            value={state}
            onChange={(e) => {
              setState(e.target.value as OrbState);
              setVariant("default");
            }}
          >
            {Object.keys(VARIANTS).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Variante{" "}
          <select
            className="rounded border border-border bg-card p-2"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
          >
            {VARIANTS[state].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Tamaño{" "}
          <select
            className="rounded border border-border bg-card p-2"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            {[20, 48, 64, 96, 128].map((n) => (
              <option key={n} value={n}>
                {n} px
              </option>
            ))}
          </select>
        </label>
        <label>
          Velocidad{" "}
          <select
            className="rounded border border-border bg-card p-2"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            {[0.5, 1, 2].map((n) => (
              <option key={n} value={n}>
                {n}×
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={paused}
            onChange={(e) => setPaused(e.target.checked)}
          />
          Pausar
        </label>
      </div>
      <div className="grid min-h-64 place-items-center rounded-xl border border-border bg-card text-primary">
        <Orb
          {...look}
          size={size}
          speed={speed}
          paused={paused}
          label={`Thinking Orbs: ${state}`}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Respeta movimiento reducido. Los colores se adaptan al tema mediante
        currentColor.
      </p>
      <details className="rounded-xl border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Ejemplo original · Chat Line
        </summary>
        <OriginalDemo />
      </details>
    </div>
  );
}
