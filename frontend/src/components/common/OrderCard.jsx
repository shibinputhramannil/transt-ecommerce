import React from 'react';
import { Package, Calendar, ArrowRight } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

/**
 * Reusable Order Card adhering to Transt theme
 */
export const OrderCard = ({
  orderId = 'TRN-10001',
  date = 'Sep 29, 2026',
  status = 'PENDING',
  total = '0.00',
  itemCount = 1,
  onViewDetails,
}) => {
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
        return <Badge variant="neutral">Pending</Badge>;
    }
  };

  const formattedTotal = typeof total === 'number' ? total.toFixed(2) : parseFloat(total || 0).toFixed(2);

  return (
    <div className="rounded-2xl border border-transt-border bg-white p-5 sm:p-6 shadow-sm hover:border-transt-green/40 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-transt-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-transt-green-light text-transt-green flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-sm font-extrabold text-transt-green tracking-wide">
              {orderId}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-transt-text-muted mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div>{getStatusBadge(status)}</div>
          <div className="text-right">
            <span className="text-[11px] text-transt-text-muted block uppercase tracking-wider font-semibold">
              Total Amount
            </span>
            <span className="text-base font-extrabold text-transt-green-dark">
              ${formattedTotal}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-transt-text-muted">
        <span>
          Includes <strong>{itemCount}</strong> {itemCount === 1 ? 'item' : 'items'} via Transt Standard Delivery
        </span>
        <Button variant="outline" size="sm" onClick={onViewDetails} className="self-start sm:self-auto">
          View Order Details
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;
