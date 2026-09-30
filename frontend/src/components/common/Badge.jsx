import React from 'react';

/**
 * Reusable Badge component for status, tags, and category labels
 */
export const Badge = ({
  children,
  variant = 'default', // 'default' | 'primary' | 'success' | 'accent' | 'warning' | 'error' | 'neutral'
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-transt-surface-cream text-transt-green border border-transt-border',
    primary: 'bg-transt-green text-white font-semibold shadow-sm',
    success: 'bg-transt-green-light text-transt-green font-semibold border border-transt-green-subtle',
    accent: 'bg-transt-accent-light text-transt-accent-dark font-medium border border-transt-accent-border',
    warning: 'bg-amber-50 text-amber-800 font-medium border border-amber-200',
    error: 'bg-transt-error-light text-transt-error font-medium border border-transt-error',
    neutral: 'bg-white text-transt-text-muted border border-transt-border',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
