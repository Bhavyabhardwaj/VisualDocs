import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileEdit, FileCode, Sparkles, Upload, GitBranch, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'edit' | 'analysis' | 'upload' | 'diagram' | 'comment';
  user: {
    name: string;
    avatar?: string;
    color: string;
  };
  action: string;
  target: string;
  timestamp: Date;
}

interface LiveActivityFeedProps {
  activities: Activity[];
  title?: string;
  limit?: number;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'edit':
      return FileEdit;
    case 'analysis':
      return Sparkles;
    case 'upload':
      return Upload;
    case 'diagram':
      return GitBranch;
    case 'comment':
      return MessageSquare;
    default:
      return FileCode;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'edit':
      return 'text-blue-600 bg-blue-50';
    case 'analysis':
      return 'text-purple-600 bg-purple-50';
    case 'upload':
      return 'text-green-600 bg-green-50';
    case 'diagram':
      return 'text-orange-600 bg-orange-50';
    case 'comment':
      return 'text-pink-600 bg-pink-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const LiveActivityFeed = ({ 
  activities, 
  title = '🌊 Team Activity',
  limit = 10 
}: LiveActivityFeedProps) => {
  const displayActivities = activities.slice(0, limit);

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <span className="text-xs text-neutral-500">Last hour</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <AnimatePresence mode="popLayout">
          {displayActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-neutral-500"
            >
              <p className="text-sm">No recent activity</p>
            </motion.div>
          ) : (
            displayActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const iconColor = getActivityColor(activity.type);

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    height: 'auto',
                    transition: {
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20
                    }
                  }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  layout
                  className="group"
                >
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                    {/* User Avatar */}
                    <Avatar className="h-8 w-8 shrink-0">
                      {activity.user.avatar && (
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      )}
                      <AvatarFallback 
                        style={{ backgroundColor: activity.user.color }}
                        className="text-white text-xs"
                      >
                        {activity.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-neutral-900">
                            <span className="font-medium">{activity.user.name}</span>
                            {' '}
                            <span className="text-neutral-600">{activity.action}</span>
                            {' '}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </p>
                        </div>

                        {/* Activity Icon */}
                        <div className={cn(
                          "p-1.5 rounded-md shrink-0 transition-transform group-hover:scale-110",
                          iconColor
                        )}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Live indicator for recent activities */}
                    {new Date().getTime() - activity.timestamp.getTime() < 60000 && (
                      <motion.div
                        className="h-2 w-2 rounded-full bg-green-500 shrink-0"
                        animate={{
                          opacity: [1, 0.5, 1],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
