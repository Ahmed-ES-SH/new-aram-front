// redux/variablesSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VariablesState {
  locale: "en" | "ar";
  width: number;
  isMenuOpen: boolean;
  conversationsSidebar: boolean;
  servicesFilterSidebar: boolean;
  sidebardashOrgs: boolean;
  isCartOpen: boolean;
  couponsFilterSidebar: boolean;
  offerFilterSidebar: boolean;
  showSidebar: boolean;
  showUserButton: boolean;
  showMessagesDrop: boolean;
  showNotificationDrop: boolean;
  orgsSidebar: boolean;
  userPanalSidebar: boolean;
  withdrawOpen: boolean;
  showSendPopup: boolean;
}

const initialState: VariablesState = {
  locale: "en",
  width: 0,
  isMenuOpen: false,
  conversationsSidebar: false,
  servicesFilterSidebar: true,
  isCartOpen: false,
  sidebardashOrgs: true,
  offerFilterSidebar: true,
  couponsFilterSidebar: true,
  showSidebar: true,
  showUserButton: false,
  showMessagesDrop: false,
  showNotificationDrop: false,
  orgsSidebar: true,
  userPanalSidebar: true,
  withdrawOpen: false,
  showSendPopup: false,
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
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
    setServicesFilterSidebar: (state, action: PayloadAction<boolean>) => {
      state.servicesFilterSidebar = action.payload;
    },
    setConversationsSidebar: (state, action: PayloadAction<boolean>) => {
      state.conversationsSidebar = action.payload;
    },
    setCouponsFilterSidebar: (state, action: PayloadAction<boolean>) => {
      state.couponsFilterSidebar = action.payload;
    },
    setOffersFilterSidebar: (state, action: PayloadAction<boolean>) => {
      state.offerFilterSidebar = action.payload;
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
    setOrgsSidebar: (state, action: PayloadAction<boolean>) => {
      state.orgsSidebar = action.payload;
    },
    setUserPanalSidebar: (state, action: PayloadAction<boolean>) => {
      state.userPanalSidebar = action.payload;
    },
    setWithdrawOpen: (state, action: PayloadAction<boolean>) => {
      state.withdrawOpen = action.payload;
    },
    setShowSendPopup: (state, action: PayloadAction<boolean>) => {
      state.showSendPopup = action.payload;
    },
  },
});

export const {
  setLocale,
  setShowSidebar,
  setShowUserButton,
  setIsCartOpen,
  setIsMenuOpen,
  setSidebardashOrgs,
  setServicesFilterSidebar,
  setOffersFilterSidebar,
  setCouponsFilterSidebar,
  setWidth,
  setShowMessagesDrop,
  setConversationsSidebar,
  setShowNotificationDrop,
  setOrgsSidebar,
  setUserPanalSidebar,
  setWithdrawOpen,
  setShowSendPopup,
} = variablesSlice.actions;

export default variablesSlice.reducer;
