import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

/**
 * Axios instance preconfigured for Transt API
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request Interceptor: Attach JWT Bearer access token when available
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('transt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Automatically handles token refresh on 401 Unauthorized
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not an auth login/register/refresh attempt, try refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login/') &&
      !originalRequest.url.includes('/auth/register/') &&
      !originalRequest.url.includes('/auth/token/refresh/')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('transt_refresh_token');

      if (refreshToken) {
        try {
          // Direct axios call without interceptor to avoid recursion
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          if (res.data?.access) {
            const newAccessToken = res.data.access;
            localStorage.setItem('transt_token', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            // Retry the original request with new token
            const retryRes = await axios(originalRequest);
            return retryRes.data;
          }
        } catch (refreshErr) {
          // Refresh token invalid or expired, clear storage
          localStorage.removeItem('transt_token');
          localStorage.removeItem('transt_refresh_token');
          localStorage.removeItem('transt_user');
          window.dispatchEvent(new Event('transt_logout'));
        }
      }
    }

    // Standardize error message extracted from DRF responses
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data.detail === 'string') {
        errorMessage = data.detail;
      } else if (typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (typeof data === 'object') {
        // Collect first field error message (e.g. { "email": ["A user with this email..."] })
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          const val = data[firstKey];
          if (Array.isArray(val) && val.length > 0) {
            errorMessage = `${val[0]}`;
          } else if (typeof val === 'string') {
            errorMessage = val;
          }
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    const customError = {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

/**
 * Foundation API Services
 */
export const healthService = {
  checkHealth: () => apiClient.get('/health/'),
  getApiRoot: () => apiClient.get('/'),
};

export default apiClient;
