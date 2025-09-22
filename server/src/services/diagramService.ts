import { eventService } from ".";
import prisma from "../config/db";
import { UnauthorizedError } from "../errors";
import type { DiagramRequest } from "../types";
import { logger } from "../utils";

export class DiagramService {
    // Diagram service implementation
    async generateDiagram(request: DiagramRequest, userId: string): Promise<any> {
        let diagramId: string = '';

        try {
            logger.info('Starting diagram generation process', {
                projectId: request.projectId,
                userId,
                type: request.type,
            });
            // check for ownership of the project
            const project = await prisma.project.findUnique({
                where: { id: request.projectId },
            });
            if (!project || project.userId !== userId) {
                throw new UnauthorizedError('Project not found or access denied');
            }
            // create a new diagram entry in the database
            const diagram = await prisma.diagram.create({
                data: {
                    projectId: request.projectId,
                    type: request.type,
                    title: request.title || 'Untitled Diagram',
                    description: request.description || '',
                    style: request.style,
                    codeFileId: request.codeFileIds ? request.codeFileIds.join(',') : null,
                    prompt: '',
                    status: 'PENDING',
                },
            });
            diagramId = diagram.id;
            // emit event
            eventService.emitDiagramProgress({
                diagramId,
                projectId: request.projectId,
                userId,
                progress: 0,
                status: 'STARTING',
            })
            // generate prompt
            const prompt = this.generatePrompt(request, project);

            eventService.emitDiagramProgress({
                diagramId,
                projectId: request.projectId,
                userId,
                progress: 30,
                status: 'GENERATING',
                stage: 'PROMPT_GENERATION',
            })

            // simulate AI processing 
            eventService.emitDiagramProgress({
                diagramId,
                projectId: request.projectId,
                userId,
                progress: 70,
                status: 'GENERATING',
                stage: 'AI_PROCESSING',
            })

            // give some time (simulate delay)
            await new Promise(resolve => setTimeout(resolve, 2000));
            // generate diagram

            const imageUrl = `/uploads/diagrams/diagram_${diagramId}_${Date.now()}.png`;

            const completedDiagram = await prisma.diagram.update({
                where: { id: diagramId },
                data: {
                    imageUrl,
                    status: 'COMPLETED',
                    prompt,
                    generationTime: 2000,
                },
            });
            eventService.emitDiagramProgress({
                diagramId,
                projectId: request.projectId,
                userId,
                status: 'COMPLETED',
                progress: 100,
            });

            logger.info('Diagram generation completed', {
                diagramId,
                projectId: request.projectId,
                userId
            });

            return completedDiagram;
        } catch (error) {
            if (diagramId) {
                await prisma.diagram.update({
                    where: { id: diagramId },
                    data: {
                        status: 'FAILED',
                        error: error instanceof Error ? error.message : 'Unknown error',
                    }
                }).catch(() => { });
            }

            eventService.emitDiagramProgress({
                diagramId: diagramId || 'unknown',
                projectId: request.projectId,
                userId,
                status: 'FAILED',
                progress: 0,
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            throw error;
        }
    }

    // get diagram by id
    async getDiagramById(diagramId: string, userId: string): Promise<any> {
        try {
            const diagram = await prisma.diagram.findUnique({
                where: { id: diagramId },
                include: {
                    project: {
                        select: { userId: true, id: true, name: true }
                    }
                }
            });
            if (!diagram || diagram.project.userId !== userId) {
                throw new UnauthorizedError('Diagram not found or access denied');
            }
            return diagram;
        } catch (error) {
            logger.error('Get diagram failed', {
                diagramId,
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw error;
        }
    }
    // get project diagrams
    async getProjectDiagrams(projectId: string, userId: string): Promise<any[]> {
        try {
            // verfy ownership
            const project = await prisma.project.findUnique({
                where: {
                    id: projectId
                }
            })
            if (!project || project.userId !== userId) {
                throw new UnauthorizedError('Project not found or access denied');
            }
            const diagrams = await prisma.diagram.findMany({
                where: { projectId },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    type: true,
                    title: true,
                    style: true,
                    status: true,
                    imageUrl: true,
                    createdAt: true,
                    description: true,
                }
            });
            return diagrams;
        } catch (error) {
            logger.error('Get project diagrams failed', {
                projectId,
                userId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw error;
        }
    }
    // generate prompt 
    private generatePrompt(request: DiagramRequest, project: any): string {
        let prompt = `Generate a ${request.style.toLowerCase()} ${request.type.toLowerCase()} diagram for "${request.title}" in the ${project.name} project. `;

        if (request.description) {
            prompt += `Description: ${request.description} `;
        }

        prompt += 'Make it professional and clear.';

        return prompt;
    }
}