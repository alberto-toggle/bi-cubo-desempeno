"use client";
import { motion, useReducedMotion } from "motion/react";
import { cubeMetrics, type CubeMetric } from "./model";
import "./cube.css";
export function CubeVisual({
  value,
  onChange,
}: {
  value: CubeMetric;
  onChange: (v: CubeMetric) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="cube-visual">
      <svg
        viewBox="0 0 600 440"
        role="group"
        aria-label="Capas del cubo de desempeño"
      >
        <g fill="none" stroke="var(--border)" strokeWidth="1">
          <path d="M85 90 300 20 515 90 515 345 300 420 85 345Z M85 90 300 165 515 90 M300 165V420 M300 20V275 M85 345 300 275 515 345" />
          {cubeMetrics.map((_, i) => (
            <path
              key={i}
              d={`M85 ${135 + i * 42} 300 ${210 + i * 42} 515 ${135 + i * 42}`}
              opacity=".5"
            />
          ))}
        </g>
        {cubeMetrics.map((layer, i) => {
          const selected = value === layer.id;
          const y = 94 + i * (196 / (cubeMetrics.length - 1));
          return (
            <motion.g
              key={layer.id}
              role="button"
              tabIndex={0}
              aria-label={layer.label}
              aria-pressed={selected}
              className="cube-layer"
              onClick={() => onChange(layer.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(layer.id);
                }
              }}
              animate={{ y: selected ? -7 : 0 }}
              transition={{ duration: reduced ? 0 : 0.24 }}
              style={{ color: layer.color }}
            >
              <path
                d={`M120 ${y} 300 ${y - 52} 480 ${y} 300 ${y + 52}Z`}
                fill="currentColor"
                opacity={selected ? 0.25 : 0.09}
                stroke="currentColor"
              />
              <path
                d={`M120 ${y} 300 ${y + 52} 480 ${y} V${y + 15} L300 ${y + 67} 120 ${y + 15}Z`}
                fill="currentColor"
                opacity={selected ? 0.32 : 0.13}
              />
              <rect
                x="172"
                y={y - 10}
                width="256"
                height="38"
                rx="9"
                fill="var(--card)"
                stroke={selected ? "currentColor" : "var(--border)"}
                strokeWidth={selected ? 2 : 1}
              />
              <text
                x="188"
                y={y + 14}
                fill="currentColor"
                fontSize="11"
                fontFamily="monospace"
              >
                {layer.code}
              </text>
              <text
                x="237"
                y={y + 14}
                fill="var(--foreground)"
                fontSize="14"
                fontWeight={selected ? 600 : 400}
              >
                {layer.label}
              </text>
            </motion.g>
          );
        })}
        <text
          x="60"
          y="228"
          transform="rotate(-90 60 228)"
          className="cube-axis"
        >
          GEOGRAFÍA
        </text>
        <text x="105" y="401" className="cube-axis">
          TIPO DE INSTALACIÓN
        </text>
        <text x="425" y="401" className="cube-axis">
          TIEMPO
        </text>
      </svg>
      <p className="text-center text-xs text-muted-foreground">
        Selecciona una capa para explorar sus cifras.
      </p>
    </div>
  );
}
