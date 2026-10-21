"use client";
import { useState } from "react";
import { FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { DemoHelp } from "@/features/demo/demo-controls";
import { cafeteriaScenario as scenario, reconcileSettlement } from "./scenario";
import { money } from "../model";
export function TraceabilityPanel() {
  const [selected, setSelected] = useState("E04");
  const [mismatch, setMismatch] = useState(false);
  const stage = scenario.stages.find((s) => s.id === selected)!;
  const deposit = scenario.sales - scenario.commission - (mismatch ? 500 : 0);
  const difference = reconcileSettlement(
    scenario.sales,
    deposit,
    scenario.commission,
  );
  return (
    <section id="trazabilidad" className="surface scroll-mt-6 overflow-hidden">
      <header className="border-b border-border p-5">
        <p className="eyebrow">Caso documental · Cafetería</p>
        <h2 className="mt-2 text-lg font-semibold">
          De la operación a la póliza
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Caso independiente del corte enero–junio. Ejemplo del documento, pp.
          27–32 y 36; no se suma a los indicadores del periodo.
        </p>
      </header>
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Venta", value: scenario.sales },
            { label: "Costo directo", value: scenario.cost },
            { label: "Comisión", value: scenario.commission },
            {
              label: "Contribución del ciclo",
              value: scenario.sales - scenario.cost - scenario.commission,
            },
          ].map((m) => (
            <div key={m.label} className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-2 text-xl font-semibold tabular-nums">
                {money(m.value)}
              </p>
            </div>
          ))}
        </div>
        <nav
          aria-label="Etapas del ciclo"
          className="my-6 flex flex-wrap gap-2"
        >
          {scenario.stages.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              aria-pressed={s.id === selected}
              className={`rounded-lg border px-3 py-2 text-xs transition-colors ${s.id === selected ? "border-primary bg-accent text-accent-foreground" : "border-border hover:bg-muted"}`}
            >
              <span className="mr-2 text-muted-foreground">{s.id}</span>
              {s.name}
            </button>
          ))}
        </nav>
        <div className="rounded-xl border border-border">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <FileText size={16} />
                {stage.evidence}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {stage.folio} · Evidencia ilustrativa
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs text-primary">
              <CheckCircle2 size={14} />
              Póliza balanceada
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="p-3">Cuenta propuesta</th>
                  <th className="p-3 text-right">Debe</th>
                  <th className="p-3 text-right">Haber</th>
                </tr>
              </thead>
              <tbody>
                {stage.entries.map((e, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3">
                      <span className="font-mono">{e.account}</span>
                      <span className="mt-1 block text-muted-foreground">
                        {e.label}
                      </span>
                    </td>
                    <td className="p-3 text-right tabular-nums">
                      {money(e.debit)}
                    </td>
                    <td className="p-3 text-right tabular-nums">
                      {money(e.credit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-medium">Conciliación de tarjeta</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              POS {money(scenario.sales)}{" "}
              <ArrowRight size={12} className="inline" /> Banco {money(deposit)}{" "}
              + comisión {money(scenario.commission)}
            </p>
            <p
              className={`mt-3 text-sm font-semibold ${difference ? "text-warning" : "text-primary"}`}
              role="status"
            >
              {difference
                ? `Diferencia por aclarar: ${money(difference)}`
                : "Sin diferencias"}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-medium">Inventario conciliado</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              100 recibidas − 60 vendidas = 40 unidades
            </p>
            <p className="mt-3 text-sm font-semibold">
              Valor final:{" "}
              {money((scenario.purchased - scenario.sold) * scenario.unitCost)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <DemoHelp>
            <button
              className="demo-action"
              onClick={() => setMismatch(!mismatch)}
            >
              {mismatch
                ? "Restaurar depósito correcto"
                : "Simular diferencia bancaria de $500"}
            </button>
          </DemoHelp>
        </div>
        <DemoHelp>
          Simulación de consulta: no emite pólizas ni ejecuta pagos. Las cuentas
          son propuestas del documento; los folios son ficticios.
        </DemoHelp>
      </div>
    </section>
  );
}
