import React from 'react';
import { clsx } from 'clsx';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'gray' | 'black';
  label?: string;
  showValue?: boolean;
  showPercentage?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'emerald',
  label,
  showValue = false,
  showPercentage = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const containerClasses = clsx(
    'w-full bg-gray-200 border-2 border-black',
    {
      'h-2': size === 'sm',
      'h-4': size === 'md',
      'h-6': size === 'lg',
    }
  );

  const barClasses = clsx(
    'h-full transition-all duration-300 ease-out',
    {
      'bg-emerald-500': color === 'emerald',
      'bg-gray-500': color === 'gray',
      'bg-black': color === 'black',
    }
  );

  return (
    <div className="w-full">
      {(label || showValue || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {label && <span className="text-sm font-bold text-black">{label}</span>}
            {showValue && (
              <span className="text-sm font-mono text-gray-600">
                {value}/{max}
              </span>
            )}
          </div>
          {showPercentage && (
            <span className="text-sm font-mono font-bold text-black">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={containerClasses}>
        <div
          className={barClasses}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
