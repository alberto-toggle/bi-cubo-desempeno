import Link from "next/link";
import type { EventSpace, Venue } from "./model";
export function SpaceCards({
  spaces,
  venues,
  money,
}: {
  spaces: EventSpace[];
  venues: Venue[];
  money: (value: number) => string;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold">Espacios y tarifas</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Referencia 2026 de la imagen compartida. Base de cobro y condiciones
          por confirmar; no representa ingresos cobrados.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {spaces.map((s) => {
          const venue = venues.find((v) => v.id === s.venueId)!;
          return (
            <article key={s.id} className="surface p-5">
              <h4 className="font-semibold">{s.name}</h4>
              {venue.unitId ? (
                <Link
                  className="mt-1 block text-xs text-primary hover:underline"
                  href={`/establishments/${venue.unitId}`}
                >
                  {venue.name} ↗
                </Link>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  {venue.name}
                </p>
              )}
              {venue.note && (
                <p className="mt-3 rounded-lg bg-muted p-3 text-xs">
                  {venue.note}
                </p>
              )}
              <dl className="mt-4 space-y-3">
                {s.options.map((o) => (
                  <div key={o.name} className="border-t border-border pt-3">
                    <dt className="text-sm font-medium">{o.name}</dt>
                    <dd className="mt-1 text-xs text-muted-foreground">
                      {o.area} m² ·{" "}
                      {o.capacity === null
                        ? "Capacidad por confirmar"
                        : `${o.capacity} personas`}
                    </dd>
                    <dd className="mt-2 text-lg font-semibold tabular-nums">
                      {o.priceCents === null
                        ? "Tarifa por confirmar"
                        : money(o.priceCents)}
                    </dd>
                  </div>
                ))}
              </dl>
              {s.options.length > 1 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Modalidades del mismo espacio. En esta demo, una reserva
                  bloquea el conjunto para evitar duplicidades.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
