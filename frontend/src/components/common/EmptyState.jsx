import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Empty State component
 */
export const EmptyState = ({
  title = 'No items found',
  message = 'We could not find any products matching your current criteria.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`py-16 px-4 text-center rounded-3xl border border-dashed border-transt-border bg-white/60 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-transt-surface-cream border border-transt-border flex items-center justify-center text-transt-text-muted mx-auto mb-4">
        <PackageOpen className="w-8 h-8 text-transt-green" />
      </div>
      <h3 className="text-lg font-bold text-transt-green-dark">{title}</h3>
      <p className="mt-1.5 text-sm text-transt-text-muted max-w-sm mx-auto leading-relaxed">
        {message}
      </p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
