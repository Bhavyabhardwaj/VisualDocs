import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../utils';
import { prisma } from '../config';

export const teamController = {
  async getTeamMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // For now, return the current user's team (workspace members)
      // In a real app, you'd fetch team by ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          lastLoginAt: true,
        }
      });

      // Mock team members - in production, fetch from team_members table
      const members = user ? [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: 'Owner',
          joinedAt: user.createdAt,
          lastActive: user.lastLoginAt || user.createdAt,
          projectCount: await prisma.project.count({ where: { userId: user.id } }),
        }
      ] : [];

      return successResponse(
        res,
        { members, total: members.length },
        'Team members fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  },

  async getTeamActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      // Fetch recent project activities
      const recentProjects = await prisma.project.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          updatedAt: true,
          createdAt: true,
          status: true,
        }
      });

      const activities = recentProjects.map(project => ({
        id: `activity-${project.id}`,
        type: 'project_update',
        user: {
          id: userId,
          name: 'You',
        },
        action: project.status === 'ANALYZING' ? 'started analysis on' : 'updated',
        target: project.name,
        timestamp: project.updatedAt,
      }));

      return successResponse(
        res,
        { activities, total: activities.length },
        'Team activity fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  },

  async inviteTeamMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      // TODO: Implement team invitation logic
      // For now, return success
      return successResponse(
        res,
        { message: `Invitation sent to ${email}` },
        'Team member invited successfully'
      );
    } catch (error) {
      next(error);
    }
  },

  async removeTeamMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, userId: memberUserId } = req.params;

      // TODO: Implement member removal logic
      return successResponse(
        res,
        { message: 'Team member removed' },
        'Team member removed successfully'
      );
    } catch (error) {
      next(error);
    }
  },
};
