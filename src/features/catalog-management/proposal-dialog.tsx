"use client";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import {
  catalogRecords,
  type CatalogProposal,
  type CatalogRecord,
} from "./catalog-model";
export function ProposalDialog({
  record,
  category,
  onClose,
  onSave,
}: {
  record: CatalogRecord | null;
  category: string;
  onClose: () => void;
  onSave: (p: CatalogProposal) => void;
}) {
  const [name, setName] = useState(record?.name ?? "");
  const [code, setCode] = useState(record?.code ?? "");
  const [reason, setReason] = useState("");
  const [action, setAction] = useState<CatalogProposal["action"]>(
    record ? "Modificación" : "Alta",
  );
  const [error, setError] = useState("");
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-overlay backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-6 text-foreground shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold">
                {record ? "Proponer cambio" : "Proponer alta"}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {category} · Se guardará para validación. El catálogo base y los
                indicadores no se alteran hasta homologar el cambio.
              </Dialog.Description>
            </div>
            <Dialog.Close aria-label="Cerrar propuesta" className="p-1">
              <X size={18} />
            </Dialog.Close>
          </div>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !reason.trim() || !code.trim()) {
                setError("Completa nombre, clave y motivo.");
                return;
              }
              if (
                !record &&
                catalogRecords.some((r) => r.code === code.trim())
              ) {
                setError("La clave ya existe. Usa una clave nueva.");
                return;
              }
              onSave({
                id: crypto.randomUUID(),
                code: code.trim(),
                name: name.trim(),
                category,
                action,
                reason: reason.trim(),
                date: new Date().toISOString(),
              });
              onClose();
            }}
          >
            {record && (
              <fieldset className="flex gap-4 text-xs">
                <legend className="mb-2 text-muted-foreground">
                  Tipo de cambio
                </legend>
                {(["Modificación", "Inactivación"] as const).map((a) => (
                  <label key={a} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="action"
                      checked={action === a}
                      onChange={() => setAction(a)}
                    />
                    {a}
                  </label>
                ))}
              </fieldset>
            )}
            <label className="block text-xs">
              Clave propuesta
              <input
                required
                readOnly={!!record}
                maxLength={48}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="mt-2 w-full rounded-lg border border-border bg-background p-3 font-mono read-only:opacity-60"
              />
            </label>
            <label className="block text-xs">
              Nombre
              <input
                required
                maxLength={180}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background p-3"
              />
            </label>
            <label className="block text-xs">
              Motivo y observaciones
              <textarea
                required
                maxLength={1000}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-border bg-background p-3"
              />
            </label>
            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Propuesta local de demostración · Las bajas conservan la historia;
              no eliminan registros.
            </p>
            <div className="flex justify-end gap-2">
              <Dialog.Close className="secondary-button">Cancelar</Dialog.Close>
              <button type="submit" className="primary-button">
                Guardar propuesta
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
