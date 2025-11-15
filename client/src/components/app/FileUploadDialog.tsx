import { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { projectService } from '@/services/project.service';
import { useToast } from '@/components/ui/use-toast';
import type { UploadFilesResponse } from '@/types/api';

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string | null;
  onUploadComplete?: (projectId?: string) => void;
}

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  relativePath: string;
  error?: string;
}

export const FileUploadDialog = ({
  open,
  onOpenChange,
  projectId,
  onUploadComplete,
}: FileUploadDialogProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLanguage, setProjectLanguage] = useState<'typescript' | 'javascript' | 'python' | 'java' | 'csharp' | 'cpp' | 'php' | 'ruby' | 'go'>('typescript');
  const [needsProjectCreation, setNeedsProjectCreation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploadedCount, setUploadedCount] = useState(0);
  const uploadBatchSize = Math.max(1, Number(import.meta.env.VITE_UPLOAD_BATCH_SIZE ?? 250) || 250);
  const [lastSummary, setLastSummary] = useState<UploadFilesResponse | null>(null);

  const resetFormState = () => {
    setFiles([]);
    setNeedsProjectCreation(false);
    setProjectName('');
    setProjectDescription('');
    setProjectLanguage('typescript');
    setUploadedCount(0);
    setLastSummary(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => {
      const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      return {
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        status: 'pending' as const,
        progress: 0,
        relativePath,
      };
    });
    setFiles((prev) => [...prev, ...uploadFiles]);
    setUploadedCount(0);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    console.log('=== HANDLE UPLOAD CALLED ===');
    console.log('projectId:', projectId);
    console.log('needsProjectCreation:', needsProjectCreation);
    console.log('files.length:', files.length);
    console.log('projectName:', projectName);
    console.log('isUploading:', isUploading);

    // Check if we need to show the project creation form first
    if (!projectId && !needsProjectCreation && files.length > 0) {
      console.log('Setting needsProjectCreation to true - showing Step 2');
      setNeedsProjectCreation(true);
      return;
    }

    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select files to upload',
        variant: 'destructive',
      });
      return;
    }

    // Validate project name if creating a new project
    if (!projectId && needsProjectCreation && !projectName.trim()) {
      toast({
        title: 'Project name required',
        description: 'Please enter a name for your project',
        variant: 'destructive',
      });
      return;
    }

    console.log('🚀 Starting upload process...');
    setIsUploading(true);

    try {
      let targetProjectId = projectId;

      // Create project if needed
      if (needsProjectCreation && projectName.trim()) {
        console.log('📦 Creating project with data:', {
          name: projectName,
          description: projectDescription,
          language: projectLanguage,
        });
        
        const createResponse = await projectService.createProject({
          name: projectName,
          description: projectDescription || undefined,
          language: projectLanguage,
        });
        
        console.log('📦 Create response:', createResponse);
        
        // The response structure is { success: true, data: { project: { id: "...", ... } } }
        targetProjectId = (createResponse as any).data?.project?.id || null;
        
        if (!targetProjectId) {
          console.error('❌ No project ID in response:', createResponse);
          throw new Error('Failed to create project');
        }

        console.log('✅ Project created with ID:', targetProjectId);
        toast({
          title: 'Project created',
          description: `Created project: ${projectName}`,
        });
      }

      if (!targetProjectId) {
        throw new Error('No project ID available');
      }

      // Update all files to uploading status
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: 'uploading' as const, progress: 0 }))
      );

      const totalFiles = files.length;

      const uploadResponse = await projectService.uploadFiles(
        targetProjectId,
        files.map((f) => f.file),
        {
          batchSize: uploadBatchSize,
          onChunkStart: ({ chunkIndex, totalChunks }) => {
            setFiles((prev) =>
              prev.map((file, index) => {
                const chunkStart = chunkIndex * uploadBatchSize;
                const chunkEnd = chunkStart + uploadBatchSize;
                if (index >= chunkStart && index < chunkEnd) {
                  return { ...file, progress: 5 };
                }
                return file;
              })
            );
          },
          onChunkComplete: ({ chunkIndex, chunkSize, from }) => {
            setUploadedCount((prev) => prev + chunkSize);
            setFiles((prev) =>
              prev.map((file, index) => {
                if (index >= from && index < from + chunkSize) {
                  return { ...file, status: 'success', progress: 100 };
                }
                return file;
              })
            );
          },
        }
      );

      toast({
        title: 'Upload complete',
        description: uploadResponse.message || `Uploaded ${totalFiles} file(s)`
      });

      setTimeout(() => {
        onOpenChange(false);
        resetFormState();
        if (onUploadComplete) onUploadComplete(targetProjectId || undefined);
      }, 1500);
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Mark all as error
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Upload failed',
        }))
      );

      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {needsProjectCreation ? 'Create Project & Upload Files' : 'Upload Files'}
          </DialogTitle>
          <DialogDescription>
            {needsProjectCreation
              ? 'Create a new project for your files'
              : projectId
              ? 'Drag and drop files or click to browse'
              : 'Upload files to create a new project'}
          </DialogDescription>
        </DialogHeader>

        {needsProjectCreation ? (
          /* Project Creation Form */
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                placeholder="My Awesome Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description (Optional)</Label>
              <Input
                id="project-description"
                placeholder="Brief description of your project"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-language">Primary Language *</Label>
              <Select
                value={projectLanguage}
                onValueChange={(value: any) => setProjectLanguage(value)}
                disabled={isUploading}
              >
                <SelectTrigger id="project-language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">
                {files.length} file(s) ready to upload
              </p>
              <p className="text-xs text-blue-700">
                A new project will be created with these files
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer
                transition-all duration-200
                ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
                }
              `}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Drop files/folders here or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Supports: .js, .ts, .jsx, .tsx, .py, .java, .cpp, .c, .go, .rs, etc.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rs,.php,.rb,.swift,.kt,.cs,.vue,.svelte"
                {...({ webkitdirectory: '', directory: '' } as any)}
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
                {files.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
                  >
                    {getStatusIcon(uploadFile.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      {uploadFile.status === 'uploading' && (
                        <Progress value={uploadFile.progress} className="mt-2 h-1" />
                      )}
                      {uploadFile.status === 'error' && uploadFile.error && (
                        <p className="text-xs text-red-500 mt-1">{uploadFile.error}</p>
                      )}
                    </div>
                    {uploadFile.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(uploadFile.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <DialogFooter>
          {needsProjectCreation ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setNeedsProjectCreation(false);
                  setProjectName('');
                  setProjectDescription('');
                }}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!projectName.trim() || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating & Uploading...
                  </>
                ) : (
                  `Create Project & Upload ${files.length} file(s)`
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setFiles([]);
                  setNeedsProjectCreation(false);
                  setProjectName('');
                  setProjectDescription('');
                  setProjectLanguage('typescript');
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  console.log('=== BUTTON CLICKED ===');
                  console.log('Event:', e);
                  console.log('files.length:', files.length);
                  console.log('isUploading:', isUploading);
                  handleUpload();
                }}
                disabled={files.length === 0 || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : projectId ? (
                  `Upload ${files.length} file(s)`
                ) : (
                  `Continue with ${files.length} file(s)`
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
