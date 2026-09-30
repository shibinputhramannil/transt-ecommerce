import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

/**
 * Async Thunk: Create Order from current user's cart
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (shippingData, { rejectWithValue }) => {
    try {
      const data = await orderService.createOrder(shippingData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to place order.');
    }
  }
);

// Backward-compatibility alias
export const createOrderAsync = createOrder;

/**
 * Async Thunk: Fetch all orders for current user
 */
export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrders();
      return Array.isArray(data) ? data : (data.results || []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load orders.');
    }
  }
);

// Backward-compatibility alias
export const fetchOrdersAsync = getOrders;

/**
 * Async Thunk: Fetch detailed order by ID
 */
export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await orderService.getOrderById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load order details.');
    }
  }
);

// Backward-compatibility alias
export const fetchOrderByIdAsync = getOrderById;

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrdersState: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        // Prepend new order to list if list exists
        if (Array.isArray(state.orders)) {
          state.orders = [action.payload, ...state.orders];
        }
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // getOrders
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // getOrderById
    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export const { clearCurrentOrder, clearOrderError, resetOrdersState } = ordersSlice.actions;
export default ordersSlice.reducer;

