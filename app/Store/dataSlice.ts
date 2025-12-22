import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { instance } from "../_helpers/axios";

type Category = {
  id: number;
  title_en: string;
  title_ar: string;
  image: string;
};

interface VariablesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: VariablesState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchCategories = createAsyncThunk(
  "data/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get("/all-article-categories");
      return response.data.data; // تأكد أن هذا هو الشكل المطلوب
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.categories = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;
