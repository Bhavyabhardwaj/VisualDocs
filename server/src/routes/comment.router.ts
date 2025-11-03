import { Router } from 'express';
import { prisma } from '../utils/database';
import { successResponse, errorResponse } from '../utils';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

// Get all comments for a project
router.get('/projects/:projectId/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });

    // Transform to match frontend format
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      projectId: comment.projectId,
      userId: comment.userId,
      userName: '', // Will be populated by frontend or join with user
      content: comment.content,
      position: comment.position,
      timestamp: comment.createdAt.toISOString(),
    }));

    return res.json(successResponse(formattedComments, 'Comments retrieved successfully'));
  } catch (error) {
    next(error);
  }
});

// Delete a comment
router.delete('/comments/:commentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.userId;

    // Check if comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json(errorResponse('Comment not found', 404));
    }

    if (comment.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Unauthorized to delete this comment', 403));
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.json(successResponse(null, 'Comment deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export default router;
