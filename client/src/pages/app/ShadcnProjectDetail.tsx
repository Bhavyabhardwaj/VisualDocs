import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, GitBranch, FileText, Sparkles, Download, Share2,
  PlayCircle, Settings, Trash2, Archive, MoreVertical, FolderTree,
  Code2, FileJson, Eye, Copy, Check, Network, GitGraph, Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { projectService } from '@/services/project.service';
import { analysisService } from '@/services/analysis.service';
import { diagramService } from '@/services/diagram.service';
import { socketService } from '@/services/socket.service';
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import type { Project, Analysis, Diagram } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

export const ShadcnProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [documentation, setDocumentation] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [generatingDiagram, setGeneratingDiagram] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const [showDiagramModal, setShowDiagramModal] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Collaboration state
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    console.log('🎬 Component mounted/updated');
    console.log('📊 Current analysis state:', analysis);
    console.log('📚 Current documentation state:', documentation);
    console.log('📁 Current files count:', files.length);
    console.log('🎨 Current diagrams count:', diagrams.length);
  }, [analysis, documentation, files, diagrams]);

  useEffect(() => {
    if (id) {
      console.log('🚀 Loading data for project:', id);
      loadProject();
      loadProjectFiles();
      loadExistingAnalysis();
      loadExistingDocumentation();
      handleLoadDiagrams();
      loadExistingComments();
    }
  }, [id]);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      socketService.connect(token);
      setIsSocketConnected(socketService.isConnected());

      // Check connection status
      const connectionCheck = setInterval(() => {
        setIsSocketConnected(socketService.isConnected());
      }, 2000);

      return () => clearInterval(connectionCheck);
    }
  }, []);

  // Join project and setup socket listeners
  useEffect(() => {
    if (!id || !isSocketConnected) return;

    // Join project room
    socketService.joinProject(id);

    // Create handler functions that won't be recreated
    const handleUserJoined = (data: any) => {
      console.log('👋 User joined:', data);
      if (data.users) setActiveUsers(data.users);
    };

    const handleUserLeft = (data: any) => {
      console.log('👋 User left:', data);
      if (data.users) setActiveUsers(data.users);
    };

    const handleProjectUsers = (data: any) => {
      console.log('👥 Project users:', data);
      if (data.users) setActiveUsers(data.users);
    };

    const handleComment = (comment: any) => {
      console.log('💬 Received comment from socket:', comment);
      console.log('💬 Current comments count:', comments.length);
      
      setComments(prev => {
        // Prevent duplicates by checking if comment already exists
        const commentId = comment.id || `${comment.userId}-${comment.timestamp}`;
        const exists = prev.some(c => c.id === commentId);
        
        console.log('💬 Comment ID:', commentId);
        console.log('💬 Duplicate check:', exists);
        
        if (exists) {
          console.log('⚠️ Duplicate comment detected, skipping');
          return prev;
        }
        
        const newComment = {
          id: commentId,
          userId: comment.userId || 'unknown',
          userName: comment.userName || comment.user?.name || 'Anonymous',
          content: comment.comment || comment.content,
          timestamp: comment.timestamp || new Date().toISOString(),
        };
        
        console.log('✅ Adding new comment:', newComment);
        return [...prev, newComment];
      });
    };

    const handleAnalysisProgress = (data: any) => {
      console.log('📊 Analysis progress:', data);
      toast({
        title: 'Analysis Progress',
        description: `${data.progress || 0}% complete`,
      });
    };

    const handleDiagramProgress = (data: any) => {
      console.log('🎨 Diagram progress:', data);
      if (data.status === 'COMPLETED') {
        handleLoadDiagrams();
        toast({
          title: 'Diagram Complete',
          description: 'Diagram generation finished',
        });
      }
    };

    // Listen for user updates
    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);
    socketService.onProjectUsers(handleProjectUsers);

    // Listen for comments
    socketService.onComment(handleComment);

    // Listen for analysis progress
    socketService.onAnalysisProgress(handleAnalysisProgress);

    // Listen for diagram progress
    socketService.onDiagramProgress(handleDiagramProgress);

    return () => {
      if (id) {
        socketService.leaveProject(id);
      }
      // Clean up listeners if socketService supports it
    };
  }, [id, isSocketConnected, toast]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProject(id!);
      console.log('📦 Project data received:', response);
      console.log('📦 Project dates:', {
        createdAt: response.data?.createdAt,
        updatedAt: response.data?.updatedAt,
        lastAnalyzedAt: response.data?.lastAnalyzedAt
      });
      setProject(response.data || null);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectFiles = async () => {
    if (!id) return;
    
    try {
      console.log('📁 Loading project files for:', id);
      const response = await projectService.getProjectFiles(id);
      console.log('📁 Files response:', response);
      
      const filesData = (response.data as any)?.files || response.data || [];
      console.log('📁 Extracted files:', filesData);
      
      setFiles(filesData);
      
      if (filesData.length > 0) {
        console.log(`✅ Loaded ${filesData.length} files`);
      }
    } catch (error) {
      console.error('Failed to load project files:', error);
      setFiles([]);
    }
  };

  const loadExistingAnalysis = async () => {
    if (!id) return;
    
    try {
      console.log('🔍 Loading existing analysis for project:', id);
      const response = await analysisService.getProjectAnalysis(id);
      
      console.log('📊 Full API response:', response);
      console.log('📊 response.data:', response.data);
      console.log('📊 response.success:', response.success);
      
      // Handle different response structures
      let analysisData = null;
      
      if (response.data) {
        // Try different possible structures
        if ((response.data as any).analysis) {
          // Structure: { data: { analysis: {...} } }
          analysisData = (response.data as any).analysis;
          console.log('📊 Found analysis in data.analysis');
        } else if (Array.isArray(response.data)) {
          // Structure: { data: [...] } - array of analyses
          analysisData = response.data[0];
          console.log('📊 Found analysis in data[0]');
        } else {
          // Structure: { data: {...} } - direct analysis object
          analysisData = response.data;
          console.log('📊 Found analysis directly in data');
        }
      }
      
      if (analysisData) {
        console.log('✅ Setting analysis state:', analysisData);
        setAnalysis(analysisData);
        console.log('✅ Analysis state updated successfully');
      } else {
        console.log('⚠️ No analysis data found in response');
      }
    } catch (error: any) {
      // If 404, no existing analysis - that's okay
      if (error?.response?.status === 404) {
        console.log('ℹ️ No previous analysis exists for this project (404)');
      } else {
        console.error('❌ Failed to load existing analysis:', error);
        console.error('Error details:', error?.response?.data);
      }
    }
  };

  const loadExistingDocumentation = async () => {
    if (!id) return;
    
    try {
      console.log('📚 Loading existing documentation for project:', id);
      const response = await analysisService.generateDocumentation(id);
      
      if (response.data?.documentation) {
        console.log('✅ Found existing documentation');
        setDocumentation(response.data.documentation);
      } else {
        console.log('ℹ️ No existing documentation found');
      }
    } catch (error: any) {
      // If 404, no existing documentation - that's okay
      if (error?.response?.status === 404) {
        console.log('ℹ️ No previous documentation exists for this project');
      } else {
        console.error('Failed to load existing documentation:', error);
      }
    }
  };

  const loadExistingComments = async () => {
    if (!id) return;
    
    try {
      console.log('💬 Loading existing comments for project:', id);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/comments/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          console.log('✅ Loaded existing comments:', data.data.length);
          setComments(data.data);
        }
      } else {
        console.log('ℹ️ No existing comments found or error loading');
      }
    } catch (error) {
      console.error('Failed to load existing comments:', error);
    }
  };

  const handleCopyUrl = () => {
    if (project?.githubUrl) {
      navigator.clipboard.writeText(project.githubUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunAnalysis = async () => {
    if (!id) return;
    
    try {
      setAnalyzing(true);
      
      // First check if project has files
      const filesResponse = await projectService.getProjectFiles(id);
      console.log('📦 Files response:', filesResponse);
      
      // The response structure is { data: { files: [...] } } or { data: [...] }
      const files = (filesResponse.data as any)?.files || filesResponse.data || [];
      
      console.log('📁 Extracted files:', files);
      
      if (!files || files.length === 0) {
        toast({
          title: 'No Files Found',
          description: 'Please upload files to your project before running analysis.',
          variant: 'destructive',
        });
        setAnalyzing(false);
        return;
      }

      console.log(`📁 Found ${files.length} files to analyze`);
      
      toast({
        title: 'Analysis Started',
        description: `Analyzing ${files.length} file(s)...`,
      });

      const response = await analysisService.analyzeProject(id);
      console.log('📊 Analysis response:', response);
      console.log('📊 Analysis data:', response.data);
      
      // Backend returns { analysis: {...} }, extract the analysis object
      const analysisData = (response.data as any)?.analysis || response.data;
      console.log('📊 Extracted analysis:', analysisData);
      
      setAnalysis(analysisData);
      
      // Reload project and files to get updated counts
      await loadProject();
      await loadProjectFiles();

      toast({
        title: 'Analysis Complete',
        description: 'Project analysis completed successfully!',
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      console.error('Error response:', (error as any)?.response?.data);
      toast({
        title: 'Analysis Failed',
        description: (error as any)?.response?.data?.error || (error instanceof Error ? error.message : 'Failed to analyze project'),
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateDocumentation = async () => {
    if (!id) {
      toast({
        title: 'Error',
        description: 'Project ID is missing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setGeneratingDocs(true);
      
      toast({
        title: 'Generating Documentation',
        description: 'Creating comprehensive documentation from code analysis...',
      });

      // Call backend API to generate detailed documentation
      const response = await analysisService.generateDocumentation(id);
      const generatedDocs = (response.data as any)?.documentation || '';

      setDocumentation(generatedDocs);
      
      toast({
        title: 'Documentation Generated',
        description: 'Your comprehensive documentation is ready!',
      });
    } catch (error) {
      console.error('Documentation generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: (error as any)?.response?.data?.error || 'Failed to generate documentation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingDocs(false);
    }
  };

  const handleGenerateDiagram = async (type: 'architecture' | 'flowchart' | 'sequence' | 'class' | 'erd') => {
    if (!id) return;

    try {
      setGeneratingDiagram(true);
      
      toast({
        title: 'Generating Diagram',
        description: `Creating ${type} diagram...`,
      });

      // Convert type to uppercase for API (handle 'erd' -> 'ER' special case)
      let diagramType: 'ARCHITECTURE' | 'FLOWCHART' | 'SEQUENCE' | 'CLASS' | 'ER' | 'COMPONENT';
      if (type === 'erd') {
        diagramType = 'ER';
      } else {
        diagramType = type.toUpperCase() as 'ARCHITECTURE' | 'FLOWCHART' | 'SEQUENCE' | 'CLASS' | 'COMPONENT';
      }

      const response = await diagramService.generateDiagram({
        projectId: id,
        type: diagramType,
        title: `${project?.name || 'Project'} ${type.charAt(0).toUpperCase() + type.slice(1)} Diagram`,
        style: 'MODERN',
      });

      // Add new diagram to list
      const newDiagram = (response.data as any)?.diagram || response.data;
      setDiagrams(prev => [...prev, newDiagram]);

      toast({
        title: 'Diagram Generated',
        description: 'Your diagram has been created successfully!',
      });
    } catch (error) {
      console.error('Diagram generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: (error as any)?.response?.data?.error || 'Failed to generate diagram',
        variant: 'destructive',
      });
    } finally {
      setGeneratingDiagram(false);
    }
  };

  const handleLoadDiagrams = async () => {
    if (!id) return;
    
    try {
      const response = await diagramService.getProjectDiagrams(id);
      const diagramsData = (response.data as any)?.diagrams || response.data || [];
      setDiagrams(diagramsData);
    } catch (error) {
      console.error('Failed to load diagrams:', error);
    }
  };

  const handleViewDiagram = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setShowDiagramModal(true);
  };

  const handleDownloadDiagram = (diagram: Diagram) => {
    try {
      // Get the diagram content (Mermaid code or image data)
      const content = (diagram as any).imageData || diagram.content || '';
      
      if (!content) {
        toast({
          title: 'No Content',
          description: 'Diagram has no content to download',
          variant: 'destructive',
        });
        return;
      }

      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${diagram.title.replace(/\s+/g, '_')}.mmd`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Downloaded',
        description: 'Diagram downloaded successfully',
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download diagram',
        variant: 'destructive',
      });
    }
  };

  const handleSendComment = (comment: string) => {
    if (!id) {
      console.error('❌ Cannot send comment: No project ID');
      return;
    }
    console.log('💬 Sending comment:', comment, 'to project:', id);
    socketService.sendComment(id, comment);
    console.log('✅ Comment sent via socket');
  };

  const handleShareProject = () => {
    if (!project) return;
    
    // Copy project link to clipboard
    const projectUrl = `${window.location.origin}/app/projects/${id}`;
    navigator.clipboard.writeText(projectUrl);
    
    toast({
      title: 'Link Copied',
      description: 'Project link copied to clipboard',
    });
  };

  const handleExportProject = async () => {
    if (!project) return;
    
    try {
      toast({
        title: 'Exporting Project',
        description: 'Preparing project export...',
      });

      // Create export data
      const exportData = {
        project,
        files,
        analysis,
        diagrams,
        documentation,
        exportedAt: new Date().toISOString(),
      };

      // Create JSON blob
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        description: 'Project exported successfully',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export project',
        variant: 'destructive',
      });
    }
  };

  const handleArchiveProject = async () => {
    if (!id || !project) return;

    try {
      // Call archive API (you'll need to implement this in projectService)
      toast({
        title: 'Archiving Project',
        description: 'Project archived successfully',
      });
      
      // Update local state
      setProject({ ...project, isArchived: true, status: 'archived' });
    } catch (error) {
      console.error('Archive failed:', error);
      toast({
        title: 'Archive Failed',
        description: 'Failed to archive project',
        variant: 'destructive',
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!id || !project) return;

    setSavingSettings(true);
    try {
      const response = await projectService.updateProject(id, {
        name: projectName,
        description: projectDescription,
      });
      
      if (response.data) {
        setProject({ ...project, name: projectName, description: projectDescription });
        toast({
          title: 'Settings Saved',
          description: 'Project settings updated successfully',
        });
        setShowSettingsDialog(false);
      }
    } catch (error) {
      console.error('Save settings failed:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save project settings',
        variant: 'destructive',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!id) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await projectService.deleteProject(id);
      
      toast({
        title: 'Project Deleted',
        description: 'Project has been deleted successfully',
      });

      // Navigate back to dashboard
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-700 border-green-200">Active</Badge>;
      case 'analyzing':
        return <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">Analyzing</Badge>;
      case 'archived':
        return <Badge className="bg-neutral-500/10 text-neutral-700 border-neutral-200">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-neutral-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">Project not found</p>
          <Button onClick={() => navigate('/app/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PremiumLayout>
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-neutral-900">{project.name}</h1>
                  {getStatusBadge(project.status || 'active')}
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  {project.description || 'No description'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShareProject}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportProject}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    setProjectName(project.name || '');
                    setProjectDescription(project.description || '');
                    setShowSettingsDialog(true);
                  }}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchiveProject}>
                    <Archive className="h-4 w-4 mr-2" />
                    {project.isArchived ? 'Unarchive' : 'Archive'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={handleDeleteProject}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Files</p>
                      <p className="text-2xl font-semibold mt-1">{files.length || project.fileCount || 0}</p>
                    </div>
                    <FileText className="h-8 w-8 text-neutral-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Analyzed</p>
                      <p className="text-2xl font-semibold mt-1">
                        {analysis ? 'Yes' : (project.lastAnalyzedAt ? 'Yes' : 'No')}
                      </p>
                    </div>
                    <Sparkles className="h-8 w-8 text-neutral-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Docs</p>
                      <p className="text-2xl font-semibold mt-1">{documentation ? '1' : (project.diagramCount || 0)}</p>
                    </div>
                    <FileJson className="h-8 w-8 text-neutral-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b border-neutral-200 rounded-none bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="files"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Files
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="documentation"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Documentation
                </TabsTrigger>
                <TabsTrigger 
                  value="diagrams"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Diagrams
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-600">Created</p>
                        <p className="text-sm font-medium mt-1">
                          {safeFormatDate(project.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Last Updated</p>
                        <p className="text-sm font-medium mt-1">
                          {safeFormatDate(project.updatedAt)}
                        </p>
                      </div>
                      {project.lastAnalyzedAt && (
                        <div className="col-span-2">
                          <p className="text-sm text-neutral-600">Last Analyzed</p>
                          <p className="text-sm font-medium mt-1">
                            {safeFormatDate(project.lastAnalyzedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {project.githubUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Repository</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <GitBranch className="h-4 w-4 text-neutral-600 flex-shrink-0" />
                          <code className="text-sm text-neutral-900 truncate">
                            {project.githubUrl}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyUrl}
                          className="ml-2"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleRunAnalysis}
                      disabled={analyzing}
                    >
                      <PlayCircle className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
                      {analyzing ? 'Analyzing...' : (analysis ? 'Re-run Analysis' : 'Run Analysis')}
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleGenerateDocumentation}
                      disabled={generatingDocs}
                    >
                      <Sparkles className={`h-4 w-4 mr-2 ${generatingDocs ? 'animate-spin' : ''}`} />
                      {generatingDocs ? 'Generating...' : (documentation ? 'Regenerate Docs' : 'Generate Documentation')}
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => {
                        // Scroll to diagrams tab or navigate
                        const diagramsTab = document.querySelector('[value="diagrams"]');
                        if (diagramsTab) {
                          (diagramsTab as HTMLElement).click();
                        }
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Diagrams {diagrams.length > 0 && `(${diagrams.length})`}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">File Explorer</CardTitle>
                    <CardDescription>
                      Browse and analyze project files - Click a file to open in editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      {files.length > 0 ? (
                        <div className="space-y-2">
                          {files.map((file: any) => (
                            <div 
                              key={file.id || file.path} 
                              className="flex items-center gap-2 p-3 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-neutral-200"
                              onClick={() => {
                                const filePath = file.path || file.filename || file.name;
                                navigate(`/app/editor/${id}?file=${encodeURIComponent(filePath)}`);
                              }}
                            >
                              {file.path?.endsWith('/') || file.type === 'directory' ? (
                                <FolderTree className="h-4 w-4 text-amber-500" />
                              ) : (
                                <Code2 className="h-4 w-4 text-blue-500" />
                              )}
                              <span className="text-sm flex-1 group-hover:text-neutral-900">{file.filename || file.path || file.name}</span>
                              {file.language && (
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {file.language}
                                </Badge>
                              )}
                              {file.size && (
                                <span className="text-xs text-neutral-400">
                                  {(file.size / 1024).toFixed(1)}KB
                                </span>
                              )}
                              <Eye className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                          <FolderTree className="h-12 w-12 text-neutral-300 mb-3" />
                          <p className="text-sm text-neutral-500 font-medium">No files uploaded yet</p>
                          <p className="text-xs text-neutral-400 mt-1">
                            Upload files to start analyzing your project
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Code Analysis</CardTitle>
                    <CardDescription>
                      AI-powered insights and metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysis ? (
                      <div className="space-y-6">
                        {/* Analysis Header */}
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                          <div>
                            <p className="text-sm font-medium text-green-900">Analysis Complete</p>
                            <p className="text-xs text-green-700 mt-1">
                              Completed {analysis.completedAt ? new Date(analysis.completedAt).toLocaleString() : 'recently'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <p className="text-xs text-neutral-600">Lines of Code</p>
                            <p className="text-2xl font-semibold text-neutral-900 mt-1">
                              {(analysis as any).totalLinesOfCode?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <p className="text-xs text-neutral-600">Total Files</p>
                            <p className="text-2xl font-semibold text-neutral-900 mt-1">
                              {(analysis as any).totalFiles || 0}
                            </p>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <p className="text-xs text-neutral-600">Functions</p>
                            <p className="text-2xl font-semibold text-neutral-900 mt-1">
                              {(analysis as any).functionCount || 0}
                            </p>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <p className="text-xs text-neutral-600">Classes</p>
                            <p className="text-2xl font-semibold text-neutral-900 mt-1">
                              {(analysis as any).classCount || 0}
                            </p>
                          </div>
                        </div>

                        {/* Complexity */}
                        {(analysis as any).complexity && (
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Complexity Analysis</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-neutral-600">Total</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                  {(analysis as any).complexity.total}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-600">Average</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                  {(analysis as any).complexity.average?.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-600">Distribution</p>
                                <p className="text-sm text-neutral-700">
                                  {Object.keys((analysis as any).complexity.distribution || {}).length} levels
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Dependencies */}
                        {(analysis as any).dependencies && (
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Dependencies</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-neutral-600">External</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                  {(analysis as any).dependencies.external?.length || 0}
                                </p>
                                {(analysis as any).dependencies.external?.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {(analysis as any).dependencies.external.slice(0, 5).map((dep: string, idx: number) => (
                                      <p key={idx} className="text-xs text-neutral-600 font-mono truncate">
                                        {dep}
                                      </p>
                                    ))}
                                    {(analysis as any).dependencies.external.length > 5 && (
                                      <p className="text-xs text-neutral-500">
                                        +{(analysis as any).dependencies.external.length - 5} more
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-neutral-600">Internal</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                  {(analysis as any).dependencies.internal?.length || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Language Distribution */}
                        {(analysis as any).languageDistribution && (
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Language Distribution</h3>
                            <div className="space-y-2">
                              {Object.entries((analysis as any).languageDistribution).map(([lang, count]) => (
                                <div key={lang} className="flex items-center justify-between">
                                  <span className="text-sm text-neutral-700 capitalize">{lang}</span>
                                  <span className="text-sm font-medium text-neutral-900">{String(count)} files</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {(analysis as any).recommendations && (analysis as any).recommendations.length > 0 && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-sm font-medium text-blue-900 mb-2">
                              <Sparkles className="h-4 w-4 inline mr-2" />
                              AI Recommendations
                            </h3>
                            <ul className="space-y-2">
                              {(analysis as any).recommendations.map((rec: string, idx: number) => (
                                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                  <span className="text-blue-600 mt-0.5">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Raw Data (for debugging) */}
                        <details className="text-xs">
                          <summary className="cursor-pointer text-neutral-600 hover:text-neutral-900">
                            View raw analysis data
                          </summary>
                          <pre className="mt-2 p-3 bg-neutral-100 rounded overflow-auto text-xs">
                            {JSON.stringify(analysis, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-600 mb-4">
                          No analysis available yet
                        </p>
                        <Button onClick={handleRunAnalysis} disabled={analyzing}>
                          <PlayCircle className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
                          {analyzing ? 'Analyzing...' : 'Run First Analysis'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Documentation</CardTitle>
                        <CardDescription>
                          AI-generated project documentation
                        </CardDescription>
                      </div>
                      {documentation && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([documentation], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${project?.name || 'project'}-docs.md`;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast({
                              title: 'Downloaded',
                              description: 'Documentation saved as markdown file',
                            });
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download MD
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {documentation ? (
                      <div className="space-y-4">
                        <ScrollArea className="h-[600px] w-full rounded-lg border p-4 bg-neutral-50">
                          <pre className="text-sm text-neutral-800 whitespace-pre-wrap font-mono">
                            {documentation}
                          </pre>
                        </ScrollArea>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={handleGenerateDocumentation}
                            disabled={generatingDocs || !analysis}
                          >
                            <Sparkles className={`h-4 w-4 mr-2 ${generatingDocs ? 'animate-spin' : ''}`} />
                            {generatingDocs ? 'Regenerating...' : 'Regenerate'}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(documentation);
                              toast({
                                title: 'Copied',
                                description: 'Documentation copied to clipboard',
                              });
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-600 mb-4">
                          No documentation generated yet
                        </p>
                        <Button 
                          onClick={handleGenerateDocumentation}
                          disabled={generatingDocs}
                        >
                          <Sparkles className={`h-4 w-4 mr-2 ${generatingDocs ? 'animate-spin' : ''}`} />
                          {generatingDocs ? 'Generating...' : 'Generate Documentation'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diagrams" className="mt-6">
                <div className="space-y-6">
                  {/* Diagram Generation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Generate New Diagram</CardTitle>
                      <CardDescription>
                        Create visual representations of your code structure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center gap-2"
                          onClick={() => handleGenerateDiagram('architecture')}
                          disabled={generatingDiagram || !analysis}
                        >
                          <Network className="h-6 w-6" />
                          <span className="text-sm">Architecture</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center gap-2"
                          onClick={() => handleGenerateDiagram('flowchart')}
                          disabled={generatingDiagram || !analysis}
                        >
                          <GitGraph className="h-6 w-6" />
                          <span className="text-sm">Flowchart</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center gap-2"
                          onClick={() => handleGenerateDiagram('class')}
                          disabled={generatingDiagram || !analysis}
                        >
                          <Code2 className="h-6 w-6" />
                          <span className="text-sm">Class Diagram</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center gap-2"
                          onClick={() => handleGenerateDiagram('sequence')}
                          disabled={generatingDiagram || !analysis}
                        >
                          <PlayCircle className="h-6 w-6" />
                          <span className="text-sm">Sequence</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center gap-2"
                          onClick={() => handleGenerateDiagram('erd')}
                          disabled={generatingDiagram || !analysis}
                        >
                          <Database className="h-6 w-6" />
                          <span className="text-sm">ERD</span>
                        </Button>
                      </div>
                      {!analysis && (
                        <p className="text-xs text-neutral-600 mt-4 text-center">
                          Run analysis first to enable diagram generation
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Existing Diagrams */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Generated Diagrams</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleLoadDiagrams}
                        >
                          Refresh
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {diagrams.length > 0 ? (
                        <div className="space-y-3">
                          {diagrams.map((diagram) => (
                            <div key={diagram.id} className="p-4 border rounded-lg hover:border-neutral-400 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-sm font-medium text-neutral-900">{diagram.title}</h3>
                                  <p className="text-xs text-neutral-600 mt-1">
                                    {diagram.type.charAt(0).toUpperCase() + diagram.type.slice(1)} • {diagram.format.toUpperCase()}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant={
                                      diagram.status === 'completed' ? 'default' :
                                      diagram.status === 'generating' ? 'secondary' : 'destructive'
                                    }>
                                      {diagram.status}
                                    </Badge>
                                    <span className="text-xs text-neutral-500">
                                      {new Date(diagram.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewDiagram(diagram)}
                                    title="View Diagram"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDownloadDiagram(diagram)}
                                    title="Download Diagram"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await diagramService.deleteDiagram(diagram.id);
                                        setDiagrams(prev => prev.filter(d => d.id !== diagram.id));
                                        toast({
                                          title: 'Deleted',
                                          description: 'Diagram deleted successfully',
                                        });
                                      } catch (error) {
                                        toast({
                                          title: 'Error',
                                          description: 'Failed to delete diagram',
                                          variant: 'destructive',
                                        });
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                              {diagram.status === 'completed' && diagram.content && (
                                <div className="mt-4 p-4 bg-neutral-50 rounded border">
                                  <pre className="text-xs overflow-auto">
                                    {diagram.content.substring(0, 200)}...
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Network className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                          <p className="text-sm text-neutral-600">
                            No diagrams yet. Generate one above!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Project created</p>
                      <p className="text-xs text-neutral-600 mt-1">
                        {safeFormatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                  {project.lastAnalyzedAt && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Analysis completed</p>
                        <p className="text-xs text-neutral-600 mt-1">
                          {safeFormatDate(project.lastAnalyzedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Collaboration Panel */}
            <CollaborationPanel
              isConnected={isSocketConnected}
              activeUsers={activeUsers}
              comments={comments}
              onSendComment={handleSendComment}
            />
          </div>
        </div>
      </div>

      {/* Diagram Viewer Modal */}
      <Dialog open={showDiagramModal} onOpenChange={setShowDiagramModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedDiagram?.title}</DialogTitle>
            <DialogDescription>
              {selectedDiagram?.type} • {selectedDiagram?.format}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full rounded border p-4">
            {selectedDiagram && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={
                    selectedDiagram.status === 'completed' ? 'default' :
                    selectedDiagram.status === 'generating' ? 'secondary' : 'destructive'
                  }>
                    {selectedDiagram.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const content = (selectedDiagram as any).imageData || selectedDiagram.content || '';
                        navigator.clipboard.writeText(content);
                        toast({
                          title: 'Copied',
                          description: 'Diagram code copied to clipboard',
                        });
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDiagram(selectedDiagram)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-neutral-50 p-4 rounded font-mono text-sm whitespace-pre-wrap">
                  {(selectedDiagram as any).imageData || selectedDiagram.content || 'No content available'}
                </div>
                <div className="text-xs text-neutral-500 mt-4">
                  <p>Created: {new Date(selectedDiagram.createdAt).toLocaleString()}</p>
                  <p className="mt-1">
                    Tip: Copy the code above and paste it into{' '}
                    <a 
                      href="https://mermaid.live" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      mermaid.live
                    </a>
                    {' '}to visualize it
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Project Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Project Settings</DialogTitle>
            <DialogDescription>
              Update your project name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Enter project description"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} disabled={savingSettings}>
              {savingSettings ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </PremiumLayout>
  );
};
