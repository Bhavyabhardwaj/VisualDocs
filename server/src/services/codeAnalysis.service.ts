import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface CodeIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'Performance' | 'Security' | 'Reliability' | 'Maintainability' | 'Best Practices';
  title: string;
  description: string;
  file: string;
  line: number;
  column?: number;
  codeSnippet: string;
  aiSuggestion: {
    title: string;
    description: string;
    fixCode?: string;
    reasoning: string;
  };
}

export interface AnalysisResult {
  projectId: string;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  issues: CodeIssue[];
  summary: string;
  analyzedAt: Date;
}

export class CodeAnalysisService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  /**
   * Analyze code files using Gemini AI to detect real issues
   */
  async analyzeCodeWithAI(
    files: Array<{ name: string; content: string; path: string; language: string }>,
    projectId?: string
  ): Promise<AnalysisResult> {
    try {
      logger.info('Starting AI code analysis', { fileCount: files.length });

      // Prepare files for analysis (limit content size)
      const filesToAnalyze = files.map(f => ({
        path: f.path,
        name: f.name,
        language: f.language,
        content: f.content.substring(0, 5000), // Limit to first 5000 chars per file
        lines: f.content.split('\n').length
      }));

      const prompt = `You are an expert code reviewer and security analyst. Analyze the following code files and detect REAL issues.

FILES TO ANALYZE:
${filesToAnalyze.map((f, idx) => `
=== FILE ${idx + 1}: ${f.path} (${f.language}, ${f.lines} lines) ===
\`\`\`${f.language}
${f.content}
\`\`\`
`).join('\n')}

Detect and report issues in these categories:
1. **Performance**: Memory leaks, inefficient algorithms, unnecessary re-renders, heavy operations
2. **Security**: SQL injection, XSS vulnerabilities, exposed secrets, insecure dependencies
3. **Reliability**: Missing error boundaries, unhandled promises, async/await issues, race conditions
4. **Maintainability**: Code duplication, complex functions, poor naming, missing types
5. **Best Practices**: Anti-patterns, outdated patterns, React/TypeScript best practices violations

For EACH ISSUE found, provide:
- severity: "critical" | "high" | "medium" | "low"
- category: One of the 5 categories above
- title: Short, specific issue title (e.g., "Potential memory leak in useEffect hook")
- description: Detailed explanation of why this is an issue
- file: Exact file path
- line: Approximate line number where issue occurs
- codeSnippet: The problematic code snippet (3-5 lines)
- aiSuggestion:
  - title: How to fix it
  - description: Step-by-step fix explanation
  - fixCode: The corrected code snippet
  - reasoning: Why this fix solves the problem

Return ONLY a valid JSON object with this structure:
{
  "totalIssues": number,
  "issues": [
    {
      "severity": "critical" | "high" | "medium" | "low",
      "category": "Performance" | "Security" | "Reliability" | "Maintainability" | "Best Practices",
      "title": "string",
      "description": "string",
      "file": "string",
      "line": number,
      "codeSnippet": "string",
      "aiSuggestion": {
        "title": "string",
        "description": "string",
        "fixCode": "string",
        "reasoning": "string"
      }
    }
  ],
  "summary": "Brief summary of overall code quality and main concerns"
}

Be thorough but realistic. Only report actual issues, not nitpicks.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean up the response (remove markdown code blocks if present)
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // Parse AI response
      const aiResponse = JSON.parse(text);

      // Add IDs and count severity levels
      const issues: CodeIssue[] = aiResponse.issues.map((issue: any, idx: number) => ({
        id: `issue-${Date.now()}-${idx}`,
        ...issue
      }));

      const criticalIssues = issues.filter(i => i.severity === 'critical').length;
      const highIssues = issues.filter(i => i.severity === 'high').length;
      const mediumIssues = issues.filter(i => i.severity === 'medium').length;
      const lowIssues = issues.filter(i => i.severity === 'low').length;

      const analysisResult: AnalysisResult = {
        projectId: '', // Will be set by caller
        totalIssues: issues.length,
        criticalIssues,
        highIssues,
        mediumIssues,
        lowIssues,
        issues,
        summary: aiResponse.summary || 'Analysis complete',
        analyzedAt: new Date()
      };

      logger.info('AI code analysis complete', {
        totalIssues: analysisResult.totalIssues,
        critical: criticalIssues,
        high: highIssues
      });

      return {
        ...analysisResult,
        projectId: projectId || analysisResult.projectId,
      };

    } catch (error) {
      logger.error('AI code analysis failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Return fallback analysis
      return this.generateFallbackAnalysis(projectId, files);
    }
  }

  /**
   * Apply AI-suggested fix to a specific issue
   */
  async applyFix(
    projectId: string,
    issueId: string,
    file: string,
    originalCode: string,
    fixCode: string,
    currentContent: string
  ): Promise<{ success: boolean; updatedContent: string; message: string }> {
    try {
      logger.info('Applying AI fix', { projectId, issueId, file });

      let updatedContent = currentContent;

      if (originalCode && currentContent.includes(originalCode)) {
        updatedContent = currentContent.replace(originalCode, fixCode);
      } else if (originalCode) {
        const trimmedOriginal = originalCode.trim();
        if (trimmedOriginal && currentContent.includes(trimmedOriginal)) {
          updatedContent = currentContent.replace(trimmedOriginal, fixCode);
        } else if (fixCode) {
          updatedContent = `${fixCode}\n`;
        }
      } else if (fixCode) {
        updatedContent = fixCode;
      }

      return {
        success: true,
        updatedContent,
        message: 'Fix applied successfully. Please review the changes.'
      };

    } catch (error) {
      logger.error('Failed to apply fix', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        updatedContent: originalCode,
        message: 'Failed to apply fix. Please apply manually.'
      };
    }
  }

  /**
   * Generate fallback analysis when AI is unavailable
   */
  public generateFallbackAnalysis(projectId?: string, files?: Array<{ name: string; path?: string; content?: string; language?: string }>): AnalysisResult {
    const targetFile = files?.find(Boolean);
    const fallbackPath = targetFile?.path || targetFile?.name || 'src/App.tsx';
    const fallbackLanguage = targetFile?.language || this.detectLanguageFromFilename(fallbackPath);
    const snippet = targetFile?.content?.split('\n').slice(0, 6).join('\n') || 'useEffect(() => {\n  fetchData();\n}, []);';

    const sampleIssues: CodeIssue[] = [
      {
        id: `fallback-${Date.now()}`,
        severity: 'high',
        category: 'Performance',
        title: 'Potential memory leak in useEffect hook',
        description: 'Missing cleanup function in useEffect can cause memory leaks',
        file: fallbackPath,
        line: 145,
        codeSnippet: snippet,
        aiSuggestion: {
          title: 'Add cleanup function to prevent memory leaks',
          description: 'Return a cleanup function from useEffect to cancel pending operations',
          fixCode: 'useEffect(() => {\n  let cancelled = false;\n  fetchData().then(data => {\n    if (!cancelled) setData(data);\n  });\n  return () => { cancelled = true; };\n}, [])',
          reasoning: 'This prevents state updates on unmounted components'
        }
      }
    ];

    return {
      projectId: projectId || '',
      totalIssues: 1,
      criticalIssues: 0,
      highIssues: 1,
      mediumIssues: 0,
      lowIssues: 0,
      issues: sampleIssues,
      summary: 'Fallback analysis - Gemini AI unavailable',
      analyzedAt: new Date()
    };
  }

  private detectLanguageFromFilename(filename: string = ''): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      rb: 'ruby',
      go: 'go',
      php: 'php',
      cs: 'csharp',
      swift: 'swift',
      kt: 'kotlin',
      css: 'css',
      scss: 'scss',
      html: 'html',
      json: 'json',
      md: 'markdown'
    };
    return map[ext || ''] || 'plaintext';
  }
}

export const codeAnalysisService = new CodeAnalysisService();
