import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, MessageSquare, Code2, GitBranch, Clock,
  MoreHorizontal, Download, Share2, Settings, Send, X,
  Eye, FileCode, Folder, ChevronRight, Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSocket } from '@/hooks/useSocket';
import { projectService } from '@/services';
import type { Project, UserPresence, LiveComment } from '@/types/api';

export default function PremiumProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const socket = useSocket();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // State
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Load project
  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  // Socket: Join project room
  useEffect(() => {
    if (!socket || !id) return;

    socket.joinProject(id);

    return () => {
      socket.leaveProject(id);
    };
  }, [socket, id]);

  // Socket: Listen for events using callback pattern
  useEffect(() => {
    if (!socket) return;

    // Listen for project users
    socket.onProjectUsers((users: any[]) => {
      setActiveUsers(users.filter(u => u.status === 'online'));
    });

    // Listen for new comments
    socket.onComment((comment: any) => {
      setComments(prev => [comment, ...prev]);
    });

    // Listen for user joined
    socket.onUserJoined((user: any) => {
      setActiveUsers(prev => {
        const exists = prev.find(u => u.userId === user.userId);
        if (exists) return prev;
        return [...prev, user];
      });
    });

    // Listen for user left
    socket.onUserLeft((userId: string) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== userId));
    });

    // No cleanup needed - hook manages it
  }, [socket]);

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await projectService.getProject(projectId);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to load project:', error);
      navigate('/app/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = () => {
    if (!commentText.trim() || !socket || !id) return;

    socket.sendComment(id, commentText, selectedFile);

    setCommentText('');
    commentInputRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-600" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-neutral-100 rounded-md flex items-center justify-center">
                <FileCode className="w-4 h-4 text-neutral-600" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-neutral-900">{project.name}</h1>
                <p className="text-xs text-neutral-500">{project.language || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Center - Active Users */}
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              {activeUsers.map((user) => (
                <div
                  key={user.userId}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white relative"
                  title={user.userName}
                >
                  {user.userName?.charAt(0) || 'U'}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                </div>
              ))}
            </div>
            <span className="text-xs text-neutral-600">
              {activeUsers.length} {activeUsers.length === 1 ? 'person' : 'people'} viewing
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComments(!showComments)}
              className="px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Comments ({comments.length})
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors">
              <Share2 className="w-4 h-4 text-neutral-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 flex">
        {/* File Explorer & Content */}
        <div className="flex-1 flex">
          {/* File Explorer */}
          <div className="w-64 bg-white border-r border-neutral-200 overflow-y-auto">
            <div className="p-4">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                Files
              </div>
              <div className="space-y-1">
                {project.files?.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFile(file.path)}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left rounded-md transition-colors flex items-center gap-2",
                      selectedFile === file.path
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50"
                    )}
                  >
                    <FileCode className="w-4 h-4" />
                    <span className="flex-1 truncate">{file.name || file.path}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Project Info */}
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Overview Card */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Overview</h2>
                
                {project.description && (
                  <p className="text-neutral-600 mb-6">{project.description}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Language</div>
                    <div className="text-sm font-medium text-neutral-900">{project.language || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Branch</div>
                    <div className="text-sm font-medium text-neutral-900 flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5" />
                      {project.branch || 'main'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Files</div>
                    <div className="text-sm font-medium text-neutral-900">{project.files?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Updated</div>
                    <div className="text-sm font-medium text-neutral-900">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Results */}
              {project.analysis && (
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Analysis</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600">Code Quality</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {project.analysis.qualityScore || 0}/100
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                          style={{ width: `${project.analysis.qualityScore || 0}%` }}
                        />
                      </div>
                    </div>

                    {project.analysis.complexity && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-600">Complexity</span>
                          <span className="text-sm font-semibold text-neutral-900">
                            {project.analysis.complexity}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documentation Preview */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Documentation</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-neutral-600">
                    Documentation content will appear here. Select a file to view its details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Sidebar */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-96 bg-white border-l border-neutral-200 flex flex-col"
            >
              {/* Comments Header */}
              <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-neutral-600" />
                  <h3 className="font-semibold text-neutral-900">Comments</h3>
                  <span className="text-xs text-neutral-500">({comments.length})</span>
                </div>
                <button
                  onClick={() => setShowComments(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600">No comments yet</p>
                    <p className="text-xs text-neutral-500">Be the first to comment</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-neutral-200">
                <div className="flex flex-col gap-2">
                  <textarea
                    ref={commentInputRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendComment();
                      }
                    }}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm resize-none focus:ring-1 focus:ring-neutral-300 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    {selectedFile && (
                      <div className="text-xs text-neutral-500 flex items-center gap-1">
                        <FileCode className="w-3 h-3" />
                        {selectedFile}
                      </div>
                    )}
                    <button
                      onClick={handleSendComment}
                      disabled={!commentText.trim()}
                      className="ml-auto px-3 py-1.5 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Comment Item Component
function CommentItem({ comment }: { comment: LiveComment }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
        {comment.userName?.charAt(0) || 'U'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-neutral-900">{comment.userName}</span>
          <span className="text-xs text-neutral-500">
            {new Date(comment.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm text-neutral-700 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
        {comment.position?.file && (
          <div className="mt-2 px-2 py-1 bg-neutral-50 rounded text-xs text-neutral-600 flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            {comment.position.file}
          </div>
        )}
      </div>
    </div>
  );
}
