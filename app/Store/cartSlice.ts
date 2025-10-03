// src/store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "../_components/_dashboard/_cards/types";
import { RootState } from "./store";

// Define the cart item type
export interface CartItem extends Card {
  quantity?: number; // optional, will default to 1
  [key: string]: any; // allow extra properties if needed
}

// Load cart items from localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const data = localStorage.getItem("AramCartItems");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save cart items to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem("AramCartItems", JSON.stringify(items));
};

// Initial state
interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item, if exists increase quantity
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity = (existing.quantity ?? 1) + 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("AramCartItems");
    },

    // Add item with quantity = 1 (always reset)
    addItemWithOne: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity = 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },

    // Increase quantity
    increaseQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity = (item.quantity ?? 1) + 1;
      }
      saveCartToStorage(state.items);
    },

    // Decrease quantity (remove if zero)
    decreaseQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity = (item.quantity ?? 1) - 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
      saveCartToStorage(state.items);
    },

    // Remove item completely
    removeItem: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCartToStorage(state.items);
    },
  },
});

// ✅ Selector to check if item is in cart
export const isItemInCart = (state: RootState, id: string | number): boolean =>
  state.cartSlice.items.some((item) => item.id === id);

export const {
  addItem,
  addItemWithOne,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  removeItem,
} = cartSlice.actions;

export default cartSlice.reducer;
