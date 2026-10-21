"use client";
import { DemoControls } from "./demo-controls";
import { useAppSelector } from "@/store/hooks";
export function DemoWidget() {
  const role = useAppSelector((s) => s.auth.session?.role ?? null);
  return (
    <DemoControls>
      <p className="text-xs opacity-85">
        {role === "admin"
          ? "Perfil administrador: nombres y ubicaciones completos."
          : "Perfil de consulta: nombres protegidos con un prefijo ofuscado y un alias. Las ubicaciones permanecen reservadas."}
      </p>
    </DemoControls>
  );
}
