import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LiveCursorProps {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
}

export const LiveCursor = ({ userId, userName, x, y, color }: LiveCursorProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide cursor after 3 seconds of no movement
    const timeout = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timeout);
  }, [x, y]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-all duration-100"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-2px, -2px)',
      }}
    >
      {/* Cursor SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <path
          d="M5.65376 12.3673L19.3811 5.61865C19.9308 5.34133 20.5695 5.74964 20.5459 6.36966L19.8857 19.2631C19.8623 19.8824 19.1309 20.2176 18.6112 19.8441L13.1 15.5L9.5 21L7.5 19.5L11.5 14L5.65376 12.3673Z"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* User name label */}
      <div
        className="absolute top-5 left-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
        style={{
          backgroundColor: color,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {userName}
      </div>
    </div>
  );
};

interface PresenceIndicatorProps {
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
    color: string;
  }>;
  maxVisible?: number;
}

export const PresenceIndicator = ({ users, maxVisible = 5 }: PresenceIndicatorProps) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className="flex items-center gap-1">
      {visibleUsers.map((user, index) => (
        <div
          key={user.id}
          className="relative inline-block"
          style={{
            marginLeft: index > 0 ? '-8px' : '0',
            zIndex: visibleUsers.length - index,
          }}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-white ring-2"
              style={{ ringColor: user.color }}
              title={user.name}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full border-2 border-white ring-2 flex items-center justify-center text-xs font-semibold text-white"
              style={{ 
                backgroundColor: user.color,
                ringColor: user.color,
              }}
              title={user.name}
            >
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
          
          {/* Active indicator dot */}
          <div
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
            style={{ backgroundColor: user.color }}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-xs font-medium text-neutral-600 -ml-2">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

interface InlineCommentProps {
  position: { x: number; y: number };
  author: {
    name: string;
    avatar?: string;
  };
  text: string;
  replies?: Array<{
    author: { name: string; avatar?: string };
    text: string;
    timestamp: string;
  }>;
  timestamp: string;
  onReply?: () => void;
  onResolve?: () => void;
}

export const InlineComment = ({
  position,
  author,
  text,
  replies = [],
  timestamp,
  onReply,
  onResolve,
}: InlineCommentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="absolute z-40"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Comment indicator dot */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold hover:bg-blue-600 transition-colors"
      >
        {replies.length + 1}
      </button>

      {/* Comment thread */}
      {isExpanded && (
        <div className="absolute top-8 left-0 w-80 bg-white rounded-lg shadow-xl border border-neutral-200 p-4 space-y-3">
          {/* Main comment */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                  {author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <span className="text-sm font-medium text-neutral-900">{author.name}</span>
              <span className="text-xs text-neutral-500">{timestamp}</span>
            </div>
            <p className="text-sm text-neutral-700">{text}</p>
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="pl-4 border-l-2 border-neutral-200 space-y-2">
              {replies.map((reply, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    {reply.author.avatar ? (
                      <img
                        src={reply.author.avatar}
                        alt={reply.author.name}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-neutral-400 text-white flex items-center justify-center text-[10px] font-semibold">
                        {reply.author.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <span className="text-xs font-medium text-neutral-900">{reply.author.name}</span>
                    <span className="text-xs text-neutral-500">{reply.timestamp}</span>
                  </div>
                  <p className="text-sm text-neutral-700">{reply.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
            {onReply && (
              <button
                onClick={onReply}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Reply
              </button>
            )}
            {onResolve && (
              <button
                onClick={onResolve}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-700"
              >
                Resolve
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
