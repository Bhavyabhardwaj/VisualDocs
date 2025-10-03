import React from 'react';
import { useCollaboration } from './CollaborationProvider';
import { Button } from '@/components/ui/Button';
import { Users } from 'lucide-react';

export const UserPresence: React.FC = () => {
  const { users } = useCollaboration();

  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-2">
        {users.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className="relative w-8 h-8 rounded-full ring-2 ring-white dark:ring-dark-bg-secondary overflow-hidden"
            title={user.name}
            style={{ backgroundColor: user.color }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full ring-2 ring-white dark:ring-dark-bg-secondary" />
          </div>
        ))}
      </div>
      
      {users.length > 5 && (
        <div className="w-8 h-8 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full flex items-center justify-center text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
          +{users.length - 5}
        </div>
      )}
      
      <Button variant="outline" size="sm" icon={<Users className="w-4 h-4" />}>
        {users.length} online
      </Button>
    </div>
  );
};

export const LiveCursors: React.FC = () => {
  const { users } = useCollaboration();

  return (
    <>
      {users.map((user) => 
        user.cursor && (
          <div
            key={`cursor-${user.id}`}
            className="fixed pointer-events-none z-50 transition-all duration-75"
            style={{
              left: user.cursor.x,
              top: user.cursor.y,
              transform: 'translate(-2px, -2px)'
            }}
          >
            {/* Cursor */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 3L17 9L10 10L3 17V3Z"
                fill={user.color}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
            
            {/* User label */}
            <div 
              className="ml-4 -mt-1 px-2 py-1 rounded-md text-white text-xs font-medium whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        )
      )}
    </>
  );
};
