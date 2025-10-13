import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  MessageSquare, Send, AtSign, Smile, Paperclip, MoreHorizontal,
  Users, Video, Phone, Mic, MicOff, VideoOff, ScreenShare,
  Bell, Settings, X, ChevronDown, Search, Filter, Hash,
  Sparkles, Clock, CheckCheck, Eye, FileText, Code
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: 'active' | 'idle' | 'offline';
  cursor?: { x: number; y: number };
  currentFile?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  lineNumber?: number;
  fileName?: string;
  replies?: Comment[];
  resolved?: boolean;
  mentions?: string[];
}

interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: Date;
}

export const LiveCollaboration = () => {
  const { projectId } = useParams();
  const [activeUsers, setActiveUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', avatar: 'JD', color: '#3b82f6', status: 'active', currentFile: 'App.tsx' },
    { id: '2', name: 'Sarah Wilson', avatar: 'SW', color: '#8b5cf6', status: 'active', currentFile: 'utils.ts' },
    { id: '3', name: 'Mike Chen', avatar: 'MC', color: '#ec4899', status: 'idle', currentFile: 'README.md' },
    { id: '4', name: 'Emma Davis', avatar: 'ED', color: '#10b981', status: 'active', currentFile: 'App.tsx' },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      userAvatar: 'JD',
      content: 'Should we refactor this component to use hooks instead of class components? @SarahWilson what do you think?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      fileName: 'App.tsx',
      lineNumber: 42,
      mentions: ['SarahWilson'],
      replies: [
        {
          id: '2',
          userId: '2',
          userName: 'Sarah Wilson',
          userAvatar: 'SW',
          content: 'Great idea! I can help with that migration. Let\'s start with the smaller components first.',
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
        }
      ]
    },
    {
      id: '3',
      userId: '3',
      userName: 'Mike Chen',
      userAvatar: 'MC',
      content: 'The new authentication flow looks solid. Tested it on mobile and desktop - works perfectly!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      resolved: true,
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', userId: '1', userName: 'John Doe', userAvatar: 'JD', action: 'edited', target: 'App.tsx', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: '2', userId: '2', userName: 'Sarah Wilson', userAvatar: 'SW', action: 'commented on', target: 'utils.ts', timestamp: new Date(Date.now() - 1000 * 60 * 12) },
    { id: '3', userId: '4', userName: 'Emma Davis', userAvatar: 'ED', action: 'opened', target: 'App.tsx', timestamp: new Date(Date.now() - 1000 * 60 * 8) },
    { id: '4', userId: '3', userName: 'Mike Chen', userAvatar: 'MC', action: 'resolved comment in', target: 'auth.ts', timestamp: new Date(Date.now() - 1000 * 60 * 20) },
  ]);

  const [newComment, setNewComment] = useState('');
  const [showCallPanel, setShowCallPanel] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'You',
      userAvatar: 'YO',
      content: newComment,
      timestamp: new Date(),
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header with Active Users */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Live Collaboration</h1>
              <p className="text-sm text-gray-600 mt-1">Project: Visual Documentation System</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Active Users */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {activeUsers.slice(0, 4).map((user) => (
                    <div key={user.id} className="relative group">
                      <Avatar 
                        className="h-9 w-9 border-2 border-white ring-2 cursor-pointer transition-transform hover:scale-110"
                        style={{ ringColor: user.color }}
                      >
                        <AvatarFallback 
                          className="text-xs font-semibold text-white"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: user.status === 'active' ? '#10b981' : user.status === 'idle' ? '#f59e0b' : '#6b7280' }}
                      />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50">
                        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                          <div className="font-medium">{user.name}</div>
                          {user.currentFile && (
                            <div className="text-gray-400 flex items-center gap-1 mt-1">
                              <FileText className="h-3 w-3" />
                              {user.currentFile}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeUsers.length > 4 && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600 ring-2 ring-gray-200">
                      +{activeUsers.length - 4}
                    </div>
                  )}
                </div>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-sm text-gray-600">
                  {activeUsers.filter(u => u.status === 'active').length} online
                </span>
              </div>

              {/* Call Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-gray-50"
                  onClick={() => setShowCallPanel(!showCallPanel)}
                >
                  <Video className="h-4 w-4" />
                  Start Call
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 hover:bg-gray-50">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 hover:bg-gray-50">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Activity Feed */}
        <div className="w-72 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-semibold text-sm text-gray-900 mb-3">Activity Feed</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search activity..."
                className="pl-9 h-8 text-sm bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group"
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-xs">
                      {activity.userAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.userName}</span>{' '}
                      <span className="text-gray-600">{activity.action}</span>{' '}
                      <span className="font-medium text-blue-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center: Live Cursors & Code View */}
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
          {/* File Tabs */}
          <div className="border-b border-gray-200 bg-gray-50 px-4 flex items-center gap-2 overflow-x-auto">
            {['App.tsx', 'utils.ts', 'README.md'].map((file, i) => (
              <button
                key={file}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  i === 0
                    ? 'border-blue-600 text-gray-900 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  {file}
                </div>
              </button>
            ))}
          </div>

          {/* Code Editor with Live Cursors */}
          <div className="flex-1 relative p-6 font-mono text-sm overflow-auto">
            {/* Live Cursors */}
            {activeUsers.filter(u => u.status === 'active' && u.currentFile === 'App.tsx').map((user) => (
              <div
                key={user.id}
                className="absolute pointer-events-none z-50 transition-all duration-100"
                style={{
                  left: `${Math.random() * 80}%`,
                  top: `${Math.random() * 80}%`,
                }}
              >
                <div className="relative">
                  <svg
                    width="24"
                    height="36"
                    viewBox="0 0 24 36"
                    fill="none"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  >
                    <path
                      d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                      fill={user.color}
                    />
                  </svg>
                  <div
                    className="absolute top-5 left-6 px-2 py-1 rounded text-xs font-sans text-white whitespace-nowrap shadow-lg"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name}
                  </div>
                </div>
              </div>
            ))}

            {/* Sample Code */}
            <div className="space-y-1 text-gray-800">
              <div className="flex items-start gap-4 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors group">
                <span className="text-gray-400 select-none w-8 text-right">1</span>
                <code className="flex-1">
                  <span className="text-purple-600">import</span> React <span className="text-purple-600">from</span> <span className="text-green-600">'react'</span>;
                </code>
              </div>
              <div className="flex items-start gap-4 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors">
                <span className="text-gray-400 select-none w-8 text-right">2</span>
                <code className="flex-1">
                  <span className="text-purple-600">import</span> {'{ useState }'} <span className="text-purple-600">from</span> <span className="text-green-600">'react'</span>;
                </code>
              </div>
              <div className="flex items-start gap-4 px-2 py-0.5">
                <span className="text-gray-400 select-none w-8 text-right">3</span>
                <code className="flex-1"></code>
              </div>
              <div className="flex items-start gap-4 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors">
                <span className="text-gray-400 select-none w-8 text-right">4</span>
                <code className="flex-1">
                  <span className="text-purple-600">const</span> <span className="text-blue-600">App</span> = () {'=> {'}
                </code>
              </div>
              <div className="flex items-start gap-4 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors">
                <span className="text-gray-400 select-none w-8 text-right">5</span>
                <code className="flex-1 pl-4">
                  <span className="text-purple-600">const</span> [count, setCount] = <span className="text-blue-600">useState</span>(<span className="text-orange-600">0</span>);
                </code>
              </div>
              <div className="flex items-start gap-4 px-2 py-0.5">
                <span className="text-gray-400 select-none w-8 text-right">6</span>
                <code className="flex-1"></code>
              </div>
              <div className="flex items-start gap-4 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors group relative">
                <span className="text-gray-400 select-none w-8 text-right">7</span>
                <code className="flex-1 pl-4">
                  <span className="text-purple-600">return</span> (
                </code>
                {/* Inline Comment Indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <MessageSquare className="h-3 w-3 text-blue-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Writing Assistant */}
          <div className="absolute bottom-6 right-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 max-w-sm">
            <Sparkles className="h-5 w-5 flex-shrink-0 animate-pulse" />
            <div className="text-sm">
              <div className="font-medium">AI suggests:</div>
              <div className="text-blue-100 text-xs mt-0.5">Add error handling for edge cases</div>
            </div>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-7 px-2 text-xs">
              Apply
            </Button>
          </div>
        </div>

        {/* Right: Comments & Chat */}
        <div className="w-96 border-l border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm text-gray-900">Comments & Chat</h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs h-7 flex-1">
                All
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 flex-1">
                Mentions
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 flex-1">
                Resolved
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {comments.map((comment) => (
                <Card
                  key={comment.id}
                  className={`border-gray-200 hover:shadow-md transition-all cursor-pointer ${
                    comment.resolved ? 'opacity-60 bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedComment(comment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-xs">
                          {comment.userAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">{comment.userName}</span>
                          {comment.resolved && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                          {comment.fileName && (
                            <>
                              <span className="mx-1">•</span>
                              <FileText className="h-3 w-3" />
                              {comment.fileName}
                              {comment.lineNumber && `:${comment.lineNumber}`}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{comment.content}</p>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-gray-200 space-y-3 mt-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-[10px]">
                                {reply.userAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-xs text-gray-900">{reply.userName}</span>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 hover:bg-gray-50">
                        <MessageSquare className="h-3 w-3" />
                        Reply
                      </Button>
                      {!comment.resolved && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 hover:bg-gray-50">
                          <CheckCheck className="h-3 w-3" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* New Comment Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="relative">
              <Textarea
                placeholder="Add a comment or @mention someone..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="pr-24 min-h-[80px] resize-none bg-white"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100">
                  <AtSign className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="h-7 w-7 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Panel (Floating) */}
      {showCallPanel && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {activeUsers.slice(0, 2).map((user) => (
                  <Avatar key={user.id} className="h-8 w-8 border-2 border-gray-900">
                    <AvatarFallback style={{ backgroundColor: user.color }} className="text-white text-xs">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <div className="text-sm font-medium">Team Call</div>
                <div className="text-xs text-gray-400">{activeUsers.length} participants</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setShowCallPanel(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 h-48 flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Camera is off</p>
            </div>
          </div>

          <div className="p-4 flex items-center justify-center gap-2 bg-gray-50">
            <Button
              variant={isMuted ? 'default' : 'outline'}
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className={isMuted ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              variant={isVideoOff ? 'default' : 'outline'}
              size="icon"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={isVideoOff ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
            >
              {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon">
              <ScreenShare className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-8 mx-1" />
            <Button variant="outline" size="icon" className="bg-red-600 hover:bg-red-700 text-white border-red-600">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
