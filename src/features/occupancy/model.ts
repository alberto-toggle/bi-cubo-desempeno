export type RentalOption = {
  name: string;
  area: number;
  capacity: number | null;
  priceCents: number | null;
};
export type EventSpace = {
  id: string;
  venueId: string;
  name: string;
  options: RentalOption[];
};
export type Venue = {
  id: string;
  unitId: string | null;
  name: string;
  hotel: boolean;
  note?: string;
};
export type BookingStatus = "confirmed" | "tentative" | "cancelled";
export type Reservation = {
  id: string;
  spaceId: string;
  date: string;
  start: string;
  end: string;
  bookedBy: string;
  alias: string;
  event: string;
  status: BookingStatus;
  option: string;
  amountCents: number | null;
  paidCents: number;
};
export type Stay = {
  id: string;
  venueId: string;
  guest: string;
  alias: string;
  room: string;
  expectedArrival: string;
  expectedDeparture: string;
  actualArrival: string | null;
  actualDeparture: string | null;
};
export type OccupancyPeriod = { year: number; month: number };
export const monthDays = ({ year, month }: OccupancyPeriod) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();
export const dateKey = ({ year, month }: OccupancyPeriod, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
export function occupancy(
  spaces: EventSpace[],
  bookings: Reservation[],
  period: OccupancyPeriod,
  date: string,
) {
  const ids = new Set(spaces.map((s) => s.id));
  const prefix = dateKey(period, 1).slice(0, 7);
  const confirmed = bookings.filter(
    (b) =>
      ids.has(b.spaceId) &&
      b.date.startsWith(prefix) &&
      b.status === "confirmed",
  );
  const reserved = new Set(
    confirmed.filter((b) => b.date === date).map((b) => b.spaceId),
  ).size;
  const occupiedDays = new Set(confirmed.map((b) => `${b.spaceId}/${b.date}`))
    .size;
  return {
    total: spaces.length,
    reserved,
    available: spaces.length - reserved,
    datePercent: spaces.length ? (reserved / spaces.length) * 100 : 0,
    monthPercent: spaces.length
      ? (occupiedDays / (spaces.length * monthDays(period))) * 100
      : 0,
    occupiedDays,
    confirmed: confirmed.length,
  };
}
export function stayStatus(stay: Stay, now: string) {
  if (stay.actualDeparture) return "Salida registrada";
  if (stay.actualArrival)
    return stay.expectedDeparture < now ? "Salida pendiente" : "En estancia";
  return stay.expectedArrival < now ? "Arribo pendiente" : "Por llegar";
}
export const bookingLabels: Record<BookingStatus, string> = {
  confirmed: "Confirmada",
  tentative: "Por confirmar",
  cancelled: "Cancelada",
};

/** Only confirmed bookings create contracted rental income in this demo. */
export function rentalIncome(bookings: Reservation[]) {
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const contracted = confirmed.reduce((sum, b) => sum + (b.amountCents ?? 0), 0);
  const collected = confirmed.reduce((sum, b) => sum + b.paidCents, 0);
  return { contracted, collected, pending: contracted - collected,
    unpriced: confirmed.filter((b) => b.amountCents === null).length };
}
