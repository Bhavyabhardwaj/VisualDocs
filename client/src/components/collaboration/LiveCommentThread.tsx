import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Check, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
    color: string;
  };
  content: string;
  timestamp: Date;
  isEditing?: boolean;
}

interface LiveCommentThreadProps {
  threadId: string;
  comments: Comment[];
  position?: { x: number; y: number };
  onAddComment?: (content: string) => void;
  onResolve?: () => void;
  onDelete?: (commentId: string) => void;
  isResolved?: boolean;
  currentUser?: {
    name: string;
    avatar?: string;
    color: string;
  };
}

export const LiveCommentThread = ({
  threadId,
  comments,
  position,
  onAddComment,
  onResolve,
  onDelete,
  isResolved = false,
  currentUser = {
    name: 'You',
    color: '#3b82f6'
  }
}: LiveCommentThreadProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [replyText, setReplyText] = useState('');
  
  // Suppress unused variable warnings
  void threadId;

  const handleSendReply = () => {
    if (replyText.trim() && onAddComment) {
      onAddComment(replyText);
      setReplyText('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        "w-80 bg-white rounded-lg shadow-xl border border-neutral-200",
        isResolved && "opacity-60"
      )}
      style={position ? {
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 50
      } : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-700"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Comments ({comments.length})</span>
        </button>

        <div className="flex items-center gap-1">
          {!isResolved && onResolve && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResolve}
              className="h-7 px-2 text-xs gap-1.5"
            >
              <Check className="h-3 w-3" />
              Resolve
            </Button>
          )}
          {isResolved && (
            <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded">
              ✓ Resolved
            </span>
          )}
        </div>
      </div>

      {/* Comments List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto p-3 space-y-3">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      {comment.user.avatar && (
                        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      )}
                      <AvatarFallback 
                        style={{ backgroundColor: comment.user.color }}
                        className="text-white text-xs"
                      >
                        {comment.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-neutral-900">
                          {comment.user.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-neutral-500">
                            {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                          </span>
                          {comment.isEditing && (
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                              <span className="animate-pulse">✍️</span>
                              typing...
                            </span>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onDelete?.(comment.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 mt-1 break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reply Input */}
            {!isResolved && (
              <div className="p-3 border-t border-neutral-200">
                <div className="flex gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    {currentUser.avatar && (
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    )}
                    <AvatarFallback 
                      style={{ backgroundColor: currentUser.color }}
                      className="text-white text-xs"
                    >
                      {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a reply..."
                      value={replyText}
                      onChange={(e) => {
                        setReplyText(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleSendReply();
                        }
                      }}
                      className="min-h-[60px] text-sm resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-neutral-500">
                        ⌘+Enter to send
                      </span>
                      <Button
                        size="sm"
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="h-7 gap-1.5"
                      >
                        <Send className="h-3 w-3" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Comment Bubble (shows count inline in document)
export const CommentBubble = ({ 
  count, 
  onClick, 
  position 
}: { 
  count: number; 
  onClick: () => void;
  position?: 'inline' | 'margin';
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        "bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors",
        "border border-blue-200",
        position === 'margin' && "absolute -right-8 top-0"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageSquare className="h-3 w-3" />
      <span>{count}</span>
    </motion.button>
  );
};
