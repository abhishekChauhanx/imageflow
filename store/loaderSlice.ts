import { createSlice } from "@reduxjs/toolkit";

interface LoaderState {
  visible: boolean;
}

const initialState: LoaderState = {
  visible: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader(state) {
      state.visible = true;
    },
    hideLoader(state) {
      state.visible = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;