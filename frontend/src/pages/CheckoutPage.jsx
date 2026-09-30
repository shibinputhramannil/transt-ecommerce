import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Truck,
  ArrowLeft,
  ShieldCheck,
  Package,
  AlertCircle,
  CreditCard,
  CheckCircle,
  Lock,
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { createOrder } from '../store/slices/ordersSlice';
import { fetchCartAsync } from '../store/slices/cartSlice';
import { ROUTES } from '../utils/constants';

// Compact Review Item Thumbnail
const ReviewItemThumbnail = ({ src, name }) => {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="w-10 h-10 rounded-lg bg-white border border-transt-border-subtle flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs">
      {src && !hasError ? (
        <img
          src={src}
          alt={name || 'Product'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <Package className="w-5 h-5 text-transt-green" />
      )}
    </div>
  );
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, totalPrice, totalItems, loading: cartLoading } = useSelector((state) => state.cart);

  // Form State
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Pre-fill user information when available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        shipping_name: prev.shipping_name || user.name || user.username || '',
        shipping_email: prev.shipping_email || user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.shipping_name.trim()) {
      errors.shipping_name = 'Recipient full name is required.';
    }
    if (!formData.shipping_email.trim()) {
      errors.shipping_email = 'Contact email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.shipping_email)) {
      errors.shipping_email = 'Please provide a valid email address.';
    }
    if (!formData.shipping_phone.trim()) {
      errors.shipping_phone = 'Phone number is required for delivery.';
    } else if (formData.shipping_phone.trim().length < 7) {
      errors.shipping_phone = 'Please enter a valid phone number.';
    }
    if (!formData.shipping_address.trim()) {
      errors.shipping_address = 'Full delivery street address is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const order = await dispatch(
        createOrder({
          shipping_name: formData.shipping_name.trim(),
          shipping_email: formData.shipping_email.trim(),
          shipping_phone: formData.shipping_phone.trim(),
          shipping_address: formData.shipping_address.trim(),
        })
      ).unwrap();

      // Synchronize Redux cart state immediately
      dispatch(fetchCartAsync());

      // Redirect to Order Detail / Confirmation page
      navigate(`/orders/${order.id}`, { state: { newOrder: true } });
    } catch (err) {
      console.error('Failed to create order:', err);
      const errMsg =
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to process order. Please verify your details and try again.';
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedTotalPrice =
    typeof totalPrice === 'number'
      ? totalPrice.toFixed(2)
      : parseFloat(totalPrice || 0).toFixed(2);

  // If cart is empty and not loading, show Empty Cart state
  if (!cartLoading && items.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Your cart is empty"
          message="You cannot proceed to checkout with an empty cart. Browse our products to add items."
          actionText="Explore Products"
          onAction={() => navigate(ROUTES.PRODUCTS)}
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12 space-y-8 max-w-7xl">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.CART}
          className="inline-flex items-center text-sm font-semibold text-transt-text-muted hover:text-transt-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Return to Shopping Cart
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="accent">Step 2: Order Finalization</Badge>
        </div>
      </div>

      {/* Header */}
      <div className="pb-6 border-b border-transt-border flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Express Checkout</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transt-green-dark mt-2 tracking-tight">
            Checkout & Delivery Destination
          </h1>
          <p className="text-xs sm:text-sm text-transt-text-muted mt-1 max-w-2xl leading-relaxed">
            Provide your destination information to finalize your order. Your product inventory and prices will be locked atomically.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-transt-text-muted bg-transt-surface-cream px-3 py-1.5 rounded-xl border border-transt-border">
          <Lock className="w-3.5 h-3.5 text-transt-green" />
          <span>256-Bit Encrypted Order</span>
        </div>
      </div>

      {/* Submission Error Banner */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to place order</p>
            <p className="text-xs text-red-700 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Main Expansive 2-Column Grid */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column (7 Cols on desktop): Delivery Destination & Fulfillment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Delivery Details Card */}
          <div className="bg-white rounded-3xl border border-transt-border p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-transt-border-subtle">
              <h2 className="text-lg font-bold text-transt-green-dark flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-transt-green" />
                1. Delivery Destination
              </h2>
              <span className="text-xs text-transt-text-muted font-medium">All fields required</span>
            </div>

            {/* Structured Balanced Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Row 1: Full Name (Full Width) */}
              <div className="sm:col-span-2">
                <Input
                  label="Recipient Full Name"
                  id="shipping_name"
                  name="shipping_name"
                  placeholder="e.g. Jane Doe"
                  value={formData.shipping_name}
                  onChange={handleChange}
                  error={formErrors.shipping_name}
                  required
                />
              </div>

              {/* Row 2: Contact Email (Col 1) & Phone Number (Col 2) */}
              <div>
                <Input
                  label="Contact Email"
                  id="shipping_email"
                  name="shipping_email"
                  type="email"
                  placeholder="e.g. jane@example.com"
                  value={formData.shipping_email}
                  onChange={handleChange}
                  error={formErrors.shipping_email}
                  required
                />
              </div>

              <div>
                <Input
                  label="Contact Phone Number"
                  id="shipping_phone"
                  name="shipping_phone"
                  placeholder="e.g. +91 9876543210"
                  value={formData.shipping_phone}
                  onChange={handleChange}
                  error={formErrors.shipping_phone}
                  required
                />
              </div>

              {/* Row 3: Street Address (Full Width) */}
              <div className="sm:col-span-2 space-y-1.5">
                <label
                  htmlFor="shipping_address"
                  className="block text-xs font-bold text-transt-text uppercase tracking-wider"
                >
                  Full Street Address & Landmark Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  rows={4}
                  placeholder="Apartment / Flat / House No., Building Name, Street, Area, City, State, PIN Code"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-transt-text text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-transt-green/20 ${
                    formErrors.shipping_address
                      ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                      : 'border-transt-border hover:border-transt-green/50 focus:border-transt-green'
                  }`}
                  required
                />
                {formErrors.shipping_address && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.shipping_address}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Order Fulfillment Mode */}
          <div className="bg-white rounded-3xl border border-transt-border p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-transt-green-dark pb-3 border-b border-transt-border-subtle flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-transt-green" />
              2. Fulfillment & Price Lock
            </h2>

            <div className="p-4 sm:p-5 rounded-2xl bg-transt-surface-cream border border-transt-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-full bg-transt-green text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-transt-green-dark block">
                    Direct Order Placement & Atomic Snapshot Lock
                  </span>
                  <p className="text-xs text-transt-text-muted mt-0.5">
                    Catalog prices and inventory stock are locked immutably into your order.
                  </p>
                </div>
              </div>
              <Badge variant="accent">Standard</Badge>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (5 Cols on desktop): Sleek Order Review */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-transt-border p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-transt-border-subtle">
              <h2 className="text-base font-bold text-transt-green-dark">
                Order Review
              </h2>
              <Badge variant="neutral">{totalItems} {totalItems === 1 ? 'item' : 'items'}</Badge>
            </div>

            {/* Compact Item Review List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const product = item.product || {};
                const unitPrice =
                  typeof product.price === 'number'
                    ? product.price.toFixed(2)
                    : parseFloat(product.price || 0).toFixed(2);
                const subtotal =
                  typeof item.subtotal === 'number'
                    ? item.subtotal.toFixed(2)
                    : parseFloat(item.subtotal || (product.price * item.quantity)).toFixed(2);

                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-transt-surface-cream/70 border border-transt-border-subtle flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ReviewItemThumbnail src={product.image} name={product.name} />
                      <div className="min-w-0 flex-1">
                        <h4
                          className="text-xs font-bold text-transt-green-dark truncate"
                          title={product.name}
                        >
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-transt-text-muted">
                          {item.quantity} × <span className="font-semibold text-transt-text">${unitPrice}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-transt-green flex-shrink-0">
                      ${subtotal}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financial Summary */}
            <div className="space-y-2.5 pt-3 border-t border-transt-border-subtle text-xs sm:text-sm">
              <div className="flex justify-between text-transt-text-muted">
                <span>Total Items</span>
                <span className="font-semibold text-transt-text">{totalItems} units</span>
              </div>
              <div className="flex justify-between text-transt-text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-transt-text">${formattedTotalPrice}</span>
              </div>
              <div className="flex justify-between text-transt-text-muted">
                <span>Transt Delivery</span>
                <span className="font-semibold text-transt-green">Free</span>
              </div>

              <div className="pt-3 border-t border-transt-border-subtle flex justify-between items-baseline">
                <span className="text-sm font-bold text-transt-green-dark">Grand Total</span>
                <span className="text-xl font-black text-transt-green">${formattedTotalPrice}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-md py-3 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Placing Order...'
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Place Order (${formattedTotalPrice})
                </>
              )}
            </Button>

            <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-transt-text-muted text-center">
              <Lock className="w-3 h-3 text-transt-green flex-shrink-0" />
              <span>Atomic transaction & Price Snapshot Lock</span>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default CheckoutPage;
