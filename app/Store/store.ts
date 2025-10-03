// redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import variablesReducer from "./variablesSlice";
import dataReducer from "./dataSlice";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import CardCategoriesReducer from "./cardCategorySlice";
import CurrencyReducer from "./currencySlice";
import CategoriesReducer from "./categoriesSlice";

export const store = configureStore({
  reducer: {
    variables: variablesReducer,
    data: dataReducer,
    user: userReducer,
    cardCategories: CardCategoriesReducer,
    categories: CategoriesReducer,
    cartSlice: cartReducer,
    currency: CurrencyReducer,
  },
});

// أنواع للمستقبل (مهمة عند استخدام TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
