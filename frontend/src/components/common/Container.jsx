import React from 'react';

/**
 * Reusable Container Component
 * Provides expansive, full-screen responsive max-width and horizontal padding.
 */
export const Container = ({
  children,
  className = '',
  size = 'default', // 'sm' | 'default' | 'lg' | 'full'
  as: Component = 'div',
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-4xl',
    default: 'max-w-[1440px]',
    lg: 'max-w-[1600px]',
    full: 'max-w-full',
  };

  return (
    <Component
      className={`mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 w-full ${sizeClasses[size] || sizeClasses.default} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
