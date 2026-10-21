export const themes = [
  {
    id: "prism",
    name: "Prisma",
    description: "Púrpura vibrante · lavanda y azul hielo",
    colorScheme: "light",
  },
  {
    id: "institutional",
    name: "Institucional",
    description: "Guinda y dorado · identidad institucional",
    colorScheme: "light",
  },
  {
    id: "ocean",
    name: "Océano",
    description: "Azul profundo · claro y preciso",
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
  { id: "patria", name: "Patria + Noto Sans" },
  { id: "inter", name: "Inter" },
  { id: "manrope", name: "Manrope" },
  {
    id: "plex",
    name: "IBM Plex Sans",
  },
] as const;
export const finishes = [
  {
    id: "original",
    name: "Original",
    description: "Superficies sólidas y contraste directo.",
  },
  {
    id: "crystal",
    name: "Cristal",
    description: "Liquid Glass en navegación y controles; contenido sobre fondos sólidos.",
  },
] as const;
export const themeAliases: Record<string, string> = { violet: "prism" };
export type Appearance = {
  theme: (typeof themes)[number]["id"];
  font: (typeof fonts)[number]["id"];
  finish: (typeof finishes)[number]["id"];
};
export const defaults: Appearance = {
  theme: "ocean",
  font: "inter",
  finish: "original",
};
export const storageKey = "gtyg.appearance.v1";
export function validateAppearance(value: unknown): Appearance {
  const item =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const theme =
    typeof item.theme === "string"
      ? (themeAliases[item.theme] ?? item.theme)
      : item.theme;
  return {
    theme: themes.some((t) => t.id === theme)
      ? (theme as Appearance["theme"])
      : defaults.theme,
    font: fonts.some((f) => f.id === item.font)
      ? (item.font as Appearance["font"])
      : defaults.font,
    finish: finishes.some((f) => f.id === item.finish)
      ? (item.finish as Appearance["finish"])
      : defaults.finish,
  };
}
