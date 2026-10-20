import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { defaults, type Appearance } from "./config";
const slice = createSlice({
  name: "appearance",
  initialState: defaults,
  reducers: {
    setAppearance: (_state, action: PayloadAction<Appearance>) =>
      action.payload,
  },
});
export const { setAppearance } = slice.actions;
export default slice.reducer;
