import taxonomy from "@/data/master-taxonomy.json";
import masters from "@/data/master-units.json";
import reference from "@/data/reference-catalogs.json";
export type CatalogRecord = {
  category: string;
  code: string;
  name: string;
  relation: string;
  description: string;
  page: number;
};
export const catalogRecords: CatalogRecord[] = [
  ...Object.entries(taxonomy.regions).map(([code, name]) => ({
    category: "Regiones",
    code: `REG-${code}`,
    name,
    relation: "México",
    description: "Regionalización propuesta",
    page: 3,
  })),
  ...Object.entries(taxonomy.states).map(([code, s]) => ({
    category: "Entidades",
    code: `EST-${code}`,
    name: s.name,
    relation: `REG-${s.region}`,
    description: "Cobertura documentada",
    page: 3,
  })),
  ...Object.entries(taxonomy.divisions).map(([code, name]) => ({
    category: "Divisiones",
    code: `DIV-${code}`,
    name,
    relation: "Organización",
    description: "Adscripción organizacional",
    page: code === "SCO" ? 4 : 3,
  })),
  ...Object.entries(taxonomy.segments).map(([code, name]) => ({
    category: "Segmentos",
    code: `SEG-${code}`,
    name,
    relation: "Eje transversal",
    description: "Actividad económica",
    page: 4,
  })),
  ...masters.units.map((u) => ({
    category: "Unidades",
    code: u.code,
    name: u.name,
    relation: u.division,
    description: `${u.location} · ${u.kind}`,
    page: u.sourcePage,
  })),
  ...reference,
];
export type CatalogProposal = {
  id: string;
  code: string;
  name: string;
  category: string;
  action: "Alta" | "Modificación" | "Inactivación";
  reason: string;
  date: string;
};
export function validateProposals(value: unknown): CatalogProposal[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (p): p is CatalogProposal =>
      p &&
      ["id", "code", "name", "category", "reason", "date"].every(
        (k) => typeof p[k] === "string",
      ) &&
      ["Alta", "Modificación", "Inactivación"].includes(p.action),
  );
}
