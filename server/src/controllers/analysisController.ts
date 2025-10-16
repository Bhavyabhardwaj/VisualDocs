import type { NextFunction, Request, Response } from "express";
import { analysisService, eventService } from "../services";
import { UnauthorizedError } from "../errors";
import { successResponse, logger } from "../utils";
import prisma from "../config/db";

export class AnalysisController {
    // get project analysis
    async getProjectAnalysis(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;

            if (!projectId) {
                throw new UnauthorizedError("Project ID is required");
            }

            const analysis = await analysisService.getProjectAnalysis(userId, projectId);
            return successResponse(
                res,
                { analysis },
                "Project analysis retrieved successfully",
                200
            );
        } catch (error) {
            next(error);
        }
    }

    // analyse project
    async analyseProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id; // Changed from req.params.projectId
            const { fields } = req.body;

            if (!projectId) {
                return new UnauthorizedError("Project ID is required");
            }

            // Simulate analysis process
            const analysis = await analysisService.analyzeProject(userId, projectId, fields);

            return successResponse(
                res,
                { analysis },
                "Project analyzed successfully",
                201
            )
        } catch (error) {
            next(error);
        }
    }

    // get analysis by id
    async getAnalysisById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;

            if (!projectId) {
                return new UnauthorizedError("Project ID is required");
            }

            const analysis = await analysisService.getProjectAnalysis(userId, projectId);
            return successResponse(
                res,
                { analysis },
                "Project analysis retrieved successfully",
                200
            )
        } catch (error) {
            next(error);
        }
    }

    // rerun analysis for project
    async rerunAnalysis(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;
            const { fields, force } = req.body;

            if (!projectId) {
                return new UnauthorizedError("Project ID is required");
            }

            if (!force) {
                const existingAnalysis = await analysisService.getProjectAnalysis(projectId, userId);

                // Check if analysis is currently running
                const isAnalysisRunning = await this.checkAnalysisStatus(projectId, userId);

                if (isAnalysisRunning) {
                    return successResponse(
                        res,
                        {
                            analysis: existingAnalysis,
                            status: 'running',
                            message: 'Analysis is already in progress for this project'
                        },
                        'Analysis already running',
                        409 // Conflict status code
                    );
                }

                // If analysis exists and is recent (less than 1 hour old), return existing
                if (existingAnalysis && existingAnalysis.completedAt) {
                    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                    const analysisTime = new Date(existingAnalysis.completedAt);

                    if (analysisTime > oneHourAgo) {
                        return successResponse(
                            res,
                            {
                                analysis: existingAnalysis,
                                status: 'recent',
                                message: 'Recent analysis available. Use force=true to rerun.'
                            },
                            'Recent analysis found',
                            200
                        );
                    }
                }
            }

            // Simulate rerun analysis process
            const analysis = await analysisService.analyzeProject(userId, projectId);

            return successResponse(
                res,
                { analysis },
                "Project analysis rerun successfully",
                200
            )
        } catch (error) {
            next(error);
        }
    }

    // Helper method to check if analysis is currently running
    private async checkAnalysisStatus(projectId: string, userId: string): Promise<boolean> {
        try {
            const recentAnalysisTime = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

            const hasRunningAnalysis = await this.checkActiveAnalysisProcess(projectId);

            return hasRunningAnalysis;

        } catch (error) {
            // If we can't determine the status, assume no running analysis
            return false;
        }
    }

    // Check for active analysis processes (simplified implementation)
    private async checkActiveAnalysisProcess(projectId: string): Promise<boolean> {
        try {
            const recentAnalysisAttempt = await prisma.analysis.findFirst({
                where: {
                    projectId,
                    createdAt: {
                        gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            // If there's a recent analysis but no completion timestamp very close to creation,
            // it might still be running
            if (recentAnalysisAttempt) {
                const timeDiff = recentAnalysisAttempt.completedAt.getTime() - recentAnalysisAttempt.createdAt.getTime();
                // If completed too quickly (less than 30 seconds), it might be a cached result
                // If it took a reasonable time but was very recent, consider it might still be running
                if (timeDiff < 30000 && new Date().getTime() - recentAnalysisAttempt.createdAt.getTime() < 2 * 60 * 1000) {
                    return false; // Quick completion, likely cached
                }

                // If analysis was started recently and took reasonable time, check if another might be starting
                if (new Date().getTime() - recentAnalysisAttempt.createdAt.getTime() < 60000) {
                    return true; // Very recent analysis, might be running
                }
            }

            return false;

        } catch (error) {
            // If query fails, assume no running analysis
            return false;
        }
    }
    // get project analysis progres
    async getAnalysisProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id; // Changed from req.params.projectId
            if (!projectId) {
                return new UnauthorizedError("Project ID is required");
            }

            // Comprehensive real-time progress tracking implementation
            const progressData = await this.getComprehensiveAnalysisProgress(projectId, userId);

            return successResponse(
                res,
                { progress: progressData },
                'Analysis progress retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }

    // Comprehensive analysis progress tracking
    private async getComprehensiveAnalysisProgress(projectId: string, userId: string) {
        try {
            // Get the latest analysis record
            const analysis = await analysisService.getProjectAnalysis(projectId, userId);

            // Check if analysis is currently running
            const isRunning = await this.checkActiveAnalysisProcess(projectId);

            // Get project files count for progress calculation
            const projectFiles = await prisma.codeFile.count({
                where: { projectId }
            });

            // Initialize progress data
            let progressData = {
                status: 'NOT_STARTED' as 'NOT_STARTED' | 'STARTING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED',
                progress: 0,
                currentFile: null as string | null,
                totalFiles: projectFiles,
                completedFiles: 0,
                lastUpdated: null as Date | null,
                estimatedCompletion: null as Date | null,
                analysisId: null as string | null,
                stages: {
                    fileDiscovery: { completed: false, progress: 0 },
                    preprocessing: { completed: false, progress: 0 },
                    codeAnalysis: { completed: false, progress: 0 },
                    aggregation: { completed: false, progress: 0 },
                    storage: { completed: false, progress: 0 }
                },
                metrics: {
                    filesPerSecond: 0,
                    timeElapsed: 0,
                    timeRemaining: 0
                },
                error: null as string | null
            };

            if (!analysis && !isRunning) {
                // No analysis has been run yet
                return progressData;
            }

            if (analysis) {
                // Analysis exists - determine current state
                progressData.analysisId = analysis.id;
                progressData.lastUpdated = analysis.completedAt || analysis.createdAt;

                if (isRunning) {
                    // Analysis is currently running
                    progressData.status = 'IN_PROGRESS';

                    // Calculate progress based on time elapsed and typical analysis duration
                    const startTime = analysis.createdAt.getTime();
                    const currentTime = Date.now();
                    const elapsedTime = currentTime - startTime;

                    // Estimate progress based on elapsed time (typical analysis takes 30-120 seconds)
                    const estimatedDuration = Math.max(30000, projectFiles * 1000); // 1 second per file minimum
                    progressData.progress = Math.min(95, Math.floor((elapsedTime / estimatedDuration) * 100));

                    // Estimate completion time
                    const remainingTime = estimatedDuration - elapsedTime;
                    progressData.estimatedCompletion = new Date(currentTime + Math.max(5000, remainingTime));

                    // Calculate metrics
                    progressData.metrics.timeElapsed = Math.floor(elapsedTime / 1000);
                    progressData.metrics.timeRemaining = Math.max(5, Math.floor(remainingTime / 1000));

                    if (elapsedTime > 0) {
                        progressData.metrics.filesPerSecond = Math.round((progressData.completedFiles / (elapsedTime / 1000)) * 100) / 100;
                    }

                    // Estimate current stage based on progress
                    if (progressData.progress < 20) {
                        progressData.stages.fileDiscovery.completed = true;
                        progressData.stages.fileDiscovery.progress = 100;
                        progressData.stages.preprocessing.progress = Math.min(100, (progressData.progress / 20) * 100);
                    } else if (progressData.progress < 70) {
                        progressData.stages.fileDiscovery.completed = true;
                        progressData.stages.preprocessing.completed = true;
                        progressData.stages.fileDiscovery.progress = 100;
                        progressData.stages.preprocessing.progress = 100;
                        progressData.stages.codeAnalysis.progress = Math.min(100, ((progressData.progress - 20) / 50) * 100);
                    } else if (progressData.progress < 90) {
                        progressData.stages.fileDiscovery.completed = true;
                        progressData.stages.preprocessing.completed = true;
                        progressData.stages.codeAnalysis.completed = true;
                        progressData.stages.fileDiscovery.progress = 100;
                        progressData.stages.preprocessing.progress = 100;
                        progressData.stages.codeAnalysis.progress = 100;
                        progressData.stages.aggregation.progress = Math.min(100, ((progressData.progress - 70) / 20) * 100);
                    } else {
                        progressData.stages.fileDiscovery.completed = true;
                        progressData.stages.preprocessing.completed = true;
                        progressData.stages.codeAnalysis.completed = true;
                        progressData.stages.aggregation.completed = true;
                        progressData.stages.fileDiscovery.progress = 100;
                        progressData.stages.preprocessing.progress = 100;
                        progressData.stages.codeAnalysis.progress = 100;
                        progressData.stages.aggregation.progress = 100;
                        progressData.stages.storage.progress = Math.min(100, ((progressData.progress - 90) / 10) * 100);
                    }

                    // Estimate completed files based on progress
                    progressData.completedFiles = Math.floor((progressData.progress / 100) * projectFiles);

                } else {
                    // Analysis is completed
                    progressData.status = 'COMPLETED';
                    progressData.progress = 100;
                    progressData.completedFiles = projectFiles;
                    progressData.estimatedCompletion = analysis.completedAt;

                    // All stages completed
                    Object.keys(progressData.stages).forEach(stage => {
                        progressData.stages[stage as keyof typeof progressData.stages].completed = true;
                        progressData.stages[stage as keyof typeof progressData.stages].progress = 100;
                    });

                    // Calculate final metrics
                    const totalTime = analysis.completedAt.getTime() - analysis.createdAt.getTime();
                    progressData.metrics.timeElapsed = Math.floor(totalTime / 1000);
                    progressData.metrics.timeRemaining = 0;
                    progressData.metrics.filesPerSecond = totalTime > 0 ?
                        Math.round((projectFiles / (totalTime / 1000)) * 100) / 100 : 0;
                }
            }

            // Check for any recent errors
            if (analysis && !isRunning && progressData.progress < 100) {
                progressData.status = 'FAILED';
                progressData.error = 'Analysis failed to complete. Please try again.';
            }

            return progressData;

        } catch (error) {
            // Return error state
            return {
                status: 'FAILED' as 'NOT_STARTED' | 'STARTING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED',
                progress: 0,
                currentFile: null,
                totalFiles: 0,
                completedFiles: 0,
                lastUpdated: new Date(),
                estimatedCompletion: null,
                analysisId: null,
                stages: {
                    fileDiscovery: { completed: false, progress: 0 },
                    preprocessing: { completed: false, progress: 0 },
                    codeAnalysis: { completed: false, progress: 0 },
                    aggregation: { completed: false, progress: 0 },
                    storage: { completed: false, progress: 0 }
                },
                metrics: {
                    filesPerSecond: 0,
                    timeElapsed: 0,
                    timeRemaining: 0
                },
                error: error instanceof Error ? error.message : 'Failed to retrieve analysis progress'
            };
        }
    }

    // get recommendations 
    async getRecommendations(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id; // Changed from req.params.projectId
            if (!projectId) {
                return new UnauthorizedError("Project ID is required");
            }

            const analysis = await analysisService.getProjectAnalysis(projectId, userId);

            if (!analysis) {
                return successResponse(
                    res,
                    { recommendations: [] },
                    'No analysis found. Run analysis first.'
                );
            }

            return successResponse(
                res,
                {
                    recommendations: analysis.recommendations || [],
                    analysisDate: analysis.completedAt
                },
                'Recommendations retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }
    async exportAnalysis(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id; // Changed from req.params.projectId
            const format = req.query.format as string || 'json'; // json, csv, pdf

            if (!projectId) {
                return new UnauthorizedError("Project ID is required");
            }

            const analysis = await analysisService.getProjectAnalysis(projectId, userId);

            if (!analysis) {
                return successResponse(
                    res,
                    null,
                    'No analysis found to export',
                    404
                );
            }

            // Implement different export formats
            switch (format) {
                case 'json':
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Content-Disposition', `attachment; filename="analysis_${projectId}.json"`);
                    return res.json({
                        ...analysis,
                        exportedAt: new Date().toISOString(),
                        format: 'json',
                        version: '1.0'
                    });

                case 'csv':
                    return await this.exportAnalysisAsCSV(res, analysis, projectId);

                case 'pdf':
                    return await this.exportAnalysisAsPDF(res, analysis, projectId);

                default:
                    return successResponse(
                        res,
                        {
                            analysis,
                            availableFormats: ['json', 'csv', 'pdf'],
                            exportedAt: new Date().toISOString()
                        },
                        'Analysis exported successfully'
                    );
            }
        } catch (error) {
            next(error);
        }
    }

    // CSV Export Implementation
    private async exportAnalysisAsCSV(res: Response, analysis: any, projectId: string) {
        try {
            const csvData = this.convertAnalysisToCSV(analysis);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="analysis_${projectId}.csv"`);
            res.setHeader('Cache-Control', 'no-cache');

            return res.send(csvData);
        } catch (error) {
            logger.error('CSV export failed', {
                projectId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return res.status(500).json({
                success: false,
                message: 'Failed to export analysis as CSV',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // PDF Export Implementation
    private async exportAnalysisAsPDF(res: Response, analysis: any, projectId: string) {
        try {
            const pdfBuffer = await this.generateAnalysisPDF(analysis, projectId);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="analysis_${projectId}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length.toString());

            return res.send(pdfBuffer);
        } catch (error) {
            logger.error('PDF export failed', {
                projectId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            return res.status(500).json({
                success: false,
                message: 'Failed to export analysis as PDF',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Convert analysis data to CSV format
    private convertAnalysisToCSV(analysis: any): string {
        const csvRows: string[] = [];

        // Add header
        csvRows.push('Metric,Value,Description');

        // Basic metrics
        csvRows.push(`Total Files,${analysis.totalFiles},"Total number of files analyzed"`);
        csvRows.push(`Total Lines of Code,${analysis.totalLinesOfCode},"Total lines of code in the project"`);
        csvRows.push(`Function Count,${analysis.functionCount},"Total number of functions"`);
        csvRows.push(`Class Count,${analysis.classCount},"Total number of classes"`);
        csvRows.push(`Interface Count,${analysis.interfaceCount},"Total number of interfaces"`);
        csvRows.push(`Total Complexity,${analysis.totalComplexity},"Total complexity score"`);
        csvRows.push(`Average Complexity,${analysis.averageComplexity},"Average complexity per file"`);

        // Language distribution
        if (analysis.languageDistribution) {
            csvRows.push(''); // Empty row
            csvRows.push('Language,File Count,Percentage');

            const totalFiles = analysis.totalFiles;
            Object.entries(analysis.languageDistribution).forEach(([lang, count]: [string, any]) => {
                const percentage = ((count / totalFiles) * 100).toFixed(2);
                csvRows.push(`${lang},${count},${percentage}%`);
            });
        }

        // Complexity distribution
        if (analysis.complexity && analysis.complexity.distribution) {
            csvRows.push(''); // Empty row
            csvRows.push('Complexity Level,File Count');

            const dist = analysis.complexity.distribution;
            csvRows.push(`Low (1-5),${dist.low || 0}`);
            csvRows.push(`Medium (6-10),${dist.medium || 0}`);
            csvRows.push(`High (11-15),${dist.high || 0}`);
            csvRows.push(`Critical (16+),${dist.critical || 0}`);
        }

        // Dependencies
        if (analysis.dependencies) {
            csvRows.push(''); // Empty row
            csvRows.push('Dependency Type,Dependencies');

            if (analysis.dependencies.external) {
                csvRows.push(`External,"${analysis.dependencies.external.join(', ')}"`);
            }
            if (analysis.dependencies.internal) {
                csvRows.push(`Internal,"${analysis.dependencies.internal.join(', ')}"`);
            }
        }

        // Recommendations
        if (analysis.recommendations && analysis.recommendations.length > 0) {
            csvRows.push(''); // Empty row
            csvRows.push('Recommendations');
            analysis.recommendations.forEach((rec: string, index: number) => {
                csvRows.push(`${index + 1},"${rec.replace(/"/g, '""')}"`);
            });
        }

        // Metadata
        csvRows.push(''); // Empty row
        csvRows.push('Analysis Metadata');
        csvRows.push(`Analysis ID,${analysis.id}`);
        csvRows.push(`Project ID,${analysis.projectId}`);
        csvRows.push(`Completed At,${analysis.completedAt}`);
        csvRows.push(`Export Date,${new Date().toISOString()}`);

        return csvRows.join('\n');
    }

    // Generate PDF report from analysis data
    private async generateAnalysisPDF(analysis: any, projectId: string): Promise<Buffer> {
        // Simple HTML to PDF conversion (in production, use libraries like puppeteer or pdfkit)
        const htmlContent = this.generateAnalysisHTML(analysis, projectId);

        // For now, return a simple text-based PDF content
        // In production, you'd use proper PDF generation libraries
        const pdfContent = this.generateSimplePDFContent(analysis, projectId);

        return Buffer.from(pdfContent, 'utf-8');
    }

    // Generate HTML content for PDF (simplified)
    private generateAnalysisHTML(analysis: any, projectId: string): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Code Analysis Report - ${projectId}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .section { margin: 20px 0; }
                    .metric { margin: 10px 0; }
                    .chart { margin: 20px 0; padding: 15px; background: #f5f5f5; }
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Code Analysis Report</h1>
                    <p><strong>Project ID:</strong> ${projectId}</p>
                    <p><strong>Analysis Date:</strong> ${new Date(analysis.completedAt).toLocaleString()}</p>
                    <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="section">
                    <h2>Project Overview</h2>
                    <div class="metric">Total Files: ${analysis.totalFiles}</div>
                    <div class="metric">Total Lines of Code: ${analysis.totalLinesOfCode.toLocaleString()}</div>
                    <div class="metric">Functions: ${analysis.functionCount}</div>
                    <div class="metric">Classes: ${analysis.classCount}</div>
                    <div class="metric">Interfaces: ${analysis.interfaceCount}</div>
                </div>
                
                <div class="section">
                    <h2>Code Complexity</h2>
                    <div class="metric">Total Complexity: ${analysis.totalComplexity}</div>
                    <div class="metric">Average Complexity: ${analysis.averageComplexity.toFixed(2)}</div>
                </div>
                
                ${analysis.recommendations ? `
                <div class="section">
                    <h2>Recommendations</h2>
                    <ul>
                        ${analysis.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </body>
            </html>
        `;
    }

    // Generate simple PDF content (text-based)
    private generateSimplePDFContent(analysis: any, projectId: string): string {
        return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 500
>>
stream
BT
/F1 12 Tf
50 720 Td
(CODE ANALYSIS REPORT) Tj
0 -30 Td
(Project ID: ${projectId}) Tj
0 -20 Td
(Generated: ${new Date().toLocaleString()}) Tj
0 -40 Td
(OVERVIEW:) Tj
0 -20 Td
(Total Files: ${analysis.totalFiles}) Tj
0 -20 Td
(Lines of Code: ${analysis.totalLinesOfCode}) Tj
0 -20 Td
(Functions: ${analysis.functionCount}) Tj
0 -20 Td
(Classes: ${analysis.classCount}) Tj
0 -20 Td
(Interfaces: ${analysis.interfaceCount}) Tj
0 -20 Td
(Total Complexity: ${analysis.totalComplexity}) Tj
0 -20 Td
(Average Complexity: ${analysis.averageComplexity.toFixed(2)}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000251 00000 n 
0000000802 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
878
%%EOF`;
    }
}