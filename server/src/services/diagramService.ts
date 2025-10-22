import { eventService } from ".";
import prisma from "../config/db";
import { UnauthorizedError } from "../errors";
import type { DiagramRequest, FileAnalysisResult, ProjectAnalysisResult } from "../types";
import { logger } from "../utils";
import { aiService } from './ai.service';

export class DiagramService {
    // Diagram service implementation
    async generateDiagram(request: DiagramRequest, userId: string): Promise<any> {
        let diagramId: string = '';
        const startTime = Date.now();

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
                    style: request.style || 'MODERN',
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
            // generate prompt with enhanced analysis data
            const prompt = await this.generateEnhancedPrompt(request, project);

            eventService.emitDiagramProgress({
                diagramId,
                projectId: request.projectId,
                userId,
                progress: 30,
                status: 'GENERATING',
                stage: 'PROMPT_GENERATION',
            })

            // Get project files and analysis for AI generation
            const files = await prisma.codeFile.findMany({
                where: { projectId: request.projectId },
                select: {
                    name: true,
                    content: true,
                    language: true,
                    path: true,
                }
            });

            const analysis = await prisma.analysis.findUnique({
                where: { projectId: request.projectId }
            });

            eventService.emitDiagramProgress({
                diagramId,
                projectId: request.projectId,
                userId,
                progress: 50,
                status: 'GENERATING',
                stage: 'AI_PROCESSING',
            })

            // Generate Mermaid diagram using AI
            let mermaidCode: string;
            try {
                if (analysis && files.length > 0) {
                    const analysisData: any = {
                        totalFiles: analysis.totalFiles,
                        totalLinesOfCode: analysis.totalLinesOfCode,
                        functionCount: analysis.functionCount,
                        classCount: analysis.classCount,
                        interfaceCount: analysis.interfaceCount,
                        complexity: analysis.metrics,
                        languageDistribution: analysis.languageDistribution,
                        dependencies: analysis.dependencies,
                    };

                    mermaidCode = await aiService.generateDiagramDescription(
                        project.name,
                        request.type.toLowerCase(),
                        analysisData,
                        files as any
                    );
                } else {
                    // Fallback: generate basic diagram
                    mermaidCode = this.generateBasicDiagram(request.type, project.name);
                }
            } catch (aiError) {
                logger.warn('AI diagram generation failed, using fallback', { 
                    error: aiError instanceof Error ? aiError.message : 'Unknown error' 
                });
                mermaidCode = this.generateBasicDiagram(request.type, project.name);
            }

            eventService.emitDiagramProgress({
                diagramId,
                projectId: request.projectId,
                userId,
                progress: 90,
                status: 'GENERATING',
                stage: 'STORAGE',
            })

            const generationTime = Math.floor(Date.now() - startTime);

            const completedDiagram = await prisma.diagram.update({
                where: { id: diagramId },
                data: {
                    imageData: mermaidCode,
                    status: 'COMPLETED',
                    prompt,
                    generationTime,
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
    // generate enhanced prompt using project analysis data
    private async generateEnhancedPrompt(request: DiagramRequest, project: any): Promise<string> {
        try {
            // Get project analysis data for rich context
            const projectAnalysis = await this.getProjectAnalysisData(project.id);
            
            // Get specific file data if file IDs are provided
            const fileAnalysisData = request.codeFileIds ? 
                await this.getFileAnalysisData(request.codeFileIds) : [];

            // Build context-aware prompt based on diagram type
            let prompt = this.buildBasePrompt(request, project);
            
            // Add project-wide analysis insights
            if (projectAnalysis) {
                prompt += this.addProjectAnalysisContext(projectAnalysis, request.type);
            }
            
            // Add specific file context if provided
            if (fileAnalysisData.length > 0) {
                prompt += this.addFileSpecificContext(fileAnalysisData, request.type);
            }
            
            // Add style and type-specific instructions
            prompt += this.addStyleInstructions(request.style, request.type);
            
            // Add custom prompt if provided
            if (request.options?.customPrompt) {
                prompt += `\n\nAdditional Requirements: ${request.options.customPrompt}`;
            }
            
            logger.info('Enhanced prompt generated', {
                projectId: project.id,
                diagramType: request.type,
                promptLength: prompt.length,
                hasProjectAnalysis: !!projectAnalysis,
                fileCount: fileAnalysisData.length
            });
            
            return prompt;
            
        } catch (error) {
            logger.warn('Failed to generate enhanced prompt, falling back to basic prompt', {
                projectId: project.id,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            
            // Fallback to basic prompt if analysis data is unavailable
            return this.generateBasicPrompt(request, project);
        }
    }
    
    private async getProjectAnalysisData(projectId: string): Promise<ProjectAnalysisResult | null> {
        try {
            const analysis = await prisma.analysis.findFirst({
                where: { projectId },
                orderBy: { completedAt: 'desc' }
            });
            
            return analysis ? {
                id: analysis.id,
                projectId: analysis.projectId,
                totalFiles: analysis.totalFiles,
                totalLinesOfCode: analysis.totalLinesOfCode,
                functionCount: analysis.functionCount,
                classCount: analysis.classCount,
                interfaceCount: analysis.interfaceCount,
                complexity: {
                    total: analysis.totalComplexity,
                    average: analysis.averageComplexity,
                    distribution: {
                        low: 0,
                        medium: 0,
                        high: 0,
                        critical: 0,
                        ...(typeof analysis.metrics === 'object' && analysis.metrics !== null ? 
                            (analysis.metrics as any).complexityDistribution || {} : {})
                    }
                },
                languageDistribution: analysis.languageDistribution as Record<string, number>,
                dependencies: analysis.dependencies as any,
                recommendations: analysis.recommendations,
                completedAt: analysis.completedAt
            } : null;
        } catch (error) {
            logger.error('Failed to fetch project analysis data', { projectId, error });
            return null;
        }
    }
    
    private async getFileAnalysisData(fileIds: string[]): Promise<FileAnalysisResult[]> {
        try {
            const files = await prisma.codeFile.findMany({
                where: { id: { in: fileIds } }
            });
            
            return files.map(file => {
                // Extract analysis data from file metadata
                const metadata = file.metadata as any;
                const ast = file.ast as any;
                
                return {
                    fileId: file.id,
                    fileName: file.name,
                    language: file.language,
                    linesOfCode: this.countLinesOfCode(file.content),
                    functions: this.extractFunctions(metadata, ast, file.language),
                    classes: this.extractClasses(metadata, ast, file.language),
                    interfaces: this.extractInterfaces(metadata, ast, file.language),
                    imports: this.extractImports(metadata, ast, file.content, file.language),
                    complexity: this.calculateFileComplexity(file.content, file.language)
                };
            });
        } catch (error) {
            logger.error('Failed to fetch file analysis data', { fileIds, error });
            return [];
        }
    }
    
    private countLinesOfCode(content: string): number {
        return content.split('\n').filter(line => line.trim().length > 0).length;
    }
    
    private extractFunctions(metadata: any, ast: any, language: string): string[] {
        // Extract from metadata if available
        if (metadata?.functions) return metadata.functions;
        
        // Basic extraction from content based on language
        const functions: string[] = [];
        
        // This is a simplified extraction - in production you'd use proper AST parsing
        if (language === 'typescript' || language === 'javascript') {
            // Look for function declarations and methods
            const functionPattern = /(?:function\s+|const\s+\w+\s*=\s*(?:async\s+)?(?:\([^)]*\)\s*=>|\([^)]*\)\s*:\s*\w+\s*=>)|class\s+\w+\s*{[^}]*?(\w+)\s*\([^)]*\)\s*{)/g;
            // This is simplified - you'd want to use a proper parser
        }
        
        return functions;
    }
    
    private extractClasses(metadata: any, ast: any, language: string): string[] {
        if (metadata?.classes) return metadata.classes;
        
        const classes: string[] = [];
        // Simplified class extraction
        return classes;
    }
    
    private extractInterfaces(metadata: any, ast: any, language: string): string[] {
        if (metadata?.interfaces) return metadata.interfaces;
        
        const interfaces: string[] = [];
        // Simplified interface extraction
        return interfaces;
    }
    
    private extractImports(metadata: any, ast: any, content: string, language: string): string[] {
        if (metadata?.imports) return metadata.imports;
        
        const imports: string[] = [];
        
        // Basic import extraction
        if (language === 'typescript' || language === 'javascript') {
            const importLines = content.split('\n').filter(line => 
                line.trim().startsWith('import ') || line.trim().startsWith('const ') && line.includes('require(')
            );
            
            importLines.forEach(line => {
                const match = line.match(/from\s+['"]([^'"]+)['"]/);
                if (match && match[1]) {
                    imports.push(match[1]);
                }
            });
        }
        
        return imports;
    }
    
    private calculateFileComplexity(content: string, language: string): number {
        // Simplified complexity calculation
        const lines = content.split('\n');
        let complexity = 1; // Base complexity
        
        // Count complexity-adding constructs
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.includes('if ') || trimmed.includes('else if ')) complexity++;
            if (trimmed.includes('for ') || trimmed.includes('while ')) complexity++;
            if (trimmed.includes('switch ') || trimmed.includes('case ')) complexity++;
            if (trimmed.includes('try ') || trimmed.includes('catch ')) complexity++;
        });
        
        return complexity;
    }
    
    private buildBasePrompt(request: DiagramRequest, project: any): string {
        const title = request.title || `${request.type} Diagram`;
        let prompt = `Create a ${request.style.toLowerCase()} ${request.type.toLowerCase()} diagram titled "${title}" for the "${project.name}" project.`;
        
        if (request.description) {
            prompt += ` Project Description: ${request.description}.`;
        }
        
        return prompt;
    }
    
    private addProjectAnalysisContext(analysis: ProjectAnalysisResult, diagramType: string): string {
        let context = `\n\nProject Context:`;
        context += `\n- Total Files: ${analysis.totalFiles}`;
        context += `\n- Total Lines of Code: ${analysis.totalLinesOfCode.toLocaleString()}`;
        context += `\n- Functions: ${analysis.functionCount}, Classes: ${analysis.classCount}, Interfaces: ${analysis.interfaceCount}`;
        
        // Add language distribution
        const languages = Object.entries(analysis.languageDistribution)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([lang, count]) => `${lang} (${count} files)`)
            .join(', ');
        context += `\n- Primary Languages: ${languages}`;
        
        // Add complexity insights
        const avgComplexityNum = analysis.complexity.average;
        const complexityLevel = avgComplexityNum < 5 ? 'Low' : avgComplexityNum < 10 ? 'Medium' : avgComplexityNum < 15 ? 'High' : 'Critical';
        context += `\n- Average Complexity: ${avgComplexityNum.toFixed(1)} (${complexityLevel})`;
        
        // Add dependencies for architecture diagrams
        if (diagramType === 'ARCHITECTURE' || diagramType === 'COMPONENT') {
            const externalDeps = analysis.dependencies.external.slice(0, 10).join(', ');
            if (externalDeps) {
                context += `\n- Key Dependencies: ${externalDeps}`;
            }
        }
        
        return context;
    }
    
    private addFileSpecificContext(files: FileAnalysisResult[], diagramType: string): string {
        let context = `\n\nSpecific Files Analysis:`;
        
        files.forEach(file => {
            context += `\n\n${file.fileName} (${file.language}):`;
            context += `\n  - Lines of Code: ${file.linesOfCode}`;
            context += `\n  - Complexity: ${file.complexity}`;
            
            if (file.functions.length > 0) {
                const funcList = file.functions.slice(0, 5).join(', ');
                context += `\n  - Key Functions: ${funcList}`;
            }
            
            if (file.classes.length > 0) {
                const classList = file.classes.slice(0, 3).join(', ');
                context += `\n  - Classes: ${classList}`;
            }
            
            if (file.interfaces.length > 0 && (diagramType === 'CLASS' || diagramType === 'COMPONENT')) {
                const interfaceList = file.interfaces.slice(0, 3).join(', ');
                context += `\n  - Interfaces: ${interfaceList}`;
            }
            
            if (file.imports.length > 0 && (diagramType === 'ARCHITECTURE' || diagramType === 'COMPONENT')) {
                const importList = file.imports.slice(0, 5).join(', ');
                context += `\n  - Key Imports: ${importList}`;
            }
        });
        
        return context;
    }
    
    private addStyleInstructions(style: string, diagramType: string): string {
        let instructions = `\n\nStyle & Format Instructions:`;
        
        // Style-specific instructions
        switch (style) {
            case 'MODERN':
                instructions += `\n- Use modern, clean design with rounded corners and contemporary colors`;
                instructions += `\n- Include icons and visual elements for better clarity`;
                break;
            case 'MINIMALIST':
                instructions += `\n- Keep it simple and clean with minimal visual clutter`;
                instructions += `\n- Use monochrome or limited color palette`;
                break;
            case 'DETAILED':
                instructions += `\n- Include comprehensive details, annotations, and explanations`;
                instructions += `\n- Show relationships, data types, and method signatures where applicable`;
                break;
            case 'COLORFUL':
                instructions += `\n- Use vibrant colors to differentiate components and relationships`;
                instructions += `\n- Apply color coding for different types of elements`;
                break;
        }
        
        // Diagram type-specific instructions
        switch (diagramType) {
            case 'ARCHITECTURE':
                instructions += `\n- Show high-level system components and their interactions`;
                instructions += `\n- Include data flow and communication patterns`;
                instructions += `\n- Highlight external dependencies and integrations`;
                break;
            case 'CLASS':
                instructions += `\n- Show class relationships (inheritance, composition, aggregation)`;
                instructions += `\n- Include key methods and properties`;
                instructions += `\n- Use proper UML notation`;
                break;
            case 'FLOWCHART':
                instructions += `\n- Show process flow with decision points and branching`;
                instructions += `\n- Use standard flowchart symbols`;
                instructions += `\n- Include error handling paths where applicable`;
                break;
            case 'SEQUENCE':
                instructions += `\n- Show interaction between objects over time`;
                instructions += `\n- Include lifelines and message passing`;
                instructions += `\n- Highlight asynchronous operations`;
                break;
            case 'COMPONENT':
                instructions += `\n- Show modular structure and component boundaries`;
                instructions += `\n- Include interfaces and dependencies between components`;
                instructions += `\n- Highlight reusable components`;
                break;
            case 'ER':
                instructions += `\n- Show entities, attributes, and relationships`;
                instructions += `\n- Include cardinality and constraints`;
                instructions += `\n- Use proper ER diagram notation`;
                break;
        }
        
        instructions += `\n\nOutput Requirements:`;
        instructions += `\n- Generate a professional, publication-ready diagram`;
        instructions += `\n- Ensure all text is clearly readable`;
        instructions += `\n- Use consistent spacing and alignment`;
        instructions += `\n- Include a legend if necessary for understanding`;
        
        return instructions;
    }

    /**
     * Delete diagram
     */
    async deleteDiagram(diagramId: string, userId: string): Promise<void> {
        try {
            logger.info('Deleting diagram', { diagramId, userId });

            // Get diagram to verify ownership
            const diagram = await prisma.diagram.findUnique({
                where: { id: diagramId },
                include: { project: true }
            });

            if (!diagram) {
                throw new Error('Diagram not found');
            }

            if (diagram.project.userId !== userId) {
                throw new UnauthorizedError('Access denied');
            }

            // Delete the diagram
            await prisma.diagram.delete({
                where: { id: diagramId }
            });

            logger.info('Diagram deleted successfully', { diagramId });
        } catch (error) {
            logger.error('Failed to delete diagram', { diagramId, error });
            throw error;
        }
    }
    
    // generate basic prompt (fallback)
    private generateBasicPrompt(request: DiagramRequest, project: any): string {
        let prompt = `Generate a ${request.style.toLowerCase()} ${request.type.toLowerCase()} diagram for "${request.title}" in the ${project.name} project. `;

        if (request.description) {
            prompt += `Description: ${request.description} `;
        }

        prompt += 'Make it professional and clear.';

        return prompt;
    }

    // Generate basic fallback diagram in Mermaid format
    private generateBasicDiagram(type: string, projectName: string): string {
        const typeUpper = type.toUpperCase();
        
        switch (typeUpper) {
            case 'ARCHITECTURE':
                return `graph TB
    subgraph "${projectName} Architecture"
        A[Application Layer] --> B[Business Logic]
        B --> C[Data Access Layer]
        C --> D[(Database)]
        A --> E[External APIs]
    end
    
    style A fill:#e3f2fd
    style B fill:#bbdefb
    style C fill:#90caf9
    style D fill:#64b5f6
    style E fill:#42a5f5`;

            case 'FLOWCHART':
                return `flowchart TD
    Start([Start]) --> Input[Receive Input]
    Input --> Process[Process Data]
    Process --> Decision{Valid?}
    Decision -->|Yes| Success[Success]
    Decision -->|No| Error[Error Handler]
    Success --> End([End])
    Error --> End
    
    style Start fill:#4caf50
    style End fill:#f44336
    style Success fill:#8bc34a
    style Error fill:#ff9800`;

            case 'CLASS':
                return `classDiagram
    class Application {
        +config: Config
        +initialize()
        +run()
    }
    class Service {
        +process()
        +validate()
    }
    class Repository {
        +save()
        +find()
        +delete()
    }
    class Model {
        +id: string
        +data: any
    }
    
    Application --> Service
    Service --> Repository
    Repository --> Model`;

            case 'SEQUENCE':
                return `sequenceDiagram
    participant User
    participant Client
    participant Server
    participant Database
    
    User->>Client: Initiate Request
    Client->>Server: API Call
    Server->>Database: Query
    Database-->>Server: Results
    Server-->>Client: Response
    Client-->>User: Display`;

            case 'ER':
                return `erDiagram
    USER ||--o{ PROJECT : owns
    PROJECT ||--|{ FILE : contains
    PROJECT ||--o{ ANALYSIS : has
    
    USER {
        string id PK
        string email
        string name
    }
    PROJECT {
        string id PK
        string userId FK
        string name
    }
    FILE {
        string id PK
        string projectId FK
        string name
        string content
    }`;

            default:
                return `graph LR
    A[${projectName}] --> B[Component 1]
    A --> C[Component 2]
    A --> D[Component 3]`;
        }
    }
}