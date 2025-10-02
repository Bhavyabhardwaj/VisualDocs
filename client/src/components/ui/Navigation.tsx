import React from 'react';
import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: number;
  external?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  children, 
  icon, 
  badge, 
  external, 
  onClick 
}) => {
  const location = useLocation();
  const isActive = location.pathname === href || 
    (href !== '/' && location.pathname.startsWith(href));

  const classes = clsx(
    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150',
    'hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary',
    {
      'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': isActive,
      'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text': !isActive,
    }
  );

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
      {badge && badge > 0 && (
        <span className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded-full">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={classes} onClick={onClick}>
      {content}
    </Link>
  );
};

interface NavSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const NavSection: React.FC<NavSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-1">
      {title && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <nav className="space-y-1">{children}</nav>
    </div>
  );
};

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  separator?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  separator = '/' 
}) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="mx-2 text-light-text-tertiary dark:text-dark-text-tertiary">
              {separator}
            </span>
          )}
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-light-text dark:text-dark-text font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
