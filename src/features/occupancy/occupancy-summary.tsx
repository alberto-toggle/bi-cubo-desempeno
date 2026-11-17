"use client";
import Link from "next/link";
import { eventSpaces, eventVenues } from "@/features/demo/event-spaces";
import { demoReservations } from "@/services/demo-occupancy";
import { dateKey, occupancy, rentalIncome, type OccupancyPeriod } from "./model";
import { useOccupancyAccess } from "./use-occupancy-access";
import { ReportMetrics } from "@/features/reporting/report-layout";

export function OccupancySummary({ unitIds, period }: {
  unitIds: string[];
  period: OccupancyPeriod;
}) {
  const access = useOccupancyAccess();
  const venueIds = new Set(eventVenues.filter((v) => v.unitId && unitIds.includes(v.unitId)).map((v) => v.id));
  const spaces = eventSpaces.filter((s) => venueIds.has(s.venueId));
  if (!spaces.length) return null;
  const date = dateKey(period, 15);
  const bookings = demoReservations(period).filter((b) => spaces.some((s) => s.id === b.spaceId));
  const stats = occupancy(spaces, bookings, period, date);
  const income = rentalIncome(bookings);
  const upcoming = bookings.filter((b) => b.status === "confirmed" && b.date > date)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Salones y reservas</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Instalaciones filtradas · Corte simulado: {date.split("-").reverse().join("/")} · Reservas y pagos ficticios
          </p>
        </div>
        <Link className="secondary-button" href="/reports?chapter=salons">Consultar calendario y estancias →</Link>
      </header>
      <ReportMetrics items={[
        { label: "Salones reservados al corte", value: `${stats.reserved} / ${stats.total}`, note: "Con reserva confirmada para ese día" },
        { label: "Próximas reservas del mes", value: String(upcoming.length), note: "Después del día de corte" },
        { label: "Cobrado por renta", value: access.money(income.collected), note: "Reservas del mes seleccionado" },
        { label: "Pendiente de cobro", value: access.money(income.pending), note: "Solo reservas confirmadas con tarifa" },
      ]} />
      {upcoming.length > 0 && <ul className="surface divide-y divide-border px-4">
        {upcoming.slice(0, 3).map((booking) => {
          const space = spaces.find((s) => s.id === booking.spaceId)!;
          return <li key={booking.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
            <div><p className="font-medium">{space.name} · {booking.date.split("-").reverse().join("/")} · {booking.start}</p>
              <p className="text-xs text-muted-foreground">{eventVenues.find((v) => v.id === space.venueId)?.name}</p></div>
            <p className="text-xs text-muted-foreground">Reservó: {access.person(booking.bookedBy, booking.alias)}</p>
          </li>;
        })}
      </ul>}
    </section>
  );
}
