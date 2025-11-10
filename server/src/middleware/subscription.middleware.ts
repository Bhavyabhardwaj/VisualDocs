/**
 * Subscription Middleware
 * Enforces feature restrictions based on user's subscription plan
 */

import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, BadRequestError } from '../errors';
import prisma from '../config/db';

// Plan limits configuration
export const PLAN_LIMITS = {
  FREE: {
    maxProjects: 3,
    maxStorage: 100 * 1024 * 1024, // 100 MB in bytes
    maxTeamMembers: 1,
    maxFilesPerProject: 10,
    features: {
      basicDiagrams: true,
      advancedDiagrams: false,
      aiAnalysis: 'basic' as 'basic' | 'advanced' | 'none',
      teamCollaboration: false,
      customTemplates: false,
      exportOptions: false,
      prioritySupport: false,
      apiAccess: false,
      customIntegrations: false,
    },
  },
  PROFESSIONAL: {
    maxProjects: Infinity,
    maxStorage: 10 * 1024 * 1024 * 1024, // 10 GB in bytes
    maxTeamMembers: 10,
    maxFilesPerProject: 100,
    features: {
      basicDiagrams: true,
      advancedDiagrams: true,
      aiAnalysis: 'advanced' as 'basic' | 'advanced' | 'none',
      teamCollaboration: true,
      customTemplates: true,
      exportOptions: true,
      prioritySupport: true,
      apiAccess: true,
      customIntegrations: false,
    },
  },
  ENTERPRISE: {
    maxProjects: Infinity,
    maxStorage: Infinity,
    maxTeamMembers: Infinity,
    maxFilesPerProject: Infinity,
    features: {
      basicDiagrams: true,
      advancedDiagrams: true,
      aiAnalysis: 'advanced' as 'basic' | 'advanced' | 'none',
      teamCollaboration: true,
      customTemplates: true,
      exportOptions: true,
      prioritySupport: true,
      apiAccess: true,
      customIntegrations: true,
    },
  },
};

/**
 * Check if user has access to a specific feature
 */
export const requireFeature = (featureName: keyof typeof PLAN_LIMITS.FREE.features) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      // Get user's subscription plan
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionPlan: true, subscriptionStatus: true },
      });

      if (!user) {
        throw new BadRequestError('User not found');
      }

      // Check subscription status
      if (user.subscriptionStatus === 'EXPIRED' || user.subscriptionStatus === 'CANCELLED') {
        throw new ForbiddenError('Your subscription has expired. Please renew to continue using this feature.');
      }

      // Get plan limits
      const plan = user.subscriptionPlan || 'FREE';
      const planLimits = PLAN_LIMITS[plan];

      // Check if feature is available for this plan
      const featureValue = planLimits.features[featureName];
      
      if (!featureValue || featureValue === 'none') {
        throw new ForbiddenError(
          `This feature is not available on the ${plan} plan. Please upgrade to access ${featureName}.`
        );
      }

      // Attach plan info to request for use in controllers
      req.userPlan = {
        plan,
        limits: planLimits,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user can create more projects
 */
export const checkProjectLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new BadRequestError('User not authenticated');
    }

    // Get user's subscription plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const plan = user.subscriptionPlan || 'FREE';
    const planLimits = PLAN_LIMITS[plan];
    const currentProjects = user._count.projects;

    // Check if user has reached project limit
    if (currentProjects >= planLimits.maxProjects) {
      throw new ForbiddenError(
        `You have reached the maximum number of projects (${planLimits.maxProjects}) for the ${plan} plan. Please upgrade to create more projects.`
      );
    }

    // Attach plan info to request
    req.userPlan = {
      plan,
      limits: planLimits,
      currentProjects,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check storage limit
 */
export const checkStorageLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new BadRequestError('User not authenticated');
    }

    // Get file size from request
    const fileSize = req.file?.size || 0;

    // Get user's subscription plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
      },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const plan = user.subscriptionPlan || 'FREE';
    const planLimits = PLAN_LIMITS[plan];

    // For now, we'll just check file size against a simplified storage calculation
    // You might want to add actual storage tracking in your database
    const estimatedCurrentStorage = 0; // Placeholder

    // Check if adding this file would exceed storage limit
    if (planLimits.maxStorage !== Infinity && (estimatedCurrentStorage + fileSize) > planLimits.maxStorage) {
      const limitMB = planLimits.maxStorage / (1024 * 1024);
      const currentMB = estimatedCurrentStorage / (1024 * 1024);
      
      throw new ForbiddenError(
        `Storage limit exceeded. You are using ${currentMB.toFixed(2)} MB of ${limitMB} MB available on the ${plan} plan. Please upgrade for more storage.`
      );
    }

    // Attach plan info to request
    req.userPlan = {
      plan,
      limits: planLimits,
      currentStorage: estimatedCurrentStorage,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's plan information and limits
 */
export const getPlanInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new BadRequestError('User not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const plan = user.subscriptionPlan || 'FREE';
    const planLimits = PLAN_LIMITS[plan];

    // Attach comprehensive plan info to request
    req.userPlan = {
      plan,
      status: user.subscriptionStatus,
      endsAt: user.subscriptionEndsAt,
      limits: planLimits,
      usage: {
        projects: user._count.projects,
      },
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      userPlan?: {
        plan: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
        status?: string;
        endsAt?: Date | null;
        limits: typeof PLAN_LIMITS.FREE | typeof PLAN_LIMITS.PROFESSIONAL | typeof PLAN_LIMITS.ENTERPRISE;
        usage?: {
          projects: number;
        };
        currentProjects?: number;
        currentStorage?: number;
      };
    }
  }
}
