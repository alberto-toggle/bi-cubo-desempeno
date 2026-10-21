/** Reproducible simulation. Documented identities and generated figures stay separate. */
import { readFileSync, writeFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const masters = JSON.parse(
  readFileSync(new URL("src/data/master-units.json", root)),
);
const taxonomy = JSON.parse(
  readFileSync(new URL("src/data/master-taxonomy.json", root)),
);
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
const templates = {
  COM: [
    "CN-COM-001",
    "Venta minorista general",
    "CC-ALM",
    "Almacén e inventarios",
    "SUB-COM-002",
    "Abarrotes y bebidas",
  ],
  AGR: [
    "CN-AGR-002",
    "Producción pecuaria",
    "CC-PEC",
    "Producción pecuaria",
    "SUB-AGR-003",
    "Ganado bovino",
  ],
  DEP: [
    "CN-DEP-001",
    "Membresías y accesos",
    "CC-DEP",
    "Instalaciones deportivas",
    "SUB-DEP-002",
    "Membresía familiar",
  ],
  AYB: [
    "CN-AYB-001",
    "Restaurante",
    "CC-COC",
    "Cocina y preparación",
    "SUB-AYB-001",
    "Servicio a la carta",
  ],
  HOS: [
    "CN-HOS-001",
    "Habitaciones",
    "CC-HAB",
    "Habitaciones",
    "SUB-HOS-001",
    "Habitación sencilla",
  ],
  REC: [
    "CN-REC-001",
    "Cine y taquilla",
    "CC-OPE",
    "Operación principal",
    "SUB-REC-001",
    "Entrada general",
  ],
  EVE: [
    "CN-EVE-001",
    "Renta de salones y espacios",
    "CC-ARE",
    "Áreas comunes",
    "SUB-EVE-002",
    "Renta por evento",
  ],
  ARR: [
    "CN-ARR-001",
    "Renta de locales",
    "CC-ARE",
    "Áreas comunes",
    "SUB-ARR-001",
    "Renta fija",
  ],
  MOV: [
    "CN-MOV-001",
    "Estacionamiento por rotación",
    "CC-EST",
    "Operación de estacionamiento",
    "SUB-MOV-001",
    "Cobro por hora",
  ],
  FUN: [
    "CN-FUN-001",
    "Servicios funerarios",
    "CC-OPE",
    "Operación principal",
    "SUB-FUN-001",
    "Paquete funerario",
  ],
  LOG: [
    "CN-LOG-001",
    "Almacenamiento",
    "CC-ALM",
    "Almacén e inventarios",
    "SUB-LOG-001",
    "Almacenamiento y custodia",
  ],
  INS: [
    "CN-INS-001",
    "Servicios sociales",
    "CC-ADM",
    "Administración y dirección",
    "SUB-INS-001",
    "Atención social",
  ],
};
const coffee = [
  "CN-AYB-002",
  "Cafetería",
  "CC-COC",
  "Cocina y preparación",
  "SUB-AYB-006",
  "Alimentos rápidos y repostería",
];
const units = masters.units.map((master, i) => {
  const seg = master.segmentCode;
  let main = templates[seg];
  if (master.kind === "Cafetería") main = coffee;
  if (master.kind === "Boliche")
    main = [
      "CN-REC-002",
      "Boliche",
      "CC-OPE",
      "Operación principal",
      "SUB-REC-003",
      "Renta de pista",
    ];
  if (master.kind.includes("agrícola"))
    main = [
      "CN-AGR-001",
      "Producción agrícola",
      "CC-AGR",
      "Producción agrícola",
      "SUB-AGR-001",
      "Granos y forrajes",
    ];
  if (master.kind === "Centinela 24 horas")
    main = [
      "CN-COM-003",
      "Venta de conveniencia 24 horas",
      "CC-ALM",
      "Almacén e inventarios",
      "SUB-COM-006",
      "Conveniencia 24 horas",
    ];
  const definitions = [{ segment: seg, template: main }];
  if (["DEP", "HOS", "INS"].includes(seg))
    definitions.push({ segment: "AYB", template: coffee });
  if (seg === "DEP")
    definitions.push({ segment: "EVE", template: templates.EVE });
  if (seg === "ARR")
    definitions.push({ segment: "MOV", template: templates.MOV });
  const centers = definitions.map(({ segment, template }, ci) => {
    const [code, name, costCenterCode, costCenter, sublineCode, subline] =
      template;
    const base =
      (ci ? 36000 : seg === "HOS" ? 480000 : seg === "AGR" ? 220000 : 85000) +
      ((i * 13879) % 170000);
    return {
      id: `${master.id}-center-${ci + 1}`,
      code,
      name,
      segment: taxonomy.segments[segment],
      costCenterCode,
      costCenter,
      sublineCode,
      subline,
      monthly: months.map((month, mi) => {
        const revenue = Math.round(
          base * (0.81 + mi * 0.045 + ((i * 7 + mi * 11) % 19) / 100),
        );
        const cost = Math.round(revenue * (0.48 + ((i + ci * 3) % 27) / 100));
        return { month, revenue, cost };
      }),
    };
  });
  const monthly = months.map((month) => ({
    month,
    ...centers.reduce(
      (a, c) => {
        const m = c.monthly.find((x) => x.month === month);
        return { revenue: a.revenue + m.revenue, cost: a.cost + m.cost };
      },
      { revenue: 0, cost: 0 },
    ),
  }));
  const revenue = monthly.reduce((a, m) => a + m.revenue, 0);
  const operations =
    seg === "HOS"
      ? [
          {
            label: "Habitaciones disponibles",
            value: String(40 + (i % 50)),
            unit: "habitaciones",
          },
          {
            label: "Ocupación promedio",
            value: String(58 + (i % 29)),
            unit: "%",
          },
          {
            label: "Estancia promedio",
            value: (1.8 + (i % 4) * 0.3).toFixed(1),
            unit: "noches",
          },
        ]
      : seg === "DEP"
        ? [
            {
              label: "Membresías vigentes",
              value: String(480 + i * 17),
              unit: "membresías",
            },
            {
              label: "Accesos registrados",
              value: String(12000 + i * 187),
              unit: "accesos",
            },
            {
              label: "Utilización promedio",
              value: String(52 + (i % 35)),
              unit: "%",
            },
          ]
        : seg === "AGR"
          ? [
              {
                label: "Producción registrada",
                value: String(18000 + i * 431),
                unit: "kg",
              },
              {
                label: "Merma registrada",
                value: (1.2 + (i % 6) * 0.2).toFixed(1),
                unit: "%",
              },
              {
                label: "Lotes con trazabilidad",
                value: String(24 + (i % 16)),
                unit: "lotes",
              },
            ]
          : [
              {
                label:
                  seg === "ARR"
                    ? "Contratos vigentes"
                    : "Operaciones registradas",
                value: String(
                  seg === "ARR"
                    ? 20 + (i % 25)
                    : Math.floor(revenue / (180 + i * 13)),
                ),
                unit: seg === "ARR" ? "contratos" : "operaciones",
              },
              {
                label:
                  seg === "ARR"
                    ? "Ocupación de locales"
                    : "Ingreso promedio por operación",
                value:
                  seg === "ARR"
                    ? String(68 + (i % 24))
                    : (
                        revenue /
                        Math.max(1, Math.floor(revenue / (180 + i * 13)))
                      ).toFixed(2),
                unit: seg === "ARR" ? "%" : "MXN",
              },
              {
                label: "Disponibilidad del servicio",
                value: (96 + (i % 30) / 10).toFixed(1),
                unit: "%",
              },
            ];
  return {
    ...master,
    alias: `Unidad ${String(i + 1).padStart(3, "0")}`,
    status: i % 9 === 4 ? "Por conciliar" : "Al día",
    monthly,
    centers,
    operations,
  };
});
writeFileSync(
  new URL("public/demo/portfolio.json", root),
  JSON.stringify(
    {
      updatedAt: "30 jun 2026 · corte simulado",
      provenance: {
        identities: masters.source,
        pages: "5–6",
        figures: "Simulación reproducible; no son resultados institucionales",
        reconciliation:
          "La relación de 86 renglones requiere homologación. No se sumó al padrón propuesto.",
      },
      units,
    },
    null,
    2,
  ) + "\n",
);
console.log(`Generated ${units.length} units with reconciled center totals`);
