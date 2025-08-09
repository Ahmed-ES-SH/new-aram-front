// redux/variablesSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VariablesState {
  locale: "en" | "ar";
  showSidebar: boolean;
  showUserButton: boolean;
  showMessagesDrop: boolean;
  showNotificationDrop: boolean;
}

const initialState: VariablesState = {
  locale: "en",
  showSidebar: true,
  showUserButton: false,
  showMessagesDrop: false,
  showNotificationDrop: false,
};

const variablesSlice = createSlice({
  name: "variables",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<"en" | "ar">) => {
      state.locale = action.payload;
    },
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
    setShowUserButton: (state, action: PayloadAction<boolean>) => {
      state.showUserButton = action.payload;
    },
    setShowMessagesDrop: (state, action: PayloadAction<boolean>) => {
      state.showMessagesDrop = action.payload;
    },
    setShowNotificationDrop: (state, action: PayloadAction<boolean>) => {
      state.showNotificationDrop = action.payload;
    },
  },
});

export const {
  setLocale,
  setShowSidebar,
  setShowUserButton,
  setShowMessagesDrop,
  setShowNotificationDrop,
} = variablesSlice.actions;

export default variablesSlice.reducer;
