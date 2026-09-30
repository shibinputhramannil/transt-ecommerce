import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

/**
 * Async Thunk: Fetch Products list with optional filters (category, search)
 */
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts(params);
      return Array.isArray(data) ? data : (data.results || []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load products.');
    }
  }
);

// Alias for backwards-compatibility
export const fetchProducts = getProducts;

/**
 * Async Thunk: Fetch a single product by ID
 */
export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await productService.getProductById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load product details.');
    }
  }
);

// Alias for backwards-compatibility
export const fetchProductById = getProductById;

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.error = null;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // getProducts
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // getProductById
    builder
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export const { clearSelectedProduct, clearProductError } = productsSlice.actions;
export default productsSlice.reducer;

