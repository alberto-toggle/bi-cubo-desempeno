/** Colores documentales: independientes de la apariencia de la aplicación. */
export const reportPalette = {
  year: (year: number) =>
    ({ 2023: "#C0504D", 2024: "#F79646", 2025: "#9BBB59", 2026: "#BF9000" })[
      year
    ] ?? "#8FAADC",
  short: "#00B0F0",
  long: "#C55A11",
};
export const reportChapters = [
  { line: "Granjas", color: "#CCCC00" },
  { line: "Criadero", color: "#1D9A78" },
  { line: "Restaurante", color: "#8FAADC" },
  { line: "Hotel", color: "#FFC000" },
  { line: "Centro deportivo", color: "#E7D395" },
  { line: "Tiendas", color: "#00FFFF" },
  { line: "Centros comerciales", color: "#FF0000" },
  { line: "Estacionamiento", color: "#FF9999" },
  { line: "Centinelas", color: "#BFBFBF" },
  { line: "Centro de promoción social", color: "#F4B081" },
  { line: "Cafetería", color: "#00B0F0" },
  { line: "Corredor gastronómico", color: "#00FF00" },
  { line: "Boliche", color: "#DEC9A2" },
  { line: "Cine", color: "#FFFF00" },
  { line: "Predio agrícola", color: "#FF0000" },
  { line: "Centro ecuestre", color: "#00B050" },
  { line: "Servicio funerario", color: "#00B050" },
  { line: "Comida rápida", color: "#ED7D31" },
  { line: "Almacén", color: "#AE8420" },
] as const;
export const documentColors = [
  "#F4B081",
  "#FFC000",
  "#8FAADC",
  "#00B050",
  "#00B0F0",
  "#BFBFBF",
  "#9BBB59",
  "#FF9999",
  "#DEC9A2",
  "#CCCC00",
  "#1D9A78",
  "#D64A4A",
];
/** Correspondencias verificadas en las diapositivas; no renombra unidades ambiguas. */
export const unitDocumentColors: Record<string, string> = {
  "unit-079": "#5B9BD5",
  "unit-078": "#FFC000",
  "unit-076": "#FF9999",
  "unit-031": "#C55A11",
  "unit-077": "#00B050",
  "unit-080": "#00B0F0",
  "unit-073": "#CC00FF",
  "unit-034": "#FFE499",
  "unit-074": "#51EF24",
  "unit-095": "#92D050",
  "unit-094": "#9CC2E5",
  "unit-096": "#CC00FF",
  "unit-097": "#AEABAB",
  "unit-093": "#00FFFF",
  "unit-092": "#FFC000",
  "unit-100": "#CCCCFF",
  "unit-101": "#AEABAB",
  "unit-102": "#92D050",
  "unit-003": "#C4E0B2",
  "unit-006": "#FFFF00",
  "unit-011": "#00B050",
  "unit-016": "#F4B081",
  "unit-018": "#9CC2E5",
  "unit-019": "#92D050",
  "unit-024": "#BFBFBF",
  "unit-025": "#00B050",
  "unit-026": "#00FFFF",
  "unit-036": "#FFD865",
  "unit-037": "#00B050",
  "unit-038": "#FFD865",
  "unit-046": "#51EF19",
  "unit-054": "#D8E2F3",
  "unit-055": "#F4B081",
};
export const programDocumentColors: Record<string, string> = {
  "CARNE DE POLLO": "#00B050",
  AVICOLA: "#D64A4A",
  "CARNE DE RES": "#FFC000",
  BOVINOS: "#00B0F0",
  BOVINOS_CRIADERO: "#FF9999",
  "MAIZ PREDIO SARABIA": "#BFBFBF",
  NOGALES: "#BFBFBF",
  "CARNE DE CERDO": "#ED7D31",
  PORCINOS: "#00FFFF",
  ALFALFA: "#FF9999",
  "MIEL, HUEVO DE GODORNIZ": "#CCCCFF",
  "PRODUCTOS CARNICOS": "#D64A4A",
  "HUEVO ROJO": "#4472C4",
  "HUEVO BLANCO": "#00B0F0",
  AGRICOLA: "#ED7D31",
  OREGANO: "#FFC000",
  "CIERVO ROJO": "#FFFF00",
  OVINOS: "#00B050",
  "BISONTE AMERICANO": "#BF9000",
};
export function programColor(name: string, index: number) {
  return (
    programDocumentColors[
      name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
    ] ?? documentColors[index % documentColors.length]
  );
}

export const goalColors = {
  target: "#92D050",
  planned: "#D64A4A",
  actual: "#00FFFF",
};
export const sportsColors = {
  breakdownSurface: "#F0F8F5",
  breakdownLabel: "#616161",
  positiveSurface: "#C8E6C9",
  negativeSurface: "#FFCDD2",
  registrationSurface: "#BBDEFB",
  incomeBackground: "linear-gradient(110deg, #1B5E20, #43A047)",
  registrationBackground: "linear-gradient(110deg, #1565C0, #42A5F5)",
  positive: "#2E7D32",
  negative: "#C62828",
  registration: "#1976D2",
};

export const unitDocumentOrder: Record<string, readonly string[]> = {
  Centinelas: [
    "unit-074",
    "unit-034",
    "unit-073",
    "unit-080",
    "unit-077",
    "unit-031",
    "unit-076",
    "unit-078",
    "unit-079",
  ],
  "Cafeter\u00eda": [
    "unit-092",
    "unit-093",
    "unit-097",
    "unit-096",
    "unit-094",
    "unit-095",
  ],
  Cine: ["unit-102", "unit-101", "unit-100"],
  Hotel: ["unit-055", "unit-038", "unit-018", "unit-019"],
  "Centro deportivo": ["unit-016", "unit-036", "unit-037"],
  Tiendas: ["unit-024", "unit-026", "unit-003", "unit-025", "unit-054"],
};
export const programDocumentOrder: Record<string, readonly string[]> = {
  Granjas: [
    "Carne de pollo",
    "Avícola",
    "Carne de res",
    "Bovinos",
    "Carne de cerdo",
    "Porcinos",
    "Alfalfa",
    "Miel, huevo de godorniz",
    "Maíz predio Sarabia",
  ],
  Criadero: [
    "Productos cárnicos",
    "Huevo rojo",
    "Huevo blanco",
    "Agrícola",
    "Bovinos",
    "Orégano",
    "Ciervo rojo",
    "Ovinos",
    "Bisonte americano",
    "Nogales",
  ],
};

export const documentTableColors = {
  header: "#C00000",
  headerText: "#FFFFFF",
  text: "#111111",
  occupancy: "#FEF2CC",
};

/** Titulares de las diapositivas para reconocer cada sección del reporte. */
export const chapterTitles: Record<string, string> = {
  Granjas: "Utilidades generadas por programa productivo de las granjas",
  Criadero: "Utilidades generadas por programa productivo del C.M.G.",
  Restaurante: "Utilidades generadas por los restaurantes",
  Hotel: "Utilidades generadas por los hoteles",
  "Centro deportivo": "Utilidades generadas por los deportivos",
  Tiendas: "Utilidades generadas por las tiendas",
  "Centros comerciales": "Utilidades generadas por los centros comerciales",
  Estacionamiento: "Utilidades generadas por los estacionamientos",
  Centinelas: "Utilidades generadas por los centinelas",
  Cafetería: "Utilidades generadas por las cafeterías",
  Cine: "Utilidades generadas por los cines",
};
