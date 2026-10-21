import { parseReport, type ManagementReport } from "@/features/reporting/model";
export interface ManagementReportRepository {
  load(signal?: AbortSignal): Promise<ManagementReport>;
}
export const demoManagementReportRepository: ManagementReportRepository = {
  async load(signal) {
    const response = await fetch("/demo/management-report.json", { signal });
    if (!response.ok)
      throw new Error("No pudimos cargar el reporte. Intenta nuevamente.");
    return parseReport(await response.json());
  },
};
