import type {
  ChapterCell,
  ChapterTable,
  ChapterTablesData,
  ChapterUnitResult,
} from "@/features/reporting/chapter-tables-model";
import { percent } from "@/features/reporting/model";
import { demoUnitOperations } from "./demo-unit-operations";

const text = (...lines: string[]): ChapterCell => ({ type: "text", lines });
const money = (
  value: number,
  ratio?: number | null,
  note?: string,
): ChapterCell => ({ type: "money", value, percent: ratio, note });
/** Fictitious allocations reconcile in cents to the existing unit result. */
function allocate(value: number, weights: number[]) {
  let assigned = 0;
  return weights.map((weight, i) => {
    const part =
      i === weights.length - 1
        ? value - assigned
        : Math.round((value * weight) / 100);
    assigned += part;
    return part;
  });
}
/** Documentary column contracts with synthetic operational and financial details. */
export function demoChapterTables(
  line: string,
  rows: ChapterUnitResult[],
  year: number,
  month: number,
): ChapterTablesData {
  const hotel = line === "Hotel",
    restaurant = line === "Restaurante",
    sport = line === "Centro deportivo",
    mall = line === "Centros comerciales",
    parking = line === "Estacionamiento",
    cinema = line === "Cine",
    farm = line === "Granjas";
  const columns = [
    "Instalación",
    ...(restaurant
      ? ["Horarios"]
      : hotel || parking || cinema
        ? ["Capacidad"]
        : sport
          ? [
              "Capacidad y usuarios actuales",
              "Locales y salón",
              "Utilidad deportivo",
            ]
          : mall
            ? ["Locales y precio por m²", "Renta de locales / tienda"]
            : farm
              ? ["Utilidad acumulada"]
              : []),
    `Meta ${year}`,
  ];
  const occupancy: ChapterTablesData["occupancy"] = [];
  const supplementalRows: ChapterTable["rows"] = [];
  const mainRows = rows.map((row) => {
    const seed = Number(row.id.replace(/\D/g, "")) || 1;
    const d = demoUnitOperations(row.id, line, year, month);
    const cells: ChapterCell[] = [];
    let label = row.label;
    if (restaurant) {
      label += ` · ${d.capacity} comensales`;
      cells.push(
        text(
          "Lunes–viernes: 07:00–" + (seed % 2 ? "17:00" : "20:00"),
          "Sábado: 08:00–" + (seed % 2 ? "13:00" : "18:00"),
          seed % 3 ? "Domingo: 08:00–17:00" : "Domingo: cerrado",
        ),
      );
      const parts = allocate(row.value, [10 + (seed % 15), 90 - (seed % 15)]);
      supplementalRows.push({
        ...row,
        cells: [
          money(parts[0], percent(parts[0], row.value)),
          money(parts[1], percent(parts[1], row.value)),
          money(row.value, percent(row.value, row.value)),
        ],
      });
    }
    if (hotel) {
      cells.push(text(`${d.capacity} habitaciones`));
      // Weighted room-night occupancy: cumulative and single month are distinct.
      let occupied = 0,
        available = 0,
        current = 0;
      for (let m = 1; m <= month; m++) {
        const nights = d.capacity * new Date(year, m, 0).getDate();
        const used = Math.round(
          (nights * demoUnitOperations(row.id, line, year, m).occupancy) / 100,
        );
        occupied += used;
        available += nights;
        if (m === month) current = (used / nights) * 100;
      }
      occupancy.push({
        ...row,
        average: (occupied / available) * 100,
        current,
      });
    }
    if (sport) {
      const values = allocate(row.value, [6 + (seed % 8), 94 - (seed % 8)]);
      cells.push(
        text(`${d.active + 80} usuarios de capacidad`, `Actuales: ${d.active}`),
        money(
          values[0],
          percent(values[0], row.value),
          `${d.premises} locales / espacios`,
        ),
        money(values[1], percent(values[1], row.value)),
      );
    }
    if (mall) {
      const values = allocate(row.value, [40, 60]);
      cells.push(
        {
          type: "parts",
          parts: [
            {
              label: `${d.premises} locales · ${d.vacant} desocupados · Planta baja / m²`,
              value: d.rate * 100,
            },
            { label: "Planta alta / m²", value: (d.rate - 15) * 100 },
          ],
        },
        {
          type: "parts",
          parts: [
            {
              label: "Locales",
              value: values[0],
              percent: percent(values[0], row.value),
            },
            {
              label: "Tienda",
              value: values[1],
              percent: percent(values[1], row.value),
            },
          ],
        },
      );
    }
    if (parking) {
      const accessible = 2 + (seed % 3),
        motorcycles = 4 + (seed % 4),
        bicycles = 6 + (seed % 5),
        electric = 2,
        fixed = 8 + (seed % 6);
      const publicSpaces =
        d.capacity - accessible - motorcycles - bicycles - electric - fixed;
      cells.push(
        text(
          `${d.capacity} espacios en total`,
          `${publicSpaces} público general · ${fixed} cuota fija`,
          `${accessible} accesibles · ${motorcycles} motocicletas`,
          `${bicycles} bicicletas · ${electric} con carga eléctrica`,
        ),
      );
    }
    if (cinema) {
      const vip = 8 + (seed % 10),
        first = Math.floor((d.capacity - vip) / 2),
        second = d.capacity - vip - first;
      cells.push(
        text(
          `Sala 1: ${first} personas`,
          `Sala 2: ${second} personas`,
          `Área VIP: ${vip} personas`,
          `Total: ${d.capacity} personas`,
        ),
      );
      const values = allocate(row.value, [82, 8, 6, 4]);
      supplementalRows.push({
        ...row,
        cells: [
          money(values[1]),
          money(values[2]),
          money(values[3]),
          money(values[1] + values[2] + values[3]),
        ],
      });
    }
    if (farm) cells.push(money(row.value));
    cells.push(
      money(row.target, percent(row.value, row.target), "Avance de meta"),
    );
    return { ...row, label, cells };
  });
  const target = rows.reduce((s, r) => s + r.target, 0),
    actual = rows.reduce((s, r) => s + r.value, 0),
    advance = percent(actual, target);
  return {
    main: {
      title: restaurant
        ? "Instalaciones, horarios y metas"
        : hotel
          ? "Instalaciones, capacidad y metas"
          : sport
            ? "Capacidad, utilidades y metas"
            : mall
              ? "Locales, arrendamiento y metas"
              : parking || cinema
                ? "Capacidad y metas"
                : farm
                  ? "Utilidades acumuladas y metas"
                  : "Instalaciones y metas",
      description:
        "El porcentaje de avance es la utilidad acumulada dividida entre la meta anual. Importes y datos operativos simulados.",
      columns,
      rows: mainRows,
    },
    supplementary: restaurant
      ? {
          title: "Restaurantes / salones",
          description:
            "Porcentajes de participación en la utilidad total de cada instalación. Los componentes suman 100%; no son porcentajes de avance de meta.",
          columns: [
            "Instalación",
            "Utilidad rentas de salones",
            "Utilidad restaurante",
            "Total de utilidades",
          ],
          rows: supplementalRows,
        }
      : cinema
        ? {
            title: "Renta de sala, visitas escolares y matinée",
            description:
              "Desglose incluido en las utilidades del cine; no se suma nuevamente al resultado.",
            columns: [
              "Instalación",
              "Renta de sala",
              "Visitas escolares",
              "Matinée",
              "Total de servicios",
            ],
            rows: supplementalRows,
          }
        : null,
    occupancy,
    target,
    actual,
    advance,
    pending: advance === null ? null : Math.max(0, 100 - advance),
  };
}
