import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  brutalist?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  icon,
  className,
  brutalist = true,
  ...props
}) => {
  const inputClasses = clsx(
    brutalist ? 'input-brutalist' : 'border border-gray-300 rounded-md px-3 py-2',
    'w-full focus:outline-none',
    {
      'border-red-500': error,
    },
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-black mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          className={clsx(inputClasses, {
            'pl-10': icon,
          })}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-600">{helper}</p>
      )}
    </div>
  );
};
