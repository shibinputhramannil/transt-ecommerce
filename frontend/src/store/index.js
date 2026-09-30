import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  devTools: import.meta.env.DEV,
});

// Re-export all thunks and selectors for convenient imports
export * from './slices/authSlice';
export * from './slices/productsSlice';
export * from './slices/cartSlice';
export * from './slices/ordersSlice';

export default store;

