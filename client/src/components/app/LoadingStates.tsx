import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          {message}
        </p>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  lines = 1,
  avatar = false 
}) => {
  return (
    <div className={clsx('animate-pulse', className)}>
      {avatar && (
        <div className="w-10 h-10 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full mb-3" />
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded',
              i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-bg-secondary border app-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-1/3" />
          <div className="h-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded" />
        <div className="h-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-5/6" />
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto w-12 h-12 text-light-text-tertiary dark:text-dark-text-tertiary mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
        {title}
      </h3>
      <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action}
    </div>
  );
};
