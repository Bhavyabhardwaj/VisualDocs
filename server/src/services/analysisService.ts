import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import type { FileAnalysisResult, ProjectAnalysisResult } from '../types';
import prisma from '../config/db';
import { eventService } from '.';

export class AnalysisService {

    /**
     * Analyze project files and generate insights
     */
    async analyzeProject(projectId: string, userId: string, fileIds?: string[]): Promise<ProjectAnalysisResult> {
        try {
            logger.info('Starting project analysis', { projectId, userId, fileIds });

            // Verify project access
            const project = await prisma.project.findUnique({
                where: { id: projectId }
            });

            if (!project || project.userId !== userId) {
                throw new UnauthorizedError('Access denied to this project');
            }

            // Emit analysis start event
            eventService.emitAnalysisProgress({
                projectId,
                userId,
                status: 'STARTING',
                progress: 0,
            });

            // Get project files
            const files = await this.getProjectFiles(projectId, fileIds);

            if (files.length === 0) {
                throw new BadRequestError('No files found for analysis');
            }

            eventService.emitAnalysisProgress({
                projectId,
                userId,
                status: 'IN_PROGRESS',
                progress: 10,
                totalFiles: files.length,
                completedFiles: 0,
            });

            // Analyze each file with progress updates
            const fileAnalyses: FileAnalysisResult[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                try {
                    const analysis = await this.analyzeFile(file);
                    fileAnalyses.push(analysis);

                    const progress = 10 + ((i + 1) / files.length) * 70;

                    eventService.emitAnalysisProgress({
                        projectId,
                        userId,
                        status: 'IN_PROGRESS',
                        progress: Math.round(progress),
                        currentFile: file.name,
                        completedFiles: i + 1,
                        totalFiles: files.length,
                    });

                    await new Promise(resolve => setTimeout(resolve, 100));

                } catch (error) {
                    logger.warn('File analysis failed, skipping', {
                        fileId: file.id,
                        fileName: file.name,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }

            // Aggregate results and store in database
            const aggregatedResult = await this.aggregateAndStore(projectId, fileAnalyses);

            eventService.emitAnalysisProgress({
                projectId,
                userId,
                status: 'COMPLETED',
                progress: 100,
            });

            logger.info('Project analysis completed', {
                projectId,
                userId,
                totalFiles: aggregatedResult.totalFiles,
                totalLinesOfCode: aggregatedResult.totalLinesOfCode
            });

            return aggregatedResult;

        } catch (error) {
            eventService.emitAnalysisProgress({
                projectId,
                userId,
                status: 'FAILED',
                progress: 0,
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            throw error;
        }
    }

    /**
     * Get analysis results by project ID
     */
    async getProjectAnalysis(projectId: string, userId: string): Promise<any> {
        try {
            const project = await prisma.project.findUnique({
                where: { id: projectId }
            });

            if (!project || project.userId !== userId) {
                throw new UnauthorizedError('Access denied to this project');
            }

            const analysis = await prisma.analysis.findUnique({
                where: { projectId }
            });

            return analysis;

        } catch (error) {
            logger.error('Get project analysis failed', {
                projectId,
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw error;
        }
    }

    // Private helper methods
    private async analyzeFile(file: any): Promise<FileAnalysisResult> {
        return {
            fileId: file.id,
            fileName: file.name,
            language: file.language,
            linesOfCode: this.countLinesOfCode(file.content),
            functions: this.extractFunctions(file.content, file.language),
            classes: this.extractClasses(file.content, file.language),
            interfaces: this.extractInterfaces(file.content, file.language),
            imports: this.extractImports(file.content, file.language),
            complexity: this.calculateComplexity(file.content),
        };
    }

    private countLinesOfCode(content: string): number {
        return content.split('\n').filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#');
        }).length;
    }

    private extractFunctions(content: string, language: string): string[] {
        const functionRegex = /function\s+(\w+)|(\w+)\s*\([^)]*\)\s*{|def\s+(\w+)/g;
        const functions: string[] = [];
        let match;

        while ((match = functionRegex.exec(content)) !== null) {
            const functionName = match[1] || match[2] || match[3];
            if (functionName && !functions.includes(functionName)) {
                functions.push(functionName);
            }
        }

        return functions;
    }

    private extractClasses(content: string, language: string): string[] {
        const classRegex = /class\s+(\w+)/g;
        const classes: string[] = [];
        let match;

        while ((match = classRegex.exec(content)) !== null) {
            if (match[1] && !classes.includes(match[1])) {
                classes.push(match[1]);
            }
        }

        return classes;
    }

    private extractInterfaces(content: string, language: string): string[] {
        if (language !== 'typescript') return [];

        const interfaceRegex = /interface\s+(\w+)/g;
        const interfaces: string[] = [];
        let match;

        while ((match = interfaceRegex.exec(content)) !== null) {
            if (match[1] && !interfaces.includes(match[1])) {
                interfaces.push(match[1]);
            }
        }

        return interfaces;
    }

    private extractImports(content: string, language: string): string[] {
        const importRegex = /import\s+.*?from\s+['"`]([^'"`]+)['"`]/g;
        const imports: string[] = [];
        let match;

        while ((match = importRegex.exec(content)) !== null) {
            if (match[1] && !imports.includes(match[1])) {
                imports.push(match[1]);
            }
        }

        return imports;
    }

    private calculateComplexity(content: string): number {
        let complexity = 1;
        const patterns = [/if\s*\(/g, /while\s*\(/g, /for\s*\(/g, /switch\s*\(/g];

        patterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) complexity += matches.length;
        });

        return complexity;
    }

    private async aggregateAndStore(projectId: string, fileAnalyses: FileAnalysisResult[]): Promise<ProjectAnalysisResult> {
        const totalFiles = fileAnalyses.length;
        const totalLinesOfCode = fileAnalyses.reduce((sum, file) => sum + file.linesOfCode, 0);
        const functionCount = fileAnalyses.reduce((sum, file) => sum + file.functions.length, 0);
        const classCount = fileAnalyses.reduce((sum, file) => sum + file.classes.length, 0);
        const interfaceCount = fileAnalyses.reduce((sum, file) => sum + file.interfaces.length, 0);

        const complexities = fileAnalyses.map(file => file.complexity);
        const totalComplexity = complexities.reduce((sum, c) => sum + c, 0);
        const averageComplexity = totalComplexity / totalFiles;

        const result: ProjectAnalysisResult = {
            id: `analysis_${Date.now()}`,
            projectId,
            totalFiles,
            totalLinesOfCode,
            functionCount,
            classCount,
            interfaceCount,
            complexity: {
                total: totalComplexity,
                average: Number(averageComplexity.toFixed(2)),
                distribution: {
                    low: complexities.filter(c => c <= 5).length,
                    medium: complexities.filter(c => c > 5 && c <= 10).length,
                    high: complexities.filter(c => c > 10 && c <= 15).length,
                    critical: complexities.filter(c => c > 15).length,
                },
            },
            languageDistribution: {},
            dependencies: { internal: [], external: [] },
            recommendations: ['Add unit tests', 'Improve code documentation'],
            completedAt: new Date(),
        };

        // Store in database
        await prisma.analysis.upsert({
            where: { projectId },
            update: {
                totalFiles,
                totalLinesOfCode,
                totalComplexity,
                averageComplexity,
                functionCount,
                classCount,
                interfaceCount,
                completedAt: new Date(),
            },
            create: {
                projectId,
                totalFiles,
                totalLinesOfCode,
                totalComplexity,
                averageComplexity,
                functionCount,
                classCount,
                interfaceCount,
                languageDistribution: {},
                frameworksDetected: [],
                dependencies: {},
                recommendations: result.recommendations,
                completedAt: new Date(),
            }
        });

        return result;
    }

    private async getProjectFiles(projectId: string, fileIds?: string[]): Promise<any[]> {
        return await prisma.codeFile.findMany({
            where: {
                projectId,
                ...(fileIds && { id: { in: fileIds } })
            },
            select: {
                id: true,
                name: true,
                content: true,
                language: true,
            }
        });
    }
}
