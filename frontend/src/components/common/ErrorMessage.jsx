import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Error Message component with muted brand-compatible red styling
 */
export const ErrorMessage = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-transt-error bg-transt-error-light p-5 text-transt-text shadow-sm ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex-shrink-0 text-transt-error mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-transt-error">{title}</h3>
          {message && (
            <p className="mt-1 text-sm text-transt-text-secondary leading-relaxed">{message}</p>
          )}
          {onRetry && (
            <div className="mt-3.5">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="bg-white hover:bg-transt-surface-cream text-transt-error border-transt-error/40 hover:border-transt-error"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
