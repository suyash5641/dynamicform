import { configureStore } from "@reduxjs/toolkit";
import formReducer from "@/slice/formSlice";
import userReducer from "@/slice/userSlice";

export const store = configureStore({
  reducer: {
    fields: formReducer,
    userInfo: userReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
