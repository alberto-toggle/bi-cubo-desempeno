import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { OverviewRepository } from "@/services/overview-repository";
import type { Overview } from "./types";
export interface OverviewState {
  data: Overview | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  requestId?: string;
}
const initialState: OverviewState = { data: null, status: "idle", error: null };
export const loadOverview = createAsyncThunk<
  Overview,
  void,
  { extra: { overview: OverviewRepository } }
>("overview/load", (_, api) => api.extra.overview.load(api.signal));
const slice = createSlice({
  name: "overview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadOverview.pending, (s, a) => {
      s.status = "loading";
      s.error = null;
      s.requestId = a.meta.requestId;
    });
    builder.addCase(loadOverview.fulfilled, (s, a) => {
      if (s.requestId !== a.meta.requestId) return;
      s.status = "succeeded";
      s.data = a.payload;
    });
    builder.addCase(loadOverview.rejected, (s, a) => {
      if (s.requestId !== a.meta.requestId) return;
      s.status = a.meta.aborted ? "idle" : "failed";
      s.error = a.meta.aborted
        ? null
        : (a.error.message ?? "No fue posible cargar los datos.");
    });
  },
});
export default slice.reducer;
