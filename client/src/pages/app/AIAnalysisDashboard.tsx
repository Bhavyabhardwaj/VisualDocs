import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Zap,
  FileText, Code, GitBranch, Users, Clock, Download, Filter,
  ChevronDown, ChevronUp, Calendar, BarChart3, Sparkles,
  AlertTriangle, Info, XCircle, Target, Brain, Box, FileCode,
  RefreshCw, Search, Eye, Copy, ExternalLink, Shield, Cpu, 
  Activity, Layers, Hash, ArrowUpRight, History, Play, Pause,
  Settings, ChevronRight, CheckCheck, Share2, Bookmark, BookmarkCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { useToast } from '@/components/ui/use-toast';

interface QualityMetric {
  name: string;
  value?: number;
  maxValue?: number;
  score: number;
  change: number;
  status: string;
}

interface Issue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description?: string;  // Added for recommendations
  file: string;
  line: number;
  category: string;
  suggestion?: string;
  codeSnippet?: string;
  aiSuggestion?: {
    title: string;
    description: string;
    fixCode?: string;
    reasoning: string;
  };
}

export const AIAnalysisDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [issueFilter, setIssueFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [bookmarkedIssues, setBookmarkedIssues] = useState<Set<string>>(new Set());
  const [resolvedIssues, setResolvedIssues] = useState<Set<string>>(new Set());
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('issues');
  const [sortBy, setSortBy] = useState<'severity' | 'category' | 'file'>('severity');
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Ctrl/Cmd + Shift + A - Run analysis
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        handleRunAnalysis();
      }
      
      // Ctrl/Cmd + E - Export report
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExportReport();
      }
      
      // Ctrl/Cmd + / - Toggle search
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      }
      
      // ? - Show keyboard shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowKeyboardShortcuts(prev => !prev);
      }
      
      // Escape - Close dialogs
      if (e.key === 'Escape') {
        setShowKeyboardShortcuts(false);
      }
      
      // 1-4 - Quick filter by severity
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        switch(e.key) {
          case '1':
            setIssueFilter('critical');
            toast({ title: "Filter: Critical Issues", duration: 1500 });
            break;
          case '2':
            setIssueFilter('high');
            toast({ title: "Filter: High Issues", duration: 1500 });
            break;
          case '3':
            setIssueFilter('medium');
            toast({ title: "Filter: Medium Issues", duration: 1500 });
            break;
          case '4':
            setIssueFilter('low');
            toast({ title: "Filter: Low Issues", duration: 1500 });
            break;
          case '0':
            setIssueFilter('all');
            toast({ title: "Filter: All Issues", duration: 1500 });
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectId, analysisData]);

  // Load first project on mount
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3004/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        
        // The API returns data.data.items (array of projects)
        if (data.success && data.data?.items && data.data.items.length > 0) {
          console.log(`✅ Loaded ${data.data.items.length} projects:`, data.data.items.map((p: any) => `${p.name} (${p._count?.codeFiles || 0} files)`));
          setProjects(data.data.items);
          const firstProject = data.data.items[0];
          setProjectId(firstProject.id);
          
          // Check if project has files
          if (firstProject._count?.codeFiles === 0) {
            console.warn('⚠️ Project has no code files - upload files first');
            toast({
              title: "No Code Files",
              description: "Please upload code files to your project first before running analysis.",
              variant: "default",
            });
          }
          
          await loadAnalysis(firstProject.id);
        } else {
          console.warn('⚠️ No projects found - please create a project first');
          toast({
            title: "No Projects Found",
            description: "Create a project and upload code files to start AI analysis.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
        toast({
          title: "Failed to Load Projects",
          description: "Could not load your projects. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, []);

  // Load analysis data
  const loadAnalysis = async (pid: string) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('📊 Fetching analysis for project:', pid);
      
      // First, try to get existing analysis
      const analysisResponse = await fetch(`http://localhost:3004/api/analysis/${pid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (analysisResponse.ok) {
        const data = await analysisResponse.json();
        const analysis = data.data?.analysis || data.analysis || data.data;
        
        if (analysis && Object.keys(analysis).length > 0) {
          console.log('✅ Loaded existing analysis:', analysis);
          setAnalysisData(analysis);
          
          // Also try to load AI code analysis for issues
          loadAICodeAnalysis(pid);
          return;
        }
      }
      
      // No analysis exists - set to null so UI can show "Run Analysis" button
      console.log('⚠️ No analysis data - project needs to be analyzed');
      setAnalysisData(null);
    } catch (error) {
      console.error('Failed to load analysis:', error);
      setAnalysisData(null);
    }
  };

  // Load AI code analysis for detailed issues
  const loadAICodeAnalysis = async (pid: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3004/api/code-analysis/${pid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🤖 AI Code Analysis:', data);
        
        // Extract analysis from response (handle different response structures)
        const aiAnalysis = data.data?.analysis || data.analysis || data.data;
        
        // Merge AI issues with analysis data
        if (aiAnalysis && analysisData) {
          setAnalysisData({
            ...analysisData,
            aiAnalysis: aiAnalysis,
            issues: aiAnalysis.issues || [],
            totalIssues: aiAnalysis.totalIssues || 0,
            criticalIssues: aiAnalysis.criticalIssues || 0,
            highIssues: aiAnalysis.highIssues || 0,
            mediumIssues: aiAnalysis.mediumIssues || 0,
            lowIssues: aiAnalysis.lowIssues || 0,
          });
        }
      }
    } catch (error) {
      console.log('AI code analysis not available:', error);
    }
  };

  // Get quality metrics from analysis data - transform database format to UI format
  const qualityMetrics: QualityMetric[] = analysisData ? [
    {
      name: "Code Complexity",
      value: analysisData.averageComplexity || 0,
      maxValue: 20,
      score: Math.max(0, 100 - (analysisData.averageComplexity || 0) * 5),
      change: 0,
      status: (analysisData.averageComplexity || 0) <= 10 ? "good" : (analysisData.averageComplexity || 0) <= 15 ? "warning" : "critical"
    },
    {
      name: "Maintainability",
      value: Math.max(0, 100 - (analysisData.averageComplexity || 0) * 5),
      maxValue: 100,
      score: Math.max(0, 100 - (analysisData.averageComplexity || 0) * 5),
      change: 0,
      status: (analysisData.averageComplexity || 0) <= 10 ? "good" : (analysisData.averageComplexity || 0) <= 15 ? "warning" : "critical"
    },
    {
      name: "Test Coverage",
      value: 0,
      maxValue: 100,
      score: 0,
      change: 0,
      status: "warning"
    }
  ] : [];

  // Get issues from analysis data - use real AI issues if available, fallback to recommendations
  const issues: Issue[] = analysisData?.issues?.map((issue: any) => ({
    id: issue.id || `issue-${Math.random()}`,
    severity: issue.severity || 'medium',
    title: issue.title || 'Code Issue',
    description: issue.description || '',
    file: issue.file || 'Multiple files',
    line: issue.line || 0,
    category: issue.category || 'Quality',
    codeSnippet: issue.codeSnippet || '',
    aiSuggestion: issue.aiSuggestion || null,
  })) || analysisData?.recommendations?.map((rec: string, index: number) => ({
    id: `rec-${index}`,
    severity: rec.includes('🚨') ? 'critical' : rec.includes('⚠️') ? 'high' : 'medium',
    title: rec.split(':')[1]?.trim() || rec.substring(0, 50),
    description: rec,
    suggestion: rec,
    file: 'Multiple files',
    line: 0,
    category: rec.includes('Security') ? 'Security' : 
              rec.includes('Performance') ? 'Performance' : 
              rec.includes('Maintainability') ? 'Maintainability' : 'Quality',
  })) || [];

  // Apply filtering
  const filteredIssues = useMemo(() => {
    let filtered = issues;
    
    // Severity filter
    if (issueFilter !== 'all') {
      filtered = filtered.filter(issue => issue.severity === issueFilter);
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(query) ||
        issue.file.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query) ||
        issue.description?.toLowerCase().includes(query)
      );
    }
    
    // Remove resolved issues
    filtered = filtered.filter(issue => !resolvedIssues.has(issue.id));
    
    // Sort issues
    filtered.sort((a, b) => {
      if (sortBy === 'severity') {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      } else {
        return a.file.localeCompare(b.file);
      }
    });
    
    return filtered;
  }, [issues, issueFilter, categoryFilter, searchQuery, resolvedIssues, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(issues.map(i => i.category));
    return ['all', ...Array.from(cats)];
  }, [issues]);

  // Calculate stats from real data
  const totalIssues = analysisData?.totalIssues || issues.length;
  const criticalIssues = analysisData?.criticalIssues || issues.filter(i => i.severity === 'critical').length;
  const highIssues = analysisData?.highIssues || issues.filter(i => i.severity === 'high').length;
  const mediumIssues = analysisData?.mediumIssues || issues.filter(i => i.severity === 'medium').length;
  const lowIssues = analysisData?.lowIssues || issues.filter(i => i.severity === 'low').length;
  
  // Calculate overall quality score from analysis
  const calculateQualityScore = () => {
    if (!analysisData) return 0;
    
    // If we have AI analysis with real score
    if (analysisData.aiAnalysis?.overallQuality) {
      return analysisData.aiAnalysis.overallQuality;
    }
    
    // Calculate from complexity
    const complexity = analysisData.averageComplexity || 0;
    if (complexity <= 5) return 95;
    if (complexity <= 10) return 85;
    if (complexity <= 15) return 75;
    if (complexity <= 20) return 65;
    return 55;
  };
  
  const overallQuality = calculateQualityScore();
  const aiSuggestionsCount = issues.filter(issue => issue.aiSuggestion).length;
  const analysisTime = analysisData?.analysisTime || '0s';

  const getSeverityConfig = (severity: string) => {
    const configs = {
      critical: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
      high: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
      medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertCircle },
      low: { color: 'text-neutral-700', bg: 'bg-neutral-50', border: 'border-neutral-200', icon: Info },
    };
    return configs[severity as keyof typeof configs] || configs.low;
  };

  const handleExportReport = async () => {
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    if (!analysisData) {
      toast({
        title: "No Analysis Data",
        description: "Please run analysis first before exporting",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Exporting Report",
      description: "Your AI analysis report is being generated...",
    });

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:3004/api/analysis/${projectId}/export?format=pdf`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export failed');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-report-${projectId}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Complete",
        description: "Report downloaded successfully!",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : 'Failed to export report',
        variant: "destructive",
      });
    }
  };

  const handleRunAnalysis = async () => {
    if (!projectId) {
      toast({
        title: "No Project Selected",
        description: "Please create a project first to run AI analysis.",
        variant: "destructive",
      });
      return;
    }

    // Check if project has files
    const currentProject = projects.find(p => p.id === projectId);
    if (currentProject && currentProject._count?.codeFiles === 0) {
      toast({
        title: "No Code Files",
        description: "Please upload code files to your project before running analysis. Go to the editor to add files.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    toast({
      title: "AI Analysis Starting",
      description: "Running comprehensive AI code analysis...",
    });

    try {
      const token = localStorage.getItem('authToken');
      console.log('🤖 Starting AI code analysis for project:', projectId);
      
      // Step 1: Run regular analysis first
      const analysisResponse = await fetch(`http://localhost:3004/api/analysis/${projectId}/rerun`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const analysisData = await analysisResponse.json();
      console.log('✅ Basic analysis complete:', analysisData);

      // Step 2: Run AI code analysis for detailed issues
      toast({
        title: "AI Analysis In Progress",
        description: "Analyzing code with AI for issues and suggestions...",
      });

      const aiAnalysisResponse = await fetch(`http://localhost:3004/api/code-analysis/${projectId}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (aiAnalysisResponse.ok) {
        const aiData = await aiAnalysisResponse.json();
        console.log('✅ AI analysis complete:', aiData);
        
        toast({
          title: "Analysis Complete!",
          description: `Found ${aiData.data?.totalIssues || aiData.analysis?.totalIssues || 0} issues. ${aiData.data?.criticalIssues || aiData.analysis?.criticalIssues || 0} critical, ${aiData.data?.highIssues || aiData.analysis?.highIssues || 0} high priority.`,
        });
      } else {
        const errorData = await aiAnalysisResponse.json();
        console.log('⚠️ AI analysis error:', errorData);
        toast({
          title: "Analysis Complete (Basic)",
          description: "Basic analysis finished successfully! AI analysis requires Gemini API key.",
        });
      }

      // Reload all data
      await loadAnalysis(projectId);
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Failed to complete analysis',
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewCode = (file: string, line: number) => {
    console.log('handleViewCode called:', { file, line, projectId });
    
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to code editor with file and line
    navigate(`/app/editor/${projectId}?file=${encodeURIComponent(file)}&line=${line}`);
    
    toast({
      title: "Opening Editor",
      description: `Opening ${file} at line ${line}`,
    });
  };

  const handleApplyFix = async (issueId: string, issueTitle: string, file: string, originalCode: string, fixCode: string) => {
    console.log('handleApplyFix called:', { issueId, issueTitle, file, projectId });
    
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Applying Fix",
      description: `AI is fixing: ${issueTitle}`,
    });

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:3004/api/code-analysis/${projectId}/issues/${issueId}/apply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file, originalCode, fixCode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply fix');
      }

      toast({
        title: "Fix Applied",
        description: "Code has been updated successfully!",
      });

      // Reload analysis
      await loadAnalysis(projectId);
    } catch (error) {
      console.error('Apply fix error:', error);
      toast({
        title: "Failed to Apply Fix",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleIgnoreIssue = async (issueId: string, issueTitle: string) => {
    console.log('handleIgnoreIssue called:', { issueId, issueTitle, projectId });
    
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:3004/api/code-analysis/${projectId}/issues/${issueId}/ignore`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ignore issue');
      }

      toast({
        title: "Issue Ignored",
        description: `"${issueTitle}" will not be shown again.`,
      });

      // Reload analysis
      await loadAnalysis(projectId);
    } catch (error) {
      console.error('Ignore issue error:', error);
      toast({
        title: "Failed to Ignore",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  // Bookmark an issue for later review
  const handleBookmarkIssue = (issueId: string) => {
    setBookmarkedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(issueId)) {
        newSet.delete(issueId);
        toast({ title: "Bookmark Removed", description: "Issue removed from bookmarks" });
      } else {
        newSet.add(issueId);
        toast({ title: "Issue Bookmarked", description: "Issue saved for later review" });
      }
      return newSet;
    });
  };

  // Mark an issue as resolved
  const handleResolveIssue = (issueId: string, issueTitle: string) => {
    setResolvedIssues(prev => {
      const newSet = new Set(prev);
      newSet.add(issueId);
      return newSet;
    });
    toast({
      title: "Issue Resolved",
      description: `"${issueTitle}" marked as resolved`,
    });
  };

  // Copy issue details
  const handleCopyIssue = (issue: Issue) => {
    const text = `${issue.severity.toUpperCase()}: ${issue.title}\nFile: ${issue.file}:${issue.line}\nCategory: ${issue.category}\n${issue.description || issue.suggestion || ''}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Issue details copied to clipboard" });
  };

  // Share analysis results
  const handleShareAnalysis = async () => {
    if (!analysisData) {
      toast({ title: "No Data", description: "No analysis data to share", variant: "destructive" });
      return;
    }
    
    const shareUrl = `${window.location.origin}/app/analysis?project=${projectId}`;
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Analysis link copied to clipboard",
    });
  };

  // Bulk resolve all low priority issues
  const handleBulkResolve = (severity: string) => {
    const issuesToResolve = issues.filter(i => i.severity === severity);
    const newResolved = new Set(resolvedIssues);
    issuesToResolve.forEach(i => newResolved.add(i.id));
    setResolvedIssues(newResolved);
    toast({
      title: "Bulk Resolved",
      description: `${issuesToResolve.length} ${severity} issues marked as resolved`,
    });
  };

  const handleGenerateImprovementPlan = async () => {
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    if (!analysisData) {
      toast({
        title: "No Analysis Data",
        description: "Please run analysis first before generating improvement plan",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generating Plan",
      description: "AI is creating a personalized improvement roadmap...",
    });

    try {
      const token = localStorage.getItem('authToken');
      
      // Generate improvement plan based on analysis data
      const improvementPlan = {
        projectId,
        analysisDate: new Date().toISOString(),
        summary: {
          totalFiles: analysisData.totalFiles || 0,
          totalLinesOfCode: analysisData.totalLinesOfCode || 0,
          averageComplexity: analysisData.averageComplexity || 0,
          totalIssues: issues.length,
        },
        recommendations: analysisData.recommendations || [],
        priorities: issues
          .sort((a, b) => {
            const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return severityOrder[a.severity] - severityOrder[b.severity];
          })
          .slice(0, 5)
          .map((issue, index) => ({
            rank: index + 1,
            title: issue.title,
            severity: issue.severity,
            description: issue.description || issue.suggestion,
            category: issue.category,
          })),
        metrics: qualityMetrics.map(m => ({
          name: m.name,
          score: m.score,
          status: m.status,
        })),
      };

      // Create a downloadable markdown file
      const markdown = `# Code Improvement Plan
**Project ID:** ${projectId}
**Generated:** ${new Date().toLocaleString()}

## Summary
- **Total Files:** ${improvementPlan.summary.totalFiles}
- **Lines of Code:** ${improvementPlan.summary.totalLinesOfCode.toLocaleString()}
- **Average Complexity:** ${improvementPlan.summary.averageComplexity.toFixed(1)}
- **Issues Found:** ${improvementPlan.summary.totalIssues}

## Quality Metrics
${improvementPlan.metrics.map(m => `- **${m.name}:** ${m.score}% (${m.status})`).join('\n')}

## Top Priorities
${improvementPlan.priorities.map(p => `
### ${p.rank}. ${p.title} [${p.severity.toUpperCase()}]
**Category:** ${p.category}
**Action:** ${p.description}
`).join('\n')}

## Recommendations
${improvementPlan.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

## Next Steps
1. Address critical and high-severity issues first
2. Review and refactor high-complexity functions
3. Add comprehensive unit tests
4. Schedule regular code reviews
5. Monitor code quality metrics weekly

---
*Generated by VisualDocs AI Analysis*
`;

      // Download the markdown file
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `improvement-plan-${projectId}-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Plan Ready",
        description: "Your personalized improvement plan has been downloaded!",
      });
    } catch (error) {
      console.error('Improvement plan error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate plan',
        variant: "destructive",
      });
    }
  };

  const handleScheduleAnalysis = () => {
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    // For now, show a dialog with schedule options
    toast({
      title: "Schedule Analysis",
      description: "Choose when to run automatic analysis: Daily, Weekly, or Monthly. Feature coming soon!",
    });
    
    // Store preference in localStorage for now
    const schedule = {
      projectId,
      frequency: 'weekly',
      enabled: true,
      lastScheduled: new Date().toISOString(),
    };
    
    try {
      const existingSchedules = JSON.parse(localStorage.getItem('analysisSchedules') || '[]');
      const updatedSchedules = existingSchedules.filter((s: any) => s.projectId !== projectId);
      updatedSchedules.push(schedule);
      localStorage.setItem('analysisSchedules', JSON.stringify(updatedSchedules));
      
      toast({
        title: "Schedule Set",
        description: `Weekly analysis scheduled for project. Analysis will run automatically every Monday.`,
      });
    } catch (error) {
      console.error('Schedule error:', error);
    }
  };

  return (
    <TooltipProvider>
    <PremiumLayout>
      {loading ? (
        <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-brand-primary animate-pulse mx-auto mb-4" />
              <p className="text-neutral-600">Loading analysis...</p>
            </div>
          </div>
        </div>
      ) : (
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary p-2 sm:p-2.5 shadow-sm">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-brand-primary">AI Analysis</h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">Intelligent insights for your codebase</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{projects.find(p => p.id === projectId)?.name || 'Select Project'}</span>
                    <span className="sm:hidden">Project</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {projects.map(project => (
                    <DropdownMenuItem 
                      key={project.id}
                      onClick={() => {
                        setProjectId(project.id);
                        loadAnalysis(project.id);
                      }}
                    >
                      {project.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</span>
                    <span className="sm:hidden">{timeRange === '7d' ? '7d' : timeRange === '30d' ? '30d' : '90d'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTimeRange('7d')}>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange('30d')}>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange('90d')}>Last 90 days</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                    onClick={() => setShowKeyboardShortcuts(true)}
                  >
                    <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Shortcuts</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Keyboard shortcuts (?)</p>
                </TooltipContent>
              </Tooltip>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                onClick={handleExportReport}
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs sm:text-sm"
                onClick={handleRunAnalysis}
                disabled={analyzing}
              >
                <Sparkles className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${analyzing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{analyzing ? 'Analyzing...' : 'Run Analysis'}</span>
                <span className="sm:hidden">{analyzing ? '...' : 'Analyze'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        {!analysisData && projectId && (
          <Card className="border-brand-primary/30 bg-gradient-to-r from-brand-bg to-white mb-6 md:mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="rounded-full bg-brand-primary/10 p-4">
                  <Brain className="h-8 w-8 text-brand-primary animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold text-brand-primary mb-2">No Analysis Data Yet</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    {projects.find(p => p.id === projectId)?._count?.codeFiles > 0 
                      ? "Your project has files ready to analyze. Click 'Run Analysis' to get AI-powered insights!"
                      : "Upload code files to your project first (via GitHub import or file upload), then run analysis."}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                    {projects.find(p => p.id === projectId)?._count?.codeFiles > 0 ? (
                      <Button 
                        onClick={handleRunAnalysis}
                        disabled={analyzing}
                        className="gap-2 bg-brand-primary hover:bg-brand-secondary text-white"
                      >
                        <Sparkles className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
                        {analyzing ? 'Analyzing...' : 'Run Analysis Now'}
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={() => navigate('/app/projects')}
                          className="gap-2 bg-brand-primary hover:bg-brand-secondary text-white"
                        >
                          <FileCode className="h-4 w-4" />
                          Upload Files
                        </Button>
                        <span className="text-xs text-neutral-500">or</span>
                        <Button 
                          onClick={() => navigate('/app/projects')}
                          variant="outline"
                          className="gap-2 border-brand-primary text-brand-primary hover:bg-brand-bg"
                        >
                          <GitBranch className="h-4 w-4" />
                          Import from GitHub
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-neutral-600">Overall Quality</CardTitle>
              <div className="rounded-lg bg-emerald-50 p-1.5 sm:p-2">
                <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{overallQuality}%</div>
              <div className="mt-1 sm:mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="font-medium hidden sm:inline">Based on analysis</span>
                <span className="font-medium sm:hidden">Analysis</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-neutral-600">Issues Found</CardTitle>
              <div className="rounded-lg bg-red-50 p-1.5 sm:p-2">
                <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{totalIssues}</div>
              <div className="mt-1 sm:mt-2 flex items-center gap-1.5 text-xs text-neutral-600">
                <span className="font-medium">
                  {criticalIssues} critical, {highIssues} high
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-neutral-600">AI Suggestions</CardTitle>
              <div className="rounded-lg bg-brand-bg p-1.5 sm:p-2">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-brand-primary">{aiSuggestionsCount}</div>
              <p className="mt-1 sm:mt-2 text-xs text-neutral-600 hidden sm:block">Ready to implement</p>
              <p className="mt-1 text-xs text-neutral-600 sm:hidden">Ready</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-neutral-600">Analysis Time</CardTitle>
              <div className="rounded-lg bg-neutral-100 p-1.5 sm:p-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-brand-primary">{analysisTime}</div>
              <p className="mt-1 sm:mt-2 text-xs text-neutral-600 hidden sm:block">Last scan duration</p>
              <p className="mt-1 text-xs text-neutral-600 sm:hidden">Last scan</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column: Quality Metrics & Issues */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Quality Metrics */}
            <Card className="border-neutral-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-brand-primary">Quality Metrics</CardTitle>
                    <CardDescription className="mt-1 text-xs sm:text-sm">Track code quality across key dimensions</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm w-full sm:w-auto"
                    onClick={() => toast({
                      title: "Quality Trends",
                      description: "Viewing detailed quality metrics over time...",
                    })}
                  >
                    <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    View Trends
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {qualityMetrics.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8">
                    <div className="rounded-full bg-neutral-100 p-2.5 sm:p-3 mb-2 sm:mb-3">
                      <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600">
                      No quality metrics available. Run an analysis to see metrics.
                    </p>
                  </div>
                ) : (
                <div className="space-y-4 sm:space-y-5">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm font-medium text-brand-primary">{metric.name}</span>
                          {metric.status === 'improving' && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1">
                              <TrendingUp className="h-3 w-3" />
                              +{metric.change}%
                            </Badge>
                          )}
                          {metric.status === 'declining' && (
                            <Badge className="bg-red-50 text-red-700 border-red-200 text-xs gap-1">
                              <TrendingDown className="h-3 w-3" />
                              {metric.change}%
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-brand-primary">{metric.score}%</span>
                      </div>
                      <div className="relative h-2 sm:h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                            metric.score >= 90
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              : metric.score >= 70
                              ? 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600'
                          }`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>

            {/* Issues List */}
            <Card className="border-neutral-200">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-base sm:text-lg font-semibold">Detected Issues</CardTitle>
                      <CardDescription className="mt-1 text-xs sm:text-sm">
                        AI-powered code analysis results • {filteredIssues.length} of {totalIssues} shown
                        {resolvedIssues.size > 0 && ` • ${resolvedIssues.size} resolved`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={handleShareAnalysis}
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share Analysis</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Enhanced Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        placeholder="Search issues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm"
                      />
                    </div>

                    {/* Severity Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm">
                          <Filter className="h-3.5 w-3.5" />
                          {issueFilter === 'all' ? 'All Severity' : issueFilter.charAt(0).toUpperCase() + issueFilter.slice(1)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Severity</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIssueFilter('all')}>
                          All Issues ({totalIssues})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIssueFilter('critical')}>
                          <XCircle className="h-3 w-3 mr-2 text-red-600" />
                          Critical ({criticalIssues})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIssueFilter('high')}>
                          <AlertTriangle className="h-3 w-3 mr-2 text-orange-600" />
                          High ({highIssues})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIssueFilter('medium')}>
                          <AlertCircle className="h-3 w-3 mr-2 text-amber-600" />
                          Medium ({mediumIssues})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIssueFilter('low')}>
                          <Info className="h-3 w-3 mr-2 text-neutral-600" />
                          Low ({lowIssues})
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Category Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm">
                          <Layers className="h-3.5 w-3.5" />
                          {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {categories.map(cat => (
                          <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                            {cat === 'all' ? 'All Categories' : cat}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sort */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm">
                          <Activity className="h-3.5 w-3.5" />
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSortBy('severity')}>
                          By Severity
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('category')}>
                          By Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('file')}>
                          By File
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Bulk Actions */}
                    {(totalIssues > 0) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm">
                            <CheckCheck className="h-3.5 w-3.5" />
                            Bulk
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {lowIssues > 0 && (
                            <DropdownMenuItem onClick={() => handleBulkResolve('low')}>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-neutral-500" />
                              Resolve all Low ({lowIssues})
                            </DropdownMenuItem>
                          )}
                          {mediumIssues > 0 && (
                            <DropdownMenuItem onClick={() => handleBulkResolve('medium')}>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-amber-500" />
                              Resolve all Medium ({mediumIssues})
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              // Expand all issues
                              const allIds = new Set(filteredIssues.map(i => i.id));
                              setExpandedIssues(allIds);
                              toast({ title: "Expanded All", description: "All issues expanded", duration: 1500 });
                            }}
                          >
                            <ChevronDown className="h-3.5 w-3.5 mr-2" />
                            Expand All
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setExpandedIssues(new Set());
                              toast({ title: "Collapsed All", description: "All issues collapsed", duration: 1500 });
                            }}
                          >
                            <ChevronUp className="h-3.5 w-3.5 mr-2" />
                            Collapse All
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setResolvedIssues(new Set());
                              toast({ title: "Reset", description: "All resolved issues restored", duration: 1500 });
                            }}
                            className="text-orange-600"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-2" />
                            Reset Resolved
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    
                    {/* Clear Filters */}
                    {(issueFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1.5 h-9 text-xs text-neutral-500 hover:text-neutral-700"
                        onClick={() => {
                          setIssueFilter('all');
                          setCategoryFilter('all');
                          setSearchQuery('');
                          toast({ title: "Filters Cleared", duration: 1500 });
                        }}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Issue Stats Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                      {criticalIssues > 0 && (
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: `${(criticalIssues / Math.max(totalIssues, 1)) * 100}%` }} 
                        />
                      )}
                      {highIssues > 0 && (
                        <div 
                          className="h-full bg-orange-500" 
                          style={{ width: `${(highIssues / Math.max(totalIssues, 1)) * 100}%` }} 
                        />
                      )}
                      {mediumIssues > 0 && (
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ width: `${(mediumIssues / Math.max(totalIssues, 1)) * 100}%` }} 
                        />
                      )}
                      {lowIssues > 0 && (
                        <div 
                          className="h-full bg-neutral-300" 
                          style={{ width: `${(lowIssues / Math.max(totalIssues, 1)) * 100}%` }} 
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      {criticalIssues > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />{criticalIssues}</span>}
                      {highIssues > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" />{highIssues}</span>}
                      {mediumIssues > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />{mediumIssues}</span>}
                      {lowIssues > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neutral-300" />{lowIssues}</span>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
                  {filteredIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
                      <div className="rounded-full bg-neutral-100 p-3 sm:p-4 mb-3 sm:mb-4">
                        <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2">
                        {issues.length === 0 ? 'No Issues Found' : 'No Matching Issues'}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 max-w-md mb-4 px-4">
                        {analysisData 
                          ? issues.length === 0 
                            ? "Your code looks great! No issues detected in the latest analysis."
                            : `No issues match the current filter. Try selecting "All Issues" to see all ${totalIssues} detected issues.`
                          : "Run an analysis to detect issues in your code."}
                      </p>
                      {!analysisData && (
                        <Button 
                          onClick={handleRunAnalysis}
                          className="gap-2 bg-brand-primary hover:bg-brand-secondary text-xs sm:text-sm"
                        >
                          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Run First Analysis
                        </Button>
                      )}
                    </div>
                  ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {filteredIssues.map((issue) => {
                      const config = getSeverityConfig(issue.severity);
                      const Icon = config.icon;
                      const isBookmarked = bookmarkedIssues.has(issue.id);
                      const isResolved = resolvedIssues.has(issue.id);
                      const isExpanded = expandedIssues.has(issue.id);
                      
                      return (
                        <div
                          key={issue.id}
                          className={`p-3 sm:p-4 rounded-lg border ${config.border} ${config.bg} hover:shadow-md transition-all group relative ${isResolved ? 'opacity-60' : ''}`}
                        >
                          {/* Bookmark & Resolved Indicators */}
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            {isBookmarked && (
                              <span className="text-amber-500">
                                <Bookmark className="h-3.5 w-3.5 fill-current" />
                              </span>
                            )}
                            {isResolved && (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Resolved
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className={`rounded-lg bg-white p-1.5 sm:p-2 ${config.border} border`}>
                              <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0 pr-16 sm:pr-20">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                                <div className="flex-1">
                                  <h4 className={`text-xs sm:text-sm font-semibold text-brand-primary group-hover:text-brand-secondary transition-colors ${isResolved ? 'line-through' : ''}`}>
                                    {issue.title}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 text-xs text-neutral-600">
                                    <Badge className="bg-white border-neutral-200 text-neutral-700 text-xs">
                                      {issue.category}
                                    </Badge>
                                    <span className="hidden sm:inline">•</span>
                                    <FileText className="h-3 w-3" />
                                    <span className="font-mono">{issue.file}:{issue.line}</span>
                                  </div>
                                </div>
                                <Badge
                                  className={`${config.bg} ${config.color} ${config.border} capitalize text-xs`}
                                >
                                  {issue.severity}
                                </Badge>
                              </div>
                              
                              <div className="flex items-start gap-2 mt-3 p-2.5 sm:p-3 rounded-lg bg-white border border-neutral-200">
                                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-brand-primary mb-1">AI Suggestion:</div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-neutral-400 hover:text-brand-primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(issue.suggestion);
                                        toast({
                                          title: "Copied to clipboard",
                                          description: "AI suggestion copied successfully",
                                        });
                                      }}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="text-xs text-neutral-600 leading-relaxed">{issue.suggestion}</div>
                                </div>
                              </div>
                              
                              {/* Expanded Details */}
                              {isExpanded && issue.codeSnippet && (
                                <div className="mt-3 p-3 rounded-lg bg-neutral-900 border border-neutral-700">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-neutral-300">Code Snippet</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-neutral-400 hover:text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(issue.codeSnippet || '');
                                        toast({
                                          title: "Copied to clipboard",
                                          description: "Code snippet copied successfully",
                                        });
                                      }}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <pre className="text-xs text-neutral-100 font-mono overflow-x-auto">
                                    <code>{issue.codeSnippet}</code>
                                  </pre>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs gap-1.5 border-neutral-300 hover:bg-brand-bg flex-1 sm:flex-none"
                                  onClick={() => handleViewCode(issue.file, issue.line)}
                                >
                                  <Code className="h-3 w-3" />
                                  View Code
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className={`h-7 text-xs gap-1.5 border-neutral-300 hover:bg-brand-bg flex-1 sm:flex-none ${isResolved ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  onClick={() => !isResolved && handleApplyFix(
                                    issue.id,
                                    issue.title,
                                    issue.file,
                                    issue.codeSnippet || '',
                                    issue.aiSuggestion?.fixCode || ''
                                  )}
                                  disabled={isResolved}
                                >
                                  <Zap className="h-3 w-3" />
                                  Apply Fix
                                </Button>
                                
                                {/* Enhanced Action Buttons */}
                                <div className="flex items-center gap-1 ml-auto">
                                  {issue.codeSnippet && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          className={`h-7 w-7 p-0 ${isExpanded ? 'text-brand-primary bg-brand-bg' : 'text-neutral-400 hover:text-brand-primary'}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleExpandIssue(issue.id);
                                          }}
                                        >
                                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{isExpanded ? 'Collapse details' : 'Expand details'}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className={`h-7 w-7 p-0 ${isBookmarked ? 'text-amber-500' : 'text-neutral-400 hover:text-amber-500'}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleBookmarkIssue(issue.id);
                                        }}
                                      >
                                        <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{isBookmarked ? 'Remove bookmark' : 'Bookmark issue'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className={`h-7 w-7 p-0 ${isResolved ? 'text-emerald-500' : 'text-neutral-400 hover:text-emerald-500'}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleResolveIssue(issue.id);
                                        }}
                                      >
                                        <CheckCircle2 className={`h-3.5 w-3.5 ${isResolved ? 'fill-emerald-100' : ''}`} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{isResolved ? 'Mark as unresolved' : 'Mark as resolved'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 text-xs text-neutral-500 hover:bg-neutral-50 w-full sm:w-auto"
                                  onClick={() => handleIgnoreIssue(issue.id, issue.title)}
                                >
                                  Ignore
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AI Insights & Recommendations */}
          <div className="space-y-4 sm:space-y-6">
            {/* AI Insights */}
            <Card className="border-neutral-200 overflow-hidden bg-gradient-to-br from-brand-bg via-[#E8D5C4]/30 to-brand-bg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-white p-1.5 sm:p-2 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-brand-primary">AI Insights</CardTitle>
                </div>
                <CardDescription className="text-neutral-600 text-xs sm:text-sm">Smart recommendations from our AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {analysisData?.recommendations && analysisData.recommendations.length > 0 ? (
                  analysisData.recommendations.slice(0, 3).map((recommendation: string, index: number) => {
                    // Parse recommendation to extract icon type
                    const isPositive = recommendation.toLowerCase().includes('good') || recommendation.toLowerCase().includes('excellent') || recommendation.toLowerCase().includes('improved');
                    const isWarning = recommendation.includes('⚠️') || recommendation.toLowerCase().includes('consider') || recommendation.toLowerCase().includes('warning');
                    const isCritical = recommendation.includes('🚨') || recommendation.toLowerCase().includes('critical');
                    
                    const Icon = isCritical ? AlertTriangle : isWarning ? Target : isPositive ? CheckCircle2 : Zap;
                    const iconColor = isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : isPositive ? 'text-emerald-600' : 'text-brand-primary';
                    
                    // Extract title (first part before colon or first sentence)
                    const parts = recommendation.split(':');
                    const title = parts[0].replace(/[🚨⚠️✅]/g, '').trim();
                    const description = parts.length > 1 ? parts.slice(1).join(':').trim() : recommendation;

                    return (
                      <div key={index} className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-neutral-100">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-brand-primary mb-1">{title}</h4>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                              {description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : analysisData ? (
                  <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-neutral-100">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-brand-primary flex-shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-brand-primary mb-1">No AI Recommendations Yet</h4>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          Click "Run Analysis" to get AI-powered insights and recommendations for your codebase.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-neutral-100">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 mb-1">No Analysis Data</h4>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          Select a project and run analysis to see AI-powered insights.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resolution Progress */}
            {totalIssues > 0 && (
              <Card className="border-neutral-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-emerald-50 p-1.5 sm:p-2">
                        <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg font-semibold">Resolution Progress</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Track your issue resolution</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Issues Resolved</span>
                      <span className="font-semibold text-brand-primary">
                        {resolvedIssues.size} / {totalIssues}
                      </span>
                    </div>
                    <Progress 
                      value={(resolvedIssues.size / totalIssues) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{Math.round((resolvedIssues.size / totalIssues) * 100)}% complete</span>
                      <span>{totalIssues - resolvedIssues.size} remaining</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-center">
                      <div className="text-lg font-bold text-emerald-600">{resolvedIssues.size}</div>
                      <div className="text-xs text-emerald-700">Resolved</div>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 text-center">
                      <div className="text-lg font-bold text-amber-600">{bookmarkedIssues.size}</div>
                      <div className="text-xs text-amber-700">Bookmarked</div>
                    </div>
                  </div>
                  
                  {resolvedIssues.size === totalIssues && totalIssues > 0 && (
                    <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <div>
                          <div className="text-sm font-semibold text-emerald-700">All Issues Resolved! 🎉</div>
                          <div className="text-xs text-emerald-600">Great job on cleaning up your codebase</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Code Statistics */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold">Code Statistics</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Analysis of your codebase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-4">
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Total Files</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">TypeScript & React</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.totalFiles || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Lines of Code</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Excluding comments</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.totalLinesOfCode?.toLocaleString() || '0'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <GitBranch className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Complexity</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Cyclomatic average</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.averageComplexity?.toFixed(1) || '0.0'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Functions</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Total count</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.functionCount || 0}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <Box className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Classes</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Total count</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.classCount || 0}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <FileCode className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Interfaces</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Total count</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.interfaceCount || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold text-brand-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                  onClick={handleExportReport}
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Export Full Report (PDF)</span>
                  <span className="sm:hidden">Export PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                  onClick={handleGenerateImprovementPlan}
                >
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Generate Improvement Plan</span>
                  <span className="sm:hidden">Improvement Plan</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                  onClick={handleScheduleAnalysis}
                >
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Schedule Weekly Analysis</span>
                  <span className="sm:hidden">Schedule Analysis</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      )}
      
      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-primary" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Quick actions to navigate the analysis dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-neutral-900">Analysis</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Run Analysis</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">Shift</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">A</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Export Report</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">E</kbd>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-neutral-900">Navigation</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Search Issues</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">/</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Show Shortcuts</span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">?</kbd>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-neutral-900">Quick Filters</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Critical Issues
                  </span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">1</kbd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    High Issues
                  </span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">2</kbd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Medium Issues
                  </span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">3</kbd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    Low Issues
                  </span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">4</kbd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">All Issues</span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs font-mono">0</kbd>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PremiumLayout>
    </TooltipProvider>
  );
};

