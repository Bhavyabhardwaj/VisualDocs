import type { NextFunction, Request, Response } from "express";
import type { DiagramRequest } from "../types";
import { successResponse } from "../utils";
import { DiagramService } from "../services/diagramService";

export class DiagramController {

  /**
   * Generate new diagram
   * POST /api/diagrams
   */
  async generateDiagram(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const diagramRequest: DiagramRequest = req.body;
      
      // Start diagram generation (async process with real-time updates)
      const diagram = await DiagramService.generateDiagram(diagramRequest, userId);
      
      return successResponse(
        res,
        { diagram },
        'Diagram generation completed successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get diagram by ID
   * GET /api/diagrams/:id
   */
  async getDiagram(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const diagramId = req.params.id;
      
      const diagram = await DiagramService.getDiagramById(diagramId, userId);
      
      return successResponse(
        res,
        { diagram },
        'Diagram retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get project diagrams
   * GET /api/projects/:projectId/diagrams
   */
  async getProjectDiagrams(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const projectId = req.params.projectId;
      
      const diagrams = await diagramService.getProjectDiagrams(projectId, userId);
      
      return successResponse(
        res,
        { diagrams },
        'Project diagrams retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete diagram
   * DELETE /api/diagrams/:id
   */
  async deleteDiagram(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const diagramId = req.params.id;
      
      await diagramService.deleteDiagram(diagramId, userId);
      
      return successResponse(
        res,
        null,
        'Diagram deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get diagram generation progress (for polling)
   * GET /api/diagrams/:id/progress
   */
  async getDiagramProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const diagramId = req.params.id;
      
      const diagram = await diagramService.getDiagramById(diagramId, userId);
      
      const progress = {
        status: diagram.status,
        progress: diagram.status === 'COMPLETED' ? 100 : 
                 diagram.status === 'FAILED' ? 0 : 50,
        error: diagram.error || null,
        lastUpdated: diagram.updatedAt,
      };
      
      return successResponse(
        res,
        { progress },
        'Diagram progress retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Regenerate diagram with same parameters
   * POST /api/diagrams/:id/regenerate
   */
  async regenerateDiagram(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const diagramId = req.params.id;
      
      // Get existing diagram
      const existingDiagram = await diagramService.getDiagramById(diagramId, userId);
      
      // Create new diagram request based on existing one
      const diagramRequest: DiagramRequest = {
        projectId: existingDiagram.projectId,
        type: existingDiagram.type,
        title: existingDiagram.title,
        description: existingDiagram.description,
        style: existingDiagram.style,
        codeFileId: existingDiagram.codeFileId,
      };
      
      const newDiagram = await diagramService.generateDiagram(diagramRequest, userId);
      
      return successResponse(
        res,
        { diagram: newDiagram },
        'Diagram regenerated successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }
}
