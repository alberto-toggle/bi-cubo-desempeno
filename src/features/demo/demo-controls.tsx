"use client";
import "./demo-materials.css";
import { Popover } from "@base-ui/react/popover";
import { FlaskConical, X } from "lucide-react";
import { useDemoPreferences } from "./use-demo-preferences";
export function DemoHelp({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { preferences } = useDemoPreferences();
  return preferences.showHelp ? (
    <div className={`demo-help ${className}`}>
      <span className="demo-label">Demo</span>
      {children}
    </div>
  ) : null;
}
export function DemoControls({ children }: { children: React.ReactNode }) {
  const { preferences, update } = useDemoPreferences();
  return (
    <Popover.Root>
      <Popover.Trigger className="demo-trigger">
        <FlaskConical size={16} />
        Demo
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          align="end"
          sideOffset={12}
          className="z-50"
        >
          <Popover.Popup className="demo-popup">
            <div className="flex items-center justify-between gap-3">
              <Popover.Title className="font-semibold text-sm">
                Controles de demostración
              </Popover.Title>
              <Popover.Close aria-label="Cerrar ayudas demo" className="p-1">
                <X size={16} />
              </Popover.Close>
            </div>
            <label className="demo-option my-4">
              <input
                type="checkbox"
                checked={preferences.showHelp}
                onChange={(e) => update({ showHelp: e.target.checked })}
              />
              <span>Mostrar controles y ayudas</span>
            </label>
            {preferences.showHelp && (
              <div className="space-y-4">{children}</div>
            )}
            <Popover.Description className="mt-4 text-xs opacity-80">
              Simulación con datos ficticios. Preferencias guardadas en este
              navegador.
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
