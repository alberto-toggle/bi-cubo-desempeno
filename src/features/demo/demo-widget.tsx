"use client";
import { DemoControls } from "./demo-controls";
import { useAppSelector } from "@/store/hooks";
export function DemoWidget() {
  const role = useAppSelector((s) => s.auth.session?.role ?? null);
  return (
    <DemoControls>
      <p className="text-xs opacity-85">
        {role === "admin"
          ? "Perfil administrador: datos ficticios y control de privacidad de cifras."
          : "Perfil staff: indicadores de desempeño sin importes financieros."}
      </p>
    </DemoControls>
  );
}
