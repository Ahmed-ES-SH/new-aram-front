// redux/variablesSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { currencies } from "../constants/_website/navbar";

interface currencyType {
  code: string;
  name: {
    en: string;
    ar: string;
  };
  flag: string;
  symbol: string;
}

interface VariablesState {
  locale: "en" | "ar";
  width: number;
  activeCurrency: currencyType;
  isMenuOpen: boolean;
  servicesFilterSidebar: boolean;
  sidebardashOrgs: boolean;
  isCartOpen: boolean;
  showSidebar: boolean;
  showUserButton: boolean;
  showMessagesDrop: boolean;
  showNotificationDrop: boolean;
}

const initialState: VariablesState = {
  locale: "en",
  width: 0,
  activeCurrency: currencies[0],
  isMenuOpen: false,
  servicesFilterSidebar: true,
  isCartOpen: false,
  sidebardashOrgs: true,
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
    setWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
    },
    setActiveCurrency: (state, action: PayloadAction<currencyType>) => {
      state.activeCurrency = action.payload;
    },
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
    setServicesFilterSidebar: (state, action: PayloadAction<boolean>) => {
      state.servicesFilterSidebar = action.payload;
    },
    setIsMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    setIsCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
    setSidebardashOrgs: (state, action: PayloadAction<boolean>) => {
      state.sidebardashOrgs = action.payload;
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
  setIsCartOpen,
  setIsMenuOpen,
  setActiveCurrency,
  setSidebardashOrgs,
  setServicesFilterSidebar,
  setWidth,
  setShowMessagesDrop,
  setShowNotificationDrop,
} = variablesSlice.actions;

export default variablesSlice.reducer;
