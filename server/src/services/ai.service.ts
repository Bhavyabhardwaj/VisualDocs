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
            throw error;
        }
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
            throw error;
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
