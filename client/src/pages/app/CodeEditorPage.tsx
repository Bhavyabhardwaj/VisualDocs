import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

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

export default function CodeEditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Get file and line from URL params (for navigation from analysis)
  const initialFile = searchParams.get('file');
  const initialLine = searchParams.get('line');

  // State
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('typescript');
  const [projectName, setProjectName] = useState<string>('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Refs
  const editorRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const monacoRef = useRef<any>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || !projectId) return;

    const socket = io('http://localhost:3004', {
      auth: { token },
      query: { projectId },
    });

    socket.on('connect', () => {
      setIsConnected(true);
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

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [projectId, toast]);

  // Load project files
  useEffect(() => {
    if (!projectId) return;

    const loadFiles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3004/api/projects/${projectId}`, {
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
  }, [projectId, initialFile, toast]);

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
    setLanguage(file.language || detectLanguage(file.name));

    // Notify other collaborators
    if (socketRef.current) {
      socketRef.current.emit('file:open', {
        fileId: file.id,
        fileName: file.name,
      });
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

    // Emit changes to other collaborators
    if (socketRef.current && selectedFile) {
      socketRef.current.emit('code:change', {
        fileId: selectedFile.id,
        changes: value,
        timestamp: Date.now(),
      });
    }
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
        `http://localhost:3004/api/projects/${projectId}/files/${selectedFile.id}`,
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
            'flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded hover:bg-brand-bg transition-colors',
            selectedFile?.path === node.path && 'bg-brand-bg'
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
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              )}
              {node.isExpanded ? (
                <FolderOpen className="h-4 w-4 text-brand-secondary" />
              ) : (
                <Folder className="h-4 w-4 text-brand-secondary" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="h-4 w-4 text-neutral-600" />
            </>
          )}
          <span className="text-neutral-900">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isExpanded && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  const quickLinks = [
    { label: 'Dashboard', href: '/app/dashboard' },
    { label: 'Projects', href: '/app/projects' },
    { label: 'Analysis', href: '/app/analysis' },
    { label: 'Diagrams', href: '/app/diagrams' },
  ];

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar - File Tree */}
      <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="font-semibold text-brand-primary flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Project Files
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {files.length > 0 ? renderFileTree(files) : (
            <div className="text-center text-neutral-500 text-sm mt-8">
              No files found
            </div>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation & Status */}
        <div className="bg-white border-b border-neutral-200 px-4 py-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-neutral-500 tracking-wide">Project</p>
              <p className="text-lg font-semibold text-neutral-900">{projectName}</p>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3 py-1.5 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-100 transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="h-14 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedFile && (
                <>
                  <File className="h-4 w-4 text-neutral-600" />
                  <span className="font-medium text-neutral-900">{selectedFile.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {language}
                  </Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Collaborators */}
              {collaborators.length > 0 && (
                <div className="flex items-center gap-2 mr-4">
                  <Users className="h-4 w-4 text-neutral-600" />
                  <div className="flex -space-x-2">
                    {collaborators.map((collab) => (
                      <Avatar
                        key={collab.id}
                        className="h-8 w-8 border-2 border-white"
                        style={{ backgroundColor: collab.color }}
                      >
                        <AvatarFallback className="text-white text-xs">
                          {collab.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              )}

              {/* Connection Status */}
              <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
                {isConnected ? 'Live' : 'Offline'}
              </Badge>

              {/* Save Button */}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!selectedFile || isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          {selectedFile ? (
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
              }}
              theme="vs-light"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
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
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500">
              <div className="text-center">
                <Code2 className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
                <p className="text-lg font-medium">No file selected</p>
                <p className="text-sm mt-2">Select a file from the sidebar to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
