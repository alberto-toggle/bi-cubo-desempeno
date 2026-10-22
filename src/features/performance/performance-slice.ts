import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadPerformanceData } from "@/services/performance-repository";
import type { PerformanceData } from "./model";
export const loadPerformance = createAsyncThunk(
  "performance/load",
  (_, { signal }) => loadPerformanceData(signal),
);
const slice = createSlice({
  name: "performance",
  initialState: { data: null as PerformanceData | null, error: "" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadPerformance.pending, (s) => {
      s.error = "";
    });
    b.addCase(loadPerformance.fulfilled, (s, a) => {
      s.data = a.payload;
    });
    b.addCase(loadPerformance.rejected, (s, a) => {
      if (!a.meta.aborted)
        s.error = a.error.message ?? "No se pudo cargar la información.";
    });
  },
});
export default slice.reducer;
