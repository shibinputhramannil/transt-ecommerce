import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  Calendar,
  ArrowLeft,
  Truck,
  MapPin,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Clock,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import {
  getOrderById,
  clearCurrentOrder,
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
} from '../store/slices/ordersSlice';
import { ROUTES } from '../utils/constants';

// Clean Order Item Thumbnail
const OrderItemThumbnail = ({ src, name }) => {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="w-16 h-16 rounded-2xl bg-white border border-transt-border-subtle flex items-center justify-center text-transt-green flex-shrink-0 overflow-hidden shadow-sm">
      {src && !hasError ? (
        <img
          src={src}
          alt={name || 'Product'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <Package className="w-6 h-6 text-transt-green" />
      )}
    </div>
  );
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const isNewlyPlaced = location.state?.newOrder;

  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(getOrderById(id));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [isAuthenticated, id, dispatch]);

  const getStatusBadge = (orderStatus) => {
    const s = (orderStatus || '').toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return <Badge variant="success">Delivered</Badge>;
      case 'SHIPPED':
        return <Badge variant="accent">Shipped</Badge>;
      case 'PROCESSING':
        return <Badge variant="primary">Processing</Badge>;
      case 'CONFIRMED':
        return <Badge variant="primary">Confirmed</Badge>;
      case 'CANCELLED':
        return <Badge variant="error">Cancelled</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="neutral">Pending Confirmation</Badge>;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // 1. Unauthenticated Prompt
  if (!isAuthenticated) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Sign in to view this order"
          message="Please log in to your Transt account to view detailed order information."
          actionText="Sign In Now"
          onAction={() => navigate(ROUTES.LOGIN)}
        />
      </Container>
    );
  }

  // 2. Loading State
  if (loading) {
    return (
      <Container className="py-12 space-y-6 max-w-7xl">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-transt-surface-cream"></div>
          <div className="w-48 h-6 bg-transt-surface-cream rounded"></div>
        </div>
        <div className="bg-white rounded-3xl border border-transt-border p-8 space-y-6 animate-pulse">
          <div className="h-8 bg-transt-surface-cream rounded w-1/3"></div>
          <div className="h-24 bg-transt-surface-cream rounded"></div>
          <div className="h-32 bg-transt-surface-cream rounded"></div>
        </div>
      </Container>
    );
  }

  // 3. Error / Not Found State
  if (error || !order) {
    return (
      <Container className="py-16 max-w-4xl">
        <div className="p-8 rounded-3xl bg-white border border-transt-border text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-transt-green-dark">Order Unavailable</h2>
            <p className="text-sm text-transt-text-muted mt-2 max-w-md mx-auto">{error}</p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to={ROUTES.ORDERS}>
              <Button variant="primary" size="sm">
                View Your Orders
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => dispatch(getOrderById(id))}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const items = order.items || [];
  const formattedTotal = typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : parseFloat(order.total_amount || 0).toFixed(2);

  return (
    <Container className="py-8 lg:py-12 space-y-8 max-w-7xl">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.ORDERS}
          className="inline-flex items-center text-sm font-semibold text-transt-text-muted hover:text-transt-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Order History
        </Link>

        <Link to={ROUTES.PRODUCTS}>
          <Button variant="ghost" size="sm">
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* New Order Confirmation Banner */}
      {isNewlyPlaced && (
        <div className="p-5 rounded-3xl bg-transt-green-light border border-transt-green-subtle text-transt-green-dark flex items-start gap-4 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-transt-green flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold">Thank You! Your order has been placed successfully.</h3>
            <p className="text-xs text-transt-green-dark/80 mt-0.5 leading-relaxed">
              Order confirmation details have been recorded. You can track this order anytime from your account.
            </p>
          </div>
        </div>
      )}

      {/* Main Order Header Card */}
      <div className="bg-white rounded-3xl border border-transt-border p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-transt-border-subtle">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black text-transt-green tracking-wide">
                {order.order_number}
              </span>
              {getStatusBadge(order.status)}
            </div>
            <div className="flex items-center gap-2 text-xs text-transt-text-muted mt-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Placed on {formatDate(order.created_at)}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-transt-text-muted block uppercase tracking-wider font-semibold">
              Grand Total
            </span>
            <span className="text-3xl font-black text-transt-green-dark">
              ${formattedTotal}
            </span>
          </div>
        </div>

        {/* 2-Column Grid: Delivery Destination & Fulfillment Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Destination */}
          <div className="p-6 rounded-2xl bg-transt-surface-cream border border-transt-border-subtle space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-transt-green-dark pb-3 border-b border-transt-border-subtle">
              <Truck className="w-4 h-4 text-transt-green" />
              Delivery Destination
            </div>
            <div className="space-y-2.5 text-xs text-transt-text leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-sm text-transt-green-dark">
                <User className="w-3.5 h-3.5 text-transt-green flex-shrink-0" />
                <span>{order.shipping_name}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-transt-green flex-shrink-0 mt-0.5" />
                <span>{order.shipping_address}</span>
              </div>
              <div className="flex items-center gap-2 text-transt-text-muted">
                <Phone className="w-3.5 h-3.5 text-transt-green flex-shrink-0" />
                <span>{order.shipping_phone}</span>
              </div>
              <div className="flex items-center gap-2 text-transt-text-muted">
                <Mail className="w-3.5 h-3.5 text-transt-green flex-shrink-0" />
                <span>{order.shipping_email}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Snapshot */}
          <div className="p-6 rounded-2xl bg-transt-surface-cream border border-transt-border-subtle space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-transt-green-dark pb-3 border-b border-transt-border-subtle">
                <Package className="w-4 h-4 text-transt-green" />
                Order Snapshot
              </div>
              <div className="space-y-2.5 pt-2 text-xs text-transt-text-muted">
                <div className="flex justify-between">
                  <span>Line Items</span>
                  <strong className="text-transt-text">{items.length} unique products</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Units</span>
                  <strong className="text-transt-text">{order.item_count || items.reduce((acc, i) => acc + i.quantity, 0)} units</strong>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Method</span>
                  <strong className="text-transt-green">Transt Standard Express (Free)</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-transt-border-subtle flex justify-between items-baseline text-xs">
              <span className="font-semibold text-transt-text">Price Lock Status</span>
              <span className="text-transt-green font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Snapshot Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Breakdown */}
        <div className="space-y-4 pt-4 border-t border-transt-border-subtle">
          <h3 className="text-base font-bold text-transt-green-dark">
            Purchased Line Items ({items.length})
          </h3>

          <div className="space-y-3">
            {items.map((item) => {
              const unitPrice = typeof item.product_price === 'number' ? item.product_price.toFixed(2) : parseFloat(item.product_price || 0).toFixed(2);
              const subtotal = typeof item.subtotal === 'number' ? item.subtotal.toFixed(2) : parseFloat(item.subtotal || 0).toFixed(2);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-transt-surface-cream/50 border border-transt-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <OrderItemThumbnail src={item.product_image} name={item.product_name} />

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-transt-green-dark truncate" title={item.product_name}>
                        {item.product_name}
                      </h4>
                      <p className="text-xs text-transt-text-muted mt-0.5">
                        Unit Price: <span className="font-semibold text-transt-text">${unitPrice}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-transt-border-subtle">
                    <div className="text-xs text-transt-text-muted">
                      Qty: <span className="font-bold text-transt-text text-sm">{item.quantity}</span>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <span className="text-xs text-transt-text-muted block">Subtotal</span>
                      <span className="text-sm font-extrabold text-transt-green">
                        ${subtotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Breakdown Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-transt-surface-cream border border-transt-border space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-transt-text-muted">
              <span>Items Subtotal</span>
              <span className="font-semibold text-transt-text">${formattedTotal}</span>
            </div>
            <div className="flex justify-between text-transt-text-muted">
              <span>Transt Delivery & Logistics</span>
              <span className="font-semibold text-transt-green">Free</span>
            </div>
            <div className="pt-3 border-t border-transt-border-subtle flex justify-between items-baseline">
              <span className="text-base font-bold text-transt-green-dark">Total Amount Paid</span>
              <span className="text-2xl font-black text-transt-green">${formattedTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderDetailPage;
