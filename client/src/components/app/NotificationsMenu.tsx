import { useState } from 'react';
import { Bell, FileText, MessageSquare, Users, GitBranch, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useUserActivity } from '@/hooks/useApi';
import type { Activity } from '@/lib/api';

// Map activity type to notification type
const mapActivityToNotification = (activity: Activity) => {
  let type: 'comment' | 'mention' | 'project' | 'export' | 'collaboration' = 'project';
  
  if (activity.type.includes('comment')) type = 'comment';
  else if (activity.type.includes('mention')) type = 'mention';
  else if (activity.type.includes('export')) type = 'export';
  else if (activity.type.includes('team') || activity.type.includes('collaboration')) type = 'collaboration';
  
  return {
    id: activity.id,
    type,
    title: activity.action,
    description: `${activity.user.name} ${activity.action} ${activity.target}`,
    timestamp: new Date(activity.timestamp),
    read: false, // TODO: Implement read status in backend
    actionUrl: activity.metadata?.url
  };
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'comment':
      return <MessageSquare className="w-4 h-4" />;
    case 'mention':
      return <Users className="w-4 h-4" />;
    case 'project':
      return <GitBranch className="w-4 h-4" />;
    case 'export':
      return <FileText className="w-4 h-4" />;
    case 'collaboration':
      return <Users className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export const NotificationsMenu = () => {
  const { activities, isLoading, error, refetch } = useUserActivity();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Map activities to notifications
  const notifications = activities.map(mapActivityToNotification);
  
  // Filter unread notifications (excluding manually marked as read)
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
    // TODO: Call backend API to mark notification as read
    // await activityApi.markAsRead(id);
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
    // TODO: Call backend API to mark all notifications as read
    // await activityApi.markAllAsRead();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-zinc-50 transition-colors">
          <Bell className="w-5 h-5 text-zinc-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-zinc-600 hover:text-zinc-900 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
              <p className="text-sm text-zinc-600">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm text-zinc-600 mb-2">Failed to load notifications</p>
              <button 
                onClick={() => refetch()}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-600">No notifications yet</p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => {
                const isRead = readIds.has(notification.id);
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer ${
                      !isRead ? 'bg-zinc-50' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'comment' ? 'bg-emerald-100 text-emerald-600' :
                      notification.type === 'export' ? 'bg-orange-100 text-orange-600' :
                      notification.type === 'collaboration' ? 'bg-teal-100 text-teal-600' :
                      'bg-zinc-100 text-zinc-600'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 mb-0.5">
                        {notification.title}
                      </p>
                      <p className="text-xs text-zinc-600 mb-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!isRead && (
                      <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && !isLoading && (
          <div className="border-t border-zinc-100 p-2">
            <button className="w-full py-2 text-xs text-center text-zinc-600 hover:text-zinc-900 font-medium rounded-md hover:bg-zinc-50 transition-colors">
              View all notifications
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
