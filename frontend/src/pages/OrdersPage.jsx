import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import OrderCard from '../components/common/OrderCard';
import { getOrders, selectOrders, selectOrdersLoading, selectOrdersError } from '../store/slices/ordersSlice';
import { ROUTES } from '../utils/constants';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const fetchOrdersList = () => {
    dispatch(getOrders());
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getOrders());
    }
  }, [isAuthenticated, dispatch]);

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  // 1. Unauthenticated Prompt
  if (!isAuthenticated) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Sign in to view your orders"
          message="Please log into your Transt account to track packages, view receipts, and access order history."
          actionText="Sign In Now"
          onAction={() => navigate(ROUTES.LOGIN)}
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="pb-6 border-b border-transt-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Order History</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transt-green-dark mt-2 tracking-tight">
            Your Orders
          </h1>
          <p className="text-sm text-transt-text-muted mt-1">
            Track deliveries, view receipts, and monitor historical purchases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchOrdersList}
            disabled={loading}
            title="Refresh order history"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline" size="sm">
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3 text-sm">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to load order history</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchOrdersList}
            className="text-xs underline font-bold hover:text-red-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-transt-border p-6 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-transt-surface-cream"></div>
                  <div className="space-y-2">
                    <div className="w-28 h-4 bg-transt-surface-cream rounded"></div>
                    <div className="w-20 h-3 bg-transt-surface-cream rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-6 bg-transt-surface-cream rounded-full"></div>
              </div>
              <div className="pt-3 border-t border-transt-border-subtle flex justify-between">
                <div className="w-32 h-4 bg-transt-surface-cream rounded"></div>
                <div className="w-28 h-8 bg-transt-surface-cream rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty Orders State */
        <EmptyState
          title="No orders yet"
          message="You haven't placed any orders yet. Discover our curated catalog and start shopping today."
          actionText="Explore Catalog"
          onAction={() => navigate(ROUTES.PRODUCTS)}
          className="my-10"
        />
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              orderId={order.order_number}
              date={formatDate(order.created_at)}
              status={order.status}
              total={order.total_amount}
              itemCount={order.item_count || 1}
              onViewDetails={() => navigate(`/orders/${order.id}`)}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default OrdersPage;
