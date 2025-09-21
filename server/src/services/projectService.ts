import type { Prisma } from "../generated/prisma";
import prisma from "../config/db";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "../errors";
import type {
    CreateProjectRequest,
    PaginationOptions,
    Project,
    UpdateProjectRequest,
} from "../types";
import { logger } from "../utils";

export class ProjectService {
    // create a new project
    async createProject(
        userId: string,
        projectData: CreateProjectRequest
    ): Promise<Project> {
        try {
            logger.info(`Creating project for user: ${userId}`);

            // check if project with the same name already exists
            const existingProject = await prisma.project.findFirst({
                where: { name: projectData.name, userId, status: { not: "DELETED" } },
            });
            if (existingProject) {
                throw new ConflictError("Project with the same name already exists");
            }
            // create new project
            const createData: any = {
                name: projectData.name,
                language: projectData.language as any,
                visibility: projectData.visibility || "PRIVATE",
                userId,
                settings: {
                    autoAnalysis: true,
                    diagramStyle: "MODERN",
                    exportFormats: ["png", "svg"],
                },
            };

            // Only include optional fields if they have actual values
            if (projectData.description !== undefined) {
                createData.description = projectData.description;
            }

            if (projectData.framework !== undefined) {
                createData.framework = projectData.framework;
            }

            const newProject = await prisma.project.create({
                data: createData,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true,
                        },
                    },
                    _count: {
                        select: {
                            codeFiles: true,
                            diagrams: true,
                        },
                    },
                },
            });
            logger.info(
                `Project created successfully: ${newProject.id} for user: ${userId}`
            );
            return newProject;
        } catch (error) {
            if (error instanceof ConflictError) {
                throw error;
            }

            logger.error("Project creation failed", {
                userId,
                projectName: projectData.name,
                error: error instanceof Error ? error.message : "Unknown error",
            });

            throw new BadRequestError("Project creation failed");
        }
    }

    // get all projects for a user
    async getUserProjects(
        userId: string,
        options: PaginationOptions & { status: string; search: string }
    ): Promise<{
        items: Project[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }> {
        try {
            logger.info("Get user projects", { userId, ...options });
            const {
                page,
                limit,
                sort = "createdAt",
                order = "desc",
                status,
                search,
            } = options;
            const skip = (page - 1) * limit;

            const where: Prisma.ProjectWhereInput = {
                userId, // filter by id
                status: status ? (status as any) : { not: "DELETED" }, // exclude deleted projects
                ...(search && {
                    OR: [
                        // search in name and description
                        { name: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                    ],
                }),
            };

            // get projects
            const [projects, total] = await Promise.all([
                prisma.project.findMany({
                    where,
                    orderBy: { [sort]: order },
                    skip,
                    take: limit,
                    include: {
                        _count: {
                            select: {
                                codeFiles: true,
                                diagrams: { where: { status: "COMPLETED" } },
                                analyses: true,
                            },
                        },
                    },
                }),
                prisma.project.count({ where }),
            ]);

            const totalPages = Math.ceil(total / limit);

            const pagination = {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            };

            return {
                items: projects,
                pagination,
            };
        } catch (error) {
            logger.error("Failed to get user projects", {
                userId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new BadRequestError("Failed to get projects");
        }
    }

    // get project by id
    async getProjectById(
        userId: string,
        projectId: string
    ): Promise<
        Project & {
            codeFiles?: any[];
            latestAnalysis?: any[];
            recentDiagrams?: any[];
        }
    > {
        try {
            const project = await prisma.project.findUnique({
                where: { id: projectId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                    codeFiles: {
                        select: {
                            id: true,
                            name: true,
                            path: true,
                            language: true,
                            size: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: "desc" },
                    },
                    analyses: {
                        orderBy: { completedAt: "desc" },
                        take: 1,
                    },
                    diagrams: {
                        where: { status: "COMPLETED" },
                        orderBy: { createdAt: "desc" },
                        take: 5,
                        select: {
                            id: true,
                            title: true,
                            type: true,
                            createdAt: true,
                            imageUrl: true,
                            style: true,
                        },
                    },
                    _count: {
                        select: {
                            codeFiles: true,
                            diagrams: true,
                            analyses: true,
                        },
                    },
                },
            });
            if (!project) {
                throw new BadRequestError("Project not found");
            }
            // check if the user has access to the project
            if (project.userId !== userId && project.visibility === "PRIVATE") {
                throw new UnauthorizedError("Access denied to this project");
            }
            // check if the project is deleted
            if (project.status === "DELETED") {
                throw new NotFoundError("Project not found");
            }
            logger.info(`Project retrieved: ${project.id} for user: ${userId}`);
            return {
                ...project,
                latestAnalysis: project.analyses,
                recentDiagrams: project.diagrams,
            };
        } catch (error) {
            if (
                error instanceof BadRequestError ||
                error instanceof UnauthorizedError ||
                error instanceof NotFoundError
            ) {
                throw error;
            }
            logger.error("Failed to get project by id", {
                userId,
                projectId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new BadRequestError("Failed to get project");
        }
    }

    // update project
    async updateProject(
        projectId: string,
        userId: string,
        updates: UpdateProjectRequest
    ): Promise<Project> {
        try {
            logger.info(`Updating project: ${projectId} for user: ${userId}`);

            const existingProject = await prisma.project.findUnique({
                where: { id: projectId },
            });

            // check if project exists
            if (!existingProject) {
                throw new NotFoundError("Project not found");
            }

            // check if the user owns the project
            if (existingProject.userId !== userId) {
                throw new UnauthorizedError(
                    "You do not have permission to update this project"
                );
            }
            if (existingProject.status === "DELETED") {
                throw new NotFoundError("Project not found");
            }

            // check if updating name to an existing project name
            if (updates.name && updates.name !== existingProject.name) {
                const nameConflict = await prisma.project.findFirst({
                    where: {
                        name: updates.name,
                        userId,
                        id: { not: projectId }, // exclude current project
                        status: { not: "DELETED" },
                    },
                });
                if (nameConflict) {
                    throw new ConflictError("Project with this name already exists");
                }
            }
            // update project
            const updateData: any = {
                ...updates,
                updatedAt: new Date(),
            };

            // Convert settings to proper JSON format if present
            if (updates.settings) {
                updateData.settings = updates.settings as any;
            }

            const updatedProject = await prisma.project.update({
                where: { id: projectId },
                data: updateData,
                include: {
                    _count: {
                        select: {
                            codeFiles: true,
                            diagrams: true,
                        },
                    },
                },
            });

            logger.info(
                `Project updated successfully: ${projectId} for user: ${userId}`
            );
            return updatedProject;
        } catch (error) {
            if (
                error instanceof NotFoundError ||
                error instanceof UnauthorizedError ||
                error instanceof ConflictError
            ) {
                throw error;
            }
            logger.error("Failed to update project", {
                userId,
                projectId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new BadRequestError("Failed to update project");
        }
    }

    // soft delete project
    async deleteProject(projectId: string, userId: string): Promise<void> {
        try {
            logger.info(`Deleting project attempt: ${projectId} for user: ${userId}`);

            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });

            // check if project exists
            if (!project) {
                throw new NotFoundError("Project not found");
            }

            // check if the user owns the project
            if (project.userId !== userId) {
                throw new UnauthorizedError(
                    "You do not have permission to delete this project"
                );
            }
            if (project.status === "DELETED") {
                throw new NotFoundError("Project not found");
            }

            await prisma.project.update({
                where: { id: projectId },
                data: { status: "DELETED", updatedAt: new Date() },
            });

            logger.info(`Project deleted successfully: ${projectId} for user: ${userId}`);
        } catch (error) {
            if (
                error instanceof NotFoundError ||
                error instanceof UnauthorizedError
            ) {
                throw error;
            }
            logger.error("Failed to delete project", {
                userId,
                projectId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new BadRequestError("Failed to delete project");
        }
    }

    // archive/unarchive project
    async toggleArchiveProject(projectId: string, userId: string): Promise<Project> {
        try {
            logger.info(`Toggling archive for project: ${projectId} by user: ${userId}`);
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });
            // check if project exists & ownership & not deleted
            if (!project) {
                throw new NotFoundError("Project not found");
            }
            if (project.userId !== userId) {
                throw new UnauthorizedError("You do not have permission to archive/unarchive this project");
            }
            if (project.status === "DELETED") {
                throw new NotFoundError("Project not found");
            }
            const newStatus = project.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';

            // update project status 
            const updatedProject = await prisma.project.update({
                where: { id: projectId },
                data: { status: newStatus, updatedAt: new Date() },
            });
            logger.info(`Project archive status updated successfully: ${projectId} for user: ${userId} to ${newStatus}`);
            return updatedProject;
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
                throw error;
            }
            logger.error("Failed to toggle archive project", {
                userId,
                projectId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new BadRequestError("Failed to toggle archive project");
        }
    }

    // get project statistics
    async getProjectStats(userId: string, projectId: string): Promise<{
        totalFiles: number;
        totalSize: number;
        languageDistribution: Record<string, number>;
        diagramCount: number;
        lastAnalysis: Date | null;
    }> {
        try {
            // ownership
            const project = await this.getProjectById(userId, projectId);
            // get statistics
            const files = await prisma.codeFile.findMany({
                where: { projectId },
                select: { language: true, size: true },
            });
            const [diagramCount, lastAnalysis] = await Promise.all([
                prisma.diagram.count({ where: { projectId, status: "COMPLETED" } }),
                prisma.analysis.findFirst({
                    where: { projectId },
                    select: { createdAt: true },
                    orderBy: { createdAt: "desc" },
                }),
            ]);
            // statistics
            const totalFiles = files.length;
            const totalSize = files.reduce((sum, file) => sum + file.size, 0);
            const languageDistribution: Record<string, number> = {};
            files.forEach(file => {
                languageDistribution[file.language] = (languageDistribution[file.language] || 0) + 1;
            });
            return {
                totalFiles,
                totalSize,
                languageDistribution,
                diagramCount,
                lastAnalysis: lastAnalysis?.createdAt || null,
            };
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
                throw error;
            }
            logger.error("Failed to get project statistics", {
                userId,
                projectId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new BadRequestError("Failed to get project statistics");
        }
    }
}