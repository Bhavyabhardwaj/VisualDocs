import { useState } from 'react';
import { Github, Loader2, CheckCircle2, AlertCircle, GitBranch, Star, GitFork } from 'lucide-react';
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
import { projectService } from '@/services/project.service';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface GitHubImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: (projectId: string) => void;
}

interface RepoInfo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  isValid: boolean;
}

export const GitHubImportDialog = ({
  open,
  onOpenChange,
  onImportComplete,
}: GitHubImportDialogProps) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubRegex.test(url);
  };

  const handleValidate = async () => {
    if (!githubUrl.trim()) {
      setValidationError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateUrl(githubUrl)) {
      setValidationError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    setRepoInfo(null);

    try {
      const response = await projectService.validateGitHubRepo(githubUrl);
      
      if (response.data?.isValid) {
        // Try to get repo info
        try {
          const infoResponse = await projectService.getGitHubRepoInfo(githubUrl);
          if (infoResponse.data) {
            setRepoInfo({
              name: infoResponse.data.name || '',
              description: infoResponse.data.description || '',
              language: infoResponse.data.language || 'Unknown',
              stars: infoResponse.data.stars || 0,
              forks: infoResponse.data.forks || 0,
              isValid: true,
            });
            
            // Auto-fill project name and description
            if (!projectName) setProjectName(infoResponse.data.name || '');
            if (!projectDescription) setProjectDescription(infoResponse.data.description || '');
          }
        } catch (error) {
          console.error('Failed to fetch repo info:', error);
          // Still mark as valid even if we can't get detailed info
          setRepoInfo({
            name: githubUrl.split('/').pop() || '',
            description: '',
            language: 'Unknown',
            stars: 0,
            forks: 0,
            isValid: true,
          });
        }
        
        toast({
          title: 'Repository validated',
          description: 'GitHub repository is valid and ready to import',
        });
      } else {
        setValidationError(response.data?.message || 'Repository validation failed');
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setValidationError(
        error instanceof Error ? error.message : 'Failed to validate repository'
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!repoInfo?.isValid) {
      toast({
        title: 'Validation required',
        description: 'Please validate the repository first',
        variant: 'destructive',
      });
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: 'Project name required',
        description: 'Please enter a name for your project',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);

    try {
      const response = await projectService.importFromGitHub({
        githubUrl: githubUrl,
        projectName: projectName,
      });

      toast({
        title: 'Import successful',
        description: `Successfully imported ${projectName}`,
      });

      // Reset form
      setGithubUrl('');
      setProjectName('');
      setProjectDescription('');
      setRepoInfo(null);
      setValidationError(null);
      
      onOpenChange(false);

      if (onImportComplete && response.data?.id) {
        onImportComplete(response.data.id);
      } else if (response.data?.id) {
        // Navigate to the new project
        navigate(`/app/projects/${response.data.id}`);
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Failed to import repository',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (!isImporting && !isValidating) {
      setGithubUrl('');
      setProjectName('');
      setProjectDescription('');
      setRepoInfo(null);
      setValidationError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Import from GitHub
          </DialogTitle>
          <DialogDescription>
            Enter a GitHub repository URL to import your project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* GitHub URL Input */}
          <div className="space-y-2">
            <Label htmlFor="github-url">GitHub Repository URL</Label>
            <div className="flex gap-2">
              <Input
                id="github-url"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  setValidationError(null);
                  setRepoInfo(null);
                }}
                disabled={isValidating || isImporting}
                className="flex-1"
              />
              <Button
                onClick={handleValidate}
                disabled={isValidating || isImporting || !githubUrl.trim()}
                variant="outline"
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Validate'
                )}
              </Button>
            </div>
            {validationError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {validationError}
              </div>
            )}
          </div>

          {/* Repository Info Preview */}
          {repoInfo?.isValid && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Repository validated
              </div>
              
              {repoInfo.name && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <GitBranch className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{repoInfo.name}</span>
                  </div>
                  
                  {repoInfo.description && (
                    <p className="text-gray-600 text-xs">{repoInfo.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {repoInfo.language !== 'Unknown' && (
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        {repoInfo.language}
                      </span>
                    )}
                    {repoInfo.stars > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repoInfo.stars}
                      </span>
                    )}
                    {repoInfo.forks > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {repoInfo.forks}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Project Details */}
          {repoInfo?.isValid && (
            <>
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  placeholder="My Awesome Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={isImporting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Description (Optional)</Label>
                <Input
                  id="project-description"
                  placeholder="Brief description of your project"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  disabled={isImporting}
                />
              </div>
            </>
          )}

          {/* Help Text */}
          {!repoInfo && !validationError && (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-medium mb-2">How to import:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Paste your GitHub repository URL</li>
                <li>Click "Validate" to verify the repository</li>
                <li>Review and edit the project details</li>
                <li>Click "Import" to start importing</li>
              </ol>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isImporting || isValidating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!repoInfo?.isValid || isImporting || !projectName.trim()}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" />
                Import Repository
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
