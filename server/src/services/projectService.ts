import prisma from "../config/db";
import { BadRequestError, ConflictError } from "../errors";
import type { CreateProjectRequest, Project } from "../types";
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
}
