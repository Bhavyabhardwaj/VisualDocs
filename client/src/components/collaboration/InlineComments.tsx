import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
}

interface InlineCommentsProps {
  lineNumber?: number;
  existingComments?: Comment[];
  onAddComment?: (content: string) => void;
  onResolveComment?: (commentId: string) => void;
}

export const InlineComments = ({ 
  lineNumber,
  existingComments = [],
  onAddComment,
  onResolveComment 
}: InlineCommentsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(existingComments);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: newComment,
      timestamp: new Date(),
      resolved: false,
    };

    setComments([...comments, comment]);
    setNewComment('');
    onAddComment?.(newComment);
  };

  const handleResolve = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, resolved: true } : c
    ));
    onResolveComment?.(commentId);
  };

  const unresolvedComments = comments.filter(c => !c.resolved);

  return (
    <div className="relative inline-block">
      {/* Comment Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {unresolvedComments.length > 0 && (
          <span className="text-foreground">{unresolvedComments.length}</span>
        )}
      </button>

      {/* Comments Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-8 w-80 bg-background border border-border rounded-lg shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {lineNumber ? `Line ${lineNumber}` : 'Comments'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Comments List */}
            <div className="max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No comments yet
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`px-4 py-3 ${comment.resolved ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {comment.userName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-2">{comment.content}</p>
                          {!comment.resolved && (
                            <button
                              onClick={() => handleResolve(comment.id)}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Resolve
                            </button>
                          )}
                          {comment.resolved && (
                            <span className="text-xs text-success">✓ Resolved</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* New Comment Input */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-1.5 text-sm bg-muted border-0 rounded focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="p-1.5 bg-foreground text-background rounded hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
