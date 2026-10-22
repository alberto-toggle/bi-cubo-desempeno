"use client";
import { DataTableLayout } from "@/components/layout/data-table-layout";
import {
  tableLayout,
  catalogColumns,
} from "@/features/intelligence/table-layout";

import { useState } from "react";
import { Search, Plus, LockKeyhole } from "lucide-react";
import {
  catalogRecords,
  type CatalogRecord,
} from "@/features/catalog-management/catalog-model";
import { useCatalogProposals } from "@/features/catalog-management/proposal-store";
import { ProposalDialog } from "@/features/catalog-management/proposal-dialog";
import { useAppSelector } from "@/store/hooks";
import { effectiveIdentity } from "./model";
import { FilterSelect } from "./filters";
import { DemoHelp } from "@/features/demo/demo-controls";
const categories = [...new Set(catalogRecords.map((r) => r.category))];
export function CatalogsScreen() {
  const role = useAppSelector((s) => s.auth.session?.role);
  const mode = useAppSelector((s) =>
    effectiveIdentity(s.auth.session?.role ?? null),
  );
  const [category, setCategory] = useState("Unidades");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<{ record: CatalogRecord | null } | null>(
    null,
  );
  const [page, setPage] = useState(0);
  const [notice, setNotice] = useState("");
  const { proposals, add } = useCatalogProposals();
  if (role !== "admin" || mode !== "full")
    return (
      <section className="surface p-8">
        <LockKeyhole className="text-primary" />
        <h1 className="page-title">Catálogos maestros protegidos</h1>
        <p className="page-copy">
          La consulta de nombres, claves territoriales y cambios requiere acceso
          administrador con visibilidad de datos completos.
        </p>
      </section>
    );
  const rows = catalogRecords.filter(
    (r) =>
      r.category === category &&
      [r.name, r.code, r.relation]
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(query.toLocaleLowerCase("es")),
  );
  const pages = Math.max(1, Math.ceil(rows.length / 10));
  const current = Math.min(page, pages - 1);
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Administración / Datos maestros</p>
          <h1 className="page-title">Catálogos maestros</h1>
          <p className="page-copy">
            Registros genéricos, relaciones y propuestas de actualización.
          </p>
        </div>
        <button
          className="primary-button"
          onClick={() => setDialog({ record: null })}
        >
          <Plus size={15} />
          Proponer alta
        </button>
      </header>
      <DemoHelp>
        Catálogo ficticio de demostración. Cambios guardados como propuestas locales.
      </DemoHelp>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          label="Catálogo"
          value={category}
          onChange={(v) => {
            setCategory(v);
            setPage(0);
            setQuery("");
          }}
          options={categories.map((c) => ({
            value: c,
            label: `${c} (${catalogRecords.filter((r) => r.category === c).length})`,
          }))}
        />
        <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search size={15} />
          <input
            aria-label="Buscar registro de catálogo"
            placeholder="Nombre o clave…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            className="min-w-0 bg-transparent text-sm outline-none"
          />
        </label>
      </div>
      {notice && (
        <p role="status" className="text-sm text-primary">
          {notice}
        </p>
      )}
      <section className="surface overflow-hidden">
        <DataTableLayout
          columns={catalogColumns}
          className={tableLayout.catalogs}
        >
          <thead className={tableLayout.catalogHead}>
            <tr>
              {["Clave", "Nombre", "Relación", "Fuente", ""].map((h, i) => (
                <th
                  key={i}
                  className={`${tableLayout.catalogCell} font-medium`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(current * 10, current * 10 + 10).map((r) => (
              <tr key={r.code} className="border-b border-border last:border-0">
                <td
                  className={`${tableLayout.catalogCell} font-mono whitespace-nowrap`}
                >
                  {r.code}
                </td>
                <td className={tableLayout.catalogCell}>
                  <span className="font-medium">{r.name}</span>
                  <p className="mt-1 text-muted-foreground">{r.description}</p>
                  {proposals.some((p) => p.code === r.code) && (
                    <span className="mt-2 inline-block text-warning">
                      Cambio propuesto
                    </span>
                  )}
                </td>
                <td className={tableLayout.catalogCell}>{r.relation}</td>
                <td className={`${tableLayout.catalogCell} whitespace-nowrap`}>
                  Demostración
                </td>
                <td className={tableLayout.catalogCell}>
                  <button
                    className="text-primary underline whitespace-nowrap"
                    onClick={() => setDialog({ record: r })}
                  >
                    Proponer cambio
                    <span className="sr-only"> de {r.name}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableLayout>
        {!rows.length && (
          <p className="p-10 text-center text-sm text-muted-foreground">
            Sin coincidencias.
          </p>
        )}
        <footer className={tableLayout.footer}>
          <span>
            {rows.length} registros · {current + 1}/{pages}
          </span>
          <div className="flex gap-2">
            <button
              className="secondary-button disabled:opacity-40"
              disabled={!current}
              onClick={() => setPage(current - 1)}
            >
              Anterior
            </button>
            <button
              className="secondary-button disabled:opacity-40"
              disabled={current + 1 === pages}
              onClick={() => setPage(current + 1)}
            >
              Siguiente
            </button>
          </div>
        </footer>
      </section>
      <section className="surface p-5">
        <h2 className="font-semibold">Propuestas e historial</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Pendientes de validación · Sesión administrador · Conservadas en este
          navegador
        </p>
        {!proposals.length ? (
          <p className="mt-5 text-sm text-muted-foreground">
            No hay propuestas registradas.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {proposals.map((p) => (
              <li key={p.id} className="py-3">
                <p className="text-sm font-medium">
                  {p.action} · {p.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.code} · {new Date(p.date).toLocaleString("es-MX")} ·
                  Pendiente de validación
                </p>
                <p className="mt-2 text-xs">{p.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      {dialog && (
        <ProposalDialog
          record={dialog.record}
          category={category}
          onClose={() => setDialog(null)}
          onSave={(p) => {
            add(p);
            setNotice("Propuesta registrada. Pendiente de validación.");
          }}
        />
      )}
    </div>
  );
}
