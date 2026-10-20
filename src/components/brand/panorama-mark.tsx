"use client";

import { useId, type SVGProps } from "react";
import "./panorama-mark.css";

type PanoramaMarkProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Omit when the surrounding link or wordmark already provides a label. */
  title?: string;
  variant?: "gradient" | "monochrome";
};

/** Vector reconstruction of the supplied mark. Transparent negative space. */
export function PanoramaMark({
  title,
  variant = "gradient",
  className = "",
  ...props
}: PanoramaMarkProps) {
  const id = useId();
  const gradientId = `${id}-gradient`;
  const titleId = `${id}-title`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 48 370 414"
      width={40}
      height={45}
      className={`panorama-mark ${className}`}
      fill={variant === "monochrome" ? "currentColor" : `url(#${gradientId})`}
      role={title ? "img" : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title && <title id={titleId}>{title}</title>}
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="57"
          x2="0"
          y2="452"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="var(--brand-mark-highlight)" />
          <stop offset="0.39" stopColor="var(--brand-mark-magenta)" />
          <stop offset="0.72" stopColor="var(--brand-mark-cyan)" />
          <stop offset="1" stopColor="var(--brand-mark-cyan)" />
        </linearGradient>
      </defs>
      <path d="M71 158 245 57 419 154 372 181 245 110 117 184 117 303 71 329Z" />
      <path d="M140 204 244 144 345 203 299 231 244 199 207 219 285 266 419 187 419 250 285 328 140 245Z" />
      <path d="M140 270 293 361 419 291 419 348 296 419 140 326Z" />
      <path d="M117 331 279 430 245 452 71 354Z" />
    </svg>
  );
}
