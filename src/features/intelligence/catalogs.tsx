"use client";
import { useState } from "react";
import { Search, Layers3, ArrowDown } from "lucide-react";
const catalog = [
  {
    name: "Región",
    key: "REG",
    purpose: "Agrupación territorial de unidades.",
    example: "Centro · Norte · Sur",
  },
  {
    name: "Estado",
    key: "EST",
    purpose: "Entidad federativa de ubicación.",
    example: "Asociado a una región",
  },
  {
    name: "División",
    key: "DIV",
    purpose: "Adscripción organizacional de la unidad.",
    example: "Tiendas · Servicios Deportivos y Recreativos",
  },
  {
    name: "Segmento",
    key: "SEG",
    purpose: "Familia económica para analizar resultados.",
    example: "Comercio · Alimentos y bebidas · Hospedaje",
  },
  {
    name: "Unidad de negocio",
    key: "UN",
    purpose: "Instalación física u operación autónoma.",
    example: "Una tienda, un hotel o un centro recreativo",
  },
  {
    name: "Centro de negocio",
    key: "CN",
    purpose: "Fuente diferenciable de ingresos o valor.",
    example: "Cafetería dentro de una unidad deportiva",
  },
  {
    name: "Sublínea",
    key: "SUB",
    purpose: "Producto, servicio, paquete o modalidad.",
    example: "Consumo de cafetería",
  },
  {
    name: "Centro de costo",
    key: "CC",
    purpose: "Lugar o función donde se consumen recursos.",
    example: "Operación · Administración",
  },
];
export function CatalogsScreen() {
  const [query, setQuery] = useState("");
  return (
    <div className="space-y-7">
      <header>
        <p className="eyebrow">Administración / Modelo de información</p>
        <h1 className="page-title">Catálogos maestros</h1>
        <p className="page-copy">
          Las dimensiones que conectan operación, contabilidad y análisis.
        </p>
      </header>
      <section className="surface p-6">
        <div className="flex items-center gap-3">
          <Layers3 className="text-primary" />
          <h2 className="font-semibold">De la organización a la actividad</h2>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {[
            "División",
            "Unidad de negocio",
            "Centro de negocio",
            "Segmento operativo",
          ].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
                {s}
              </span>
              {i < 3 && (
                <ArrowDown
                  size={14}
                  className="-rotate-90 text-muted-foreground"
                />
              )}
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Un centro deportivo conserva su división organizacional. Su cafetería
          se analiza dentro de alimentos y bebidas. Ambas perspectivas conviven
          sin cambiar la adscripción de la unidad.
        </p>
      </section>
      <label className="flex max-w-sm items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
        <Search size={16} />
        <input
          className="w-full bg-transparent text-sm outline-none"
          aria-label="Buscar catálogo"
          placeholder="Buscar dimensión…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        {catalog
          .filter((c) =>
            [c.name, c.purpose]
              .join(" ")
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map((c) => (
            <article key={c.key} className="surface p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{c.name}</h2>
                <span className="pill font-mono text-primary">{c.key}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{c.purpose}</p>
              <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                {c.example}
              </p>
            </article>
          ))}
      </div>
      {!catalog.some((c) =>
        [c.name, c.purpose]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ) && (
        <p role="status" className="text-sm text-muted-foreground">
          No hay dimensiones para esa búsqueda.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Basado en Catálogos maestros GTyG Defensa. Estructura propuesta
        pendiente de validación; esta vista es de consulta.
      </p>
    </div>
  );
}
