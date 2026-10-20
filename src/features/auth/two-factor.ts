import type { DemoRole } from "./access";
export const demoVerificationCode = "123456";
export type DemoChallenge = {
  role: DemoRole;
  email: string;
  expiresAt: number;
  attempts: number;
};
export function createChallenge(
  role: DemoRole,
  email: string,
  now: number,
): DemoChallenge {
  return { role, email, expiresAt: now + 120000, attempts: 0 };
}
export function checkChallenge(
  challenge: DemoChallenge,
  code: string,
  now: number,
) {
  if (challenge.attempts >= 5) return "locked";
  if (now >= challenge.expiresAt) return "expired";
  return code === demoVerificationCode ? "valid" : "invalid";
}
