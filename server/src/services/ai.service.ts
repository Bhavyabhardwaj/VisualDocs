import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';
import type { ProjectAnalysisResult } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class AIService {
    private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    /**
     * Generate comprehensive documentation using Gemini AI
     */
    async generateComprehensiveDocumentation(
        projectName: string,
        projectDescription: string,
        analysis: ProjectAnalysisResult,
        files: Array<{ name: string; content: string; language: string; path?: string }>
    ): Promise<string> {
        try {
            logger.info('Generating AI-powered documentation', { projectName });

            // Prepare code samples
            const codeSamples = files.slice(0, 5).map(f => ({
                name: f.name,
                language: f.language,
                preview: f.content.substring(0, 1000)
            }));

            const prompt = `You are an expert technical writer and software architect. Generate comprehensive, professional documentation for this project.

PROJECT DETAILS:
- Name: ${projectName}
- Description: ${projectDescription || 'No description provided'}
- Total Files: ${analysis.totalFiles}
- Lines of Code: ${analysis.totalLinesOfCode}
- Functions: ${analysis.functionCount}
- Classes: ${analysis.classCount}
- Interfaces: ${analysis.interfaceCount}
- Complexity: Average ${analysis.complexity.average.toFixed(2)}, Total ${analysis.complexity.total}

LANGUAGE DISTRIBUTION:
${Object.entries(analysis.languageDistribution).map(([lang, count]) => `- ${lang}: ${count} files`).join('\n')}

DEPENDENCIES:
External: ${analysis.dependencies.external.join(', ')}
Internal: ${analysis.dependencies.internal.length} modules

CODE SAMPLES:
${codeSamples.map((s, i) => `
File ${i + 1}: ${s.name} (${s.language})
\`\`\`${s.language}
${s.preview}
\`\`\`
`).join('\n')}

Generate a markdown documentation that includes:

1. **Executive Summary** (2-3 paragraphs explaining what this project does, its purpose, and main features)

2. **Architecture Overview** (detailed explanation of the project structure, design patterns used, and architectural decisions)

3. **Key Features** (bullet points of main functionalities extracted from the code)

4. **Technology Stack** (detailed breakdown of technologies, frameworks, and tools used)

5. **Code Structure & Organization** (explain how the code is organized, folder structure, and module responsibilities)

6. **API Documentation** (if applicable, document key functions, classes, and their purposes)

7. **Setup & Installation** (step-by-step guide based on dependencies)

8. **Usage Examples** (practical code examples showing how to use the main features)

9. **Code Quality Analysis** (insights on complexity, best practices followed, areas of excellence)

10. **Recommendations** (specific, actionable suggestions for improvement)

11. **Security Considerations** (any security-related observations)

12. **Performance Insights** (analysis of performance implications from the code structure)

Make it professional, detailed, and valuable for developers. Use proper markdown formatting with headers, code blocks, tables, and lists.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const documentation = response.text();

            logger.info('AI documentation generated successfully', { 
                length: documentation.length 
            });

            return documentation;

        } catch (error) {
            logger.error('AI documentation generation failed', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            
            // Return fallback documentation
            return this.generateFallbackDocumentation(projectName, projectDescription, analysis, files);
        }
    }

    /**
     * Generate fallback documentation when AI is unavailable
     */
    private generateFallbackDocumentation(
        projectName: string,
        projectDescription: string,
        analysis: ProjectAnalysisResult,
        files: Array<{ name: string; content: string; language: string; path?: string }>
    ): string {
        const languages = Object.entries(analysis.languageDistribution || {})
            .map(([lang, pct]) => `- ${lang}: ${pct}%`)
            .join('\n');

        const frameworks = (analysis as any).frameworksDetected?.length 
            ? (analysis as any).frameworksDetected.map((f: string) => `- ${f}`).join('\n')
            : '- No frameworks detected';

        const recommendations = analysis.recommendations?.length
            ? analysis.recommendations.map(r => `- ${r}`).join('\n')
            : '- No specific recommendations at this time';

        const avgComplexity = analysis.complexity?.average || 0;
        const totalComplexity = analysis.complexity?.total || 0;

        return `# ${projectName}

## Executive Summary

${projectDescription || 'A comprehensive code analysis has been performed on this project.'}

## Project Overview

**Total Files:** ${analysis.totalFiles}  
**Lines of Code:** ${analysis.totalLinesOfCode.toLocaleString()}  
**Average Complexity:** ${avgComplexity.toFixed(2)}

## Technical Stack

### Languages
${languages}

### Frameworks & Libraries
${frameworks}

## Code Structure

- **Functions:** ${analysis.functionCount}
- **Classes:** ${analysis.classCount}
- **Interfaces:** ${analysis.interfaceCount}

## Code Quality Metrics

- **Total Complexity:** ${totalComplexity}
- **Average Complexity:** ${avgComplexity.toFixed(2)}
- **Maintainability:** ${avgComplexity < 10 ? 'Good' : avgComplexity < 20 ? 'Fair' : 'Needs Improvement'}

## File Structure

${files.slice(0, 10).map(f => `- \`${f.path || f.name}\` (${f.language})`).join('\n')}
${files.length > 10 ? `\n... and ${files.length - 10} more files` : ''}

## Recommendations

${recommendations}

## Getting Started

1. Clone the repository
2. Install dependencies
3. Review the code structure
4. Run the application

## Next Steps

- Review the code quality metrics
- Implement recommended improvements
- Add comprehensive tests
- Update documentation as needed

---

*This documentation was auto-generated from code analysis. For AI-powered comprehensive documentation, please ensure your Gemini API key is properly configured.*
`;
    }

    /**
     * Generate diagram description using AI
     */
    async generateDiagramDescription(
        projectName: string,
        diagramType: string,
        analysis: ProjectAnalysisResult,
        files: Array<{ name: string; content: string; language: string }>
    ): Promise<string> {
        try {
            logger.info('Generating diagram description', { projectName, diagramType });

            const codeSample = files.slice(0, 3).map(f => ({
                name: f.name,
                content: f.content.substring(0, 500)
            }));

            const prompt = `Generate a ${diagramType} diagram in Mermaid syntax for this project.

PROJECT: ${projectName}
FILES: ${analysis.totalFiles}
FUNCTIONS: ${analysis.functionCount}
CLASSES: ${analysis.classCount}

CODE SAMPLES:
${codeSample.map(s => `${s.name}:\n${s.content}`).join('\n\n')}

Generate a clear, well-structured ${diagramType} diagram in Mermaid format. Include:
- Main components/modules
- Key relationships
- Data flow (if applicable)
- Clear labels

Return ONLY the Mermaid diagram code, starting with the diagram type declaration.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const diagram = response.text();

            return diagram;

        } catch (error) {
            logger.error('Diagram generation failed', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            
            // Return fallback diagram
            return this.generateFallbackDiagram(projectName, diagramType, analysis, files);
        }
    }

    /**
     * Generate fallback diagram when AI is unavailable
     */
    private generateFallbackDiagram(
        projectName: string,
        diagramType: string,
        analysis: ProjectAnalysisResult,
        files: Array<{ name: string; content: string; language: string }>
    ): string {
        switch (diagramType.toLowerCase()) {
            case 'architecture':
                return `graph TB
    subgraph "${projectName}"
        A[Application Entry] --> B[Core Logic]
        B --> C[Data Layer]
        B --> D[API Layer]
        C --> E[(Database)]
        D --> F[External Services]
    end
    
    style A fill:#e1f5ff
    style B fill:#b3e5fc
    style C fill:#81d4fa
    style D fill:#4fc3f7
    style E fill:#29b6f6
    style F fill:#03a9f4`;

            case 'flowchart':
                return `flowchart TD
    Start([Start Application]) --> Init[Initialize]
    Init --> Process[Process Request]
    Process --> Decision{Valid?}
    Decision -->|Yes| Success[Execute Logic]
    Decision -->|No| Error[Handle Error]
    Success --> Response[Return Response]
    Error --> Response
    Response --> End([End])
    
    style Start fill:#4caf50
    style End fill:#f44336
    style Success fill:#81c784
    style Error fill:#e57373`;

            case 'class':
                const classNames = files
                    .filter(f => f.content.includes('class '))
                    .slice(0, 4)
                    .map(f => {
                        const match = f.content.match(/class\s+(\w+)/);
                        return match ? match[1] : 'Component';
                    });

                return `classDiagram
    ${classNames.length > 0 ? classNames.map((name, i) => `
    class ${name} {
        +properties
        +methods()
    }${i < classNames.length - 1 ? `\n    ${name} --> ${classNames[i + 1]}` : ''}`).join('\n') : `
    class MainClass {
        +property: string
        +method(): void
    }
    class SubClass {
        +data: any
        +process(): void
    }
    MainClass --> SubClass`}`;

            case 'sequence':
                return `sequenceDiagram
    participant User
    participant App
    participant API
    participant DB
    
    User->>App: Request
    App->>API: Process Request
    API->>DB: Query Data
    DB-->>API: Return Data
    API-->>App: Response
    App-->>User: Display Result`;

            case 'erd':
            case 'er':
                return `erDiagram
    USER ||--o{ PROJECT : creates
    PROJECT ||--|{ FILE : contains
    PROJECT ||--o{ ANALYSIS : has
    ANALYSIS ||--o{ METRIC : includes
    
    USER {
        string id PK
        string email
        string name
    }
    PROJECT {
        string id PK
        string userId FK
        string name
        string status
    }
    FILE {
        string id PK
        string projectId FK
        string name
        string content
    }
    ANALYSIS {
        string id PK
        string projectId FK
        int totalFiles
        int linesOfCode
    }`;

            default:
                return `graph LR
    A[${projectName}] --> B[Module 1]
    A --> C[Module 2]
    A --> D[Module 3]
    B --> E[Component A]
    C --> F[Component B]
    D --> G[Component C]`;
        }
    }

    /**
     * Generate code insights and recommendations
     */
    async generateInsights(
        analysis: ProjectAnalysisResult,
        files: Array<{ name: string; content: string }>
    ): Promise<string[]> {
        try {
            const prompt = `Analyze this codebase and provide 5-7 specific, actionable recommendations for improvement.

METRICS:
- Files: ${analysis.totalFiles}
- LOC: ${analysis.totalLinesOfCode}
- Functions: ${analysis.functionCount}
- Avg Complexity: ${analysis.complexity.average.toFixed(2)}

Provide recommendations in a JSON array format: ["recommendation 1", "recommendation 2", ...]
Focus on: code quality, architecture, security, performance, maintainability.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            try {
                return JSON.parse(text);
            } catch {
                // If not valid JSON, split by newlines
                return text.split('\n').filter(line => line.trim().length > 0);
            }

        } catch (error) {
            logger.error('Insight generation failed', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return ['Code quality looks good - maintain current standards'];
        }
    }
}

export const aiService = new AIService();
