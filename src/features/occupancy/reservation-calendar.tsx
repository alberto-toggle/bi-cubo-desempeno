import { dateKey, monthDays, type OccupancyPeriod } from "./model";
export function ReservationCalendar({
  period,
  day,
  counts,
  onSelect,
}: {
  period: OccupancyPeriod;
  day: number;
  counts: Record<string, number>;
  onSelect: (day: number) => void;
}) {
  const offset =
    (new Date(Date.UTC(period.year, period.month - 1, 1)).getUTCDay() + 6) % 7;
  const label = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(period.year, period.month - 1, 1)));
  return (
    <section
      className="surface min-w-0 p-4 sm:p-5"
      aria-label={`Calendario de reservas · ${label}`}
    >
      <h3 className="mb-4 font-semibold capitalize">{label}</h3>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
          <span
            key={i}
            className="py-2 text-xs text-muted-foreground"
            aria-hidden="true"
          >
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: monthDays(period) }, (_, i) => i + 1).map((d) => {
          const count = counts[dateKey(period, d)] ?? 0;
          return (
            <button
              key={d}
              type="button"
              onClick={() => onSelect(d)}
              aria-pressed={d === day}
              aria-label={`${d} de ${label}, ${count} reservas confirmadas`}
              className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${d === day ? "border-primary bg-primary text-primary-foreground" : count ? "border-primary/25 bg-primary/10 text-foreground hover:bg-primary/20" : "border-transparent hover:bg-muted"}`}
            >
              <span className="font-medium tabular-nums">{d}</span>
              <span className="h-3 text-[10px] tabular-nums">
                {count ? `${count} res.` : ""}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Días resaltados: reservas confirmadas. Toca un día para consultar los
        horarios. Un día con reserva puede tener horas libres.
      </p>
    </section>
  );
}
