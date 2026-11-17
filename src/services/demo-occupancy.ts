import { eventSpaces, hotelVenues } from "@/features/demo/event-spaces";
import {
  bookingPeople,
  eventKinds,
  stayScenarios,
} from "@/features/demo/occupancy-fixtures";
import {
  dateKey,
  monthDays,
  type OccupancyPeriod,
  type Reservation,
  type Stay,
} from "@/features/occupancy/model";
/** Deterministic, local demo adapter. Replace with a repository/API without changing the views. */
export function demoReservations(period: OccupancyPeriod): Reservation[] {
  return eventSpaces.flatMap((space, index) => {
    const result: Reservation[] = [];
    for (let day = 1; day <= monthDays(period); day++) {
      if ((day + index + period.month) % 5 !== 0 && day !== 15) continue;
      const date = dateKey(period, day);
      const option = space.options[(day + index) % space.options.length];
      const status = (day + index) % 11 === 0 ? "cancelled"
        : (day + index) % 7 === 0 ? "tentative" : "confirmed";
      // Fictional payment scenarios: unpaid, deposit, or fully paid.
      const paidFraction = [0, 0.5, 1][(day + index) % 3];
      result.push({
        id: `${space.id}-${date}`,
        spaceId: space.id,
        date,
        start: index % 2 ? "16:00" : "09:00",
        end: index % 2 ? "21:00" : "14:00",
        bookedBy: bookingPeople[(day + index) % bookingPeople.length],
        alias: `Solicitante ${String(index + 1).padStart(2, "0")}`,
        event: eventKinds[(day + index) % eventKinds.length],
        status,
        option: option.name,
        amountCents: option.priceCents,
        paidCents: status === "confirmed" && option.priceCents !== null
          ? Math.round(option.priceCents * paidFraction) : 0,
      });
    }
    return result;
  });
}
export function demoStays(period: OccupancyPeriod): Stay[] {
  return hotelVenues.flatMap((venue, index) =>
    stayScenarios.map((s, i) => ({
      id: `${venue.id}-${period.year}-${period.month}-${i}`,
      venueId: venue.id,
      guest: s.guest,
      alias: `Visitante ${index + 1}${i + 1}`,
      room: s.room,
      expectedArrival: `${dateKey(period, s.arrival)}T10:00`,
      expectedDeparture: `${dateKey(period, s.departure)}T11:00`,
      actualArrival: s.checkedIn ? `${dateKey(period, s.arrival)}T10:20` : null,
      actualDeparture: s.checkedOut
        ? `${dateKey(period, s.departure)}T10:45`
        : null,
    })),
  );
}
