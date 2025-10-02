import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  brutalist?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  brutalist = true,
  hover = false,
  ...props
}) => {
  const classes = clsx(
    brutalist ? 'card' : 'bg-white border border-gray-200 rounded-lg p-6',
    {
      'hover-brutalist': hover && brutalist,
      'hover:shadow-lg transition-shadow duration-200': hover && !brutalist,
    },
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

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

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3 className={clsx('text-xl font-bold text-black', className)} {...props}>
      {children}
    </h3>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx(className)} {...props}>
      {children}
    </div>
  );
};
