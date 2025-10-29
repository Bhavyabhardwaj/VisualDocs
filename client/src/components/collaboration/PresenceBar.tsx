import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Video, MessageSquare, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'editing' | 'viewing' | 'idle';
  color: string;
}

interface PresenceBarProps {
  users: User[];
  commentCount?: number;
  onStartCall?: () => void;
  onViewComments?: () => void;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'editing':
      return 'Editing';
    case 'viewing':
      return 'Viewing';
    case 'idle':
      return 'Online';
    default:
      return 'Active';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'editing':
      return 'bg-green-500';
    case 'viewing':
      return 'bg-blue-500';
    case 'idle':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

export const PresenceBar = ({ users, commentCount = 0, onStartCall, onViewComments }: PresenceBarProps) => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
      {/* Active Users */}
      <div className="flex items-center gap-3">
        <div className="flex items-center -space-x-2">
          <AnimatePresence>
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  x: 0,
                  transition: {
                    type: 'spring',
                    delay: index * 0.05,
                  }
                }}
                exit={{ opacity: 0, scale: 0 }}
                className="relative group"
              >
                <Avatar 
                  className={cn(
                    "h-8 w-8 border-2 border-white cursor-pointer transition-transform hover:scale-110 hover:z-10",
                    "ring-2 ring-offset-2 ring-offset-white"
                  )}
                  style={{ borderColor: user.color }}
                >
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback style={{ backgroundColor: user.color }} className="text-white text-xs">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status dot */}
                <motion.div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                    getStatusColor(user.status)
                  )}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {user.name}
                    <div className="text-neutral-400">{getStatusText(user.status)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* User count text */}
        <motion.div
          className="flex items-center gap-1.5 text-sm text-neutral-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Users className="h-4 w-4" />
          <span className="font-medium">{users.length}</span>
          <span>
            {users.filter(u => u.status === 'editing').length > 0 && (
              <span className="text-green-600">
                • {users.filter(u => u.status === 'editing').length} editing
              </span>
            )}
          </span>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Comments */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 relative"
          onClick={onViewComments}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">Comments</span>
          {commentCount > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {commentCount}
            </motion.span>
          )}
        </Button>

        {/* Start Call */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onStartCall}
        >
          <Video className="h-4 w-4" />
          <span className="text-sm">Call</span>
        </Button>
      </div>
    </div>
  );
};
