import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../_helpers/axios";

interface CategoryState {
  categories: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk to fetch active  categories
export const fetchActiveCategories = createAsyncThunk(
  "Categories/fetchActive",
  async (_, thunkAPI) => {
    try {
      const res = await instance.get("/public-categories");
      return res.data.data; // assuming API returns { data: [...] }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch active categories"
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
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
      .addCase(fetchActiveCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchActiveCategories.rejected, (state, action: any) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
