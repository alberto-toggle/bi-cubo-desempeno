"use client";
import { useEffect, useRef, useState } from "react";
import { HaloSearchInput } from "./halo-search";
export default function Demo() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <form
      className="mx-auto min-h-96 max-w-xl space-y-5 py-20"
      onSubmit={(e) => {
        e.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        setLoading(true);
        timer.current = setTimeout(() => setLoading(false), 1800);
      }}
    >
      <HaloSearchInput
        aria-label="Consulta de demostración"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        isLoading={loading}
        placeholder="Busca en la demostración…"
      />
      <p className="text-sm text-muted-foreground">
        Presiona Enter para simular una búsqueda. No se envían datos.
      </p>
    </form>
  );
}
