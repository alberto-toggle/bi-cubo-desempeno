export const demoPreferencesKey = "gtyg.demo-preferences.v1";
export type DemoPreferences = { twoFactor: boolean; showHelp: boolean };
export function validateDemoPreferences(value: unknown): DemoPreferences {
  const v = value as Partial<DemoPreferences> | null;
  return {
    twoFactor: typeof v?.twoFactor === "boolean" ? v.twoFactor : false,
    showHelp: typeof v?.showHelp === "boolean" ? v.showHelp : true,
  };
}
