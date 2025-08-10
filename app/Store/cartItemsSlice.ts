import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number; // Optional if you want to handle multiple quantities
}

// Helper: Load cart items from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("aram_cart");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage", error);
    return [];
  }
};

// Helper: Save cart items to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem("aram_cart", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to localStorage", error);
  }
};

// Initial state
interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: loadCartFromStorage(),
};

// Create slice
const cartItemsSlice = createSlice({
  name: "cartItems",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      saveCartToStorage(state.items);
    },
    removeItem: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    increaseQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        saveCartToStorage(state.items);
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

// Selector: Get total price
export const selectTotalPrice = (state: { cartItems: CartState }) =>
  state.cartItems.items.reduce((total, item) => total + item.price, 0);

// Export actions and reducer
export const {
  addItem,
  removeItem,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartItemsSlice.actions;
export default cartItemsSlice.reducer;
