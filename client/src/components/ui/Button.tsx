import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Marketing variants (for landing page)
        'marketing-primary': 'bg-gradient-to-r from-marketing-primary to-marketing-secondary text-white shadow-glow hover:shadow-glow-lg hover:scale-105',
        'marketing-secondary': 'glass-effect text-white border border-white/20 hover:bg-white/10',
        
        // App variants (for interior)
        'primary': 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 app-shadow hover:app-shadow-md',
        'secondary': 'bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text border app-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary app-shadow',
        'ghost': 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary hover:text-light-text dark:hover:text-dark-text',
        'outline': 'border app-border bg-transparent hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary text-light-text dark:text-dark-text',
        
        // Utility variants
        'success': 'bg-success-500 text-white hover:bg-success-600',
        'warning': 'bg-warning-500 text-white hover:bg-warning-600',
        'error': 'bg-error-500 text-white hover:bg-error-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-6 text-base',
        xl: 'h-12 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, size, className }), 'interactive-press')}
        disabled={loading || disabled}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
