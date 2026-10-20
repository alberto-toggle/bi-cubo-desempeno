"use client";
import { useId } from "react";
/** Vector artwork uses theme tokens and remains crisp at any resolution. */
export function AccessArtwork() {
  const id = useId();
  return (
    <svg
      className="access-artwork"
      viewBox="0 0 600 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-base`} x2="1" y2="1">
          <stop stopColor="var(--hero)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="1" y2=".8">
          <stop stopColor="var(--access-art-light)" />
          <stop offset=".48" stopColor="var(--access-art-mid)" />
          <stop offset="1" stopColor="var(--hero)" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x2="1" y2="1">
          <stop stopColor="var(--access-art-light)" stopOpacity=".8" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id}-base)`} d="M0 0h600v800H0z" />
      <g
        transform="rotate(-30 300 400)"
        fill={`url(#${id}-ribbon)`}
        stroke={`url(#${id}-edge)`}
        strokeWidth="1.5"
      >
        <path d="M-270 190C-30-40 260 30 820 60L820 180C350 100 50 130-270 350Z" />
        <path d="M-240 430C50 150 330 200 850 330L850 480C360 290 70 330-240 590Z" />
        <path d="M-220 760C30 420 320 440 840 650L840 830C320 560 70 590-220 950Z" />
      </g>
    </svg>
  );
}
