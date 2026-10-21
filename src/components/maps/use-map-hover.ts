"use client";

import { useEffect, useRef, useState } from "react";

/** Immediate outline feedback, delayed annotation updates for intentional hover. */
export function useMapHover(delay = 180) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  const hover = (id: string | null) => {
    setHovered(id);
    cancel();
    timer.current = setTimeout(() => {
      setPreview(id);
      timer.current = null;
    }, delay);
  };

  const confirm = (id: string | null) => {
    cancel();
    setPreview(id);
  };

  return { hovered, preview, hover, confirm };
}
