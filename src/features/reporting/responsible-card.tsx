import { UserRound } from "lucide-react";
import type { ReportProfile } from "./model";
export function ResponsibleCard({
  name,
  appointed,
  staff,
}: {
  name: string;
  appointed: string;
  staff: ReportProfile["staff"];
}) {
  return (
    <aside className="surface self-start p-5">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
        <UserRound size={28} />
      </div>
      <p className="eyebrow">Gerente / responsable</p>
      <h3 className="mt-2 font-semibold">{name}</h3>
      <dl className="mt-5 space-y-4 text-sm">
        {[
          ["Grado", staff.rank],
          ["Matrícula", staff.registration],
          ["Alta en el servicio", staff.joined],
          ["Nombramiento", appointed],
          ["Inicio de operaciones", staff.operationsStarted],
          [
            "Efectivo",
            `${staff.officers} ${staff.officers === 1 ? "oficial" : "oficiales"} · ${staff.troops} de tropa`,
          ],
          ["Personal civil", `${staff.civilians} personas`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
