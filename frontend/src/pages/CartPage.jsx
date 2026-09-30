import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  Package,
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  updateCartItemAsync,
  removeCartItemAsync,
  clearCartAsync,
  clearCartError,
  fetchCartAsync,
} from '../store/slices/cartSlice';
import { ROUTES } from '../utils/constants';

// Clean Cart Thumbnail
const CartItemThumbnail = ({ src, name }) => {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="w-20 h-20 rounded-2xl bg-transt-surface-cream border border-transt-border-subtle flex items-center justify-center text-transt-green flex-shrink-0 overflow-hidden shadow-sm">
      {src && !hasError ? (
        <img
          src={src}
          alt={name || 'Product'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <Package className="w-8 h-8 text-transt-green" />
      )}
    </div>
  );
};

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, totalItems, totalPrice, loading, error } = useSelector((state) => state.cart);

  const [itemUpdatingId, setItemUpdatingId] = useState(null);

  const handleUpdateQuantity = async (itemId, newQuantity, currentStock) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    if (newQuantity > currentStock) {
      alert(`Cannot add more than available stock (${currentStock} units).`);
      return;
    }

    setItemUpdatingId(itemId);
    try {
      await dispatch(updateCartItemAsync({ itemId, quantity: newQuantity })).unwrap();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setItemUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setItemUpdatingId(itemId);
    try {
      await dispatch(removeCartItemAsync(itemId)).unwrap();
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setItemUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your shopping cart?')) {
      try {
        await dispatch(clearCartAsync()).unwrap();
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    }
  };

  // 1. Unauthenticated Prompt
  if (!isAuthenticated) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Sign in to view your cart"
          message="Your cart is tied to your account. Please log in or create an account to view saved items."
          actionText="Sign In to Transt"
          onAction={() => navigate(ROUTES.LOGIN)}
        />
      </Container>
    );
  }

  // 2. Loading State
  if (loading && items.length === 0) {
    return (
      <Container className="py-20">
        <LoadingState message="Loading Your Shopping Cart..." />
      </Container>
    );
  }

  // 3. Error Banner
  if (error && items.length === 0) {
    return (
      <Container className="py-16 space-y-6">
        <ErrorMessage
          title="Could not load cart"
          message={error}
          onRetry={() => dispatch(fetchCartAsync())}
        />
      </Container>
    );
  }

  const formattedTotalPrice = typeof totalPrice === 'number' ? totalPrice.toFixed(2) : parseFloat(totalPrice || 0).toFixed(2);

  return (
    <Container className="py-8 lg:py-12 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="pb-6 border-b border-transt-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Active Cart</Badge>
            <span className="text-xs text-transt-text-muted">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transt-green-dark mt-2 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-transt-text-muted mt-1">
            Review your selected items and adjust quantities before proceeding to checkout.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearCart}
              className="text-xs font-semibold text-transt-text-muted hover:text-transt-error transition-colors px-2 py-1"
            >
              Clear Cart
            </button>
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="outline" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Inline Warning Error */}
      {error && items.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => dispatch(clearCartError())}
            className="text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Empty Cart State */}
      {items.length === 0 ? (
        <EmptyState
          title="Your cart is currently empty"
          message="Explore the Transt catalog to discover quality products and add them to your cart."
          actionText="Explore Products"
          onAction={() => navigate(ROUTES.PRODUCTS)}
          className="my-8"
        />
      ) : (
        /* 5. Expansive Cart Grid with Items & Order Summary */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items List (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => {
              const product = item.product || {};
              const unitPrice = typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || 0).toFixed(2);
              const subtotal = typeof item.subtotal === 'number' ? item.subtotal.toFixed(2) : parseFloat(item.subtotal || (product.price * item.quantity)).toFixed(2);
              const isUpdating = itemUpdatingId === item.id;
              const isMaxStock = item.quantity >= product.stock;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-transt-border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm hover:border-transt-green/40 transition-colors"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <Link to={`/products/${product.id}`} className="flex-shrink-0">
                      <CartItemThumbnail src={product.image} name={product.name} />
                    </Link>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <Badge variant="neutral">{product.category || 'Product'}</Badge>
                      <Link
                        to={`/products/${product.id}`}
                        className="block text-base font-bold text-transt-green-dark hover:text-transt-green transition-colors truncate"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-transt-text-muted">
                        <span>Unit Price: <strong className="text-transt-text">${unitPrice}</strong></span>
                        {product.stock <= 10 && (
                          <span className="text-amber-700 font-semibold">
                            (Only {product.stock} left)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-transt-border-subtle">
                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 bg-transt-surface-cream rounded-xl p-1 border border-transt-border">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, product.stock)}
                        disabled={isUpdating}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-transt-green hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-transt-text select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, product.stock)}
                        disabled={isUpdating || isMaxStock}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-transt-green hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-xs text-transt-text-muted block">Subtotal</span>
                      <span className="text-base font-extrabold text-transt-green">
                        ${subtotal}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating}
                      className="p-2 text-transt-text-muted hover:text-transt-error hover:bg-transt-error-light rounded-xl transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary Card (5 cols on desktop, sticky) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-transt-border p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-transt-green-dark pb-3 border-b border-transt-border-subtle">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-transt-text-muted">
                  <span>Total Items</span>
                  <span className="font-semibold text-transt-text">{totalItems} units</span>
                </div>
                <div className="flex justify-between text-transt-text-muted">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-transt-text">${formattedTotalPrice}</span>
                </div>
                <div className="flex justify-between text-transt-text-muted">
                  <span>Transt Express Delivery</span>
                  <span className="font-semibold text-transt-green">Free</span>
                </div>

                <div className="pt-4 border-t border-transt-border-subtle flex justify-between items-baseline">
                  <span className="text-base font-bold text-transt-green-dark">Cart Total</span>
                  <span className="text-3xl font-extrabold text-transt-green">${formattedTotalPrice}</span>
                </div>
              </div>

              <Link to={ROUTES.CHECKOUT} className="block">
                <Button variant="primary" size="lg" className="w-full justify-center shadow-md py-3.5">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Guarantees */}
              <div className="space-y-2 pt-4 border-t border-transt-border-subtle text-xs text-transt-text-muted">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-transt-green flex-shrink-0" />
                  <span>Complimentary Delivery on all orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-transt-green flex-shrink-0" />
                  <span>Secure 256-Bit Encrypted Cart</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-transt-green flex-shrink-0" />
                  <span>30-Day Hassle Free Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CartPage;
