import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DemoSession } from "./access";
const slice = createSlice({
  name: "auth",
  initialState: { session: null as DemoSession | null, ready: false },
  reducers: {
    setSession(state, action: PayloadAction<DemoSession | null>) {
      state.session = action.payload;
      state.ready = true;
    },
  },
});
export const { setSession } = slice.actions;
export default slice.reducer;
