import apiClient from './api';

/**
 * Orders API Service for Transt E-Commerce
 */
export const orderService = {
  /**
   * Create a new order from current authenticated user's cart
   * @param {Object} shippingData { shipping_name, shipping_email, shipping_phone, shipping_address }
   * @returns {Promise<Object>} Created order object with line items
   */
  createOrder: (shippingData) => {
    return apiClient.post('/orders/', shippingData);
  },

  /**
   * Fetch all orders placed by the current authenticated user
   * @returns {Promise<Array>} Array of user's orders
   */
  getOrders: () => {
    return apiClient.get('/orders/');
  },

  /**
   * Fetch full details for a specific order by ID or order_number
   * @param {number|string} id
   * @returns {Promise<Object>} Detailed order object
   */
  getOrderById: (id) => {
    return apiClient.get(`/orders/${id}/`);
  },
};

export default orderService;
