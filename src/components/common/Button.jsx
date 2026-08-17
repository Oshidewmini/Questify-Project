import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, danger, success, ghost
  size = 'medium',      // small, medium, large
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const classes = `btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`;
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {Icon && <Icon size={size === 'small' ? 16 : size === 'large' ? 20 : 18} className="btn-icon" />}
      <span>{children}</span>
      {loading && <span className="btn-spinner">⟳</span>}
    </button>
  );
};
