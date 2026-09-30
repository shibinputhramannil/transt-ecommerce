import React from 'react';

/**
 * Reusable Product Grid wrapper
 * Enforces uniform 1/2/3/4 column responsive grid layout
 */
export const ProductGrid = ({
  children,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default ProductGrid;
