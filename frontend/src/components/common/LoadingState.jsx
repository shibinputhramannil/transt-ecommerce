import React from 'react';

/**
 * Reusable Loading State component adhering to Transt theme
 */
export const LoadingState = ({
  message = 'Loading...',
  fullPage = false,
  className = '',
}) => {
  const containerClass = fullPage
    ? 'min-h-[60vh] flex flex-col items-center justify-center'
    : 'py-12 flex flex-col items-center justify-center';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-3 border-transt-border border-t-transt-green animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-xs font-medium text-transt-text-muted tracking-wider uppercase animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
