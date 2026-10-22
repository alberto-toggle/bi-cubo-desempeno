export type IdentityMode = "full" | "alias" | "hidden";
export type EstablishmentIdentity = {
  id: string;
  name: string;
  location: string;
  alias: string;
};
// Presentation policy for synthetic demo data. Real authorization belongs in the API.
export function presentIdentity(
  item: EstablishmentIdentity,
  mode: IdentityMode,
) {
  switch (mode) {
    case "full":
      return { name: item.name, location: item.location };
    case "alias":
      return { name: `•••• ${item.alias}`, location: "Ubicación reservada" };
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

export function presentResponsible(person: { manager: string; alias: string; appointed: string }, mode: IdentityMode) {
  return {
    name: mode === "full" ? person.manager : mode === "alias" ? `•••• ${person.alias}` : "••••••••",
    appointed: mode === "full"
      ? new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(person.appointed + "T00:00:00Z"))
      : "Fecha reservada",
  };
}
