import React, { useState } from 'react';
import { useCollaboration } from './CollaborationProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  MessageCircle, 
  Send, 
  Check, 
  X, 
  MoreHorizontal,
  Reply 
} from 'lucide-react';

interface CommentMarkerProps {
  x: number;
  y: number;
  commentId: string;
  resolved?: boolean;
  onClick: () => void;
}

export const CommentMarker: React.FC<CommentMarkerProps> = ({ 
  x, 
  y, 
  commentId, 
  resolved = false, 
  onClick 
}) => {
  return (
    <button
      className={`absolute w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
        resolved 
          ? 'bg-success-100 text-success-600 hover:bg-success-200' 
          : 'bg-primary-500 text-white hover:bg-primary-600 animate-pulse hover:animate-none'
      }`}
      style={{ left: x - 12, top: y - 12 }}
      onClick={onClick}
    >
      {resolved ? (
        <Check className="w-3 h-3" />
      ) : (
        <MessageCircle className="w-3 h-3" />
      )}
    </button>
  );
};

interface CommentThreadProps {
  commentId: string;
  onClose: () => void;
  position: { x: number; y: number };
}

export const CommentThread: React.FC<CommentThreadProps> = ({ 
  commentId, 
  onClose, 
  position 
}) => {
  const { comments, resolveComment } = useCollaboration();
  const [newComment, setNewComment] = useState('');
  
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return null;

  const handleResolve = () => {
    resolveComment(commentId);
    onClose();
  };

  return (
    <div
      className="fixed z-50"
      style={{
        left: Math.min(position.x + 20, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 200)
      }}
    >
      <Card className="w-80 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-light-text dark:text-dark-text">
              Comments
            </h4>
            <div className="flex items-center space-x-1">
              {!comment.resolved && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResolve}
                  className="text-success-600 hover:bg-success-50"
                  title="Mark as resolved"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className={`p-3 rounded-lg ${
              comment.resolved 
                ? 'bg-success-50 dark:bg-success-900/20' 
                : 'bg-light-bg-secondary dark:bg-dark-bg-tertiary'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-light-text dark:text-dark-text">
                  {comment.userName}
                </span>
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-light-text dark:text-dark-text">
                {comment.content}
              </p>
              {comment.resolved && (
                <div className="mt-2 text-xs text-success-600 font-medium">
                  ✓ Resolved
                </div>
              )}
            </div>
          </div>

          {!comment.resolved && (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Add a reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                size="sm"
              />
              <Button
                size="sm"
                disabled={!newComment.trim()}
                icon={<Send className="w-3 h-3" />}
              >
                Send
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const CommentMode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { comments, addComment } = useCollaboration();
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [isCommentMode, setIsCommentMode] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isCommentMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create new comment
    addComment({
      userId: 'current-user',
      userName: 'Current User',
      content: 'New comment...',
      x,
      y,
      resolved: false
    });
  };

  return (
    <div className="relative" onClick={handleClick}>
      {children}
      
      {/* Comment markers */}
      {comments.map((comment) => (
        <CommentMarker
          key={comment.id}
          x={comment.x}
          y={comment.y}
          commentId={comment.id}
          resolved={comment.resolved}
          onClick={() => setActiveComment(comment.id)}
        />
      ))}
      
      {/* Active comment thread */}
      {activeComment && (
        <CommentThread
          commentId={activeComment}
          onClose={() => setActiveComment(null)}
          position={comments.find(c => c.id === activeComment) || { x: 0, y: 0 }}
        />
      )}
      
      {/* Comment mode toggle */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          variant={isCommentMode ? 'primary' : 'outline'}
          onClick={() => setIsCommentMode(!isCommentMode)}
          icon={<MessageCircle className="w-4 h-4" />}
        >
          {isCommentMode ? 'Exit Comment Mode' : 'Add Comments'}
        </Button>
      </div>
    </div>
  );
};
