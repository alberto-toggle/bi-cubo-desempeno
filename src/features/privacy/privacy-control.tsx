"use client";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { toggleAmounts } from "./privacy-slice";
import { useFinancialPrivacy } from "./use-financial-privacy";
export function PrivacyControl() {
  const { hidden, canViewAmounts } = useFinancialPrivacy();
  const dispatch = useAppDispatch();
  if (!canViewAmounts) return null;
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs"
      aria-pressed={hidden}
      aria-label={hidden ? "Mostrar cifras" : "Ocultar cifras"}
      onClick={() => dispatch(toggleAmounts())}
    >
      {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
      <span className="hidden sm:inline">
        {hidden ? "Mostrar cifras" : "Ocultar cifras"}
      </span>
    </button>
  );
}
export function PrivateChartNotice() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      <EyeOff size={22} />
      <p>Cifras ocultas</p>
      <p className="text-xs">
        Activa «Mostrar cifras» para consultar esta información.
      </p>
    </div>
  );
}
