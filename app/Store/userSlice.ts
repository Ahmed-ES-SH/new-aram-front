// store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../_helpers/axios";

interface UserState {
  user: any | null;
  unreadMessagesCount: number;
  loading: boolean;
  error: string | null;
  unreadConversations: any | null;
}

const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
  unreadMessagesCount: 0,
  unreadConversations: null,
};

// Async thunk to fetch current user
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await instance.get("/current-user");
      return {
        user: res.data.data,
        unreadMessagesCount: res.data.unread_count,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.unreadMessagesCount = 0;
      state.error = null;
      state.loading = false;
    },

    setUser(state, action) {
      state.user = action.payload;
    },

    setUnreadCount: (state, action) => {
      state.unreadMessagesCount = action.payload;
    },

    setunreadConversations: (state, action) => {
      state.unreadConversations = action.payload;
    },

    reduceUnreadCount: (state, action) => {
      state.unreadMessagesCount = Math.max(
        state.unreadMessagesCount - action.payload,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.unreadMessagesCount = action.payload.unreadMessagesCount;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action: any) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const {
  setUser,
  clearUser,
  reduceUnreadCount,
  setUnreadCount,
  setunreadConversations,
} = userSlice.actions;
export default userSlice.reducer;
