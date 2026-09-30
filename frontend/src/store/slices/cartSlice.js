import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: '0.00',
  loading: false,
  itemUpdatingId: null,
  error: null,
  successMessage: null,
};

/**
 * Async Thunk: Fetch Current User's Cart
 */
export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.getCart();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load cart.');
    }
  }
);

/**
 * Async Thunk: Add Product to Cart
 */
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const data = await cartService.addToCart(productId, quantity);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add item to cart.');
    }
  }
);

/**
 * Async Thunk: Update Cart Item Quantity
 */
export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const data = await cartService.updateCartItem(itemId, quantity);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update item quantity.');
    }
  }
);

/**
 * Async Thunk: Remove Cart Item
 */
export const removeCartItemAsync = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const data = await cartService.removeCartItem(itemId);
      return data.cart || data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to remove item.');
    }
  }
);

/**
 * Async Thunk: Clear Entire Cart
 */
export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.clearCart();
      return data.cart || data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to clear cart.');
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = '0.00';
      state.loading = false;
      state.itemUpdatingId = null;
      state.error = null;
      state.successMessage = null;
    },
    clearCartError: (state) => {
      state.error = null;
    },
    clearCartSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Helper to map cart payload to state
    const updateCartState = (state, payload) => {
      if (payload) {
        state.items = payload.items || [];
        state.totalItems = typeof payload.total_items === 'number' ? payload.total_items : (payload.items || []).reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = payload.total_price || '0.00';
      }
    };

    // Fetch Cart
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to Cart
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        updateCartState(state, action.payload);
        state.successMessage = 'Item added to your cart.';
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Update Cart Item
    builder
      .addCase(updateCartItemAsync.pending, (state, action) => {
        state.itemUpdatingId = action.meta.arg.itemId;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.itemUpdatingId = null;
        updateCartState(state, action.payload);
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.itemUpdatingId = null;
        state.error = action.payload;
      });

    // Remove Cart Item
    builder
      .addCase(removeCartItemAsync.pending, (state, action) => {
        state.itemUpdatingId = action.meta.arg;
        state.error = null;
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        state.itemUpdatingId = null;
        updateCartState(state, action.payload);
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.itemUpdatingId = null;
        state.error = action.payload;
      });

    // Clear Cart
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        updateCartState(state, action.payload);
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const getCart = fetchCartAsync;
export const addToCart = addToCartAsync;
export const updateCartItem = updateCartItemAsync;
export const removeCartItem = removeCartItemAsync;
export const clearCart = clearCartAsync;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartItemUpdatingId = (state) => state.cart.itemUpdatingId;
export const selectCartError = (state) => state.cart.error;
export const selectCartSuccessMessage = (state) => state.cart.successMessage;

export const { resetCartState, clearCartError, clearCartSuccess } = cartSlice.actions;
export default cartSlice.reducer;

