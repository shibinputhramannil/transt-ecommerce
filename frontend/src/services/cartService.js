import apiClient from './api';

/**
 * Cart API Service for Transt E-Commerce
 */
export const cartService = {
  /**
   * Get current authenticated user's cart
   * @returns {Promise<Object>} { id, items: [...], total_items, total_price }
   */
  getCart: () => {
    return apiClient.get('/cart/');
  },

  /**
   * Add a product to the cart
   * @param {number|string} productId
   * @param {number} quantity - defaults to 1
   * @returns {Promise<Object>} Updated cart object
   */
  addToCart: (productId, quantity = 1) => {
    return apiClient.post('/cart/', {
      product_id: parseInt(productId, 10),
      quantity: parseInt(quantity, 10),
    });
  },

  /**
   * Update quantity of an existing cart item
   * @param {number|string} itemId
   * @param {number} quantity
   * @returns {Promise<Object>} Updated cart object
   */
  updateCartItem: (itemId, quantity) => {
    return apiClient.patch(`/cart/${itemId}/`, {
      quantity: parseInt(quantity, 10),
    });
  },

  /**
   * Remove a specific cart item
   * @param {number|string} itemId
   * @returns {Promise<Object>} { message, cart }
   */
  removeCartItem: (itemId) => {
    return apiClient.delete(`/cart/${itemId}/`);
  },

  /**
   * Clear all items in the user's cart
   * @returns {Promise<Object>} { message, cart }
   */
  clearCart: () => {
    return apiClient.delete('/cart/');
  },
};

export default cartService;
