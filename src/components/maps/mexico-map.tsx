"use client";
import { useRef, useState, type CSSProperties } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { useMapViewport } from "./use-map-viewport";
import { useMapHover } from "./use-map-hover";
import { MapCallouts } from "./map-callouts";
import geometry from "./mexico-paths.json";
import "./mexico-map.css";
export const mexicanStates = geometry.states.map(({ id, name }) => ({
  id,
  name,
}));
export type MapDatum = { count: number; value: number };
export function MexicoMap({
  data,
  selected,
  onSelect,
  formatValue,
  metricLabel = "Importe",
}: {
  data: Record<string, MapDatum>;
  selected: string;
  onSelect: (state: string) => void;
  formatValue: (value: number) => string;
  metricLabel?: string;
}) {
  const viewport = useMapViewport();
  const svgRef = useRef<SVGSVGElement>(null);
  const { hovered, preview, hover, confirm } = useMapHover();
  const [focused, setFocused] = useState<string | null>(null);
  const max = Math.max(...Object.values(data).map((d) => Math.abs(d.value)), 1);
  const active = geometry.states.find(
    (s) => s.id === (focused ?? preview ?? selected),
  );
  // Paint outlines last without moving the interactive paths or their tab order.
  const outlinedStates = [...new Set([selected, hovered, focused])]
    .map((id) => geometry.states.find((state) => state.id === id))
    .filter((state) => state !== undefined);
  const draw = (state: (typeof geometry.states)[number]) => {
    const item = data[state.id];
    const fill = item?.count
      ? `color-mix(in srgb, var(--chart-1) ${40 + (Math.abs(item.value) / max) * 60}%, var(--card))`
      : "var(--muted)";
    return (
      <path
        key={state.id}
        d={state.path}
        data-state-id={state.id}
        className="mexico-state"
        data-selected={state.id === selected}
        data-hovered={state.id === hovered}
        data-empty={!item?.count}
        style={{ "--state-fill": fill } as CSSProperties}
        role="button"
        tabIndex={0}
        aria-pressed={state.id === selected}
        aria-label={`${state.name}: ${item?.count ? `${item.count} unidades, ${formatValue(item.value)}` : "sin información en la muestra"}`}
        onMouseEnter={() => hover(state.id)}
        onMouseLeave={() => hover(null)}
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) {
            confirm(null);
            setFocused(state.id);
            viewport.reveal(e.currentTarget.getBBox());
          }
        }}
        onBlur={() => setFocused(null)}
        onClick={() => {
          if (viewport.allowClick()) {
            confirm(state.id === selected ? null : state.id);
            onSelect(state.id === selected ? "all" : state.id);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(state.id === selected ? "all" : state.id);
          }
        }}
      />
    );
  };
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          {viewport.zoom > 1
            ? "Arrastra para explorar el mapa"
            : "Acerca para distinguir los estados pequeños"}
        </span>
        <div role="group" aria-label="Zoom del mapa" className="map-controls">
          <button
            type="button"
            aria-label="Alejar mapa"
            disabled={viewport.zoom <= 1}
            onClick={() => viewport.zoomBy(1 / 1.5)}
          >
            <Minus size={15} />
          </button>
          <output aria-live="polite">{Math.round(viewport.zoom * 100)}%</output>
          <button
            type="button"
            aria-label="Acercar mapa"
            disabled={viewport.zoom >= 6}
            onClick={() => viewport.zoomBy(1.5)}
          >
            <Plus size={15} />
          </button>
          <button
            type="button"
            aria-label="Restablecer vista del mapa"
            disabled={viewport.zoom === 1}
            onClick={viewport.reset}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <div className="mexico-map-stage">
        <svg
          ref={svgRef}
          viewBox={viewport.viewBox}
          data-zoomed={viewport.zoom > 1}
          onPointerDown={viewport.onPointerDown}
          onPointerMove={viewport.onPointerMove}
          onPointerUp={viewport.onPointerUp}
          onPointerCancel={viewport.onPointerCancel}
          className="mexico-map"
          aria-label="Filtrar por entidad federativa"
        >
          <path
            aria-hidden="true"
            pointerEvents="none"
            className="mexico-map-depth"
            d={geometry.states.map((s) => s.path).join(" ")}
            transform={`translate(0 ${3 / viewport.zoom})`}
          />
          {geometry.states.map((s) => draw(s))}
          <g aria-hidden="true" pointerEvents="none">
            {outlinedStates.map((state) => (
              <path
                key={state.id}
                d={state.path}
                className="mexico-state-outline"
                data-selected={state.id === selected}
                data-focused={state.id === focused}
              />
            ))}
          </g>
        </svg>
        <MapCallouts
          svgRef={svgRef}
          viewBox={viewport.viewBox}
          data={data}
          active={active?.id}
          selected={selected}
          formatValue={formatValue}
          metricLabel={metricLabel}
        />
      </div>
      <div
        className="mt-2 min-h-12 rounded-lg bg-muted/60 px-3 py-2 text-xs"
        aria-live="polite"
      >
        {active ? (
          <>
            <strong>{active.name}</strong>
            <span className="ml-2 text-muted-foreground">
              {data[active.id]?.count
                ? `${data[active.id].count} unidades · ${formatValue(data[active.id].value)}`
                : "Sin información en la muestra"}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Selecciona un estado para consultar sus resultados.
          </span>
        )}
      </div>
    </div>
  );
}
