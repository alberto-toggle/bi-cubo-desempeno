"use client";
import { DemoControls } from "./demo-controls";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { identityModes, type IdentityMode } from "./identity-policy";
import { effectiveIdentity } from "@/features/intelligence/model";
import { setIdentityMode } from "./demo-slice";
export function DemoWidget() {
  const role = useAppSelector((s) => s.auth.session?.role ?? null);
  const mode = useAppSelector((s) =>
      effectiveIdentity(role, s.demo.identityMode),
    ),
    dispatch = useAppDispatch();
  return (
    <DemoControls>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">
          Visibilidad de datos · {role === "admin" ? "Administrador" : "Staff"}
        </legend>
        <div className="space-y-2">
          {identityModes
            .filter((o) => role === "admin" || o.id !== "full")
            .map((o) => (
              <label className="demo-option" key={o.id}>
                <input
                  type="radio"
                  name="identity-mode"
                  checked={mode === o.id}
                  onChange={() =>
                    dispatch(setIdentityMode(o.id as IdentityMode))
                  }
                />
                <span>
                  <span className="block font-medium">{o.label}</span>
                  <span className="mt-1 block text-xs opacity-80">
                    {o.description}
                  </span>
                </span>
              </label>
            ))}
        </div>
      </fieldset>
      <p className="text-xs opacity-85">
        {role === "admin"
          ? "Este perfil puede consultar nombres y ubicaciones."
          : "Este perfil no puede consultar nombres ni ubicaciones. La restricción también se aplica a búsquedas y exportaciones."}
      </p>
    </DemoControls>
  );
}
