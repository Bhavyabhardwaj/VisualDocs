import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <Card className={cn('border-2 border-dashed border-neutral-200', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-neutral-900 text-center">
          {title}
        </h3>
        <p className="text-neutral-600 text-center max-w-md mb-6 text-sm">
          {description}
        </p>
        {action && <div className="flex gap-3">{action}</div>}
      </CardContent>
    </Card>
  );
};
