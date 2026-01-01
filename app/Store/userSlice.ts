// store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../_helpers/axios";
import { Organization } from "../_components/_dashboard/_organizations/types/organization";
import { NotificationType } from "../_components/_website/_notifications/NotificationBell";

type Gender = "male" | "female";
type AccountType = "user" | "admin";
type Role = "user" | "admin";

export interface UserType extends Organization {
  id: number;
  name: string;
  email: string;
  phone: string;
  id_number: string;
  gender: Gender;
  account_type: AccountType;
  role: Role;
  birth_date: string | null;
  country: string | null;
  image: any;
  status: any;
  email_verification_token: string | null;
  email_verified_at: string | null;
  failed_attempts: number;
  is_signed: number;
  last_login_at: string | null;
  social_id: string | null;
  social_type: string | null;
  password: null | string;
  created_at: string;
  updated_at: string;
  is_promoter: boolean | number;
}

interface UserState {
  user: UserType | null;
  userState: boolean;
  notifications: NotificationType[];
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  loading: boolean;
  error: string | null;
  unreadConversations: any | null;
  isPromoter: boolean;
}

const initialState: UserState = {
  user: null,
  userState: false,
  notifications: [],
  loading: true,
  error: null,
  unreadMessagesCount: 0,
  unreadNotificationsCount: 0,
  unreadConversations: null,
  isPromoter: false,
};

// Async thunk to fetch current user
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await instance.get("/current-user");
      return {
        user: res.data.data,
        unreadMessagesCount: res.data.unread_count ?? 0,
        unreadNotificationsCount: res.data.unread_notifications_count,
        isPromoter: res.data.is_promoter,
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

    setNotifications(state, action) {
      state.notifications = action.payload;
    },

    setUserState(state, action) {
      state.userState = action.payload;
    },

    setUnreadCount: (state, action) => {
      state.unreadMessagesCount = action.payload;
    },

    setUnreadNotificationsCount: (state, action) => {
      if (typeof action.payload === "number") {
        state.unreadNotificationsCount = action.payload; // set direct
      } else if (action.payload === "increment") {
        state.unreadNotificationsCount += 1; // safe increment
      }
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
        state.isPromoter = action.payload.isPromoter;
        state.unreadNotificationsCount =
          action.payload.unreadNotificationsCount ?? 0;
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
  setNotifications,
  setUserState,
  clearUser,
  reduceUnreadCount,
  setUnreadCount,
  setUnreadNotificationsCount,
  setunreadConversations,
} = userSlice.actions;
export default userSlice.reducer;
