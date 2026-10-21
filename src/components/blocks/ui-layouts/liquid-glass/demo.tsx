"use client";
import { useState } from "react";
import { Layers, Move } from "lucide-react";
import { LiquidGlassCard } from "./liquid-glass";
import "./demo.css";
export default function LiquidGlassDemo() {
  const [blur, setBlur] = useState<"sm" | "md" | "lg" | "xl">("sm");
  const [drag, setDrag] = useState(true);
  const [edge, setEdge] = useState<"sm" | "md" | "lg">("md");
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          Desenfoque
          <select
            className="rounded-lg border border-border bg-card p-2"
            value={blur}
            onChange={(e) => setBlur(e.target.value as typeof blur)}
          >
            {["sm", "md", "lg", "xl"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Reflejos
          <select
            className="rounded-lg border border-border bg-card p-2"
            value={edge}
            onChange={(e) => setEdge(e.target.value as typeof edge)}
          >
            {["sm", "md", "lg"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={drag}
            onChange={(e) => setDrag(e.target.checked)}
          />
          Permitir arrastre
        </label>
      </div>
      <div className="liquid-demo-scene">
        <div className="liquid-demo-pattern" aria-hidden="true" />
        <LiquidGlassCard
          draggable={drag}
          blurIntensity={blur}
          shadowIntensity={edge}
          glowIntensity="sm"
          className="w-full max-w-sm"
        >
          <div className="p-8 text-white">
            <Layers size={30} />
            <h2 className="mt-5 text-3xl font-semibold">Liquid Glass</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Mueve el vidrio sobre las líneas del fondo para observar la
              refracción.
            </p>
            <span className="mt-6 flex items-center gap-2 text-xs">
              <Move size={14} />
              UI Layouts · Ejemplo interactivo
            </span>
          </div>
        </LiquidGlassCard>
      </div>
      <p className="text-xs text-muted-foreground">
        La refracción depende del soporte SVG y backdrop-filter del navegador.
        El arrastre se desactiva al solicitar movimiento reducido.
      </p>
    </div>
  );
}
