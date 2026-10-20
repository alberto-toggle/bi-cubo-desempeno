export type IdentityMode = "full" | "alias" | "hidden";
export type EstablishmentIdentity = {
  id: string;
  name: string;
  location: string;
  alias: string;
};
export const identityModes = [
  {
    id: "full",
    label: "Datos completos",
    description: "Nombres y ubicaciones ficticias.",
  },
  {
    id: "alias",
    label: "Alias",
    description: "Identificadores estables, sin ubicación.",
  },
  {
    id: "hidden",
    label: "Datos ofuscados",
    description: "Nombre y ubicación enmascarados.",
  },
] as const;
// Presentation policy for synthetic demo data. Real authorization belongs in the API.
export function presentIdentity(
  item: EstablishmentIdentity,
  mode: IdentityMode,
) {
  switch (mode) {
    case "full":
      return { name: item.name, location: item.location };
    case "alias":
      return { name: item.alias, location: "Ubicación reservada" };
    case "hidden":
      return {
        name: "••••••••",
        location: "••••••••",
      };
    default:
      return {
        name: "••••••••",
        location: "••••••••",
      };
  }
}
