import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Currency = {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: string;
  is_default: number;
  created_at: string;
  updated_at: string;
};

interface CurrencyState {
  availableCurrencies: Currency[];
  activeCurrency: Currency | null;
}

const initialState: CurrencyState = {
  availableCurrencies: [],
  activeCurrency: null,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrencies: (state, action: PayloadAction<Currency[]>) => {
      state.availableCurrencies = action.payload;

      // تحديد العملة الافتراضية من API
      const defaultCurrency =
        action.payload.find((c) => c.code === "OMR") ||
        action.payload.find((c) => c.is_default === 1) ||
        action.payload[0];

      if (defaultCurrency) {
        state.activeCurrency = defaultCurrency;
      } else if (!state.activeCurrency && action.payload.length > 0) {
        state.activeCurrency = action.payload[0];
      }
    },
    changeCurrency: (state, action: PayloadAction<string>) => {
      const selected = state.availableCurrencies.find(
        (c) => c.code === action.payload
      );
      if (selected) {
        state.activeCurrency = selected;
      }
    },
  },
});

export const { setCurrencies, changeCurrency } = currencySlice.actions;
export default currencySlice.reducer;
