import { configureStore } from "@reduxjs/toolkit";
import formReducer from "@/slice/formSlice";

export const store = configureStore({
  reducer: {
    fields: formReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
