import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ManagementReport } from "./model";
import type { ManagementReportRepository } from "@/services/management-report-repository";
export const loadReport = createAsyncThunk<
  ManagementReport,
  void,
  { extra: { managementReport: ManagementReportRepository } }
>("report/load", (_, api) => api.extra.managementReport.load(api.signal));
const slice = createSlice({
  name: "report",
  initialState: {
    data: null as ManagementReport | null,
    status: "idle" as "idle" | "loading" | "ready" | "error",
    error: "",
    requestId: "",
  },
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(loadReport.pending, (s, a) => {
        s.status = "loading";
        s.error = "";
        s.requestId = a.meta.requestId;
      })
      .addCase(loadReport.fulfilled, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.data = a.payload;
        s.status = "ready";
      })
      .addCase(loadReport.rejected, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.status = a.meta.aborted ? "idle" : "error";
        s.error = a.meta.aborted
          ? ""
          : (a.error.message ?? "No fue posible cargar el reporte.");
      }),
});
export default slice.reducer;
