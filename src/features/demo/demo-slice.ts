import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IdentityMode } from "./identity-policy";
const slice = createSlice({
  name: "demo",
  initialState: { identityMode: "alias" as IdentityMode },
  reducers: {
    setIdentityMode(state, action: PayloadAction<IdentityMode>) {
      state.identityMode = action.payload;
    },
  },
});
export const { setIdentityMode } = slice.actions;
export default slice.reducer;
