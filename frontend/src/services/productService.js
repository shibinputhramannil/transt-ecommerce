import apiClient from './api';

/**
 * Products API Service for Transt E-Commerce
 */
export const productService = {
  /**
   * Fetch all products with optional filters (category, search)
   * @param {Object} params - { category?: string, search?: string }
   * @returns {Promise<Array>} List of product objects
   */
  getProducts: (params = {}) => {
    return apiClient.get('/products/', { params });
  },

  /**
   * Fetch a single product by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<Object>} Product details object
   */
  getProductById: (id) => {
    return apiClient.get(`/products/${id}/`);
  },
};

export default productService;
