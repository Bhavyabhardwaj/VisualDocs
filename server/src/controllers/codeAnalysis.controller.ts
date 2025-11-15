import { Request, Response } from 'express';
import { codeAnalysisService } from '../services/codeAnalysis.service';
import { logger } from '../utils/logger';
import prisma from '../config/db';
import type { JwtPayload } from '../types';

export class CodeAnalysisController {
  /**
   * Run AI code analysis on a project
   */
  async analyzeProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const userId = (req.user as JwtPayload)?.userId;

      if (!userId || !projectId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      logger.info('Starting code analysis', { projectId, userId });

      // Get project and verify ownership
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          codeFiles: true
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      if (project.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Prepare files for analysis
      const files = project.codeFiles.map((f: any) => ({
        name: f.name,
        path: f.path || f.name,
        content: f.content,
        language: f.language || this.detectLanguage(f.name)
      }));

      if (files.length === 0) {
        return res.status(400).json({ error: 'No files to analyze' });
      }

      // Run AI analysis
      const analysis = await codeAnalysisService.analyzeCodeWithAI(files, projectId);

      // Store analysis results in database
      const savedAnalysis = await prisma.aICodeAnalysis.create({
        data: {
          projectId: projectId,
          totalIssues: analysis.totalIssues,
          criticalIssues: analysis.criticalIssues,
          highIssues: analysis.highIssues,
          mediumIssues: analysis.mediumIssues,
          lowIssues: analysis.lowIssues,
          summary: analysis.summary,
          issues: JSON.stringify(analysis.issues),
          analyzedAt: analysis.analyzedAt
        }
      });

      logger.info('Code analysis complete', {
        analysisId: savedAnalysis.id,
        totalIssues: analysis.totalIssues
      });

      return res.json({
        success: true,
        data: {
          analysis: {
            id: savedAnalysis.id,
            ...analysis,
            projectId: projectId
          }
        }
      });

    } catch (error) {
      logger.error('Code analysis failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get analysis results for a project
   */
  async getAnalysis(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const userId = (req.user as JwtPayload)?.userId;

      if (!userId || !projectId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get project and verify ownership
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      if (project.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Get latest analysis
      const analysis = await prisma.aICodeAnalysis.findFirst({
        where: { projectId },
        orderBy: { analyzedAt: 'desc' }
      });

      if (!analysis) {
        return res.status(404).json({ error: 'No analysis found' });
      }

      return res.json({
        success: true,
        data: {
          analysis: {
            id: analysis.id,
            projectId: analysis.projectId,
            totalIssues: analysis.totalIssues,
            criticalIssues: analysis.criticalIssues,
            highIssues: analysis.highIssues,
            mediumIssues: analysis.mediumIssues,
            lowIssues: analysis.lowIssues,
            issues: JSON.parse(analysis.issues as string),
            summary: analysis.summary,
            analyzedAt: analysis.analyzedAt
          }
        }
      });

    } catch (error) {
      logger.error('Failed to get analysis', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        error: 'Failed to get analysis'
      });
    }
  }

  /**
   * Ignore a specific issue
   */
  async ignoreIssue(req: Request, res: Response) {
    try {
      const { projectId, issueId } = req.params;
      const userId = (req.user as JwtPayload)?.userId;

      if (!userId || !projectId || !issueId) {
        return res.status(401).json({ error: 'Unauthorized or missing parameters' });
      }

      logger.info('Ignoring issue', { projectId, issueId, userId });

      // Verify project ownership
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project || project.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Store ignored issue
      await prisma.ignoredIssue.create({
        data: {
          projectId,
          issueId,
          userId,
          ignoredAt: new Date()
        }
      });

      return res.json({
        success: true,
        message: 'Issue ignored successfully'
      });

    } catch (error) {
      logger.error('Failed to ignore issue', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        error: 'Failed to ignore issue'
      });
    }
  }

  /**
   * Apply AI-suggested fix to an issue
   */
  async applyFix(req: Request, res: Response) {
    try {
      const { projectId, issueId } = req.params;
      const { file, originalCode, fixCode } = req.body;
      const userId = (req.user as JwtPayload)?.userId;

      if (!userId || !projectId || !issueId) {
        return res.status(401).json({ error: 'Unauthorized or missing parameters' });
      }

      logger.info('Applying fix', { projectId, issueId, file, userId });

      // Verify project ownership
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { codeFiles: true }
      });

      if (!project || project.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Find the file
      const projectFile = project.codeFiles.find((f: any) => f.path === file || f.name === file);

      if (!projectFile) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Get current file content
      const currentContent = projectFile.content || '';

      // Apply the fix
      const result = await codeAnalysisService.applyFix(
        projectId,
        issueId,
        file,
        originalCode,
        fixCode,
        currentContent
      );

      if (result.success) {
        // Update file content in database
        await prisma.codeFile.update({
          where: { id: projectFile.id },
          data: {
            content: result.updatedContent,
            updatedAt: new Date()
          }
        });

        // Log the fix
        await prisma.appliedFix.create({
          data: {
            projectId,
            issueId,
            fileId: projectFile.id,
            userId,
            originalCode,
            fixCode,
            appliedAt: new Date()
          }
        });
      }

      return res.json(result);

    } catch (error) {
      logger.error('Failed to apply fix', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        error: 'Failed to apply fix',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get ignored issues for a project
   */
  async getIgnoredIssues(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const userId = (req.user as JwtPayload)?.userId;

      if (!userId || !projectId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const ignored = await prisma.ignoredIssue.findMany({
        where: {
          projectId,
          userId
        }
      });

      return res.json({
        success: true,
        ignoredIssues: ignored.map((i: any) => i.issueId)
      });

    } catch (error) {
      logger.error('Failed to get ignored issues', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return res.status(500).json({
        error: 'Failed to get ignored issues'
      });
    }
  }

  /**
   * Detect programming language from file extension
   */
  private detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'php': 'php',
      'cs': 'csharp',
      'swift': 'swift',
      'kt': 'kotlin',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'md': 'markdown'
    };
    return languageMap[ext || ''] || 'plaintext';
  }
}

export const codeAnalysisController = new CodeAnalysisController();
