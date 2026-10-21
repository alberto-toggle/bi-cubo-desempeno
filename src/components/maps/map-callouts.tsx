"use client";

import { useEffect, useState, type RefObject } from "react";
import type { MapDatum } from "./mexico-map";
import { AnimatePresence } from "motion/react";
import { MapCallout } from "./map-callout";
import geometry from "./mexico-paths.json";

type Point = { x: number; y: number };
const CARD_WIDTH = 146;
const CARD_HEIGHT = 82;
const GAP = 12;

// Measure geographic anchors once per resize; project them independently of zoom.
export function MapCallouts({
  svgRef,
  viewBox,
  data,
  active,
  selected,
  formatValue,
  metricLabel,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  viewBox: string;
  data: Record<string, MapDatum>;
  active?: string;
  selected: string;
  formatValue: (value: number) => string;
  metricLabel: string;
}) {
  const [layout, setLayout] = useState<{
    width: number;
    height: number;
    anchors: Record<string, Point>;
  } | null>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => {
      const anchors: Record<string, Point> = {};
      svg
        .querySelectorAll<SVGPathElement>("[data-state-id]")
        .forEach((path) => {
          const box = path.getBBox();
          let point = new DOMPoint(
            box.x + box.width / 2,
            box.y + box.height / 2,
          );
          // Concave/coastal states can have their bounding-box center outside the land.
          if (!path.isPointInFill(point)) {
            let distance = Infinity;
            for (let y = 1; y < 10; y++)
              for (let x = 1; x < 10; x++) {
                const candidate = new DOMPoint(
                  box.x + (box.width * x) / 10,
                  box.y + (box.height * y) / 10,
                );
                const d = Math.hypot(
                  candidate.x - (box.x + box.width / 2),
                  candidate.y - (box.y + box.height / 2),
                );
                if (d < distance && path.isPointInFill(candidate)) {
                  point = candidate;
                  distance = d;
                }
              }
          }
          anchors[path.dataset.stateId!] = { x: point.x, y: point.y };
        });
      setLayout({
        width: svg.clientWidth,
        height: svg.clientHeight,
        anchors,
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [svgRef]);
  if (!layout || !layout.width) return null;
  const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
  const scale = Math.min(layout.width / vw, layout.height / vh);
  const offsetX = (layout.width - vw * scale) / 2;
  const offsetY = (layout.height - vh * scale) / 2;
  const ids = [active ?? selected];
  const cards: { id: string; anchor: Point; x: number; y: number }[] = [];
  for (const id of ids) {
    if (!id || !layout.anchors[id]) continue;
    const p = layout.anchors[id];
    const anchor = {
      x: (p.x - vx) * scale + offsetX,
      y: (p.y - vy) * scale + offsetY,
    };
    if (
      anchor.x < 0 ||
      anchor.y < 0 ||
      anchor.x > layout.width ||
      anchor.y > layout.height
    )
      continue;
    const left = anchor.x < layout.width / 2;
    const preferredX = left ? GAP : layout.width - CARD_WIDTH - GAP;
    cards.push({
      id,
      anchor,
      x: preferredX,
      y: Math.max(
        GAP,
        Math.min(layout.height - CARD_HEIGHT - GAP, anchor.y - CARD_HEIGHT / 2),
      ),
    });
  }
  return (
    <div className="map-callouts" aria-hidden="true">
      <AnimatePresence mode="wait">
        {cards.map(({ id, anchor, x, y }) => (
          <MapCallout
            key={id}
            anchor={anchor}
            x={x}
            y={y}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            title={geometry.states.find((s) => s.id === id)?.name ?? id}
            value={
              data[id]?.count ? formatValue(data[id].value) : "Sin registros"
            }
            description={
              data[id]?.count
                ? `${metricLabel} · ${data[id].count} ud.`
                : "En la muestra actual"
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
