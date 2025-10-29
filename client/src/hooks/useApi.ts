/**
 * Custom Hooks for API Data Fetching
 * React hooks for managing API calls with loading, error states
 */

import { useState, useEffect, useCallback } from 'react';
import {
  projectsApi,
  analysisApi,
  diagramsApi,
  activityApi,
  teamApi,
  searchApi,
  type Project,
  type Analysis,
  type Diagram,
  type ProjectFile,
  type PaginationParams,
  type Activity,
  type TeamMember,
  type SearchResult,
} from '@/lib/api';

// ============================================
// PROJECTS HOOKS
// ============================================

export const useProjects = (params?: PaginationParams) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await projectsApi.getAll(params);
      
      if (response.success && response.data) {
        setProjects(response.data.projects);
        setTotal(response.data.total);
      } else {
        setError(response.error || 'Failed to fetch projects');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, total, isLoading, error, refetch: fetchProjects };
};

export const useProject = (id: string | undefined) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await projectsApi.getById(id);
      
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        setError(response.error || 'Failed to fetch project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch project');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, isLoading, error, refetch: fetchProject };
};

export const useProjectFiles = (projectId: string | undefined) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await projectsApi.getFiles(projectId);
      
      if (response.success && response.data) {
        setFiles(response.data.files);
      } else {
        setError(response.error || 'Failed to fetch files');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, isLoading, error, refetch: fetchFiles };
};

// ============================================
// ANALYSIS HOOKS
// ============================================

export const useProjectAnalysis = (projectId: string | undefined) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analysisApi.getByProject(projectId);
      
      if (response.success && response.data) {
        setAnalyses(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setError(response.error || 'Failed to fetch analyses');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analyses');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return { analyses, isLoading, error, refetch: fetchAnalyses };
};

export const useAnalysis = (analysisId: string | undefined) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    if (!analysisId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analysisApi.getById(analysisId);
      
      if (response.success && response.data) {
        setAnalysis(response.data);
      } else {
        setError(response.error || 'Failed to fetch analysis');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analysis');
    } finally {
      setIsLoading(false);
    }
  }, [analysisId]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return { analysis, isLoading, error, refetch: fetchAnalysis };
};

export const useAnalysisProgress = (projectId: string | undefined, enabled: boolean = false) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !enabled) return;

    const fetchProgress = async () => {
      try {
        const response = await analysisApi.getProgress(projectId);
        
        if (response.success && response.data) {
          setProgress(response.data.progress);
          setStatus(response.data.status);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch progress');
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(fetchProgress, 2000);
    fetchProgress(); // Initial fetch

    return () => clearInterval(interval);
  }, [projectId, enabled]);

  return { progress, status, error };
};

// ============================================
// DIAGRAMS HOOKS
// ============================================

export const useProjectDiagrams = (projectId: string | undefined) => {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagrams = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await diagramsApi.getByProject(projectId);
      
      if (response.success && response.data) {
        setDiagrams(response.data.diagrams);
      } else {
        setError(response.error || 'Failed to fetch diagrams');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch diagrams');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDiagrams();
  }, [fetchDiagrams]);

  return { diagrams, isLoading, error, refetch: fetchDiagrams };
};

export const useDiagram = (diagramId: string | undefined) => {
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagram = useCallback(async () => {
    if (!diagramId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await diagramsApi.getById(diagramId);
      
      if (response.success && response.data) {
        setDiagram(response.data);
      } else {
        setError(response.error || 'Failed to fetch diagram');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch diagram');
    } finally {
      setIsLoading(false);
    }
  }, [diagramId]);

  useEffect(() => {
    fetchDiagram();
  }, [fetchDiagram]);

  return { diagram, isLoading, error, refetch: fetchDiagram };
};

export const useDiagramProgress = (diagramId: string | undefined, enabled: boolean = false) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!diagramId || !enabled) return;

    const fetchProgress = async () => {
      try {
        const response = await diagramsApi.getProgress(diagramId);
        
        if (response.success && response.data) {
          setProgress(response.data.progress);
          setStatus(response.data.status);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch progress');
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(fetchProgress, 2000);
    fetchProgress(); // Initial fetch

    return () => clearInterval(interval);
  }, [diagramId, enabled]);

  return { progress, status, error };
};

// ============================================
// MUTATION HOOKS (for create/update/delete operations)
// ============================================

export const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (data: { name: string; description?: string; language?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await projectsApi.create(data);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createProject, isLoading, error };
};

export const useUploadFiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFiles = async (projectId: string, files: FileList) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await projectsApi.uploadFiles(projectId, files);
      setProgress(100);
      
      if (response.success && response.data) {
        return response.data.files;
      } else {
        throw new Error(response.error || 'Failed to upload files');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload files');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFiles, isLoading, error, progress };
};

export const useAnalyzeProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeProject = async (projectId: string, options?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await analysisApi.analyze(projectId, options);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to analyze project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeProject, isLoading, error };
};

export const useGenerateDiagram = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDiagram = async (data: {
    projectId: string;
    type: string;
    title: string;
    options?: any;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await diagramsApi.generate(data);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to generate diagram');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate diagram');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateDiagram, isLoading, error };
};

// ============================================
// ACTIVITY HOOKS
// ============================================

export const useProjectActivity = (projectId: string | undefined) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await activityApi.getProjectActivity(projectId);
      
      if (response.success && response.data) {
        setActivities(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.error || 'Failed to fetch activities');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, isLoading, error, refetch: fetchActivities };
};

export const useUserActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await activityApi.getUserActivity();
      
      if (response.success && response.data) {
        setActivities(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.error || 'Failed to fetch notifications');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, isLoading, error, refetch: fetchActivities };
};

// ============================================
// TEAM HOOKS
// ============================================

export const useTeamMembers = (teamId: string | undefined) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!teamId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await teamApi.getTeamMembers(teamId);
      
      if (response.success && response.data) {
        setMembers(response.data.members);
      } else {
        setError(response.error || 'Failed to fetch team members');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch team members');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, isLoading, error, refetch: fetchMembers };
};

export const useInviteTeamMember = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteMember = async (teamId: string, data: { email: string; role: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await teamApi.inviteTeamMember(teamId, data);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to invite team member');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to invite team member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { inviteMember, isLoading, error };
};

// ============================================
// SEARCH HOOKS
// ============================================

export const useSearch = (query: string, filters?: { type?: string; limit?: number }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async () => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchApi.search(query, filters);
      
      if (response.success && response.data) {
        setResults(response.data.results);
      } else {
        setError(response.error || 'Failed to search');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search');
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [performSearch]);

  return { results, isLoading, error, refetch: performSearch };
};
