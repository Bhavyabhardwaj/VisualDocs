import { Users, Circle, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

interface UserPresence {
  userId: string;
  userName: string;
  email: string;
  status: 'online' | 'away' | 'busy' | 'offline';
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

interface CollaborationPanelProps {
  isConnected: boolean;
  activeUsers: UserPresence[];
  comments: Comment[];
  onSendComment: (comment: string) => void;
}

export const CollaborationPanel = ({ 
  isConnected, 
  activeUsers, 
  comments,
  onSendComment 
}: CollaborationPanelProps) => {
  const [commentInput, setCommentInput] = useState('');

  const handleSendComment = () => {
    if (commentInput.trim()) {
      onSendComment(commentInput);
      setCommentInput('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Live Collaboration
            </CardTitle>
            <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
              {isConnected ? (
                <>
                  <Circle className="h-2 w-2 fill-green-500 text-green-500 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <Circle className="h-2 w-2 fill-gray-400 text-gray-400 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Active Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Active Users ({activeUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeUsers.length > 0 ? (
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {activeUsers.map((user) => (
                  <div key={user.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                          {getInitials(user.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <Circle 
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 ${getStatusColor(user.status)} border-2 border-white rounded-full`}
                        fill="currentColor"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.userName}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-6 text-sm text-neutral-500">
              {isConnected ? 'No other users online' : 'Connect to see active users'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Comments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Live Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ScrollArea className="h-48">
            <div className="space-y-3 pr-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-7 w-7 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                        {getInitials(comment.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{comment.userName}</span>
                        <span className="text-xs text-neutral-400">
                          {new Date(comment.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-700 mt-0.5">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-neutral-500">
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>
          </ScrollArea>
          
          {isConnected && (
            <div className="flex gap-2">
              <Input
                placeholder="Type a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleSendComment}
                disabled={!commentInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
