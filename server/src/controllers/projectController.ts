import type { NextFunction, Request, Response } from "express";
import { projectService } from "../services";
import type { CreateProjectRequest, PaginationOptions } from "../types";
import { paginatedResponse, successResponse, logger } from "../utils";
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import pLimit from 'p-limit';
import prisma from "../config/db";

const FILE_PROCESSING_CONCURRENCY = Number(process.env.FILE_PROCESSING_CONCURRENCY || 10);
const UPLOAD_RESPONSE_FILE_LIMIT = Number(process.env.UPLOAD_RESPONSE_MAX_FILES || 2000);

type UploadedFileResult = {
    id: string;
    name: string;
    path: string;
    language: string | null;
    size: number;
    createdAt: Date;
    status: 'created' | 'updated' | 'skipped';
    message: string;
};

// Extend Express Request interface to include multer files
declare global {
    namespace Express {
        namespace Multer {
            interface File {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                destination: string;
                filename: string;
                path: string;
                buffer: Buffer;
            }
        }
        interface Request {
            files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
            file?: Multer.File;
        }
    }
}

export class ProjectController {
    constructor() {
        // Bind methods to preserve 'this' context
        this.createProject = this.createProject.bind(this);
        this.getProjects = this.getProjects.bind(this);
        this.getProject = this.getProject.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.toggleArchive = this.toggleArchive.bind(this);
        this.getProjectStatistics = this.getProjectStatistics.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.getProjectFiles = this.getProjectFiles.bind(this);
        this.getCollaborators = this.getCollaborators.bind(this);
        this.importFromGitHub = this.importFromGitHub.bind(this);
        this.validateGitHubRepository = this.validateGitHubRepository.bind(this);
        this.getGitHubRepositoryInfo = this.getGitHubRepositoryInfo.bind(this);
    }

    // create new project
    async createProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;    // from auth middleware
            const projectData: CreateProjectRequest = req.body;
            const project = await projectService.createProject(userId, projectData);

            return successResponse(
                res,
                { project },
                'Project created successfully',
                201
            );
        } catch (error) {
            next(error);
        }
    }
    // get projects 
    async getProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;    // from auth middleware

            // Enhanced parameter validation with bounds checking
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10)); // Cap at 100 items
            const sort = req.query.sort as string || 'createdAt';
            const order = (req.query.order === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
            const status = req.query.status as string;
            const search = req.query.search as string;

            const options: PaginationOptions & { status: string; search: string } = {
                page,
                limit,
                sort,
                order,
                status,
                search
            };
            const result = await projectService.getUserProjects(userId, options);  // fetch projects for user

            return paginatedResponse(
                res,
                result.items,
                result.pagination,
                'Projects retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }
    // get project by id
    async getProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;

            // Basic validation for projectId
            if (!projectId || typeof projectId !== 'string') {
                return successResponse(
                    res,
                    null,
                    'Invalid project ID',
                    400
                );
            }

            // Fixed parameter order: userId first, then projectId
            const project = await projectService.getProjectById(userId, projectId);

            return successResponse(
                res,
                { project },
                'Project retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }

    // update project
    async updateProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;
            const updateData = req.body;

            const updatedProject = await projectService.updateProject(projectId, userId, updateData);

            return successResponse(
                res,
                { project: updatedProject },
                'Project updated successfully'
            );
        } catch (error) {
            next(error);
        }
    }

    // delete project
    async deleteProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;

            // Basic validation for projectId
            if (!projectId || typeof projectId !== 'string') {
                return successResponse(
                    res,
                    null,
                    'Invalid project ID',
                    400
                );
            }

            await projectService.deleteProject(userId, projectId);

            return successResponse(
                res,
                null,
                'Project deleted successfully'
            );
        } catch (error) {
            next(error);
        }
    }

    // unarchive/archive project
    async toggleArchive(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;

            const project = await projectService.toggleArchiveProject(projectId, userId);

            const action = project.status === 'ARCHIVED' ? 'archived' : 'unarchived';

            return successResponse(
                res,
                { project },
                `Project ${action} successfully`
            );
        } catch (error) {
            next(error);
        }
    }

    // get project statics
    async getProjectStatistics(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;

            const stats = await projectService.getProjectStats(projectId, userId);

            return successResponse(
                res,
                { stats },
                'Project statistics retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }

    async uploadFiles(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;

            // Verify project access
            await projectService.getProjectById(userId, projectId);

            // Get uploaded files from multer middleware
            const uploadedFiles = (req.files as Express.Multer.File[]) || [];

            if (!uploadedFiles.length) {
                return successResponse(
                    res,
                    null,
                    'No files were uploaded',
                    400
                );
            }

            const uploadStartedAt = Date.now();
            const limit = pLimit(FILE_PROCESSING_CONCURRENCY);

            const processedFiles = await Promise.all(
                uploadedFiles.map(file => limit(() => this.processUploadedFile(file, projectId)))
            );

            const successfulUploads = processedFiles.filter((file): file is UploadedFileResult => file !== null);
            const failedUploads = uploadedFiles.length - successfulUploads.length;

            const summary = successfulUploads.reduce(
                (acc, file) => {
                    acc[file.status] = (acc[file.status] || 0) + 1;
                    return acc;
                },
                { created: 0, updated: 0, skipped: 0 } as Record<'created' | 'updated' | 'skipped', number>
            );

            const responseFiles = successfulUploads.slice(0, UPLOAD_RESPONSE_FILE_LIMIT);
            const durationMs = Date.now() - uploadStartedAt;

            const messageParts: string[] = [];
            if (summary.created) messageParts.push(`${summary.created} new`);
            if (summary.updated) messageParts.push(`${summary.updated} updated`);
            if (summary.skipped) messageParts.push(`${summary.skipped} skipped`);
            if (failedUploads) messageParts.push(`${failedUploads} failed`);
            const resultMessage = messageParts.length
                ? `${messageParts.join(', ')} file${successfulUploads.length === 1 ? '' : 's'} processed`
                : 'No files required changes';

            logger.info('Files uploaded to project', {
                projectId,
                userId,
                totalFiles: uploadedFiles.length,
                successful: successfulUploads.length,
                failed: failedUploads,
                summary,
                durationMs
            });

            return successResponse(
                res,
                {
                    uploadedFiles: responseFiles,
                    totalUploaded: summary.created + summary.updated,
                    totalUpdated: summary.updated,
                    totalSkipped: summary.skipped,
                    totalFailed: failedUploads,
                    totalProcessed: successfulUploads.length,
                    projectId,
                    processingTimeMs: durationMs,
                    responseTruncated: successfulUploads.length > responseFiles.length
                },
                resultMessage
            );
        } catch (error) {
            logger.error('File upload failed', {
                projectId: req.params.id,
                userId: req.user?.userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            next(error);
        }
    }

    // Helper method to process individual uploaded files
    private async processUploadedFile(file: Express.Multer.File, projectId: string) {
        try {
            const relativePath = this.extractRelativePath(file);
            const normalizedPath = this.generateFilePath(relativePath || file.originalname);

            // Read file content
            const content = await fs.readFile(file.path, 'utf-8');

            // Generate file hash for change detection
            const hash = crypto.createHash('sha256').update(content).digest('hex');

            // Detect programming language from file extension
            const language = this.detectLanguage(file.originalname);

            const existingFile = await prisma.codeFile.findFirst({
                where: {
                    projectId,
                    path: normalizedPath
                }
            });

            if (existingFile) {
                if (existingFile.hash === hash) {
                    logger.info('Existing file unchanged, skipping', {
                        fileName: file.originalname,
                        filePath: normalizedPath,
                        fileId: existingFile.id
                    });

                    await this.removeTempFile(file.path);

                    return {
                        id: existingFile.id,
                        name: existingFile.name,
                        path: existingFile.path,
                        language: existingFile.language,
                        size: existingFile.size,
                        createdAt: existingFile.createdAt,
                        status: 'skipped' as const,
                        message: 'File already up to date'
                    };
                }

                const updatedFile = await prisma.codeFile.update({
                    where: { id: existingFile.id },
                    data: {
                        content,
                        language,
                        size: file.size,
                        hash,
                        metadata: {
                            ...(existingFile.metadata as Record<string, unknown> || {}),
                            originalName: file.originalname,
                            relativePath: normalizedPath,
                            mimeType: file.mimetype,
                            uploadedAt: new Date().toISOString(),
                            fileExtension: path.extname(file.originalname)
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        path: true,
                        language: true,
                        size: true,
                        createdAt: true
                    }
                });

                await this.removeTempFile(file.path);

                return {
                    ...updatedFile,
                    status: 'updated' as const,
                    message: 'File updated successfully'
                };
            }

            // Create code file record in database
            const codeFile = await prisma.codeFile.create({
                data: {
                    name: path.basename(normalizedPath),
                    path: normalizedPath,
                    content,
                    language,
                    size: file.size,
                    hash,
                    encoding: 'utf-8',
                    projectId,
                    metadata: {
                        originalName: file.originalname,
                        relativePath: normalizedPath,
                        mimeType: file.mimetype,
                        uploadedAt: new Date().toISOString(),
                        fileExtension: path.extname(file.originalname)
                    }
                },
                select: {
                    id: true,
                    name: true,
                    path: true,
                    language: true,
                    size: true,
                    createdAt: true
                }
            });

            await this.removeTempFile(file.path);

            logger.info('File processed successfully', {
                fileId: codeFile.id,
                fileName: file.originalname,
                filePath: normalizedPath,
                language,
                size: file.size
            });

            return {
                ...codeFile,
                status: 'created' as const,
                message: 'File uploaded and processed successfully'
            };

        } catch (error) {
            logger.error('Failed to process uploaded file', {
                fileName: file.originalname,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            await this.removeTempFile(file.path);

            return null;
        }
    }

    // Helper method to detect programming language from file extension
    private detectLanguage(filename: string): string {
        const ext = path.extname(filename).toLowerCase();

        const languageMap: Record<string, string> = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.py': 'python',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c',
            '.cs': 'csharp',
            '.php': 'php',
            '.rb': 'ruby',
            '.go': 'go',
            '.rs': 'rust',
            '.kt': 'kotlin',
            '.swift': 'swift',
            '.dart': 'dart',
            '.scala': 'scala',
            '.sh': 'shell',
            '.bash': 'shell',
            '.zsh': 'shell',
            '.fish': 'shell',
            '.ps1': 'powershell',
            '.sql': 'sql',
            '.html': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.sass': 'sass',
            '.less': 'less',
            '.xml': 'xml',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml',
            '.toml': 'toml',
            '.ini': 'ini',
            '.cfg': 'config',
            '.conf': 'config',
            '.md': 'markdown',
            '.txt': 'text',
            '.log': 'log'
        };

        return languageMap[ext] || 'unknown';
    }

    // Helper method to generate consistent file paths
    private generateFilePath(rawPath: string): string {
        const normalized = (rawPath || '').replace(/\\/g, '/');
        const parts = normalized
            .split('/')
            .map(part => part.trim())
            .filter(part => part.length > 0 && part !== '.' && part !== '..');

        if (!parts.length) {
            return `/${this.sanitizePathSegment(rawPath || 'file')}`;
        }

        const sanitized = parts.map(part => this.sanitizePathSegment(part));
        return `/${sanitized.join('/')}`;
    }

    private sanitizePathSegment(segment: string): string {
        return segment.replace(/[^a-zA-Z0-9._-]/g, '_') || 'file';
    }

    private extractRelativePath(file: Express.Multer.File): string | undefined {
        if (!file?.originalname) {
            return undefined;
        }
        return file.originalname.replace(/\\/g, '/');
    }

    private async removeTempFile(filePath: string) {
        if (!filePath) return;
        await fs.unlink(filePath).catch(() => undefined);
    }
    async getProjectFiles(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;

            // Verify project access (correct parameter order: userId, projectId)
            const project = await projectService.getProjectById(userId, projectId);

            // Return files from project data (included from getProjectById)
            const files = (project as any).codeFiles || [];

            return successResponse(
                res,
                { files },
                'Project files retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }
    async getCollaborators(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;

            // Verify project access
            const project = await projectService.getProjectById(userId, projectId) as any;

            // Get active sessions for this project with collaborators
            const activeSessions = await prisma.session.findMany({
                where: {
                    projectId,
                    isActive: true,
                    lastActivity: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true
                        }
                    }
                },
                orderBy: {
                    lastActivity: 'desc'
                }
            });

            // Process collaborators from sessions
            const collaboratorMap = new Map();
            
            // Get project owner details
            const projectOwner = {
                id: project.user?.id || project.userId,
                name: project.user?.name || 'Project Owner',
                email: project.user?.email || '',
                avatar: project.user?.avatar || '',
                role: 'owner' as const,
                isActive: true,
                lastActivity: project.updatedAt,
                permissions: ['read', 'write', 'admin'],
                joinedAt: project.createdAt
            };

            // Add project owner
            collaboratorMap.set(projectOwner.id, projectOwner);

            // Process session collaborators
            for (const session of activeSessions) {
                const sessionUser = {
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    avatar: session.user.avatar || '',
                    role: session.user.id === project.userId ? 'owner' as const : 'collaborator' as const,
                    isActive: session.isActive,
                    lastActivity: session.lastActivity,
                    permissions: session.user.id === project.userId ? 
                        ['read', 'write', 'admin'] : 
                        ['read', 'write'],
                    joinedAt: session.createdAt,
                    sessionId: session.id
                };

                collaboratorMap.set(sessionUser.id, sessionUser);

                // Add collaborators from session.collaborators JSON
                try {
                    const sessionCollaborators = Array.isArray(session.collaborators) 
                        ? session.collaborators 
                        : JSON.parse(session.collaborators as string || '[]');
                    
                    for (const collab of sessionCollaborators) {
                        if (collab.userId && !collaboratorMap.has(collab.userId)) {
                            // Fetch user details for session collaborators
                            const user = await prisma.user.findUnique({
                                where: { id: collab.userId },
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    avatar: true
                                }
                            });

                            if (user) {
                                collaboratorMap.set(user.id, {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    avatar: user.avatar || '',
                                    role: 'collaborator' as const,
                                    isActive: collab.isActive || false,
                                    lastActivity: new Date(collab.lastActivity || session.lastActivity),
                                    permissions: collab.permissions || ['read'],
                                    joinedAt: new Date(collab.joinedAt || session.createdAt),
                                    sessionId: session.id,
                                    cursor: collab.cursor,
                                    currentFile: collab.currentFile
                                });
                            }
                        }
                    }
                } catch (error) {
                    logger.warn('Failed to parse session collaborators', {
                        sessionId: session.id,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }

            // Convert map to array and sort by role and activity
            const collaborators = Array.from(collaboratorMap.values()).sort((a, b) => {
                // Sort by role (owner first), then by last activity
                if (a.role === 'owner' && b.role !== 'owner') return -1;
                if (b.role === 'owner' && a.role !== 'owner') return 1;
                return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
            });

            // Generate collaboration statistics
            const stats = {
                total: collaborators.length,
                active: collaborators.filter(c => c.isActive).length,
                online: collaborators.filter(c => 
                    c.lastActivity && 
                    new Date(c.lastActivity).getTime() > Date.now() - 5 * 60 * 1000 // Last 5 minutes
                ).length,
                owners: collaborators.filter(c => c.role === 'owner').length,
                collaborators: collaborators.filter(c => c.role === 'collaborator').length
            };

            logger.info('Collaborators retrieved for project', {
                projectId,
                userId,
                totalCollaborators: stats.total,
                activeCollaborators: stats.active
            });

            return successResponse(
                res,
                {
                    collaborators,
                    stats,
                    projectInfo: {
                        id: project.id,
                        name: project.name,
                        visibility: project.visibility,
                        owner: projectOwner
                    }
                },
                'Collaborators retrieved successfully'
            );
        } catch (error) {
            logger.error('Failed to get collaborators', {
                projectId: req.params.id,
                userId: req.user?.userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            next(error);
        }
    }

    // GitHub repository import
    async importFromGitHub(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const importRequest = req.body;

            logger.info('GitHub import request received', {
                userId,
                githubUrl: importRequest.githubUrl,
                branch: importRequest.branch
            });

            const result = await projectService.importFromGitHub(userId, importRequest);

            return successResponse(
                res,
                {
                    project: result.project,
                    importStats: {
                        importedFiles: result.importedFiles,
                        skippedFiles: result.skippedFiles,
                        totalSize: result.totalSize,
                        errors: result.errors
                    }
                },
                `Project imported successfully from GitHub. ${result.importedFiles} files imported, ${result.skippedFiles} files skipped.`,
                201
            );
        } catch (error) {
            logger.error('GitHub import failed', {
                userId: req.user?.userId,
                githubUrl: req.body?.githubUrl,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            next(error);
        }
    }

    // Validate GitHub repository (check if accessible)
    async validateGitHubRepository(req: Request, res: Response, next: NextFunction) {
        try {
            const { githubUrl } = req.body;
            
            if (!githubUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'GitHub URL is required'
                });
            }

            const { githubService } = await import('../services');

            const { owner, repo, repository } = await githubService.validateRepository(githubUrl);

            return successResponse(
                res,
                {
                    isValid: true,
                    repository: {
                        owner,
                        repo,
                        name: repository.name,
                        fullName: repository.fullName,
                        description: repository.description,
                        language: repository.language,
                        defaultBranch: repository.defaultBranch,
                        stars: repository.stargazersCount,
                        forks: repository.forksCount,
                        size: repository.size,
                        private: repository.private,
                        archived: repository.archived,
                        lastUpdated: repository.updatedAt
                    }
                },
                'Repository validated successfully'
            );
        } catch (error) {
            // Return validation failure instead of throwing
            logger.error('GitHub validation failed:', error);
            return successResponse(
                res,
                {
                    isValid: false,
                    message: error instanceof Error ? error.message : 'Repository validation failed'
                },
                'Validation completed'
            );
        }
    }

    // Get repository information and file preview
    async getGitHubRepositoryInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const { url, branch } = req.query as { url: string; branch?: string };
            const { githubService } = await import('../services');

            const { owner, repo, repository } = await githubService.validateRepository(url);
            const targetBranch = branch || repository.defaultBranch;
            
            // Get file tree preview (limit to 100 files for preview)
            const files = await githubService.getFileTree(
                owner,
                repo,
                targetBranch,
                false, // Don't include tests in preview
                undefined // Use default extensions
            );

            const filePreview = files.slice(0, 100).map(file => ({
                path: file.path,
                size: file.size,
                type: githubService.detectLanguageFromExtension(file.path)
            }));

            const frameworks = githubService.detectFrameworks(files);
            const languageStats = files.reduce((acc, file) => {
                const lang = githubService.detectLanguageFromExtension(file.path);
                acc[lang] = (acc[lang] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            return successResponse(
                res,
                {
                    repository: {
                        owner,
                        repo,
                        name: repository.name,
                        fullName: repository.fullName,
                        description: repository.description,
                        language: repository.language,
                        defaultBranch: repository.defaultBranch,
                        branch: targetBranch,
                        stars: repository.stargazersCount,
                        forks: repository.forksCount,
                        size: repository.size,
                        private: repository.private,
                        archived: repository.archived,
                        lastUpdated: repository.updatedAt
                    },
                    analysis: {
                        totalFiles: files.length,
                        filePreview,
                        detectedFrameworks: frameworks,
                        languageDistribution: languageStats,
                        estimatedImportTime: Math.ceil(files.length / 10) // seconds
                    }
                },
                'Repository information retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }
}