import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notificationService, type Notification } from '@/services/notification.service';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const NotificationsPanel = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications({ limit: 20 });
      if (response.data) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.stats?.unread || 0);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Fallback to mock data if API doesn't exist yet
      setNotifications([
        {
          id: '1',
          type: 'success',
          title: 'Analysis Complete',
          message: 'Project "My App" analysis has finished',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          actionUrl: '/app/projects/1',
          actionLabel: 'View Results'
        },
        {
          id: '2',
          type: 'info',
          title: 'New Team Member',
          message: 'Sarah Adams joined your team',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          actionUrl: '/app/team'
        },
        {
          id: '3',
          type: 'success',
          title: 'Diagram Generated',
          message: 'Architecture diagram is ready',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          actionUrl: '/app/diagrams'
        },
      ]);
      setUnreadCount(2);
    } finally {
      setLoading(false);
    }
  };

  // Listen for real-time notifications via window events (WebSocket integration)
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      const notification = event.detail;
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    window.addEventListener('notification:new' as any, handleNewNotification);

    return () => {
      window.removeEventListener('notification:new' as any, handleNewNotification);
    };
  }, []);

  // Load on mount and when dropdown opens
  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setOpen(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case 'error':
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case 'warning':
        return <div className="w-2 h-2 rounded-full bg-amber-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-blue-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-4 w-4 text-neutral-600" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-neutral-500 mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-900 mb-1">No notifications</p>
              <p className="text-xs text-neutral-500 text-center">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'px-4 py-3 hover:bg-neutral-50 transition-colors group cursor-pointer',
                    !notification.read && 'bg-blue-50/30'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={cn(
                          'text-sm leading-tight',
                          !notification.read ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'
                        )}>
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-neutral-400" />
                        </Button>
                      </div>
                      <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {notification.actionLabel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-blue-600 hover:text-blue-700 px-2"
                          >
                            {notification.actionLabel}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="flex-shrink-0 h-6 w-6 p-0"
                      >
                        <Check className="w-3.5 h-3.5 text-neutral-400" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
