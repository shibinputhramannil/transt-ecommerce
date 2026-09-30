import apiClient from './api';

/**
 * Authentication API Service for Transt E-Commerce
 */
export const authService = {
  /**
   * Register a new user account
   * @param {Object} data - { name, email, password, confirm_password }
   * @returns {Promise<Object>} { message, user: { id, name, email } }
   */
  registerUser: (data) => {
    return apiClient.post('/auth/register/', data);
  },

  /**
   * Log in user and receive JWT tokens + user profile
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} { access, refresh, user: { id, name, email } }
   */
  loginUser: (credentials) => {
    return apiClient.post('/auth/login/', credentials);
  },

  /**
   * Refresh JWT access token using refresh token
   * @param {string} refreshToken
   * @returns {Promise<Object>} { access }
   */
  refreshToken: (refreshToken) => {
    return apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
  },

  /**
   * Get current authenticated user profile
   * @returns {Promise<Object>} { id, name, email }
   */
  getCurrentUser: () => {
    return apiClient.get('/auth/me/');
  },

  /**
   * Perform client-side logout
   */
  logoutUser: () => {
    localStorage.removeItem('transt_token');
    localStorage.removeItem('transt_refresh_token');
    localStorage.removeItem('transt_user');
  },
};

export default authService;
