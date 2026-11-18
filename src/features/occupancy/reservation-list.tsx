import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { bookingLabels, type Reservation } from "./model";
export type ReservationRow = Reservation & {
  spaceName: string;
  venueName: string;
};
export function ReservationList({
  rows,
  label,
  money,
  showDates = false,
}: {
  showDates?: boolean;
  rows: ReservationRow[];
  label: string;
  money: (cents: number) => string;
}) {
  return (
    <section className="surface min-w-0 p-5" aria-live="polite">
      <div className="mb-5 flex items-center gap-2">
        <CalendarDays size={18} className="text-primary" />
        <h3 className="font-semibold">Agenda · {label}</h3>
      </div>
      {!rows.length ? (
        <p className="rounded-xl bg-muted p-5 text-sm text-muted-foreground">
          Sin reservas registradas para la selección de fechas y los filtros seleccionados.
        </p>
      ) : (
        <ul className="max-h-[36rem] space-y-3 overflow-y-auto pr-1">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-semibold">{r.spaceName}</h4>
                <span
                  className={`rounded-full px-2 py-1 text-[11px] ${r.status === "confirmed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {bookingLabels[r.status]}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {r.venueName} · {r.option}
              </p>
              <p className="mt-3 text-sm">{r.event}</p>
              <p className="mt-2 flex items-center gap-2 text-xs">
                <Clock3 size={14} />
                {showDates && `${r.date.split("-").reverse().join("/")} · `}{r.start}–{r.end}
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs">
                <UserRound size={14} />
                Reservó: {r.bookedBy}
              </p>
              <dl className="mt-3 grid gap-2 border-t border-border pt-3 text-xs sm:grid-cols-3">
                <div><dt className="text-muted-foreground">Importe de referencia</dt><dd className="mt-1 font-medium">{r.amountCents === null ? "Por confirmar" : money(r.amountCents)}</dd></div>
                {r.status === "confirmed" && <>
                  <div><dt className="text-muted-foreground">Cobrado</dt><dd className="mt-1 font-medium">{money(r.paidCents)}</dd></div>
                  <div><dt className="text-muted-foreground">Pendiente</dt><dd className="mt-1 font-medium">{r.amountCents === null ? "Por confirmar" : money(r.amountCents - r.paidCents)}</dd></div>
                </>}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
