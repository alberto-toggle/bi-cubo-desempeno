"use client";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { sportsColors } from "./report-palette";

/** Presentación reutilizable: recibe importes ya formateados y respeta el enmascarado del padre. */
export function IncomeBreakdownCard({
  label,
  total,
  background,
  title,
  period,
  items,
}: {
  label: string;
  total: string;
  background: string;
  title: string;
  period: string;
  items: { label: string; value: string }[];
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="rounded-xl p-6 text-left text-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        style={{ background }}
      >
        <span className="block font-medium">{label}</span>
        <span className="mt-3 block text-3xl font-semibold tabular-nums">
          {total}
        </span>
        <span className="mt-3 block text-xs">Ver desglose por categoría</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl transition-[opacity,scale] duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 motion-reduce:transition-none sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-muted-foreground">
                {period} · Importes simulados · MXN
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Cerrar desglose"
              className="shrink-0 rounded-lg p-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              <X size={20} />
            </Dialog.Close>
          </div>
          <dl className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3 text-center"
                style={{
                  background: sportsColors.breakdownSurface,
                  color: sportsColors.positive,
                }}
              >
                <dt
                  className="text-[11px] font-semibold leading-tight"
                  style={{ color: sportsColors.breakdownLabel }}
                >
                  {item.label}
                </dt>
                <dd className="mt-2 text-xl font-semibold tabular-nums">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex justify-between gap-4 border-t border-border pt-4 text-sm">
            <span>Total</span>
            <strong className="tabular-nums">{total}</strong>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
