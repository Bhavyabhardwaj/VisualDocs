import type { NextFunction, Request, Response } from "express";
import { projectService } from "../services";
import type { CreateProjectRequest, PaginationOptions } from "../types";
import { paginatedResponse, successResponse, logger } from "../utils";
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import prisma from "../config/db";

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

            // Process and store each file
            const processedFiles = await Promise.all(
                uploadedFiles.map(file => this.processUploadedFile(file, projectId))
            );

            // Filter out failed uploads
            const successfulUploads = processedFiles.filter(file => file !== null);
            const failedUploads = processedFiles.length - successfulUploads.length;

            logger.info('Files uploaded to project', {
                projectId,
                userId,
                totalFiles: uploadedFiles.length,
                successful: successfulUploads.length,
                failed: failedUploads
            });

            return successResponse(
                res,
                {
                    uploadedFiles: successfulUploads,
                    totalUploaded: successfulUploads.length,
                    totalFailed: failedUploads,
                    projectId
                },
                `${successfulUploads.length} files uploaded successfully${failedUploads > 0 ? `, ${failedUploads} failed` : ''}`
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
            // Read file content
            const content = await fs.readFile(file.path, 'utf-8');

            // Generate file hash for deduplication
            const hash = crypto.createHash('sha256').update(content).digest('hex');

            // Detect programming language from file extension
            const language = this.detectLanguage(file.originalname);

            // Check if file already exists in project (by hash)
            const existingFile = await prisma.codeFile.findFirst({
                where: {
                    projectId,
                    hash
                }
            });

            if (existingFile) {
                logger.info('Duplicate file detected, skipping', {
                    fileName: file.originalname,
                    hash,
                    existingFileId: existingFile.id
                });

                // Clean up uploaded file
                await fs.unlink(file.path).catch(() => { });

                return {
                    id: existingFile.id,
                    name: existingFile.name,
                    status: 'duplicate',
                    message: 'File already exists in project'
                };
            }

            // Create code file record in database
            const codeFile = await prisma.codeFile.create({
                data: {
                    name: file.originalname,
                    path: this.generateFilePath(file.originalname),
                    content,
                    language,
                    size: file.size,
                    hash,
                    encoding: 'utf-8',
                    projectId,
                    metadata: {
                        originalName: file.originalname,
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

            // Clean up uploaded file from temp location
            await fs.unlink(file.path).catch(() => { });

            logger.info('File processed successfully', {
                fileId: codeFile.id,
                fileName: file.originalname,
                language,
                size: file.size
            });

            return {
                ...codeFile,
                status: 'success',
                message: 'File uploaded and processed successfully'
            };

        } catch (error) {
            logger.error('Failed to process uploaded file', {
                fileName: file.originalname,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            // Clean up uploaded file on error
            await fs.unlink(file.path).catch(() => { });

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
    private generateFilePath(filename: string): string {
        const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        return `/${sanitizedName}`;
    }
    async getProjectFiles(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const projectId = req.params.id as string;

            // Verify project access
            const project = await projectService.getProjectById(projectId, userId);

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
            const { githubService } = await import('../services');

            const { owner, repo, repository } = await githubService.validateRepository(githubUrl);

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
            next(error);
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