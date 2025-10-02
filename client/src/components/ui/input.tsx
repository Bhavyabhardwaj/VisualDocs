import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  icon,
  className,
  fullWidth = true,
  ...props
}) => {
  const inputId = React.useId();

  const inputClasses = clsx(
    'bg-white border-2 border-black font-medium transition-all duration-150',
    'focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_0_2px_rgba(0,200,150,0.2)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'w-full': fullWidth,
      'border-red-500 focus:border-red-500': error,
      'pl-12': icon,
      'px-4 py-3': true,
    },
    className
  );

  const labelClasses = 'block text-sm font-bold text-black mb-2';
  const helperClasses = 'mt-1 text-sm text-gray-600';
  const errorClasses = 'mt-1 text-sm font-medium text-red-600';

  return (
    <div className={fullWidth ? 'w-full' : 'inline-block'}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
      </div>

      {error && (
        <p className={errorClasses}>{error}</p>
      )}
      
      {helper && !error && (
        <p className={helperClasses}>{helper}</p>
      )}
    </div>
  );
};
