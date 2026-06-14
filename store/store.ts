import { configureStore } from "@reduxjs/toolkit";
import themeReducer  from "./themeSlice";
import loaderReducer from "./loaderSlice";   // ✅ add this

export const store = configureStore({
  reducer: {
    theme:  themeReducer,
    loader: loaderReducer,  // ✅ add this
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;