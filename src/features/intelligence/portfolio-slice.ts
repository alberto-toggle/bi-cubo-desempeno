import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Portfolio } from "./model";
import type { PortfolioRepository } from "@/services/portfolio-repository";
export const loadPortfolio = createAsyncThunk<
  Portfolio,
  void,
  { extra: { portfolio: PortfolioRepository } }
>("portfolio/load", (_, api) => api.extra.portfolio.load(api.signal));
const slice = createSlice({
  name: "portfolio",
  initialState: {
    data: null as Portfolio | null,
    status: "idle" as "idle" | "loading" | "ready" | "error",
    error: "",
    requestId: "",
  },
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(loadPortfolio.pending, (s, a) => {
        s.status = "loading";
        s.error = "";
        s.requestId = a.meta.requestId;
      })
      .addCase(loadPortfolio.fulfilled, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.data = a.payload;
        s.status = "ready";
      })
      .addCase(loadPortfolio.rejected, (s, a) => {
        if (s.requestId !== a.meta.requestId) return;
        s.status = a.meta.aborted ? "idle" : "error";
        s.error = a.meta.aborted
          ? ""
          : (a.error.message ?? "No pudimos cargar la información.");
      }),
});
export default slice.reducer;
