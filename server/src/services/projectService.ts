import type { Prisma } from "../generated/prisma";
import prisma from "../config/db";
import { BadRequestError, ConflictError } from "../errors";
import type { CreateProjectRequest, PaginationOptions, Project } from "../types";
import { logger } from "../utils";

export class projectService {
    // create a new project
    async createProject(userId: string, projectData: CreateProjectRequest): Promise<Project> {
        try {
            logger.info(`Creating project for user: ${userId}`);

            // check if project with the same name already exists
            const existingProject = await prisma.project.findFirst({ where: { name: projectData.name, userId, status: { not: 'DELETED' } } });
            if (existingProject) {
                throw new ConflictError('Project with the same name already exists');
            }
            // create new project
            const createData: any = {
                name: projectData.name,
                language: projectData.language as any,
                visibility: projectData.visibility || 'PRIVATE',
                userId,
                settings: {
                    autoAnalysis: true,
                    diagramStyle: 'MODERN',
                    exportFormats: ['png', 'svg'],
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
                            avatar: true
                        }
                    },
                    _count: {
                        select: {
                            codeFiles: true,
                            diagrams: true
                        }
                    }
                }
            });
            logger.info(`Project created successfully: ${newProject.id} for user: ${userId}`);
            return newProject;

        } catch (error) {
            if (error instanceof ConflictError) {
                throw error;
            }

            logger.error('Project creation failed', {
                userId,
                projectName: projectData.name,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw new BadRequestError('Project creation failed');
        }
    }

    // get all projects for a user
    async getUserProjects(userId: string, options: PaginationOptions & { status: string; search: string }): Promise<{
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
            logger.info('Get user projects', { userId, ...options });
            const { page, limit, sort = 'createdAt', order = 'desc', status, search } = options;
            const skip = (page - 1) * limit;

            const where: Prisma.ProjectWhereInput = {
                userId,     // filter by id
                status: status ? (status as any) : { not: 'DELETED' },  // exclude deleted projects
                ...(search && {
                    OR: [           // search in name and description
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ]
                })
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
                                diagrams: { where: { status: 'COMPLETED' } },
                                analyses: true,
                            }
                        }
                    }
                }),
                prisma.project.count({ where })
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
            logger.error('Failed to get user projects', {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw new BadRequestError('Failed to get projects');
        }
    }
}