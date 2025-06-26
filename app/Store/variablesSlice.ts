// redux/variablesSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VariablesState {
  language: string;
  showSidebar: boolean;
  showUserButton: boolean;
  showMessagesDrop: boolean;
  showNotificationDrop: boolean;
}

const initialState: VariablesState = {
  language: "en",
  showSidebar: true,
  showUserButton: false,
  showMessagesDrop: false,
  showNotificationDrop: false,
};

const variablesSlice = createSlice({
  name: "variables",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
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
  setLanguage,
  setShowSidebar,
  setShowUserButton,
  setShowMessagesDrop,
  setShowNotificationDrop,
} = variablesSlice.actions;

export default variablesSlice.reducer;
