import { useState, useEffect } from 'react';
import { Bell, FileText, MessageSquare, Users, BarChart3, Loader2, CheckCheck, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { useUserActivity } from '@/hooks/useApi';
import type { Activity } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Map activity type to notification type
const mapActivityToNotification = (activity: Activity) => {
  let type: 'comment' | 'mention' | 'project' | 'export' | 'collaboration' | 'analysis' = 'project';
  
  if (activity.type.includes('comment')) type = 'comment';
  else if (activity.type.includes('mention')) type = 'mention';
  else if (activity.type.includes('export') || activity.type.includes('diagram')) type = 'export';
  else if (activity.type.includes('team') || activity.type.includes('collaboration')) type = 'collaboration';
  else if (activity.type.includes('analysis')) type = 'analysis';
  
  // Build description safely
  const userName = activity.user?.name || 'You';
  const description = `${userName} ${activity.action} ${activity.target}`;
  
  return {
    id: activity.id,
    type,
    title: activity.action,
    target: activity.target,
    description,
    timestamp: new Date(activity.timestamp),
    read: false,
    actionUrl: activity.metadata?.url || (activity.projectId ? `/app/projects/${activity.projectId}` : undefined)
  };
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'comment':
      return <MessageSquare className="w-4 h-4" />;
    case 'mention':
      return <Users className="w-4 h-4" />;
    case 'analysis':
      return <BarChart3 className="w-4 h-4" />;
    case 'export':
      return <FileText className="w-4 h-4" />;
    case 'collaboration':
      return <Users className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const getIconStyles = (type: string) => {
  switch (type) {
    case 'comment':
      return 'bg-emerald-50 text-emerald-600';
    case 'analysis':
      return 'bg-brand-bg text-brand-primary';
    case 'export':
      return 'bg-violet-50 text-violet-600';
    case 'collaboration':
      return 'bg-sky-50 text-sky-600';
    default:
      return 'bg-neutral-100 text-neutral-600';
  }
};

export const NotificationsMenu = () => {
  const navigate = useNavigate();
  const { activities, isLoading, error, refetch } = useUserActivity();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('readNotificationIds');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Refetch when dropdown opens
  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  // Map activities to notifications
  const notifications = activities.map(mapActivityToNotification);
  
  // Filter unread notifications
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markAsRead = (id: string) => {
    setReadIds(prev => {
      const updated = new Set(prev).add(id);
      localStorage.setItem('readNotificationIds', JSON.stringify([...updated]));
      return updated;
    });
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
    localStorage.setItem('readNotificationIds', JSON.stringify([...allIds]));
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className={cn(
            "relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
            "hover:bg-neutral-100",
            isOpen && "bg-neutral-100"
          )}
        >
          <Bell className={cn(
            "w-5 h-5 transition-colors",
            isOpen ? "text-neutral-900" : "text-neutral-600 hover:text-neutral-900"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-primary rounded-full text-[10px] text-white flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="w-[360px] p-0 !bg-white !border-neutral-200 shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 !bg-neutral-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 !text-neutral-600" />
            <h3 className="text-sm font-semibold !text-neutral-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 bg-brand-primary text-white text-[10px] font-medium rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              className="flex items-center gap-1 text-xs !text-neutral-500 hover:!text-neutral-900 font-medium transition-colors px-2 py-1 rounded-md hover:bg-neutral-100"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
                <Loader2 className="w-5 h-5 !text-neutral-400 animate-spin" />
              </div>
              <p className="text-sm !text-neutral-500">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-sm !text-neutral-700 font-medium mb-1">Failed to load</p>
              <p className="text-xs !text-neutral-500 mb-3">Something went wrong</p>
              <button 
                onClick={() => refetch()}
                className="text-xs text-brand-primary hover:underline font-medium"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5 !text-neutral-400" />
              </div>
              <p className="text-sm !text-neutral-700 font-medium mb-1">All caught up!</p>
              <p className="text-xs !text-neutral-500">No notifications yet</p>
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((notification, index) => {
                const isRead = readIds.has(notification.id);
                const isLast = index === notifications.length - 1;
                
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
                      "hover:bg-neutral-50",
                      !isRead && "bg-brand-bg/30",
                      !isLast && "border-b border-neutral-100"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      getIconStyles(notification.type)
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium !text-neutral-900 leading-snug capitalize">
                        {notification.title}
                      </p>
                      <p className="text-xs !text-neutral-600 mt-0.5 truncate">
                        {notification.target}
                      </p>
                      <p className="text-[11px] !text-neutral-400 mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!isRead && (
                      <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && !isLoading && (
          <div className="border-t border-neutral-200 px-3 py-2 !bg-neutral-50">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate('/app/dashboard');
              }}
              className="w-full py-2 text-xs text-center !text-neutral-600 hover:!text-neutral-900 font-medium rounded-md hover:bg-neutral-100 transition-colors"
            >
              View all activity
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
