import { createSlice } from "@reduxjs/toolkit";
import { setSession } from "@/features/auth/auth-slice";
const slice = createSlice({
  name: "privacy",
  initialState: { concealed: false },
  reducers: {
    toggleAmounts(state) {
      state.concealed = !state.concealed;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setSession, (state) => {
      state.concealed = false;
    });
  },
});
export const { toggleAmounts } = slice.actions;
export default slice.reducer;
