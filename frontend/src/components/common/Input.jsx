import React from 'react';

/**
 * Reusable Form Input component adhering to the Transt theme
 */
export const Input = ({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold text-transt-text uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-2.5 rounded-xl border ${
          error ? 'border-transt-error bg-transt-error-light/40' : 'border-transt-border bg-white'
        } text-transt-text text-sm transition-colors placeholder:text-transt-text-muted/60 focus:outline-none focus:border-transt-green focus:ring-2 focus:ring-transt-green-light ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-transt-error mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-transt-text-muted mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
