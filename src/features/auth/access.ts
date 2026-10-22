export type DemoRole = "admin" | "staff";
export type DemoSession = { role: DemoRole; expiresAt: number };
export const sessionKey = "panorama.generic.session.v1";
export const demoAccounts = [
  {
    role: "admin",
    label: "Administrador",
    email: "admin@panorama.demo",
    password: "Panorama2026!",
    description: "Cifras ficticias, catálogos y configuración.",
  },
  {
    role: "staff",
    label: "Staff",
    email: "staff@panorama.demo",
    password: "Panorama2026!",
    description: "Indicadores de desempeño sin importes financieros.",
  },
] as const;
export function authenticateDemo(
  email: string,
  password: string,
): DemoRole | null {
  return (
    demoAccounts.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password,
    )?.role ?? null
  );
}
export function restoreSession(
  value: unknown,
  now: number,
): DemoSession | null {
  if (!value || typeof value !== "object") return null;
  const s = value as DemoSession;
  return (s.role === "admin" || s.role === "staff") &&
    Number.isFinite(s.expiresAt) &&
    s.expiresAt > now &&
    s.expiresAt <= now + 8 * 60 * 60 * 1000
    ? s
    : null;
}
export function canManage(role: DemoRole | null) {
  return role === "admin";
}
