import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  clickable?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  clickable = false,
  padding = 'lg',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4', 
    lg: 'p-6',
    xl: 'p-8',
  };

  const classes = clsx(
    'bg-white border-2 border-black',
    paddingClasses[padding],
    {
      'shadow-[4px_4px_0px_0px_#000]': true,
      'hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-150': hover,
      'cursor-pointer': clickable,
    },
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card sub-components
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  as: Component = 'h3',
  ...props
}) => {
  return (
    <Component className={clsx('text-xl font-bold text-black', className)} {...props}>
      {children}
    </Component>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx('text-gray-700', className)} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx('mt-4 pt-4 border-t-2 border-gray-200', className)} {...props}>
      {children}
    </div>
  );
};
