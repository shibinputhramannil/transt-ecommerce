import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Redux Actions
import { logout, loadUserAsync } from './store/slices/authSlice';
import { fetchCartAsync, resetCartState } from './store/slices/cartSlice';

// Constants
import { ROUTES } from './utils/constants';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Listen for session expiry from API interceptor
    const handleLogout = () => {
      dispatch(logout());
      dispatch(resetCartState());
    };
    window.addEventListener('transt_logout', handleLogout);

    // Refresh user profile if token exists on boot
    const token = localStorage.getItem('transt_token');
    if (token) {
      dispatch(loadUserAsync());
    }

    return () => {
      window.removeEventListener('transt_logout', handleLogout);
    };
  }, [dispatch]);

  // Fetch cart whenever authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartAsync());
    } else {
      dispatch(resetCartState());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Routes>
      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />

        {/* Protected Routes (Checkout & Orders) */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route path={ROUTES.ORDER_DETAIL} element={<OrderDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Layout Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
