import React from 'react';

/**
 * Reusable Button Component adhering to the Transt Brand Theme
 * Variants: primary | secondary | outline | ghost | danger
 */
export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-transt-green text-white hover:bg-transt-green-hover focus:ring-2 focus:ring-transt-green shadow-sm active:scale-[0.98]',
    secondary:
      'bg-transt-surface-cream text-transt-green border border-transt-green hover:bg-transt-green-light focus:ring-2 focus:ring-transt-green shadow-sm active:scale-[0.98]',
    outline:
      'bg-white text-transt-text border border-transt-border hover:border-transt-green hover:bg-transt-surface-cream focus:ring-2 focus:ring-transt-green',
    ghost:
      'bg-transparent text-transt-green hover:bg-transt-green-light focus:ring-2 focus:ring-transt-green',
    danger:
      'bg-transt-error text-white hover:opacity-90 focus:ring-2 shadow-sm active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
