/** Public stock photos for the demo, never photographs of the actual units or staff.
 * Sources are recorded in public/images/demo/SOURCES.md.
 */
const unitPhotos: Record<string, string> = {
  Tienda: "store",
  "Centinela 24 horas": "store",
  "Centro comercial": "store",
  Hotel: "hotel",
  Restaurante: "restaurant",
  "Corredor gastronómico": "restaurant",
  Cafetería: "cafe",
  "Granja agropecuaria": "farm",
  "Predio agrícola": "farm",
  Criadero: "horses",
  "Centro ecuestre": "horses",
  "Centro deportivo": "sports",
  Cine: "cinema",
  Estacionamiento: "parking",
};
export function demoUnitPhoto(kind: string): string | undefined {
  const photo = unitPhotos[kind];
  return photo ? `/images/demo/units/${photo}.jpg` : undefined;
}
export function demoResponsiblePhoto(unitId: string) {
  const index =
    Array.from(unitId).reduce(
      (sum, character) => sum + character.charCodeAt(0),
      0,
    ) % 6;
  return `/images/demo/people/person-${index}.jpg`;
}
