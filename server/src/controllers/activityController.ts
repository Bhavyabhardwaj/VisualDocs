import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../utils';
import prisma from '../config/db';

export const activityController = {
  async getProjectActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const userId = req.user?.userId;

      if (!userId || !projectId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

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
      project.analyses.forEach((analysis: any) => {
        activities.push({
          id: `analysis-${analysis.id}`,
          type: 'analysis',
          user: {
            id: project.user.id,
            name: project.user.name,
            avatar: project.user.avatar,
          },
          action: 'completed analysis',
          target: project.name,
          timestamp: analysis.createdAt,
        });
      });

      // Diagram activities
      project.diagrams.forEach((diagram: any) => {
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

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get current user info
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, avatar: true },
      });

      // Get user's recent projects with analyses and diagrams
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

      // Get recent analyses
      const analyses = await prisma.analysis.findMany({
        where: { project: { userId } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          createdAt: true,
          project: { select: { id: true, name: true } },
        }
      });

      // Get recent diagrams
      const diagrams = await prisma.diagram.findMany({
        where: { project: { userId } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          status: true,
          createdAt: true,
          project: { select: { id: true, name: true } },
        }
      });

      // Get recent comments
      const comments = await prisma.comment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          content: true,
          createdAt: true,
          project: { select: { id: true, name: true } },
        }
      });

      const activities: any[] = [];
      const userInfo = {
        id: currentUser?.id || userId,
        name: currentUser?.name || 'You',
        avatar: currentUser?.avatar,
      };

      // Add project activities
      projects.forEach((project: any) => {
        activities.push({
          id: `project-${project.id}-${project.updatedAt.getTime()}`,
          type: 'project_update',
          user: userInfo,
          action: project.status === 'ANALYZING' ? 'started analysis on' : 'updated',
          target: project.name,
          timestamp: project.updatedAt,
          projectId: project.id,
          metadata: { url: `/app/projects/${project.id}` },
        });
      });

      // Add analysis activities
      analyses.forEach((analysis: any) => {
        activities.push({
          id: `analysis-${analysis.id}`,
          type: 'analysis',
          user: userInfo,
          action: 'completed analysis on',
          target: analysis.project.name,
          timestamp: analysis.createdAt,
          projectId: analysis.project.id,
          metadata: { url: `/app/projects/${analysis.project.id}` },
        });
      });

      // Add diagram activities
      diagrams.forEach((diagram: any) => {
        activities.push({
          id: `diagram-${diagram.id}`,
          type: diagram.status === 'COMPLETED' ? 'export' : 'project',
          user: userInfo,
          action: diagram.status === 'COMPLETED' ? 'generated diagram for' : 'started generating diagram for',
          target: diagram.project.name,
          timestamp: diagram.createdAt,
          projectId: diagram.project.id,
          metadata: { url: `/app/projects/${diagram.project.id}` },
        });
      });

      // Add comment activities
      comments.forEach((comment: any) => {
        activities.push({
          id: `comment-${comment.id}`,
          type: 'comment',
          user: userInfo,
          action: 'commented on',
          target: comment.project.name,
          timestamp: comment.createdAt,
          projectId: comment.project.id,
          metadata: { url: `/app/projects/${comment.project.id}` },
        });
      });

      // Sort by timestamp descending and deduplicate
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Remove duplicates based on id
      const uniqueActivities = activities.filter((activity, index, self) =>
        index === self.findIndex((a) => a.id === activity.id)
      );

      return successResponse(
        res,
        uniqueActivities.slice(0, limit),
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

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

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

      const formattedActivities = activities.map((project: any) => ({
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
