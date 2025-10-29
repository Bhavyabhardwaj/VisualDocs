import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiveCursorProps {
  x: number;
  y: number;
  name: string;
  color: string;
  isTyping?: boolean;
}

const CURSOR_COLORS = {
  user1: '#3b82f6', // Blue
  user2: '#8b5cf6', // Purple
  user3: '#ec4899', // Pink
  user4: '#10b981', // Green
  user5: '#f59e0b', // Amber
};

export const LiveCursor = ({ x, y, name, color, isTyping }: LiveCursorProps) => {
  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      initial={{ x, y, opacity: 0, scale: 0 }}
      animate={{ 
        x, 
        y, 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          damping: 30,
          stiffness: 200,
          opacity: { duration: 0.2 }
        }
      }}
      exit={{ opacity: 0, scale: 0 }}
    >
      {/* Cursor SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <path
          d="M5.65376 12.3673L11.8538 21.4038C12.2344 21.9338 12.9597 22.0753 13.4897 21.6947C13.6558 21.5812 13.7942 21.4328 13.8958 21.2585L20.9656 8.98846C21.3362 8.3122 21.0766 7.47102 20.4003 7.10046C20.1777 6.97902 19.9256 6.91777 19.6698 6.92358L6.03819 7.37431C5.35164 7.38854 4.79606 7.96219 4.78183 8.64874C4.77784 8.87795 4.82911 9.10479 4.93155 9.30992L5.65376 12.3673Z"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>

      {/* Name badge */}
      <motion.div
        className={cn(
          "absolute left-6 top-1 px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg whitespace-nowrap",
          "backdrop-blur-sm"
        )}
        style={{ backgroundColor: color }}
        initial={{ opacity: 0, scale: 0.8, x: -10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          x: 0,
          transition: { delay: 0.1 }
        }}
      >
        {name}
        {isTyping && (
          <span className="ml-1 animate-pulse">
            ✍️
          </span>
        )}
      </motion.div>

      {/* Cursor trail effect */}
      <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{
          opacity: 0,
          scale: 2,
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
};

export const LiveCursors = ({ cursors }: { cursors: LiveCursorProps[] }) => {
  return (
    <>
      {cursors.map((cursor, index) => (
        <LiveCursor
          key={cursor.name}
          {...cursor}
        />
      ))}
    </>
  );
};
