import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../utils';
import prisma from '../config/db';
import crypto from 'crypto';
import { TeamRole, InvitationStatus } from '@prisma/client';

export const teamController = {
  // Initialize team membership (auto-add current user as OWNER if not already a member)
  async initializeTeamMember(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user is already a team member
      const existingMember = await prisma.teamMember.findFirst({
        where: { userId }
      });

      if (existingMember) {
        return res.json({
          success: true,
          data: { member: existingMember, message: 'Already a team member' }
        });
      }

      // Add user as OWNER (first user or new user)
      // Using a fixed teamId since we have a single workspace model
      const WORKSPACE_TEAM_ID = 'default-workspace';
      
      const newMember = await prisma.teamMember.create({
        data: {
          teamId: WORKSPACE_TEAM_ID,
          userId,
          role: 'OWNER',
          invitedBy: userId
        }
      } as any);

      res.json({
        success: true,
        data: { member: newMember, message: 'Team membership initialized' }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all team members with their user details
  async getTeamMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Fetch all team members with user details (no teamId needed - global workspace)
      const teamMembers = await prisma.teamMember.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              createdAt: true,
              lastLoginAt: true,
            }
          }
        },
        orderBy: { joinedAt: 'asc' }
      } as any);

      // Get project counts for each member
      const membersWithDetails = await Promise.all(
        teamMembers.map(async (member: any) => {
          const projectCount = await prisma.project.count({
            where: { userId: member.userId }
          });

          return {
            id: member.id,
            name: member.user?.name || 'Unknown',
            email: member.user?.email || '',
            avatar: member.user?.avatar || null,
            role: member.role,
            joinedAt: member.joinedAt,
            lastActive: member.user?.lastLoginAt || member.joinedAt,
            projectCount,
            userId: member.userId,
          };
        })
      );

      return successResponse(
        res,
        { members: membersWithDetails, total: membersWithDetails.length },
        'Team members fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  },

  // Get team activity feed
  async getTeamActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get all team members
      const teamMembers = await prisma.teamMember.findMany({
        select: { userId: true }
      });

      const memberIds = teamMembers.map(m => m.userId);

      // Fetch recent activities from all team members
      const recentProjects = await prisma.project.findMany({
        where: { 
          userId: { in: memberIds }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      });

      const activities = recentProjects.map((project) => ({
        id: `activity-${project.id}`,
        type: 'project_update',
        user: {
          id: project.user.id,
          name: project.user.name,
          avatar: project.user.avatar,
        },
        action: project.status === 'ACTIVE' ? 'updated' : 'created',
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

  // Invite a new team member by email
  async inviteTeamMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, role = 'MEMBER' } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate email
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }

      // Validate role
      if (!['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      // Check if inviter is admin or owner
      const inviterMember = await prisma.teamMember.findFirst({
        where: { userId }
      });

      if (!inviterMember || !['OWNER', 'ADMIN'].includes(inviterMember.role)) {
        return res.status(403).json({ error: 'Only admins and owners can invite members' });
      }

      // Check if user already exists in the system
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      // Check if already a team member
      if (existingUser) {
        const existingMember = await prisma.teamMember.findFirst({
          where: {
            userId: existingUser.id
          }
        });

        if (existingMember) {
          return res.status(400).json({ 
            error: 'User is already a team member' 
          });
        }
      }

      // Check for existing pending invitation
      const existingInvitation = await prisma.teamInvitation.findFirst({
        where: {
          email,
          status: 'PENDING',
          expiresAt: { gt: new Date() }
        }
      });

      if (existingInvitation) {
        return res.status(400).json({ 
          error: 'An invitation has already been sent to this email' 
        });
      }

      // Generate unique invitation token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Using a fixed teamId since we have a single workspace model
      const WORKSPACE_TEAM_ID = 'default-workspace';

      // Create invitation
      const invitation = await prisma.teamInvitation.create({
        data: {
          teamId: WORKSPACE_TEAM_ID,
          email,
          role: role as TeamRole,
          invitedBy: userId,
          token,
          expiresAt,
          status: 'PENDING'
        }
      });

      // If user already exists, automatically add them to the team
      if (existingUser) {
        await prisma.teamMember.create({
          data: {
            teamId: WORKSPACE_TEAM_ID,
            userId: existingUser.id,
            role: role as TeamRole,
            invitedBy: userId,
          }
        });

        // Update invitation status
        await prisma.teamInvitation.update({
          where: { id: invitation.id },
          data: { status: 'ACCEPTED', acceptedAt: new Date() }
        });

        return successResponse(
          res,
          { 
            message: `${email} has been added to the team`,
            invitation,
            autoAdded: true 
          },
          'Team member added successfully'
        );
      }

      // TODO: Send invitation email with token
      // For now, just return success
      return successResponse(
        res,
        { 
          message: `Invitation sent to ${email}`,
          invitation: {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            expiresAt: invitation.expiresAt,
            token: invitation.token,
          }
        },
        'Team member invited successfully'
      );
    } catch (error) {
      next(error);
    }
  },

  // Accept team invitation
  async acceptInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      // Find invitation by token
      const invitation = await prisma.teamInvitation.findFirst({
        where: { token }
      });

      if (!invitation) {
        return res.status(404).json({ error: 'Invitation not found' });
      }

      if (invitation.status !== 'PENDING') {
        return res.status(400).json({ error: 'Invitation has already been processed' });
      }

      if (invitation.expiresAt < new Date()) {
        await prisma.teamInvitation.update({
          where: { id: invitation.id },
          data: { status: 'EXPIRED' }
        });
        return res.status(400).json({ error: 'Invitation has expired' });
      }

      // Get user email
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      if (!user || user.email !== invitation.email) {
        return res.status(403).json({ 
          error: 'This invitation was sent to a different email address' 
        });
      }

      // Check if already a member
      const existingMember = await prisma.teamMember.findFirst({
        where: {
          userId,
          teamId: invitation.teamId
        }
      });

      if (existingMember) {
        return res.status(400).json({ error: 'You are already a team member' });
      }

      // Add to team
      await prisma.teamMember.create({
        data: {
          userId,
          teamId: invitation.teamId,
          role: invitation.role,
          invitedBy: invitation.invitedBy,
        }
      });

      // Update invitation
      await prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date()
        }
      });

      return successResponse(
        res,
        { message: 'Successfully joined the team' },
        'Invitation accepted'
      );
    } catch (error) {
      next(error);
    }
  },

  // Remove a team member
  async removeTeamMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId: memberUserId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!memberUserId) {
        return res.status(400).json({ error: 'Member user ID is required' });
      }

      // Check if requester is admin or owner
      const requesterMember = await prisma.teamMember.findFirst({
        where: { userId }
      });

      if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
        return res.status(403).json({ 
          error: 'Only admins and owners can remove members' 
        });
      }

      // Get the member to remove
      const memberToRemove = await prisma.teamMember.findFirst({
        where: {
          userId: memberUserId
        }
      });

      if (!memberToRemove) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      // Prevent removing yourself if you're the only owner
      if (memberToRemove.role === 'OWNER') {
        const ownerCount = await prisma.teamMember.count({
          where: { role: 'OWNER' }
        });

        if (ownerCount === 1) {
          return res.status(400).json({ 
            error: 'Cannot remove the last owner. Assign another owner first.' 
          });
        }
      }

      // Remove member
      await prisma.teamMember.delete({
        where: { id: memberToRemove.id }
      });

      return successResponse(
        res,
        { message: 'Team member removed successfully' },
        'Member removed'
      );
    } catch (error) {
      next(error);
    }
  },

  // Update team member role
  async updateMemberRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId: memberUserId } = req.params;
      const { role } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!memberUserId) {
        return res.status(400).json({ error: 'Member user ID is required' });
      }

      // Validate role
      if (!['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      // Check if requester is admin or owner
      const requesterMember = await prisma.teamMember.findFirst({
        where: { userId }
      });

      if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
        return res.status(403).json({ 
          error: 'Only admins and owners can update member roles' 
        });
      }

      // Get the member to update
      const memberToUpdate = await prisma.teamMember.findFirst({
        where: {
          userId: memberUserId
        }
      });

      if (!memberToUpdate) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      // If changing from OWNER, check there's another owner
      if (memberToUpdate.role === 'OWNER' && role !== 'OWNER') {
        const ownerCount = await prisma.teamMember.count({
          where: { role: 'OWNER' }
        });

        if (ownerCount === 1) {
          return res.status(400).json({ 
            error: 'Cannot change the last owner. Assign another owner first.' 
          });
        }
      }

      // Update role
      const updatedMember = await prisma.teamMember.update({
        where: { id: memberToUpdate.id },
        data: { role: role as TeamRole }
      });

      return successResponse(
        res,
        { 
          member: updatedMember,
          message: `Role updated to ${role}` 
        },
        'Member role updated successfully'
      );
    } catch (error) {
      next(error);
    }
  },

  // Get pending invitations
  async getPendingInvitations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Using a fixed teamId since we have a single workspace model
      const WORKSPACE_TEAM_ID = 'default-workspace';

      const invitations = await prisma.teamInvitation.findMany({
        where: {
          teamId: WORKSPACE_TEAM_ID,
          status: 'PENDING',
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      });

      return successResponse(
        res,
        { invitations, total: invitations.length },
        'Pending invitations fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  },
};
