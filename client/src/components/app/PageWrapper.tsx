import React from 'react';
import { clsx } from 'clsx';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  description,
  actions,
  className,
  maxWidth = 'full',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-none',
    full: 'w-full',
  };

  return (
    <div className={clsx('min-h-full', className)}>
      <div className={clsx('mx-auto px-4 sm:px-6 lg:px-8 py-8', maxWidthClasses[maxWidth])}>
        {/* Page Header */}
        {(title || description || actions) && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};
