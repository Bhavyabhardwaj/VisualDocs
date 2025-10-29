import { formatDistanceToNow } from 'date-fns';
import { 
  FileUp, 
  Sparkles, 
  Share2, 
  MessageSquare,
  GitBranch,
  Download,
  Users,
  Loader2
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useProjectActivity } from '@/hooks/useApi';
import type { Activity as APIActivity } from '@/lib/api';

// Map API activity types to our simplified types
const mapActivityType = (apiType: string): 'upload' | 'analysis' | 'share' | 'export' | 'comment' | 'diagram' | 'team' => {
  if (apiType.includes('upload') || apiType.includes('file')) return 'upload';
  if (apiType.includes('analysis')) return 'analysis';
  if (apiType.includes('share')) return 'share';
  if (apiType.includes('export')) return 'export';
  if (apiType.includes('comment')) return 'comment';
  if (apiType.includes('diagram')) return 'diagram';
  if (apiType.includes('team') || apiType.includes('collaboration')) return 'team';
  return 'upload'; // default
};

export interface Activity {
  id: string;
  type: 'upload' | 'analysis' | 'share' | 'export' | 'comment' | 'diagram' | 'team';
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  projectId: string;
  maxHeight?: string;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'upload':
      return <FileUp className="w-4 h-4" />;
    case 'analysis':
      return <Sparkles className="w-4 h-4" />;
    case 'share':
      return <Share2 className="w-4 h-4" />;
    case 'export':
      return <Download className="w-4 h-4" />;
    case 'comment':
      return <MessageSquare className="w-4 h-4" />;
    case 'diagram':
      return <GitBranch className="w-4 h-4" />;
    case 'team':
      return <Users className="w-4 h-4" />;
  }
};

const getActivityIconColor = (type: Activity['type']) => {
  switch (type) {
    case 'upload':
      return 'bg-emerald-100 text-emerald-600';
    case 'analysis':
      return 'bg-orange-100 text-orange-600';
    case 'share':
      return 'bg-teal-100 text-teal-600';
    case 'export':
      return 'bg-zinc-100 text-zinc-600';
    case 'comment':
      return 'bg-amber-100 text-amber-600';
    case 'diagram':
      return 'bg-green-100 text-green-600';
    case 'team':
      return 'bg-teal-100 text-teal-600';
  }
};

export const ComprehensiveActivityFeed = ({ projectId, maxHeight = '400px' }: ActivityFeedProps) => {
  const { activities: apiActivities, isLoading, error, refetch } = useProjectActivity(projectId);

  // Map API activities to component activities
  const activities: Activity[] = apiActivities.map((apiActivity: APIActivity) => ({
    id: apiActivity.id,
    type: mapActivityType(apiActivity.type),
    user: apiActivity.user,
    action: apiActivity.action,
    target: apiActivity.target,
    timestamp: new Date(apiActivity.timestamp)
  }));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-3" />
        <p className="text-sm text-zinc-600">Loading activity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-sm font-medium text-zinc-900 mb-1">Failed to load activity</p>
        <p className="text-xs text-zinc-500 text-center max-w-sm mb-3">
          {error}
        </p>
        <button 
          onClick={() => refetch()}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6 text-zinc-400" />
        </div>
        <p className="text-sm font-medium text-zinc-900 mb-1">No activity yet</p>
        <p className="text-xs text-zinc-500 text-center max-w-sm">
          Activity from your team will appear here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea style={{ maxHeight }} className="pr-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            {/* Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityIconColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm text-zinc-900">
                    <span className="font-semibold">{activity.user.name}</span>
                    {' '}
                    {activity.action}
                    {activity.target && (
                      <>
                        {' '}
                        <span className="font-medium text-zinc-700">{activity.target}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>

                {/* User Avatar */}
                {activity.user.avatar ? (
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {activity.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
