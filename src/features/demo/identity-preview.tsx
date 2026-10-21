"use client";
import { ShieldCheck } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { presentIdentity } from "./identity-policy";
import { effectiveIdentity } from "@/features/intelligence/model";
import establishments from "./establishments.json";
export function IdentityPreview() {
  const mode = useAppSelector((s) =>
    effectiveIdentity(s.auth.session?.role ?? null),
  );
  return (
    <section
      className="surface overflow-hidden"
      aria-labelledby="identity-title"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <h2 id="identity-title" className="font-semibold">
            Perspectiva de establecimientos
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Ejemplos ficticios · La identidad visible depende del nivel de
            acceso.
          </p>
        </div>
        <span className="pill gap-2" role="status">
          <ShieldCheck size={14} />
          {mode === "full" ? "Datos completos" : "Identidad protegida"}
        </span>
      </header>
      <ul className="divide-y divide-border">
        {establishments.map((item) => {
          const view = presentIdentity(item, mode);
          return (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium">{view.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {view.location}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {item.activity}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
