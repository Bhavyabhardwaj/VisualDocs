import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io, Socket } from 'socket.io-client';
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Save,
  Users,
  Code2,
  MessageSquare,
  SendHorizontal,
  Search,
  X,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  RotateCcw,
  FileCode,
  Clock,
  ArrowLeft,
  Keyboard,
  Terminal,
  GitBranch,
  FileText,
  Wand2,
  Columns,
  PanelRightClose,
  PanelRightOpen,
  ChevronUp,
  ExternalLink,
  Info,
  Settings,
  Command,
  Hash,
  Braces,
  ArrowUpDown,
  RefreshCw,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  isExpanded?: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
}

interface EditorChange {
  userId: string;
  changes: any;
  timestamp: number;
}

interface ProjectComment {
  id: string;
  projectId?: string;
  userId: string;
  userName?: string;
  content: string;
  timestamp: string;
}

interface OpenTab {
  file: FileNode;
  isModified: boolean;
}

interface CodeSymbol {
  name: string;
  kind: 'function' | 'class' | 'variable' | 'interface' | 'method';
  line: number;
}

export default function CodeEditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3004';

  // Get file and line from URL params (for navigation from analysis)
  const initialFile = searchParams.get('file');
  const initialLine = searchParams.get('line');

  // State
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [code, setCode] = useState<string>('');
  const [originalCode, setOriginalCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('typescript');
  const [projectName, setProjectName] = useState<string>('');
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Enhanced state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'vs-light' | 'vs-dark'>('vs-light');
  const [isZenMode, setIsZenMode] = useState(false);
  const [showCommentsPanel, setShowCommentsPanel] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [recentFiles, setRecentFiles] = useState<FileNode[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [codeSymbols, setCodeSymbols] = useState<CodeSymbol[]>([]);
  const [showSymbols, setShowSymbols] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileComments, setShowMobileComments] = useState(false);

  // Refs
  const editorRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const monacoRef = useRef<any>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || !projectId) return;

    const socket = io(apiBaseUrl, {
      auth: { token },
      query: { projectId },
    });

    const handleNewComment = (incoming: any) => {
      setComments((prev) => {
        const normalised: ProjectComment = {
          id: incoming.id,
          projectId: incoming.projectId,
          userId: incoming.userId,
          userName: incoming.userName || incoming.user?.name || 'Collaborator',
          content: incoming.content,
          timestamp: incoming.timestamp || new Date().toISOString(),
        };

        if (prev.some((comment) => comment.id === normalised.id)) {
          return prev;
        }
        return [...prev, normalised];
      });
    };

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-project', { projectId });
      toast({
        title: 'Connected',
        description: 'Live collaboration enabled',
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      toast({
        title: 'Disconnected',
        description: 'Connection lost',
        variant: 'destructive',
      });
    });

    // Listen for collaborator updates
    socket.on('collaborators:update', (users: Collaborator[]) => {
      setCollaborators(users);
    });

    // Listen for code changes from other users
    socket.on('code:change', (change: EditorChange) => {
      if (editorRef.current && monacoRef.current) {
        // Apply remote changes to editor
        const model = editorRef.current.getModel();
        if (model) {
          model.applyEdits(change.changes);
        }
      }
    });

    // Listen for cursor position updates
    socket.on('cursor:update', ({ userId, position }: any) => {
      // Update collaborator cursor positions
      setCollaborators((prev) =>
        prev.map((c) =>
          c.id === userId ? { ...c, cursor: position } : c
        )
      );
    });
    socket.on('new-comment', handleNewComment);

    socketRef.current = socket;

    return () => {
      socket.off('new-comment', handleNewComment);
      socket.disconnect();
    };
  }, [projectId, toast, apiBaseUrl]);

  // Load project files
  useEffect(() => {
    if (!projectId) return;

    const loadFiles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${apiBaseUrl}/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to load project');

        const data = await response.json();
        const projectData =
          data.data?.project || data.project || data?.data || data;
        
        // Build file tree from project files (check both data and nested project)
        const codeFiles =
          projectData?.codeFiles ||
          data.data?.project?.codeFiles ||
          data.project?.codeFiles ||
          data.codeFiles ||
          [];
        const fileTree = buildFileTree(codeFiles);
        setFiles(fileTree);
        setProjectName(projectData?.name || 'Code Editor');

        // If initial file specified, select it
        if (initialFile) {
          const file = findFileByPath(fileTree, initialFile);
          if (file) {
            selectFile(file);
          }
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load project files',
          variant: 'destructive',
        });
      }
    };

    loadFiles();
  }, [projectId, initialFile, toast, apiBaseUrl]);

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    const loadComments = async () => {
      try {
        setIsCommentsLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${apiBaseUrl}/api/comments/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load comments');
        }

        const data = await response.json();
        if (!isMounted) return;

        const items: ProjectComment[] = data.data || data.comments || [];
        const normalized = items.map((comment) => ({
          ...comment,
          userName: comment.userName || comment.user?.name || 'Collaborator',
        }));
        setComments(normalized);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to load comments', error.message);
        }
      } finally {
        if (isMounted) {
          setIsCommentsLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [projectId, apiBaseUrl]);

  // Navigate to specific line when file is loaded
  useEffect(() => {
    if (editorRef.current && initialLine && selectedFile) {
      const lineNumber = parseInt(initialLine);
      editorRef.current.revealLineInCenter(lineNumber);
      editorRef.current.setPosition({ lineNumber, column: 1 });
      editorRef.current.focus();
    }
  }, [selectedFile, initialLine]);

  // Build file tree from flat file list
  const buildFileTree = (fileList: any[]): FileNode[] => {
    const root: FileNode[] = [];
    const folderMap: Record<string, FileNode> = {};

    fileList.forEach((file: any) => {
      const parts = file.path.split('/');
      let currentLevel = root;

      parts.forEach((part: string, index: number) => {
        const isFile = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');

        let existing = currentLevel.find((node) => node.name === part);

        if (!existing) {
          existing = {
            id: file.id || currentPath,
            name: part,
            path: currentPath,
            type: isFile ? 'file' : 'folder',
            content: isFile ? file.content : undefined,
            language: isFile ? file.language : undefined,
            children: isFile ? undefined : [],
            isExpanded: false,
          };

          currentLevel.push(existing);
          if (!isFile) {
            folderMap[currentPath] = existing;
          }
        }

        if (!isFile && existing.children) {
          currentLevel = existing.children;
        }
      });
    });

    return root;
  };

  // Find file by path in tree
  const findFileByPath = (tree: FileNode[], path: string): FileNode | null => {
    for (const node of tree) {
      if (node.path === path && node.type === 'file') {
        return node;
      }
      if (node.children) {
        const found = findFileByPath(node.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  // Select file to edit
  const selectFile = (file: FileNode) => {
    if (file.type !== 'file') return;

    setSelectedFile(file);
    setCode(file.content || '');
    setOriginalCode(file.content || '');
    setLanguage(file.language || detectLanguage(file.name));

    // Add to open tabs if not already open
    setOpenTabs(prev => {
      const exists = prev.find(t => t.file.path === file.path);
      if (!exists) {
        return [...prev, { file, isModified: false }];
      }
      return prev;
    });

    // Add to recent files
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.path !== file.path);
      return [file, ...filtered].slice(0, 10);
    });

    // Extract code symbols
    extractSymbols(file.content || '', file.language || detectLanguage(file.name));

    // Notify other collaborators
    if (socketRef.current) {
      socketRef.current.emit('file:open', {
        fileId: file.id,
        fileName: file.name,
      });
    }
  };

  // Extract code symbols (functions, classes, etc.)
  const extractSymbols = (content: string, lang: string) => {
    const symbols: CodeSymbol[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Function patterns
      const funcMatch = line.match(/(?:function|const|let|var)\s+(\w+)\s*(?:=\s*(?:async\s*)?\(|=\s*\(|\()/);
      if (funcMatch) {
        symbols.push({ name: funcMatch[1], kind: 'function', line: index + 1 });
      }
      
      // Class patterns
      const classMatch = line.match(/class\s+(\w+)/);
      if (classMatch) {
        symbols.push({ name: classMatch[1], kind: 'class', line: index + 1 });
      }
      
      // Interface patterns
      const interfaceMatch = line.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        symbols.push({ name: interfaceMatch[1], kind: 'interface', line: index + 1 });
      }
      
      // Method patterns
      const methodMatch = line.match(/^\s+(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\w+)?\s*{/);
      if (methodMatch && !funcMatch) {
        symbols.push({ name: methodMatch[1], kind: 'method', line: index + 1 });
      }
    });
    
    setCodeSymbols(symbols);
  };

  // Close a tab
  const closeTab = (filePath: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenTabs(prev => prev.filter(t => t.file.path !== filePath));
    
    // If closing current file, switch to another tab
    if (selectedFile?.path === filePath) {
      const remaining = openTabs.filter(t => t.file.path !== filePath);
      if (remaining.length > 0) {
        selectFile(remaining[remaining.length - 1].file);
      } else {
        setSelectedFile(null);
        setCode('');
      }
    }
  };

  // Toggle folder expand/collapse
  const toggleFolder = (path: string) => {
    const updateTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.path === path && node.type === 'folder') {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    setFiles(updateTree(files));
  };

  // Handle editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;

    setCode(value);
    
    // Mark tab as modified if content changed
    if (selectedFile && value !== originalCode) {
      setOpenTabs(prev => prev.map(t => 
        t.file.path === selectedFile.path ? { ...t, isModified: true } : t
      ));
    }

    // Emit changes to other collaborators
    if (socketRef.current && selectedFile) {
      socketRef.current.emit('code:change', {
        fileId: selectedFile.id,
        changes: value,
        timestamp: Date.now(),
      });
    }
  };

  // Filter files based on search
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    
    const searchLower = searchQuery.toLowerCase();
    
    const filterTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce((acc: FileNode[], node) => {
        if (node.type === 'file' && node.name.toLowerCase().includes(searchLower)) {
          acc.push(node);
        } else if (node.type === 'folder' && node.children) {
          const filteredChildren = filterTree(node.children);
          if (filteredChildren.length > 0) {
            acc.push({ ...node, children: filteredChildren, isExpanded: true });
          }
        }
        return acc;
      }, []);
    };
    
    return filterTree(files);
  }, [files, searchQuery]);

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard',
    });
  };

  // Download current file
  const handleDownloadFile = () => {
    if (!selectedFile) return;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded',
      description: `${selectedFile.name} downloaded`,
    });
  };

  // Format code
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
      toast({
        title: 'Formatted',
        description: 'Code has been formatted',
      });
    }
  };

  // Go to line
  const handleGoToLine = (lineNumber: number) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(lineNumber);
      editorRef.current.setPosition({ lineNumber, column: 1 });
      editorRef.current.focus();
    }
  };

  // Reset code to original
  const handleResetCode = () => {
    setCode(originalCode);
    setOpenTabs(prev => prev.map(t => 
      t.file.path === selectedFile?.path ? { ...t, isModified: false } : t
    ));
    toast({
      title: 'Reset',
      description: 'Code reset to original',
    });
  };

  // Find next occurrence
  const handleFindNext = () => {
    if (editorRef.current && findText) {
      const model = editorRef.current.getModel();
      if (model) {
        editorRef.current.getAction('actions.find')?.run();
      }
    }
  };

  // Replace text
  const handleReplace = () => {
    if (editorRef.current && findText && replaceText) {
      const newCode = code.replace(new RegExp(findText, 'g'), replaceText);
      setCode(newCode);
      toast({
        title: 'Replaced',
        description: `Replaced all occurrences of "${findText}"`,
      });
    }
  };

  // Keyboard shortcuts
  const shortcuts = [
    { keys: 'Ctrl/⌘ + S', action: 'Save file' },
    { keys: 'Ctrl/⌘ + F', action: 'Find in file' },
    { keys: 'Ctrl/⌘ + H', action: 'Find & Replace' },
    { keys: 'Ctrl/⌘ + P', action: 'Quick file search' },
    { keys: 'Ctrl/⌘ + G', action: 'Go to line' },
    { keys: 'Ctrl/⌘ + D', action: 'Select next occurrence' },
    { keys: 'Ctrl/⌘ + /', action: 'Toggle comment' },
    { keys: 'Ctrl/⌘ + ]', action: 'Indent line' },
    { keys: 'Ctrl/⌘ + [', action: 'Outdent line' },
    { keys: 'Alt + ↑/↓', action: 'Move line up/down' },
    { keys: 'Ctrl/⌘ + Shift + K', action: 'Delete line' },
    { keys: 'F11', action: 'Toggle zen mode' },
  ];

  // Code stats
  const codeStats = useMemo(() => {
    const lines = code.split('\n').length;
    const chars = code.length;
    const words = code.split(/\s+/).filter(w => w.length > 0).length;
    return { lines, chars, words };
  }, [code]);

  // Get file icon color based on language
  const getFileIconColor = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const colorMap: Record<string, string> = {
      ts: 'text-blue-500',
      tsx: 'text-blue-500',
      js: 'text-yellow-500',
      jsx: 'text-yellow-500',
      py: 'text-green-500',
      java: 'text-orange-500',
      css: 'text-pink-500',
      html: 'text-orange-600',
      json: 'text-yellow-600',
      md: 'text-gray-500',
    };
    return colorMap[ext || ''] || 'text-gray-400';
  };

  // Handle cursor position changes
  const handleCursorChange = (e: any) => {
    const position = e.position;
    if (socketRef.current) {
      socketRef.current.emit('cursor:update', {
        line: position.lineNumber,
        column: position.column,
      });
    }
  };

  // Save file
  const handleSave = async () => {
    if (!selectedFile || !projectId) return;

    setIsSaving(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${apiBaseUrl}/api/projects/${projectId}/files/${selectedFile.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: code }),
        }
      );

      if (!response.ok) throw new Error('Save failed');

      setOriginalCode(code);
      setLastSaved(new Date());
      setOpenTabs(prev => prev.map(t => 
        t.file.path === selectedFile.path ? { ...t, isModified: false } : t
      ));

      toast({
        title: 'Saved',
        description: `${selectedFile.name} saved successfully`,
      });

      // Notify collaborators
      if (socketRef.current) {
        socketRef.current.emit('file:saved', {
          fileId: selectedFile.id,
          fileName: selectedFile.name,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save file',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommentSubmit = () => {
    if (!projectId) {
      toast({
        title: 'Missing project',
        description: 'Select a project before commenting.',
        variant: 'destructive',
      });
      return;
    }

    const message = newComment.trim();
    if (!message) return;

    if (!socketRef.current) {
      toast({
        title: 'Connection required',
        description: 'Reconnect to collaboration to share comments.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingComment(true);

    socketRef.current.emit('project-comment', {
      projectId,
      content: message,
    });

    setNewComment('');
    setTimeout(() => setIsSubmittingComment(false), 300);
  };

  // Detect language from file extension
  const detectLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rs: 'rust',
      rb: 'ruby',
      php: 'php',
      cs: 'csharp',
      swift: 'swift',
      kt: 'kotlin',
      css: 'css',
      scss: 'scss',
      html: 'html',
      json: 'json',
      md: 'markdown',
      sql: 'sql',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml',
    };
    return langMap[ext || ''] || 'plaintext';
  };

  // Render file tree
  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-lg hover:bg-[#E8D5C4]/50 transition-all group',
            selectedFile?.path === node.path && 'bg-[#E8D5C4] text-[#37322F]'
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              selectFile(node);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {node.isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-[#37322F]/60" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[#37322F]/60" />
              )}
              {node.isExpanded ? (
                <FolderOpen className="h-4 w-4 text-amber-600" />
              ) : (
                <Folder className="h-4 w-4 text-amber-500" />
              )}
            </>
          ) : (
            <>
              <span className="w-3.5" />
              <FileCode className={cn("h-4 w-4", getFileIconColor(node.name))} />
            </>
          )}
          <span className="text-[#37322F] truncate flex-1">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isExpanded && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  const getCommentTimestamp = (value: string) => {
    try {
      return formatDistanceToNow(new Date(value), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  const quickLinks = [
    { label: 'Dashboard', href: '/app/dashboard', icon: Terminal },
    { label: 'Projects', href: '/app/projects', icon: Folder },
    { label: 'Analysis', href: '/app/analysis', icon: Sparkles },
    { label: 'Diagrams', href: '/app/diagrams', icon: GitBranch },
  ];

  return (
    <TooltipProvider>
      <div className={cn(
        "flex h-screen bg-[#F7F5F3]",
        isZenMode && "bg-[#1e1e1e]"
      )}>
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && !isZenMode && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Sidebar - File Tree */}
        {!isZenMode && (
          <div className={cn(
            "bg-white border-r border-[#E8D5C4] flex flex-col",
            "fixed lg:relative inset-y-0 left-0 z-50 w-72",
            "transform transition-transform duration-300 lg:translate-x-0",
            showMobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}>
            {/* Header */}
            <div className="p-4 border-b border-[#E8D5C4]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[#37322F] flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-[#37322F]" />
                  Project Files
                </h2>
                <div className="flex items-center gap-1">
                  {/* Close sidebar on mobile */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 lg:hidden"
                    onClick={() => setShowMobileSidebar(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => navigate(-1)}
                      >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Go back</TooltipContent>
                </Tooltip>
                </div>
              </div>
              <p className="text-sm text-[#37322F]/60 truncate">{projectName}</p>
              
              {/* Search Files */}
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#37322F]/40" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#F7F5F3] border-[#E8D5C4] h-9 text-sm"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* File Tree */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredFiles.length > 0 ? renderFileTree(filteredFiles) : (
                  <div className="text-center text-[#37322F]/50 text-sm mt-8">
                    {searchQuery ? 'No matching files' : 'No files found'}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Recent Files */}
            {recentFiles.length > 0 && !searchQuery && (
              <div className="border-t border-[#E8D5C4] p-3">
                <p className="text-xs font-medium text-[#37322F]/60 mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent Files
                </p>
                <div className="space-y-1">
                  {recentFiles.slice(0, 3).map(file => (
                    <button
                      key={file.path}
                      onClick={() => selectFile(file)}
                      className="w-full text-left px-2 py-1 text-xs text-[#37322F]/70 hover:bg-[#E8D5C4]/30 rounded truncate flex items-center gap-2"
                    >
                      <FileCode className={cn("h-3 w-3", getFileIconColor(file.name))} />
                      {file.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation Bar */}
          {!isZenMode && (
            <div className="bg-white border-b border-[#E8D5C4] px-2 sm:px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Mobile Sidebar Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:hidden flex-shrink-0"
                    onClick={() => setShowMobileSidebar(true)}
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                  
                  {/* Quick Links - Hidden on mobile */}
                  <nav className="hidden md:flex items-center gap-1">
                    {quickLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="px-3 py-1.5 rounded-lg text-sm text-[#37322F]/70 hover:bg-[#E8D5C4]/50 hover:text-[#37322F] transition-colors flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden lg:inline">{link.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                  
                  {/* Project name on mobile */}
                  <span className="md:hidden text-sm font-medium text-[#37322F] truncate max-w-[120px]">
                    {projectName || 'Editor'}
                  </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Collaborators - Hidden on very small screens */}
                  {collaborators.length > 0 && (
                    <div className="hidden sm:flex items-center gap-2 mr-2 px-2 py-1 bg-[#F7F5F3] rounded-lg">
                      <Users className="h-4 w-4 text-[#37322F]/60" />
                      <div className="flex -space-x-2">
                        {collaborators.slice(0, 3).map((collab) => (
                          <Tooltip key={collab.id}>
                            <TooltipTrigger asChild>
                              <Avatar
                                className="h-6 w-6 sm:h-7 sm:w-7 border-2 border-white cursor-pointer"
                                style={{ backgroundColor: collab.color }}
                              >
                                <AvatarFallback className="text-white text-[10px] sm:text-xs">
                                  {collab.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>{collab.name}</TooltipContent>
                          </Tooltip>
                        ))}
                        {collaborators.length > 3 && (
                          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#37322F] border-2 border-white flex items-center justify-center text-white text-[10px]">
                            +{collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Connection Status - Compact on mobile */}
                  <Badge 
                    variant={isConnected ? 'default' : 'destructive'} 
                    className={cn(
                      "text-xs",
                      isConnected && "bg-green-500 hover:bg-green-600"
                    )}
                  >
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full sm:mr-1.5",
                      isConnected ? "bg-green-200 animate-pulse" : "bg-red-200"
                    )} />
                    <span className="hidden sm:inline">{isConnected ? 'Live' : 'Offline'}</span>
                  </Badge>

                  {/* Mobile Comments Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:hidden flex-shrink-0"
                    onClick={() => setShowMobileComments(true)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>

                  {/* Save Button - Icon only on mobile */}
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!selectedFile || isSaving}
                    className="gap-2 bg-[#37322F] hover:bg-[#37322F]/90"
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Editor Tabs */}
          {!isZenMode && openTabs.length > 0 && (
            <div className="bg-[#F7F5F3] border-b border-[#E8D5C4] px-2 pt-2">
              <div className="flex items-center gap-1 overflow-x-auto">
                {openTabs.map(tab => (
                  <div
                    key={tab.file.path}
                    onClick={() => selectFile(tab.file)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer text-sm transition-colors group min-w-0",
                      selectedFile?.path === tab.file.path
                        ? "bg-white text-[#37322F] border-t border-x border-[#E8D5C4]"
                        : "text-[#37322F]/60 hover:bg-white/50"
                    )}
                  >
                    <FileCode className={cn("h-4 w-4 flex-shrink-0", getFileIconColor(tab.file.name))} />
                    <span className="truncate max-w-[120px]">{tab.file.name}</span>
                    {tab.isModified && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    )}
                    <button
                      onClick={(e) => closeTab(tab.file.path, e)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-[#E8D5C4] rounded p-0.5 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toolbar */}
          {!isZenMode && selectedFile && (
            <div className="bg-white border-b border-[#E8D5C4] px-2 sm:px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {/* Breadcrumb - Truncated on mobile */}
                <div className="flex items-center gap-1 text-xs sm:text-sm text-[#37322F]/60 min-w-0 flex-1 overflow-hidden">
                  <Folder className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {selectedFile.path.split('/').slice(-2).join('/')}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs bg-[#F7F5F3] flex-shrink-0">
                  {language}
                </Badge>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Find & Replace Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowFindReplace(!showFindReplace)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Find & Replace (Ctrl+H)</TooltipContent>
                </Tooltip>

                {/* Code Symbols */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8", showSymbols && "bg-[#E8D5C4]")}
                      onClick={() => setShowSymbols(!showSymbols)}
                    >
                      <Braces className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Code Symbols</TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-[#E8D5C4] mx-1" />

                {/* Copy */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Code</TooltipContent>
                </Tooltip>

                {/* Download */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownloadFile}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download File</TooltipContent>
                </Tooltip>

                {/* Format */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFormatCode}>
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Format Code</TooltipContent>
                </Tooltip>

                {/* Reset */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetCode}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset to Original</TooltipContent>
                </Tooltip>

                <div className="w-px h-5 bg-[#E8D5C4] mx-1" />

                {/* Editor Settings */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditorTheme(editorTheme === 'vs-light' ? 'vs-dark' : 'vs-light')}>
                      {editorTheme === 'vs-light' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                      {editorTheme === 'vs-light' ? 'Dark Theme' : 'Light Theme'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowMinimap(!showMinimap)}>
                      {showMinimap ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showMinimap ? 'Hide Minimap' : 'Show Minimap'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setWordWrap(!wordWrap)}>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      {wordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFontSize(Math.max(10, fontSize - 2))}>
                      <ZoomOut className="h-4 w-4 mr-2" />
                      Decrease Font Size
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                      <ZoomIn className="h-4 w-4 mr-2" />
                      Increase Font Size
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Keyboard Shortcuts */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowShortcuts(true)}>
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Keyboard Shortcuts</TooltipContent>
                </Tooltip>

                {/* Zen Mode */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsZenMode(true)}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zen Mode (F11)</TooltipContent>
                </Tooltip>

                {/* Toggle Comments Panel */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setShowCommentsPanel(!showCommentsPanel)}
                    >
                      {showCommentsPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{showCommentsPanel ? 'Hide Comments' : 'Show Comments'}</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Find & Replace Bar */}
          {showFindReplace && selectedFile && (
            <div className="bg-white border-b border-[#E8D5C4] px-4 py-2 flex items-center gap-3">
              <Input
                placeholder="Find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="w-48 h-8 text-sm"
              />
              <Input
                placeholder="Replace with..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="w-48 h-8 text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleFindNext}>
                Find Next
              </Button>
              <Button size="sm" variant="outline" onClick={handleReplace}>
                Replace All
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowFindReplace(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Monaco Editor & Panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Code Symbols Panel */}
            {showSymbols && selectedFile && !isZenMode && (
              <div className="w-56 border-r border-[#E8D5C4] bg-white overflow-y-auto">
                <div className="p-3 border-b border-[#E8D5C4]">
                  <h3 className="text-sm font-medium text-[#37322F] flex items-center gap-2">
                    <Braces className="h-4 w-4" />
                    Symbols
                  </h3>
                </div>
                <div className="p-2">
                  {codeSymbols.length > 0 ? (
                    codeSymbols.map((symbol, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleGoToLine(symbol.line)}
                        className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-[#E8D5C4]/50 flex items-center gap-2"
                      >
                        <span className={cn(
                          "w-5 h-5 rounded flex items-center justify-center text-xs font-medium",
                          symbol.kind === 'function' && "bg-purple-100 text-purple-600",
                          symbol.kind === 'class' && "bg-amber-100 text-amber-600",
                          symbol.kind === 'interface' && "bg-blue-100 text-blue-600",
                          symbol.kind === 'method' && "bg-green-100 text-green-600",
                        )}>
                          {symbol.kind[0].toUpperCase()}
                        </span>
                        <span className="truncate text-[#37322F]">{symbol.name}</span>
                        <span className="text-xs text-[#37322F]/40 ml-auto">:{symbol.line}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-[#37322F]/50 text-center py-4">No symbols found</p>
                  )}
                </div>
              </div>
            )}

            {/* Editor */}
            <div className="flex-1 relative">
              {selectedFile ? (
                <>
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={(editor, monaco) => {
                      editorRef.current = editor;
                      monacoRef.current = monaco;

                      // Listen for cursor position changes
                      editor.onDidChangeCursorPosition(handleCursorChange);

                      // Enable keyboard shortcuts
                      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, handleSave);
                      
                      // Zen mode toggle
                      editor.addCommand(monaco.KeyCode.F11, () => setIsZenMode(!isZenMode));
                    }}
                    theme={editorTheme}
                    options={{
                      minimap: { enabled: showMinimap },
                      fontSize: fontSize,
                      lineNumbers: 'on',
                      roundedSelection: true,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: wordWrap ? 'on' : 'off',
                      quickSuggestions: true,
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      folding: true,
                      foldingStrategy: 'indentation',
                      showFoldingControls: 'always',
                      matchBrackets: 'always',
                      autoClosingBrackets: 'always',
                      autoClosingQuotes: 'always',
                      formatOnPaste: true,
                      formatOnType: true,
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: 'on',
                      smoothScrolling: true,
                      padding: { top: 16 },
                    }}
                  />

                  {/* Zen Mode Exit Button */}
                  {isZenMode && (
                    <Button
                      className="absolute top-4 right-4 gap-2 bg-[#37322F]/80 hover:bg-[#37322F]"
                      onClick={() => setIsZenMode(false)}
                    >
                      <Minimize2 className="h-4 w-4" />
                      Exit Zen Mode
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-[#F7F5F3]">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#E8D5C4] flex items-center justify-center">
                      <Code2 className="h-10 w-10 text-[#37322F]/40" />
                    </div>
                    <p className="text-lg font-medium text-[#37322F]">No file selected</p>
                    <p className="text-sm text-[#37322F]/60 mt-2">Select a file from the sidebar to start editing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Comments Panel - Mobile Overlay */}
            {showMobileComments && !isZenMode && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowMobileComments(false)}
              />
            )}

            {/* Comments Panel */}
            {((showCommentsPanel && !isZenMode) || showMobileComments) && (
              <aside className={cn(
                "bg-white flex flex-col border-l border-[#E8D5C4]",
                "fixed lg:relative inset-y-0 right-0 z-50 w-80",
                "transform transition-transform duration-300 lg:translate-x-0",
                showMobileComments || showCommentsPanel ? "translate-x-0" : "translate-x-full lg:translate-x-0",
                !showCommentsPanel && !showMobileComments && "lg:hidden"
              )}>
                <div className="px-4 py-3 border-b border-[#E8D5C4]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#37322F] flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#37322F]/60" />
                        Comments
                      </p>
                      <p className="text-xs text-[#37322F]/50">Keep everyone in sync on this project</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-[#F7F5F3]">
                        {comments.length}
                      </Badge>
                      {/* Close button for mobile */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 lg:hidden"
                        onClick={() => setShowMobileComments(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 px-4 py-3">
                  <div className="space-y-3">
                    {isCommentsLoading ? (
                      <p className="text-sm text-[#37322F]/50">Loading comments...</p>
                    ) : comments.length === 0 ? (
                      <div className="text-center text-[#37322F]/50 text-sm mt-8">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p>No comments yet</p>
                        <p className="text-xs mt-1">Start the discussion below</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="rounded-xl border border-[#E8D5C4] p-3 bg-[#F7F5F3]/50">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-[#37322F]">
                              {comment.userName || 'Collaborator'}
                            </span>
                            <span className="text-xs text-[#37322F]/50">
                              {getCommentTimestamp(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-[#37322F]/70 mt-2 whitespace-pre-line">
                            {comment.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="border-t border-[#E8D5C4] p-3 space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share feedback or leave a note"
                    className="min-h-[80px] bg-[#F7F5F3] border-[#E8D5C4] resize-none"
                    onKeyDown={(event) => {
                      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                        event.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                  />
                  <div className="flex items-center justify-between text-xs text-[#37322F]/50">
                    <span>Press ⌘/Ctrl + Enter to send</span>
                    <Button
                      size="sm"
                      className="gap-2 bg-[#37322F] hover:bg-[#37322F]/90"
                      disabled={!newComment.trim() || isSubmittingComment}
                      onClick={handleCommentSubmit}
                    >
                      <SendHorizontal className="h-4 w-4" />
                      {isSubmittingComment ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Status Bar */}
          {!isZenMode && (
            <div className="bg-[#37322F] text-white px-4 py-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                {selectedFile && (
                  <>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {codeStats.lines} lines
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {codeStats.chars} chars
                    </span>
                    <span className="flex items-center gap-1">
                      <Code2 className="h-3 w-3" />
                      {language}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                {lastSaved && (
                  <span className="flex items-center gap-1 text-white/60">
                    <Check className="h-3 w-3" />
                    Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-400" : "bg-red-400"
                  )} />
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                <span>Font: {fontSize}px</span>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts Dialog */}
        <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              {shortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 px-3 bg-[#F7F5F3] rounded-lg">
                  <span className="text-sm text-[#37322F]">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-white border border-[#E8D5C4] rounded text-xs font-mono text-[#37322F]">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
