import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../_helpers/axios";

interface CardCategoryState {
  categories: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CardCategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk to fetch active card categories
export const fetchActiveCardCategories = createAsyncThunk(
  "cardCategories/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await instance.get("/card-categories-by-state?state=1");
      return res.data.data; // assuming API returns { data: [...] }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch active categories"
      );
    }
  }
);

const cardCategorySlice = createSlice({
  name: "cardCategories",
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.categories = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveCardCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCardCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchActiveCardCategories.rejected, (state, action: any) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearCategories } = cardCategorySlice.actions;
export default cardCategorySlice.reducer;
