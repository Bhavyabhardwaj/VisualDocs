import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import type { FileAnalysisResult, ProjectAnalysisResult } from '../types';
import prisma from '../config/db';
import { eventService } from '.';

export class AnalysisService {
    // Analyze project 
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
            
            // jump 0,10,20,30...
            for (let i = 0; i < files.length; i += BATCH_SIZE) {
                const batch = files.slice(i, i + BATCH_SIZE);   // Get current batch
                
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

    // Private helper methods 
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

    private performSinglePassAnalysis(content: string, language: string): {
        linesOfCode: number;
        functions: Set<string>;
        classes: Set<string>;
        interfaces: Set<string>;
        imports: Set<string>;
        complexity: number;
    } {
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
     *  Smart recommendations based on metrics
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

    // Helper method to aggregate results without storing to DB
    private aggregateAnalysisResults(fileAnalyses: FileAnalysisResult[], projectId: string): ProjectAnalysisResult {
        const languageDistribution = new Map<string, number>();
        const dependencySet = new Set<string>();
        const internalDeps = new Set<string>();
        
        let totalFiles = 0;
        let totalLinesOfCode = 0;
        let functionCount = 0;
        let classCount = 0;
        let interfaceCount = 0;
        let totalComplexity = 0;
        
        const complexityBuckets: { [key: string]: number } = {
            'low (1-5)': 0,
            'medium (6-10)': 0,
            'high (11-15)': 0,
            'critical (16+)': 0
        };

        for (const analysis of fileAnalyses) {
            totalFiles++;
            totalLinesOfCode += analysis.linesOfCode;
            functionCount += analysis.functions.length;
            classCount += analysis.classes.length;
            interfaceCount += analysis.interfaces.length;
            totalComplexity += analysis.complexity;

            const currentCount = languageDistribution.get(analysis.language) || 0;
            languageDistribution.set(analysis.language, currentCount + 1);

            if (analysis.complexity <= 5) complexityBuckets['low (1-5)'] = (complexityBuckets['low (1-5)'] || 0) + 1;
            else if (analysis.complexity <= 10) complexityBuckets['medium (6-10)'] = (complexityBuckets['medium (6-10)'] || 0) + 1;
            else if (analysis.complexity <= 15) complexityBuckets['high (11-15)'] = (complexityBuckets['high (11-15)'] || 0) + 1;
            else complexityBuckets['critical (16+)'] = (complexityBuckets['critical (16+)'] || 0) + 1;

            analysis.imports.forEach(imp => {
                if (imp.startsWith('.') || imp.startsWith('/')) {
                    internalDeps.add(imp);
                } else {
                    dependencySet.add(imp);
                }
            });
        }

        const averageComplexity = totalFiles > 0 ? totalComplexity / totalFiles : 0;

        return {
            id: `analysis_${Date.now()}`,
            projectId,
            totalFiles,
            totalLinesOfCode,
            functionCount,
            classCount,
            interfaceCount,
            languageDistribution: Object.fromEntries(languageDistribution),
            complexity: {
                total: totalComplexity,
                average: averageComplexity,
                distribution: complexityBuckets as any // Type cast for flexibility
            },
            dependencies: {
                external: Array.from(dependencySet),
                internal: Array.from(internalDeps)
            },
            recommendations: [
                averageComplexity <= 5 ? 'Code quality looks good - maintain current standards' : 
                averageComplexity <= 10 ? 'Consider refactoring more complex functions' :
                'High complexity detected - prioritize refactoring'
            ],
            completedAt: new Date().toISOString() as any // Type cast for string date
        };
    }

    // Generate comprehensive documentation
    async generateDocumentation(projectId: string, userId: string): Promise<string> {
        try {
            logger.info('Generating documentation', { projectId, userId });

            // Get project and analysis data
            const project = await prisma.project.findUnique({
                where: { id: projectId },
                include: {
                    codeFiles: {
                        select: {
                            id: true,
                            name: true,
                            content: true,
                            language: true,
                            path: true,
                        }
                    }
                }
            });

            if (!project || project.userId !== userId) {
                throw new UnauthorizedError('Access denied to this project');
            }

            // Get the latest analysis
            const files = project.codeFiles;
            if (files.length === 0) {
                throw new BadRequestError('No files found to document');
            }

            // Analyze code structure
            const fileAnalyses = await Promise.all(
                files.map(file => this.analyzeFile(file))
            );

            // Aggregate data (without storing to DB)
            const aggregated = this.aggregateAnalysisResults(fileAnalyses, projectId);

            // Generate comprehensive markdown documentation
            const documentation = this.buildDetailedDocumentation(project, aggregated, files);

            logger.info('Documentation generated successfully', { 
                projectId, 
                documentationLength: documentation.length 
            });

            return documentation;

        } catch (error) {
            logger.error('Documentation generation failed', {
                projectId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    private buildDetailedDocumentation(
        project: any,
        analysis: ProjectAnalysisResult,
        files: any[]
    ): string {
        const doc: string[] = [];

        // Title and Overview
        doc.push(`# ${project.name} - Technical Documentation\n`);
        doc.push(`> ${project.description || 'Comprehensive project documentation generated by VisualDocs AI'}\n`);
        doc.push(`**Last Updated:** ${new Date().toLocaleString()}\n`);
        doc.push(`**Project ID:** \`${project.id}\`\n`);
        doc.push(`---\n\n`);

        // Table of Contents
        doc.push(`## 📋 Table of Contents\n`);
        doc.push(`1. [Project Overview](#project-overview)\n`);
        doc.push(`2. [Project Statistics](#project-statistics)\n`);
        doc.push(`3. [Architecture](#architecture)\n`);
        doc.push(`4. [File Structure](#file-structure)\n`);
        doc.push(`5. [Code Analysis](#code-analysis)\n`);
        doc.push(`6. [Dependencies](#dependencies)\n`);
        doc.push(`7. [Quality Metrics](#quality-metrics)\n`);
        doc.push(`8. [Recommendations](#recommendations)\n\n`);

        // Project Overview
        doc.push(`## 📖 Project Overview\n\n`);
        doc.push(`### Basic Information\n\n`);
        doc.push(`| Property | Value |\n`);
        doc.push(`|----------|-------|\n`);
        doc.push(`| **Name** | ${project.name} |\n`);
        doc.push(`| **Language** | ${project.language || 'Multiple'} |\n`);
        doc.push(`| **Framework** | ${project.framework || 'N/A'} |\n`);
        doc.push(`| **Created** | ${new Date(project.createdAt).toLocaleDateString()} |\n`);
        if (project.githubUrl) {
            doc.push(`| **Repository** | [${project.githubUrl}](${project.githubUrl}) |\n`);
        }
        doc.push(`\n`);

        // Project Statistics
        doc.push(`## 📊 Project Statistics\n\n`);
        doc.push(`### Code Metrics\n\n`);
        doc.push(`\`\`\`\n`);
        doc.push(`Total Files:              ${analysis.totalFiles}\n`);
        doc.push(`Total Lines of Code:      ${analysis.totalLinesOfCode.toLocaleString()}\n`);
        doc.push(`Total Functions:          ${analysis.functionCount}\n`);
        doc.push(`Total Classes:            ${analysis.classCount}\n`);
        doc.push(`Total Interfaces:         ${analysis.interfaceCount}\n`);
        doc.push(`\`\`\`\n\n`);

        // Language Distribution
        if (Object.keys(analysis.languageDistribution).length > 0) {
            doc.push(`### Language Distribution\n\n`);
            Object.entries(analysis.languageDistribution).forEach(([lang, count]) => {
                const percentage = ((count / analysis.totalFiles) * 100).toFixed(1);
                doc.push(`- **${lang.toUpperCase()}**: ${count} files (${percentage}%)\n`);
            });
            doc.push(`\n`);
        }

        // Architecture
        doc.push(`## 🏗️ Architecture\n\n`);
        doc.push(`### Complexity Analysis\n\n`);
        if (analysis.complexity) {
            doc.push(`| Metric | Value |\n`);
            doc.push(`|--------|-------|\n`);
            doc.push(`| **Total Complexity** | ${analysis.complexity.total} |\n`);
            doc.push(`| **Average Complexity** | ${analysis.complexity.average.toFixed(2)} |\n`);
            doc.push(`| **Complexity Rating** | ${this.getComplexityRating(analysis.complexity.average)} |\n\n`);

            if (analysis.complexity.distribution) {
                doc.push(`#### Complexity Distribution\n\n`);
                doc.push(`\`\`\`\n`);
                Object.entries(analysis.complexity.distribution).forEach(([level, count]) => {
                    doc.push(`${level.padEnd(15)} ${'█'.repeat(Math.min(count, 50))} (${count})\n`);
                });
                doc.push(`\`\`\`\n\n`);
            }
        }

        // File Structure
        doc.push(`## 📁 File Structure\n\n`);
        doc.push(`\`\`\`\n`);
        files.forEach(file => {
            const icon = this.getFileIcon(file.language);
            doc.push(`${icon} ${file.path || file.name}\n`);
        });
        doc.push(`\`\`\`\n\n`);

        // Detailed File Analysis
        doc.push(`### Detailed File Information\n\n`);
        files.slice(0, 10).forEach(file => {
            doc.push(`#### ${file.name}\n\n`);
            doc.push(`- **Language**: ${file.language}\n`);
            doc.push(`- **Path**: \`${file.path || file.name}\`\n`);
            doc.push(`- **Size**: ${(file.content?.length || 0).toLocaleString()} characters\n`);
            
            // Extract key elements from file
            const lines = (file.content || '').split('\n');
            const imports = lines.filter((l: string) => l.match(/^import |^from |^require\(/)).slice(0, 5);
            if (imports.length > 0) {
                doc.push(`- **Key Imports**:\n`);
                imports.forEach((imp: string) => {
                    doc.push(`  - \`${imp.trim()}\`\n`);
                });
            }
            doc.push(`\n`);
        });

        if (files.length > 10) {
            doc.push(`_... and ${files.length - 10} more files_\n\n`);
        }

        // Dependencies
        doc.push(`## 📦 Dependencies\n\n`);
        if (analysis.dependencies) {
            doc.push(`### External Dependencies (${analysis.dependencies.external.length})\n\n`);
            if (analysis.dependencies.external.length > 0) {
                const grouped = this.groupDependencies(analysis.dependencies.external);
                Object.entries(grouped).forEach(([category, deps]) => {
                    doc.push(`#### ${category}\n\n`);
                    deps.forEach((dep: string) => {
                        doc.push(`- \`${dep}\`\n`);
                    });
                    doc.push(`\n`);
                });
            } else {
                doc.push(`No external dependencies detected.\n\n`);
            }

            doc.push(`### Internal Dependencies (${analysis.dependencies.internal.length})\n\n`);
            if (analysis.dependencies.internal.length > 0) {
                analysis.dependencies.internal.slice(0, 10).forEach((dep: string) => {
                    doc.push(`- \`${dep}\`\n`);
                });
                if (analysis.dependencies.internal.length > 10) {
                    doc.push(`\n_... and ${analysis.dependencies.internal.length - 10} more internal modules_\n`);
                }
            } else {
                doc.push(`No internal dependencies detected.\n`);
            }
            doc.push(`\n`);
        }

        // Quality Metrics
        doc.push(`## ✨ Quality Metrics\n\n`);
        doc.push(`### Code Quality Assessment\n\n`);
        const qualityScore = this.calculateQualityScore(analysis);
        doc.push(`**Overall Quality Score:** ${qualityScore}/100 ${this.getQualityEmoji(qualityScore)}\n\n`);
        doc.push(`| Metric | Score | Assessment |\n`);
        doc.push(`|--------|-------|------------|\n`);
        doc.push(`| **Code Complexity** | ${this.getComplexityScore(analysis.complexity.average)}/100 | ${this.getComplexityRating(analysis.complexity.average)} |\n`);
        doc.push(`| **Code Organization** | ${this.getOrganizationScore(analysis)}/100 | ${this.getOrganizationRating(analysis)} |\n`);
        doc.push(`| **Modularity** | ${this.getModularityScore(analysis)}/100 | ${this.getModularityRating(analysis)} |\n\n`);

        // Recommendations
        doc.push(`## 💡 Recommendations\n\n`);
        if (analysis.recommendations && analysis.recommendations.length > 0) {
            analysis.recommendations.forEach((rec: string, idx: number) => {
                doc.push(`${idx + 1}. ${rec}\n`);
            });
        } else {
            doc.push(`### General Best Practices\n\n`);
            doc.push(`1. **Maintain Consistent Code Style**: Use linters and formatters\n`);
            doc.push(`2. **Write Comprehensive Tests**: Aim for >80% code coverage\n`);
            doc.push(`3. **Document Public APIs**: Add JSDoc comments to all exported functions\n`);
            doc.push(`4. **Regular Refactoring**: Keep complexity metrics low\n`);
            doc.push(`5. **Dependency Management**: Regularly update dependencies\n`);
        }
        doc.push(`\n`);

        // Footer
        doc.push(`---\n\n`);
        doc.push(`### Analysis Metadata\n\n`);
        doc.push(`- **Analysis ID**: \`${analysis.id}\`\n`);
        doc.push(`- **Generated**: ${new Date(analysis.completedAt).toLocaleString()}\n`);
        doc.push(`- **Tool**: VisualDocs AI-Powered Documentation Generator\n`);
        doc.push(`- **Version**: 1.0.0\n\n`);
        doc.push(`*This documentation was automatically generated using static code analysis and AI insights.*\n`);

        return doc.join('');
    }

    private getComplexityRating(avgComplexity: number): string {
        if (avgComplexity <= 5) return '✅ Excellent (Low Complexity)';
        if (avgComplexity <= 10) return '👍 Good';
        if (avgComplexity <= 20) return '⚠️ Moderate';
        return '❌ High (Needs Refactoring)';
    }

    private getFileIcon(language: string): string {
        const icons: { [key: string]: string } = {
            typescript: '📘',
            javascript: '📙',
            python: '🐍',
            java: '☕',
            cpp: '⚙️',
            csharp: '#️⃣',
            go: '🔷',
            rust: '🦀',
            ruby: '💎',
            php: '🐘',
        };
        return icons[language.toLowerCase()] || '📄';
    }

    private groupDependencies(deps: string[]): { [category: string]: string[] } {
        const groups: { [category: string]: string[] } = {
            'Core Frameworks': [],
            'Utilities': [],
            'Database': [],
            'Authentication': [],
            'Other': []
        };

        deps.forEach(dep => {
            if (dep.match(/express|nest|fastify|koa/i)) {
                groups['Core Frameworks']?.push(dep);
            } else if (dep.match(/prisma|mongoose|typeorm|sequelize/i)) {
                groups['Database']?.push(dep);
            } else if (dep.match(/passport|jwt|bcrypt|auth/i)) {
                groups['Authentication']?.push(dep);
            } else if (dep.match(/lodash|axios|date-fns|moment/i)) {
                groups['Utilities']?.push(dep);
            } else {
                groups['Other']?.push(dep);
            }
        });

        // Remove empty groups
        Object.keys(groups).forEach(key => {
            if (groups[key]?.length === 0) delete groups[key];
        });

        return groups;
    }

    private calculateQualityScore(analysis: ProjectAnalysisResult): number {
        let score = 100;
        
        // Deduct points for high complexity
        if (analysis.complexity.average > 10) score -= 20;
        else if (analysis.complexity.average > 5) score -= 10;
        
        // Deduct points for too few or too many files
        if (analysis.totalFiles < 3) score -= 10;
        
        // Deduct points for very long files
        const avgLines = analysis.totalLinesOfCode / analysis.totalFiles;
        if (avgLines > 500) score -= 15;
        
        return Math.max(0, score);
    }

    private getQualityEmoji(score: number): string {
        if (score >= 90) return '🌟';
        if (score >= 75) return '✅';
        if (score >= 60) return '👍';
        if (score >= 40) return '⚠️';
        return '❌';
    }

    private getComplexityScore(avgComplexity: number): number {
        return Math.max(0, 100 - (avgComplexity * 5));
    }

    private getOrganizationScore(analysis: ProjectAnalysisResult): number {
        const filesPerFunction = analysis.totalFiles / Math.max(1, analysis.functionCount);
        if (filesPerFunction > 0.5) return 85;
        if (filesPerFunction > 0.3) return 70;
        return 60;
    }

    private getOrganizationRating(analysis: ProjectAnalysisResult): string {
        const score = this.getOrganizationScore(analysis);
        if (score >= 80) return 'Well Organized';
        if (score >= 60) return 'Adequately Organized';
        return 'Needs Organization';
    }

    private getModularityScore(analysis: ProjectAnalysisResult): number {
        const hasClasses = analysis.classCount > 0;
        const hasInterfaces = analysis.interfaceCount > 0;
        const goodFileCount = analysis.totalFiles >= 3;
        
        let score = 50;
        if (hasClasses) score += 15;
        if (hasInterfaces) score += 15;
        if (goodFileCount) score += 20;
        
        return score;
    }

    private getModularityRating(analysis: ProjectAnalysisResult): string {
        const score = this.getModularityScore(analysis);
        if (score >= 80) return 'Highly Modular';
        if (score >= 60) return 'Moderately Modular';
        return 'Monolithic Structure';
    }
}
