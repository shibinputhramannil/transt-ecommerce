import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Safely parse user from localStorage
const storedUserJson = localStorage.getItem('transt_user');
let initialUser = null;
try {
  initialUser = storedUserJson ? JSON.parse(storedUserJson) : null;
} catch (e) {
  initialUser = null;
}

const storedToken = localStorage.getItem('transt_token') || null;
const storedRefreshToken = localStorage.getItem('transt_refresh_token') || null;

const initialState = {
  user: initialUser,
  token: storedToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: Boolean(storedToken && initialUser),
  loading: false,
  error: null,
};

/**
 * Async Thunk: Login User
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.loginUser(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed. Please check your credentials.');
    }
  }
);

/**
 * Async Thunk: Register User
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.registerUser(userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed. Please check your input.');
    }
  }
);

/**
 * Async Thunk: Fetch Current Authenticated User Profile
 */
export const loadUserAsync = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load user profile.');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.token = access;
      if (refresh) {
        state.refreshToken = refresh;
        localStorage.setItem('transt_refresh_token', refresh);
      }
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('transt_token', access);
      localStorage.setItem('transt_user', JSON.stringify(user));
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('transt_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      authService.logoutUser();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem('transt_token', action.payload.access);
        if (action.payload.refresh) {
          localStorage.setItem('transt_refresh_token', action.payload.refresh);
        }
        localStorage.setItem('transt_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Load User
    builder
      .addCase(loadUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('transt_user', JSON.stringify(action.payload));
      })
      .addCase(loadUserAsync.rejected, (state) => {
        // If token invalid, clear auth state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        authService.logoutUser();
      });
  },
});

export const loginUser = loginAsync;
export const registerUser = registerAsync;
export const fetchCurrentUser = loadUserAsync;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export const { setCredentials, setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

