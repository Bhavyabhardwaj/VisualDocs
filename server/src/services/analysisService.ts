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

            // Analyze files in parallel batches for better performance
            const BATCH_SIZE = 10; // Process 10 files concurrently
            const fileAnalyses: FileAnalysisResult[] = [];
            
            for (let i = 0; i < files.length; i += BATCH_SIZE) {
                const batch = files.slice(i, i + BATCH_SIZE);
                
                try {
                    // Parallel processing of current batch
                    const batchResults = await Promise.allSettled(
                        batch.map(file => this.analyzeFile(file))
                    );

                    // Process results and handle failures gracefully
                    batchResults.forEach((result, index) => {
                        if (result.status === 'fulfilled') {
                            fileAnalyses.push(result.value);
                        } else {
                            const file = batch[index];
                            logger.warn('File analysis failed, skipping', {
                                fileId: file.id,
                                fileName: file.name,
                                error: result.reason
                            });
                        }
                    });

                    const progress = 10 + ((i + batch.length) / files.length) * 70;

                    eventService.emitAnalysisProgress({
                        projectId,
                        userId,
                        status: 'IN_PROGRESS',
                        progress: Math.round(progress),
                        completedFiles: i + batch.length,
                        totalFiles: files.length,
                    });

                } catch (error) {
                    logger.error('Batch analysis failed', {
                        batchStart: i,
                        batchSize: batch.length,
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

    // Private helper methods - OPTIMIZED for performance
    private async analyzeFile(file: any): Promise<FileAnalysisResult> {
        // Single-pass analysis using optimized data structures
        const analysis = this.performSinglePassAnalysis(file.content, file.language);
        
        return {
            fileId: file.id,
            fileName: file.name,
            language: file.language,
            linesOfCode: analysis.linesOfCode,
            functions: Array.from(analysis.functions), // Convert Set to Array
            classes: Array.from(analysis.classes),
            interfaces: Array.from(analysis.interfaces),
            imports: Array.from(analysis.imports),
            complexity: analysis.complexity,
        };
    }

    /**
     * OPTIMIZED: Single-pass analysis using efficient data structures
     * Time Complexity: O(n) where n is content length
     * Space Complexity: O(k) where k is unique identifiers
     */
    private performSinglePassAnalysis(content: string, language: string): {
        linesOfCode: number;
        functions: Set<string>;
        classes: Set<string>;
        interfaces: Set<string>;
        imports: Set<string>;
        complexity: number;
    } {
        // Use Sets for O(1) duplicate prevention instead of O(n) array.includes()
        const functions = new Set<string>();
        const classes = new Set<string>();
        const interfaces = new Set<string>();
        const imports = new Set<string>();

        let linesOfCode = 0;
        let complexity = 1;

        // Precompiled regex patterns for better performance
        const patterns = this.getLanguagePatterns(language);

        // Single pass through content lines
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Count valid lines of code
            if (trimmedLine && !this.isCommentOrEmpty(trimmedLine, language)) {
                linesOfCode++;
            }

            // Extract patterns in single pass using compiled regexes
            this.extractPatternsFromLine(trimmedLine, patterns, {
                functions,
                classes,
                interfaces,
                imports
            });

            // Calculate complexity
            complexity += this.calculateLineComplexity(trimmedLine);
        }

        return {
            linesOfCode,
            functions,
            classes,
            interfaces,
            imports,
            complexity
        };
    }

    /**
     * OPTIMIZED: Precompiled regex patterns cached by language
     */
    private languagePatternCache = new Map<string, any>();
    
    private getLanguagePatterns(language: string) {
        if (this.languagePatternCache.has(language)) {
            return this.languagePatternCache.get(language);
        }

        const patterns = {
            functions: this.getFunctionPattern(language),
            classes: /class\s+(\w+)/,
            interfaces: language === 'typescript' ? /interface\s+(\w+)/ : null,
            imports: this.getImportPattern(language),
            complexity: [/if\s*\(/, /while\s*\(/, /for\s*\(/, /switch\s*\(/, /catch\s*\(/]
        };

        this.languagePatternCache.set(language, patterns);
        return patterns;
    }

    private getFunctionPattern(language: string): RegExp {
        switch (language) {
            case 'javascript':
            case 'typescript':
                return /(?:function\s+(\w+)|(\w+)\s*[:=]\s*(?:function|async|\([^)]*\)\s*=>))/;
            case 'python':
                return /def\s+(\w+)/;
            case 'java':
            case 'csharp':
                return /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\(/;
            default:
                return /function\s+(\w+)|(\w+)\s*\([^)]*\)\s*{/;
        }
    }

    private getImportPattern(language: string): RegExp {
        switch (language) {
            case 'javascript':
            case 'typescript':
                return /import\s+.*?from\s+['"`]([^'"`]+)['"`]/;
            case 'python':
                return /(?:import\s+(\w+)|from\s+(\w+)\s+import)/;
            case 'java':
                return /import\s+([a-zA-Z0-9_.]+)/;
            default:
                return /import\s+.*?from\s+['"`]([^'"`]+)['"`]/;
        }
    }

    private isCommentOrEmpty(line: string, language: string): boolean {
        if (!line) return true;
        
        switch (language) {
            case 'javascript':
            case 'typescript':
            case 'java':
            case 'csharp':
                return line.startsWith('//') || line.startsWith('/*') || line.startsWith('*');
            case 'python':
                return line.startsWith('#') || line.startsWith('"""') || line.startsWith("'''");
            default:
                return line.startsWith('//') || line.startsWith('#');
        }
    }

    private extractPatternsFromLine(line: string, patterns: any, results: any): void {
        // Extract functions
        const funcMatch = patterns.functions.exec(line);
        if (funcMatch) {
            const funcName = funcMatch[1] || funcMatch[2];
            if (funcName) results.functions.add(funcName);
        }

        // Extract classes
        const classMatch = patterns.classes.exec(line);
        if (classMatch && classMatch[1]) {
            results.classes.add(classMatch[1]);
        }

        // Extract interfaces (TypeScript only)
        if (patterns.interfaces) {
            const interfaceMatch = patterns.interfaces.exec(line);
            if (interfaceMatch && interfaceMatch[1]) {
                results.interfaces.add(interfaceMatch[1]);
            }
        }

        // Extract imports
        const importMatch = patterns.imports.exec(line);
        if (importMatch) {
            const importName = importMatch[1] || importMatch[2];
            if (importName) results.imports.add(importName);
        }
    }

    private calculateLineComplexity(line: string): number {
        let complexity = 0;
        
        // Count complexity-increasing constructs
        if (/if\s*\(/.test(line)) complexity++;
        if (/while\s*\(/.test(line)) complexity++;
        if (/for\s*\(/.test(line)) complexity++;
        if (/switch\s*\(/.test(line)) complexity++;
        if (/catch\s*\(/.test(line)) complexity++;
        if (/else\s+if/.test(line)) complexity++;
        if (/&&|\|\|/.test(line)) {
            complexity += (line.match(/&&|\|\|/g) || []).length;
        }

        return complexity;
    }

    /**
     * OPTIMIZED: Stream-based aggregation with efficient data structures
     * Time Complexity: O(n) where n is total analysis results
     * Space Complexity: O(1) constant space for aggregation
     */
    private async aggregateAndStore(projectId: string, fileAnalyses: FileAnalysisResult[]): Promise<ProjectAnalysisResult> {
        // Use Map for O(1) language distribution counting
        const languageDistribution = new Map<string, number>();
        const dependencySet = new Set<string>();
        
        // Single-pass aggregation
        let totalFiles = 0;
        let totalLinesOfCode = 0;
        let functionCount = 0;
        let classCount = 0;
        let interfaceCount = 0;
        let totalComplexity = 0;
        
        // Efficient complexity distribution using array indexing
        const complexityBuckets: number[] = [0, 0, 0, 0]; // [low, medium, high, critical]

        for (const analysis of fileAnalyses) {
            totalFiles++;
            totalLinesOfCode += analysis.linesOfCode;
            functionCount += analysis.functions.length;
            classCount += analysis.classes.length;
            interfaceCount += analysis.interfaces.length;
            totalComplexity += analysis.complexity;

            // Update language distribution
            const currentCount = languageDistribution.get(analysis.language) || 0;
            languageDistribution.set(analysis.language, currentCount + 1);

            // Efficiently categorize complexity
            if (analysis.complexity <= 5) complexityBuckets[0] = (complexityBuckets[0] ?? 0) + 1;
            else if (analysis.complexity <= 10) complexityBuckets[1] = (complexityBuckets[1] ?? 0) + 1;
            else if (analysis.complexity <= 15) complexityBuckets[2] = (complexityBuckets[2] ?? 0) + 1;
            else complexityBuckets[3] = (complexityBuckets[3] ?? 0) + 1;

            // Collect unique dependencies
            analysis.imports.forEach(imp => dependencySet.add(imp));
        }

        const averageComplexity = totalFiles > 0 ? totalComplexity / totalFiles : 0;

        // Convert Map to plain object for JSON storage
        const languageDistributionObj = Object.fromEntries(languageDistribution);

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
                    low: complexityBuckets[0] ?? 0,
                    medium: complexityBuckets[1] ?? 0,
                    high: complexityBuckets[2] ?? 0,
                    critical: complexityBuckets[3] ?? 0,
                },
            },
            languageDistribution: languageDistributionObj,
            dependencies: { 
                internal: [], 
                external: Array.from(dependencySet) 
            },
            recommendations: this.generateRecommendations(totalComplexity, averageComplexity, totalFiles),
            completedAt: new Date(),
        };

        // Optimized database operation with batch insert
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
                languageDistribution: languageDistributionObj,
                dependencies: result.dependencies,
                recommendations: result.recommendations,
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
                languageDistribution: languageDistributionObj,
                frameworksDetected: [],
                dependencies: result.dependencies,
                recommendations: result.recommendations,
                completedAt: new Date(),
            }
        });

        return result;
    }

    /**
     * OPTIMIZED: Smart recommendations based on metrics
     */
    private generateRecommendations(totalComplexity: number, averageComplexity: number, totalFiles: number): string[] {
        const recommendations: string[] = [];

        if (averageComplexity > 10) {
            recommendations.push('Consider refactoring complex functions to improve maintainability');
        }
        
        if (totalFiles > 50 && averageComplexity > 8) {
            recommendations.push('Large codebase with high complexity - consider architectural review');
        }
        
        if (totalComplexity > totalFiles * 15) {
            recommendations.push('High overall complexity detected - add comprehensive unit tests');
        }

        if (recommendations.length === 0) {
            recommendations.push('Code quality looks good - maintain current standards');
        }

        return recommendations;
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
