"use client";

import { motion, useReducedMotion } from "motion/react";

type MapCalloutProps = {
  anchor: { x: number; y: number };
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  value: string;
  description: string;
};

/** Presentational annotation: independent of map geometry and business metrics. */
export function MapCallout({
  anchor,
  x,
  y,
  width,
  height,
  title,
  value,
  description,
}: MapCalloutProps) {
  const reducedMotion = useReducedMotion();
  const endX =
    anchor.x < x ? x : anchor.x > x + width ? x + width : x + width / 2;
  const endY = Math.max(y + 12, Math.min(y + height - 12, anchor.y));

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.1 } }}
      transition={{ duration: reducedMotion ? 0 : 0.16 }}
    >
      <svg className="map-callout-lines" width="100%" height="100%">
        <g data-active="true">
          <path d={`M ${anchor.x} ${anchor.y} L ${endX} ${endY}`} />
          <circle cx={anchor.x} cy={anchor.y} r="4" />
          <circle
            className="map-marker-ring"
            cx={anchor.x}
            cy={anchor.y}
            r="8"
          />
        </g>
      </svg>
      <div
        className="map-callout"
        data-active="true"
        style={{ left: x, top: y, width, height }}
      >
        <span className="map-callout-name">{title}</span>
        <strong>{value}</strong>
        <span className="map-callout-meta">{description}</span>
      </div>
    </motion.div>
  );
}
