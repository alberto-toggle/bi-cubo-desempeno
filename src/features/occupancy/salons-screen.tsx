"use client";
import { useState } from "react";
import { eventSpaces, eventVenues } from "@/features/demo/event-spaces";
import { demoReservations } from "@/services/demo-occupancy";
import { FilterSelect } from "@/features/intelligence/filters";
import { ReportMetrics } from "@/features/reporting/report-layout";
import { dateKey, occupancy, rentalIncome, type OccupancyPeriod } from "./model";
import { PeriodPicker } from "./period-picker";
import { ReservationCalendar } from "./reservation-calendar";
import { ReservationList } from "./reservation-list";
import { SpaceCards } from "./space-cards";
import { useOccupancyAccess } from "./use-occupancy-access";
export function SalonsScreen({
  unitId,
  initialPeriod = { year: 2026, month: 9 },
}: {
  unitId?: string;
  initialPeriod?: OccupancyPeriod;
}) {
  const [period, setPeriod] = useState(initialPeriod),
    [day, setDay] = useState(15),
    [agendaDays, setAgendaDays] = useState(1),
    [venueId, setVenue] = useState(unitId ?? "all"),
    [spaceId, setSpace] = useState("all");
  const access = useOccupancyAccess();
  const venues = eventVenues.filter((v) => !unitId || v.unitId === unitId);
  const venueSpaces = eventSpaces.filter(
    (s) =>
      venues.some((v) => v.id === s.venueId) &&
      (venueId === "all" || s.venueId === venueId),
  );
  const spaces = venueSpaces.filter(
    (s) => spaceId === "all" || s.id === spaceId,
  );
  const reservations = demoReservations(period).filter((b) =>
    spaces.some((s) => s.id === b.spaceId),
  );
  const income = rentalIncome(reservations);
  const date = dateKey(period, day),
    stats = occupancy(spaces, reservations, period, date);
  const counts: Record<string, number> = {};
  reservations
    .filter((b) => b.status === "confirmed")
    .forEach((b) => {
      counts[b.date] = (counts[b.date] ?? 0) + 1;
    });
  const endDate = new Date(Date.UTC(period.year, period.month - 1, day + agendaDays - 1));
  const endPeriod = { year: endDate.getUTCFullYear(), month: endDate.getUTCMonth() + 1 };
  const end = dateKey(endPeriod, endDate.getUTCDate());
  const agendaReservations = endPeriod.month !== period.month || endPeriod.year !== period.year
    ? [...reservations, ...demoReservations(endPeriod).filter((b) => spaces.some((s) => s.id === b.spaceId))]
    : reservations;
  function showUpcoming(days: number) {
    const today = new Date();
    setPeriod({ year: today.getFullYear(), month: today.getMonth() + 1 });
    setDay(today.getDate());
    setAgendaDays(days);
  }
  const rows = agendaReservations
    .filter((b) => b.date >= date && b.date <= end)
    .map((b) => {
      const space = spaces.find((s) => s.id === b.spaceId)!;
      return {
        ...b,
        bookedBy: access.person(b.bookedBy, b.alias),
        spaceName: space.name,
        venueName: venues.find((v) => v.id === space.venueId)!.name,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Consulta de disponibilidad</p>
        <h2 className="mt-2 text-2xl font-semibold">Salones y reservas</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Calendario y solicitantes ficticios · Consulta de demostración, sin
          registrar reservas.
        </p>
      </header>
      <div className="surface flex flex-wrap items-end gap-3 p-4">
        <PeriodPicker value={period} onChange={(next) => { setPeriod(next); setDay(15); setAgendaDays(1); }} />
        {!unitId && (
          <FilterSelect
            label="Instalación con salones"
            value={venueId}
            onChange={(v) => {
              setVenue(v);
              setSpace("all");
            }}
            options={[
              { value: "all", label: "Todas las instalaciones" },
              ...venues.map((v) => ({ value: v.id, label: v.name })),
            ]}
          />
        )}
        <FilterSelect
          label="Salón"
          value={spaceId}
          onChange={setSpace}
          options={[
            { value: "all", label: "Todos los salones" },
            ...venueSpaces.map((s) => ({ value: s.id, label: s.name })),
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Accesos rápidos de agenda">
        <button type="button" className="secondary-button min-h-11" onClick={() => showUpcoming(1)}>Hoy</button>
        <button type="button" className="secondary-button min-h-11" onClick={() => showUpcoming(7)}>Próximos 7 días</button>
        <p className="w-full text-xs text-muted-foreground">Los accesos rápidos usan la fecha actual. Reservas y pagos de demostración.</p>
      </div>
      <ReportMetrics
        items={[
          {
            label: "Espacios consultados",
            value: String(stats.total),
            note: "Modalidades compartidas contadas una sola vez",
          },
          {
            label: "Reservados el día seleccionado",
            value: `${stats.reserved} / ${stats.total}`,
            note: `${stats.datePercent.toFixed(1)}% · ${date.split("-").reverse().join("/")}`,
          },
          {
            label: "Sin reserva confirmada ese día",
            value: String(stats.available),
            note: "Las solicitudes pendientes no bloquean disponibilidad",
          },
          {
            label: "Reservas confirmadas del mes",
            value: String(stats.confirmed),
            note: "Consulta horarios y solicitantes en el calendario",
          },
        ]}
      />
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <ReservationCalendar
          period={period}
          day={day}
          counts={counts}
          onSelect={(next) => { setDay(next); setAgendaDays(1); }}
        />
        <ReservationList
          money={access.money}
          rows={rows}
          showDates={agendaDays > 1}
          label={agendaDays > 1 ? `${date.split("-").reverse().join("/")} – ${end.split("-").reverse().join("/")}` : `${day}/${period.month}/${period.year}`}
        />
      </div>
      <section className="space-y-3">
        <h3 className="font-semibold">Ingresos por renta · mes seleccionado</h3>
        <ReportMetrics items={[
          { label: "Importe contratado", value: access.money(income.contracted), note: "Reservas confirmadas con tarifa disponible" },
          { label: "Cobrado", value: access.money(income.collected), note: "Anticipos y pagos simulados" },
          { label: "Pendiente de cobro", value: access.money(income.pending), note: "Importe contratado menos cobrado" },
          { label: "Por confirmar tarifa", value: String(income.unpriced), note: "Reservas excluidas de los importes" },
        ]} />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Importes y pagos simulados usando la tarifa de referencia por reserva, sin cargos adicionales.
          Canceladas y solicitudes por confirmar no suman ingresos. No se calculan utilidades.
        </p>
      </section>
      <SpaceCards spaces={spaces} venues={venues} money={access.money} />
    </div>
  );
}
