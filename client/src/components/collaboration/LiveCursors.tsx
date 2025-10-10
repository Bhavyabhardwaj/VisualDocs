import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

interface CursorPosition {
  userId: string;
  userName: string;
  x: number;
  y: number;
  file?: string;
  timestamp: string;
}

interface LiveCursorsProps {
  projectId: string;
  currentFile?: string;
}

export function LiveCursors({ projectId, currentFile }: LiveCursorsProps) {
  const socket = useSocket();
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [myPosition, setMyPosition] = useState<{ x: number; y: number } | null>(null);

  // Listen for cursor movements
  useEffect(() => {
    if (!socket) return;

    socket.onCursorMove((data: CursorPosition) => {
      // Only show cursors for the current file
      if (currentFile && data.file !== currentFile) return;

      setCursors(prev => {
        const updated = new Map(prev);
        updated.set(data.userId, data);
        return updated;
      });

      // Remove stale cursors after 5 seconds
      setTimeout(() => {
        setCursors(prev => {
          const updated = new Map(prev);
          updated.delete(data.userId);
          return updated;
        });
      }, 5000);
    });

    return () => {
      // Cleanup
    };
  }, [socket, currentFile]);

  // Track my cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const position = { x: e.clientX, y: e.clientY };
      setMyPosition(position);

      // Throttle cursor position updates
      if (socket && projectId && currentFile) {
        socket.sendCursorPosition(projectId, currentFile, {
          line: 0,
          column: 0
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [socket, projectId, currentFile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {Array.from(cursors.values()).map((cursor) => (
          <Cursor key={cursor.userId} cursor={cursor} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Cursor({ cursor }: { cursor: CursorPosition }) {
  // Generate consistent color for each user
  const getColor = (userId: string) => {
    const colors = [
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#06B6D4', // cyan
      '#6366F1', // indigo
    ];
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const color = getColor(cursor.userId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute pointer-events-none"
      style={{
        left: cursor.x,
        top: cursor.y,
        transform: 'translate(-2px, -2px)'
      }}
    >
      <MousePointer2
        className="w-5 h-5"
        style={{ color }}
        fill={color}
      />
      <div
        className="absolute top-6 left-0 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-lg"
        style={{ backgroundColor: color }}
      >
        {cursor.userName}
      </div>
    </motion.div>
  );
}

// Activity Indicator Component
export function ActivityIndicator({ 
  activeUsers 
}: { 
  activeUsers: Array<{ userId: string; userName: string; status: string }> 
}) {
  const [showList, setShowList] = useState(false);

  if (activeUsers.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowList(!showList)}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
      >
        <div className="flex items-center -space-x-2">
          {activeUsers.slice(0, 3).map((user) => (
            <div
              key={user.userId}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white"
              title={user.userName}
            >
              {user.userName?.charAt(0) || 'U'}
            </div>
          ))}
        </div>
        <span className="text-xs font-medium text-green-700">
          {activeUsers.length} active
        </span>
      </button>

      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 p-3 z-10"
          >
            <div className="space-y-2">
              {activeUsers.map((user) => (
                <div key={user.userId} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-medium text-white">
                    {user.userName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-900">{user.userName}</div>
                    <div className="text-xs text-neutral-500">{user.status}</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Typing Indicator
export function TypingIndicator({ users }: { users: string[] }) {
  if (users.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 text-xs text-neutral-500 italic"
    >
      <div className="flex gap-1">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
        />
      </div>
      {users.length === 1 ? (
        <span>{users[0]} is typing...</span>
      ) : users.length === 2 ? (
        <span>{users[0]} and {users[1]} are typing...</span>
      ) : (
        <span>{users[0]} and {users.length - 1} others are typing...</span>
      )}
    </motion.div>
  );
}
