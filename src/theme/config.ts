export const themes = [
  {
    id: "ocean",
    name: "Océano",
    description: "Azul profundo · claro y preciso",
    colorScheme: "light",
  },
  {
    id: "violet",
    name: "Órbita",
    description: "Violeta · contemporáneo",
    colorScheme: "light",
  },
  {
    id: "copper",
    name: "Terracota",
    description: "Cobre · cálido y editorial",
    colorScheme: "light",
  },
  {
    id: "night",
    name: "Medianoche",
    description: "Oscuro · alto contraste",
    colorScheme: "dark",
  },
] as const;
export const fonts = [
  { id: "inter", name: "Inter" },
  { id: "manrope", name: "Manrope" },
  {
    id: "plex",
    name: "IBM Plex Sans",
  },
] as const;
export type Appearance = {
  theme: (typeof themes)[number]["id"];
  font: (typeof fonts)[number]["id"];
};
export const defaults: Appearance = { theme: "ocean", font: "inter" };
export const storageKey = "gtyg.appearance.v1";
export function validateAppearance(value: unknown): Appearance {
  const item =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return {
    theme: themes.some((t) => t.id === item.theme)
      ? (item.theme as Appearance["theme"])
      : defaults.theme,
    font: fonts.some((f) => f.id === item.font)
      ? (item.font as Appearance["font"])
      : defaults.font,
  };
}
