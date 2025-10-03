import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles - Premium feel
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        // Marketing variants (for landing page) - Stunning effects
        'marketing-primary': 'bg-gradient-to-r from-marketing-primary via-marketing-secondary to-marketing-accent text-white font-semibold marketing-glow-sm hover:marketing-glow hover:scale-105 active:scale-100 shadow-lg',
        'marketing-secondary': 'glass-effect-strong text-white border border-white/20 hover:bg-white/15 hover:border-white/30 backdrop-blur-xl',
        'marketing-ghost': 'text-marketing-primary hover:bg-white/5 hover:text-marketing-secondary',
        
        // App variants (for interior) - Clean & professional
        'primary': 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md active:shadow-sm font-medium',
        'secondary': 'bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary shadow-sm hover:shadow',
        'ghost': 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary hover:text-light-text dark:hover:text-dark-text',
        'outline': 'border border-light-border dark:border-dark-border bg-transparent hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary text-light-text dark:text-dark-text',
        'link': 'text-primary-500 underline-offset-4 hover:underline',
        
        // Utility variants
        'success': 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-sm',
        'warning': 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 shadow-sm',
        'error': 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-sm',
        'info': 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/30',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        md: 'h-9 px-4 text-sm rounded-lg',
        lg: 'h-11 px-6 text-base rounded-lg',
        xl: 'h-13 px-8 text-lg rounded-xl',
        icon: 'h-9 w-9 p-0',
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
