import React from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    description, 
    error, 
    icon, 
    iconPosition = 'left',
    fullWidth = true,
    className,
    type,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const inputId = React.useId();
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const inputClasses = clsx(
      // Base styles
      'flex h-10 w-full rounded-md bg-white dark:bg-dark-bg-secondary border app-border px-3 py-2 text-sm transition-theme',
      'placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:border-primary-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      
      // Icon padding
      {
        'pl-10': icon && iconPosition === 'left',
        'pr-10': (icon && iconPosition === 'right') || isPassword,
      },
      
      // Error state
      error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
      
      // Custom className
      className
    );

    return (
      <div className={clsx('space-y-2', fullWidth ? 'w-full' : 'inline-block')}>
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-light-text dark:text-dark-text"
          >
            {label}
          </label>
        )}
        
        {description && !error && (
          <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
            {description}
          </p>
        )}
        
        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                {icon}
              </span>
            </div>
          )}
          
          {/* Input Field */}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={inputClasses}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          
          {/* Right Icon or Password Toggle */}
          {(icon && iconPosition === 'right') || isPassword ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text dark:hover:text-dark-text transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <span className="text-light-text-tertiary dark:text-dark-text-tertiary pointer-events-none">
                  {icon}
                </span>
              )}
            </div>
          ) : null}
        </div>
        
        {error && (
          <p className="text-sm text-error-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
