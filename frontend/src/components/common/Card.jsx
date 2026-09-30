import React from 'react';

/**
 * Reusable Card container component
 */
export const Card = ({
  children,
  className = '',
  variant = 'white', // 'white' | 'cream'
  hoverable = false,
  ...props
}) => {
  const bgClass = variant === 'cream' ? 'bg-transt-surface-cream' : 'bg-white';
  const hoverClass = hoverable
    ? 'transition-all duration-200 hover:border-transt-green/50 hover:shadow-md hover:-translate-y-0.5'
    : 'shadow-sm';

  return (
    <div
      className={`rounded-2xl border border-transt-border ${bgClass} ${hoverClass} p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
