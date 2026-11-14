/** Fictional allocations of net profit, not expenses already deducted from it. */
export const demoFundProjects = [
  {
    id: "social-school",
    name: "Apoyo a equipamiento escolar",
    category: "Obra social",
    spentWeight: 12,
    committedWeight: 8,
  },
  {
    id: "social-hospital",
    name: "Apoyo a un hospital comunitario",
    category: "Obra social",
    spentWeight: 8,
    committedWeight: 12,
  },
  {
    id: "new-store",
    name: "Construcción de una nueva tienda",
    category: "Infraestructura",
    spentWeight: 10,
    committedWeight: 30,
  },
  {
    id: "bowling",
    name: "Conversión de cine a boliche",
    category: "Infraestructura",
    spentWeight: 25,
    committedWeight: 25,
  },
  {
    id: "maintenance",
    name: "Conservación de instalaciones del grupo",
    category: "Gastos operativos",
    spentWeight: 25,
    committedWeight: 15,
  },
  {
    id: "group-services",
    name: "Servicios generales del grupo",
    category: "Gastos operativos",
    spentWeight: 20,
    committedWeight: 10,
  },
] as const;
