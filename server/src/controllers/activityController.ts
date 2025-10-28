import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../utils';
import { prisma } from '../config';

export const activityController = {
  async getProjectActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const userId = req.user?.userId;

      // Get project
      const project = await prisma.project.findFirst({
        where: { 
          id: projectId,
          userId 
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          },
          analyses: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              status: true,
              createdAt: true,
            }
          },
          diagrams: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              type: true,
              status: true,
              createdAt: true,
            }
          }
        }
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Build activity timeline
      const activities = [];

      // Project created
      activities.push({
        id: `project-created-${project.id}`,
        type: 'project_created',
        user: {
          id: project.user.id,
          name: project.user.name,
          avatar: project.user.avatar,
        },
        action: 'created project',
        target: project.name,
        timestamp: project.createdAt,
      });

      // Project updated
      if (project.updatedAt.getTime() !== project.createdAt.getTime()) {
        activities.push({
          id: `project-updated-${project.id}`,
          type: 'project_updated',
          user: {
            id: project.user.id,
            name: project.user.name,
            avatar: project.user.avatar,
          },
          action: 'updated project',
          target: project.name,
          timestamp: project.updatedAt,
        });
      }

      // Analysis activities
      project.analyses.forEach(analysis => {
        activities.push({
          id: `analysis-${analysis.id}`,
          type: 'analysis',
          user: {
            id: project.user.id,
            name: project.user.name,
            avatar: project.user.avatar,
          },
          action: analysis.status === 'COMPLETED' ? 'completed analysis' : 'started analysis',
          target: project.name,
          timestamp: analysis.createdAt,
        });
      });

      // Diagram activities
      project.diagrams.forEach(diagram => {
        activities.push({
          id: `diagram-${diagram.id}`,
          type: 'diagram',
          user: {
            id: project.user.id,
            name: project.user.name,
            avatar: project.user.avatar,
          },
          action: diagram.status === 'COMPLETED' ? 'generated diagram' : 'started generating diagram',
          target: diagram.type,
          timestamp: diagram.createdAt,
        });
      });

      // Sort by timestamp descending
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return successResponse(
        res,
        { activities: activities.slice(0, 20), total: activities.length },
        'Project activity fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  },

  async getUserActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const limit = parseInt(req.query.limit as string) || 20;

      // Get user's recent projects
      const projects = await prisma.project.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        }
      });

      const activities = projects.map(project => ({
        id: `project-${project.id}`,
        type: 'project_update',
        action: project.status === 'ANALYZING' ? 'started analysis on' : 'updated',
        target: project.name,
        timestamp: project.updatedAt,
        projectId: project.id,
      }));

      return successResponse(
        res,
        { activities, total: activities.length },
        'User activity fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  },

  async getTeamActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { teamId } = req.params;
      const userId = req.user?.userId;

      // For now, return user activity as team activity
      // In production, fetch activities from all team members
      const activities = await prisma.project.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 20,
        select: {
          id: true,
          name: true,
          updatedAt: true,
          status: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        }
      });

      const formattedActivities = activities.map(project => ({
        id: `team-${project.id}`,
        type: 'project_update',
        user: {
          id: project.user.id,
          name: project.user.name,
          avatar: project.user.avatar,
        },
        action: project.status === 'ANALYZING' ? 'started analysis on' : 'updated',
        target: project.name,
        timestamp: project.updatedAt,
      }));

      return successResponse(
        res,
        { activities: formattedActivities, total: formattedActivities.length },
        'Team activity fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  },
};
