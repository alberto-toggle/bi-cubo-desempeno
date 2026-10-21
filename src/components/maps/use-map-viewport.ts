"use client";
import { useRef, useState, type PointerEvent } from "react";
const WIDTH = 1000,
  HEIGHT = 630;
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
type Viewport = { x: number; y: number; zoom: number };
const initial = { x: 0, y: 0, zoom: 1 };
function bound(v: Viewport): Viewport {
  return {
    ...v,
    x: clamp(v.x, 0, WIDTH - WIDTH / v.zoom),
    y: clamp(v.y, 0, HEIGHT - HEIGHT / v.zoom),
  };
}
export function useMapViewport() {
  const [view, setView] = useState(initial);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    ratio: number;
    view: Viewport;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  function zoomBy(factor: number) {
    setView((v) => {
      const zoom = clamp(v.zoom * factor, 1, 6);
      return bound({
        zoom,
        x: v.x + WIDTH / v.zoom / 2 - WIDTH / zoom / 2,
        y: v.y + HEIGHT / v.zoom / 2 - HEIGHT / zoom / 2,
      });
    });
  }
  function onPointerDown(e: PointerEvent<SVGSVGElement>) {
    suppressClick.current = false;
    if (view.zoom === 1 || e.button !== 0) return;
    const matrix = e.currentTarget.getScreenCTM();
    if (!matrix) return;
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      ratio: 1 / matrix.a,
      view,
      moved: false,
    };
  }
  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    d.moved = true;
    suppressClick.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setView(
      bound({
        ...d.view,
        x: d.view.x - dx * d.ratio,
        y: d.view.y - dy * d.ratio,
      }),
    );
  }
  function endDrag() {
    drag.current = null;
  }
  return {
    viewBox: `${view.x} ${view.y} ${WIDTH / view.zoom} ${HEIGHT / view.zoom}`,
    zoom: view.zoom,
    zoomBy,
    reset: () => setView(initial),
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    allowClick: () => !suppressClick.current,
    reveal: (box: DOMRect) =>
      setView((v) =>
        v.zoom === 1
          ? v
          : bound({
              ...v,
              x: box.x + box.width / 2 - WIDTH / v.zoom / 2,
              y: box.y + box.height / 2 - HEIGHT / v.zoom / 2,
            }),
      ),
  };
}
