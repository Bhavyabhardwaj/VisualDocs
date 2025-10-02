import React from 'react';
import { clsx } from 'clsx';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = true,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={clsx(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      padding ? 'px-4 sm:px-6 lg:px-8' : '',
      className
    )}>
      {children}
    </div>
  );
};
