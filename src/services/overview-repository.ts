import { parseOverview, type Overview } from "@/features/overview/types";
export interface OverviewRepository {
  load(signal?: AbortSignal): Promise<Overview>;
}
// Only this adapter knows where fixtures live. Replace it with an API adapter.
export const demoOverviewRepository: OverviewRepository = {
  async load(signal) {
    const response = await fetch("/demo/overview.json", {
      signal,
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error("No pudimos cargar los indicadores. Intenta nuevamente.");
    return parseOverview(await response.json());
  },
};
