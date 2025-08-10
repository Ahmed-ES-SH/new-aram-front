// redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import variablesReducer from "./variablesSlice";
import dataReducer from "./dataSlice";
import userReducer from "./userSlice";
import cartReducer from "./cartItemsSlice";

export const store = configureStore({
  reducer: {
    variables: variablesReducer,
    data: dataReducer,
    user: userReducer,
    cartItems: cartReducer,
  },
});

// أنواع للمستقبل (مهمة عند استخدام TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
