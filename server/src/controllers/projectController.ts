import type { NextFunction, Request, Response } from "express";
import { projectService } from "../services";
import type { CreateProjectRequest, PaginationOptions } from "../types";
import { paginatedResponse, successResponse } from "../utils";
import { stat } from "fs";

export class ProjectController {
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
            await projectService.getProjectById(projectId, userId);

            // TODO: Implement file processing logic
            // This will be handled by file upload middleware and service
            const uploadedFiles = req.files || [];

            return successResponse(
                res,
                {
                    uploadedFiles: Array.isArray(uploadedFiles) ? uploadedFiles.length : 1,
                    projectId
                },
                'Files uploaded successfully'
            );
        } catch (error) {
            next(error);
        }
    }
}