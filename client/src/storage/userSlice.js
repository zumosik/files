import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: "",
    darkMode: false,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    changeMode(state) {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { setToken, changeMode } = userSlice.actions;

export default userSlice.reducer;
