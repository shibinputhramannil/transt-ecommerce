/**
 * Application Constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Transt';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Brand Assets
export const BRAND_LOGO_PATH = '/assets/brand/transt-logo.png';
export const BRAND_LOGO_LIGHT_PATH = '/assets/brand/transt-logo-light.png';
export const BRAND_TAGLINE = 'Fast, seamless e-commerce logistics and shopping';

// Application Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
};
