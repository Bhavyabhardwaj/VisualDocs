import { Router } from 'express';
import prisma from '../config/db';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

// Get all comments for a project
router.get('/projects/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'Project ID is required',
      });
    }

    const comments = await prisma.comment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });

    // Transform to match frontend format
    const formattedComments = comments.map((comment: any) => ({
      id: comment.id,
      projectId: comment.projectId,
      userId: comment.userId,
      userName: '', // Will be populated by frontend or join with user
      content: comment.content,
      position: comment.position,
      timestamp: comment.createdAt.toISOString(),
    }));

    return res.json({
      success: true,
      message: 'Comments retrieved successfully',
      data: formattedComments,
    });
  } catch (error) {
    next(error);
  }
});

// Delete a comment
router.delete('/comments/:commentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.userId;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        error: 'Comment ID is required',
      });
    }

    // Check if comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }

    if (comment.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to delete this comment',
      });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
