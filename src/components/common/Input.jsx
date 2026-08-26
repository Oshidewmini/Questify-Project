import React, { useState } from 'react';
import './Input.css';

export const Input = ({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className={`input-container ${error ? 'input-error' : ''} ${isFocused ? 'input-focused' : ''} ${disabled ? 'input-disabled' : ''}`}>
        {Icon && <Icon size={18} className="input-left-icon" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className="input-field"
          {...props}
        />
        {RightIcon && (
          <div className="input-right-icon" onClick={onRightIconClick} style={{ cursor: onRightIconClick ? 'pointer' : 'default' }}>
            <RightIcon size={18} />
          </div>
        )}
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};
