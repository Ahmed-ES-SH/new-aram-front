import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
  available_balance: number;
  pending_balance: number;
  total_balance: number;
}

const initialState: initialStateType = {
  available_balance: 0,
  pending_balance: 0,
  total_balance: 0,
};

const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    setWallet: (
      state,
      action: PayloadAction<{
        available_balance: number;
        pending_balance: number;
        total_balance: number;
      }>
    ) => {
      state.available_balance = action.payload.available_balance;
      state.pending_balance = action.payload.pending_balance;
      state.total_balance = action.payload.total_balance;
    },

    updateAvailableBalance: (state, action: PayloadAction<number>) => {
      state.available_balance = action.payload;
    },

    updatePendingBalance: (state, action: PayloadAction<number>) => {
      state.pending_balance = action.payload;
    },

    updateTotalBalance: (state, action: PayloadAction<number>) => {
      state.total_balance = action.payload;
    },
  },
});

export const {
  setWallet,
  updateAvailableBalance,
  updatePendingBalance,
  updateTotalBalance,
} = balanceSlice.actions;

export default balanceSlice.reducer;
