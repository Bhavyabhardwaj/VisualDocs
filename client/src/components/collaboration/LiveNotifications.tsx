import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, MessageSquare, Sparkles, AlertTriangle, CheckCircle, Info, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'comment' | 'ai' | 'conflict' | 'success' | 'info' | 'team';

interface LiveNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  user?: {
    name: string;
    avatar?: string;
    color?: string;
  };
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }[];
  duration?: number; // auto-dismiss after ms (0 = manual dismiss only)
}

interface LiveNotificationsProps {
  notifications: LiveNotification[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'comment':
      return MessageSquare;
    case 'ai':
      return Sparkles;
    case 'conflict':
      return AlertTriangle;
    case 'success':
      return CheckCircle;
    case 'team':
      return Users;
    default:
      return Info;
  }
};

const getNotificationColors = (type: NotificationType) => {
  switch (type) {
    case 'comment':
      return 'border-blue-200 bg-blue-50';
    case 'ai':
      return 'border-purple-200 bg-purple-50';
    case 'conflict':
      return 'border-orange-200 bg-orange-50';
    case 'success':
      return 'border-green-200 bg-green-50';
    case 'team':
      return 'border-indigo-200 bg-indigo-50';
    default:
      return 'border-neutral-200 bg-neutral-50';
  }
};

const getIconColor = (type: NotificationType) => {
  switch (type) {
    case 'comment':
      return 'text-blue-600';
    case 'ai':
      return 'text-purple-600';
    case 'conflict':
      return 'text-orange-600';
    case 'success':
      return 'text-green-600';
    case 'team':
      return 'text-indigo-600';
    default:
      return 'text-neutral-600';
  }
};

const getPositionClasses = (position: string) => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    default: // top-right
      return 'top-4 right-4';
  }
};

export const LiveNotifications = ({ 
  notifications, 
  onDismiss,
  position = 'top-right'
}: LiveNotificationsProps) => {
  return (
    <div className={cn(
      "fixed z-50 flex flex-col gap-3 w-96 max-w-[calc(100vw-2rem)]",
      getPositionClasses(position)
    )}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const colors = getNotificationColors(notification.type);
          const iconColor = getIconColor(notification.type);

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                x: 400, 
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                "relative bg-white rounded-lg shadow-lg border-2 overflow-hidden",
                colors
              )}
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 opacity-50"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0)',
                    '0 0 0 4px rgba(59, 130, 246, 0.1)',
                    '0 0 0 0 rgba(59, 130, 246, 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <div className="relative p-4">
                <div className="flex gap-3">
                  {/* Icon or Avatar */}
                  {notification.user ? (
                    <Avatar className="h-10 w-10 shrink-0">
                      {notification.user.avatar && (
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      )}
                      <AvatarFallback 
                        style={{ backgroundColor: notification.user.color || '#3b82f6' }}
                        className="text-white"
                      >
                        {notification.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className={cn(
                      "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center",
                      colors
                    )}>
                      <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-neutral-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-neutral-700 mt-0.5">
                          {notification.message}
                        </p>
                      </div>

                      {/* Dismiss button */}
                      <button
                        onClick={() => onDismiss(notification.id)}
                        className="shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Actions */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {notification.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={action.variant || 'default'}
                            onClick={() => {
                              action.onClick();
                              onDismiss(notification.id);
                            }}
                            className="h-7 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar for auto-dismiss */}
              {notification.duration && notification.duration > 0 && (
                <motion.div
                  className={cn("h-1", iconColor.replace('text-', 'bg-'))}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{
                    duration: notification.duration / 1000,
                    ease: 'linear',
                  }}
                  onAnimationComplete={() => onDismiss(notification.id)}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing notifications
export const useLiveNotifications = () => {
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);

  const addNotification = (notification: Omit<LiveNotification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss if duration is set
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, notification.duration);
    }

    return id;
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAll,
  };
};
