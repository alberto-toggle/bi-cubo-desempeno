import type {
  Venue,
  EventSpace,
  RentalOption,
} from "@/features/occupancy/model";
import catalog from "@/data/master-units.json";
// Names/areas/capacities/tariffs transcribed from IMG-20261113-WA0123.jpg.
// Catalog association is explicit: no name-based fuzzy joins.
const venue = (unitId: string, hotel = false): Venue => {
  const unit = catalog.units.find((u) => u.id === unitId);
  if (!unit) throw new Error(`Instalación sin catálogo: ${unitId}`);
  return { id: unitId, unitId, name: unit.name, hotel };
};
export const eventVenues: Venue[] = [
  venue("unit-018", true),
  venue("unit-011"),
  venue("unit-016"),
  venue("unit-019", true),
  venue("unit-038", true),
  venue("unit-030"),
  venue("unit-099"),
  venue("unit-055", true),
  venue("unit-081"),
  {
    id: "pending-puebla",
    unitId: null,
    hotel: false,
    name: "Restaurante Bicentenario del Hco. Col. Mil. · Puebla",
    note: "Vinculación pendiente: el catálogo contiene Restaurante Puebla; equivalencia por confirmar.",
  },
];
const option = (
  name: string,
  area: number,
  capacity: number | null,
  priceCents: number | null,
): RentalOption => ({ name, area, capacity, priceCents });
const space = (
  id: string,
  venueId: string,
  name: string,
  area: number,
  capacity: number | null,
  price: number,
): EventSpace => ({
  id,
  venueId,
  name,
  options: [option("Completo", area, capacity, price)],
});
export const eventSpaces: EventSpace[] = [
  space("revolucion", "unit-018", "Revolución", 81, 60, 497970),
  space("independencia", "unit-018", "Independencia", 104, 100, 644380),
  space("jardin", "unit-018", "Jardín", 310, 100, 660000),
  space(
    "terraza-restaurante",
    "unit-018",
    "Terraza del restaurante",
    180,
    100,
    644380,
  ),
  space("pavorreal", "unit-018", "Pavorreal", 55, 25, 219670),
  {
    id: "republica",
    venueId: "unit-018",
    name: "República",
    options: [
      option("Completo", 1200, 700, 888250),
      option("¼ de salón", 279, 160, 222063),
    ],
  },
  space("victoria", "unit-011", "Victoria", 122, 30, 279400),
  space("colibri", "unit-016", "Colibrí", 103, 60, 288200),
  space("mirador", "unit-016", "Mirador", 90, 30, 279400),
  space("centenario", "unit-019", "Centenario", 67, 40, 266200),
  space("escuadron", "unit-038", "Escuadrón 201", 184, 100, 219670),
  space(
    "fuerza-aerea",
    "unit-030",
    "Fuerza Aérea Expedicionaria",
    1200,
    300,
    559450,
  ),
  space("cenzontle", "unit-099", "Cenzontle", 468, 240, 399300),
  space("lounge", "unit-055", "Sala Lounge", 70, 30, 279400),
  space("terraza-bicentenario", "unit-055", "Terraza", 68, 40, 266200),
  space("patria", "unit-081", "Patria", 84, 30, 199650),
  // Conservative shared resource: combined/partial bookings block this same space.
  {
    id: "puebla",
    venueId: "pending-puebla",
    name: "Salón y terraza",
    options: [
      option("Salón", 341, 140, 465850),
      option("Terraza", 137, null, 266200),
      option("Salón y terraza", 478, null, null),
    ],
  },
];
export const hotelVenues = eventVenues.filter((v) => v.hotel);
