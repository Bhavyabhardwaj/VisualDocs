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

            const prompt = `You are a world-class technical writer and senior software architect with 15+ years of experience. Your task is to create exceptional, production-ready documentation that will impress any developer who reads it.

PROJECT DETAILS:
- Name: ${projectName}
- Description: ${projectDescription || 'A sophisticated software project'}
- Total Files: ${analysis.totalFiles}
- Lines of Code: ${analysis.totalLinesOfCode.toLocaleString()}
- Functions: ${analysis.functionCount}
- Classes: ${analysis.classCount}
- Interfaces: ${analysis.interfaceCount}
- Complexity: Average ${analysis.complexity.average.toFixed(2)}, Total ${analysis.complexity.total}

LANGUAGE DISTRIBUTION:
${Object.entries(analysis.languageDistribution).map(([lang, count]) => `- ${lang}: ${count} files`).join('\n')}

DEPENDENCIES:
External: ${analysis.dependencies.external.join(', ') || 'None detected'}
Internal: ${analysis.dependencies.internal.length} modules

CODE SAMPLES (analyze these carefully):
${codeSamples.map((s, i) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 File ${i + 1}: ${s.name} (${s.language})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`${s.language}
${s.preview}
\`\`\`
`).join('\n')}

Create EXCEPTIONAL documentation in markdown format. Be specific, insightful, and thorough. Include:

# 📋 ${projectName} - Complete Documentation

## 🎯 Executive Summary
Write 2-3 compelling paragraphs that:
- Clearly explain what this project does and its purpose
- Highlight the key problems it solves
- Mention the tech stack and architectural approach
- Convey the project's value proposition

## 🏗️ Architecture Overview
Provide detailed architecture analysis:
- Describe the overall system design and patterns used (MVC, middleware, etc.)
- Explain how components interact with each other
- Include an ASCII diagram or describe the data flow
- Mention any architectural decisions you can infer from the code

## ✨ Key Features
Extract and list ALL major features from the code:
- Analyze function names and logic to identify features
- Group related features together
- Explain what each feature does in practical terms

## 🛠️ Technology Stack
Create a comprehensive tech breakdown:
| Category | Technology | Purpose |
|----------|------------|---------|
| ... | ... | ... |

## 📁 Project Structure
Explain the codebase organization:
\`\`\`
project/
├── ... (infer structure from file paths)
\`\`\`
Describe what each directory/file is responsible for.

## 📚 API Reference
Document key functions, middleware, classes:
### Function/Class Name
- **Purpose:** What it does
- **Parameters:** Input details
- **Returns:** Output details
- **Example usage:** Code snippet

## 🚀 Getting Started

### Prerequisites
List specific requirements based on dependencies.

### Installation
\`\`\`bash
# Provide specific commands
\`\`\`

### Configuration
Explain any environment variables or config needed.

### Running the Application
\`\`\`bash
# Commands to run
\`\`\`

## 💡 Usage Examples
Provide practical, copy-paste ready examples:
\`\`\`typescript
// Example 1: ...
\`\`\`

## 📊 Code Quality Analysis

### Metrics Summary
| Metric | Value | Assessment |
|--------|-------|------------|
| Complexity | ${analysis.complexity.average.toFixed(2)} | ... |
| Maintainability | ... | ... |
| Test Coverage | ... | ... |

### Strengths
- List specific positive patterns you see in the code
- Mention good practices being followed

### Areas of Excellence
Highlight particularly well-written code or patterns.

## 🔐 Security Analysis
Analyze security aspects:
- Authentication/authorization patterns found
- Input validation
- Security middleware in use
- Recommendations for security improvements

## ⚡ Performance Insights
- Identify any performance-related patterns
- Caching strategies
- Async operations
- Potential bottlenecks

## 📈 Recommendations
Provide specific, actionable improvements:
1. **Priority 1:** Critical improvements
2. **Priority 2:** Important enhancements
3. **Priority 3:** Nice-to-have additions

## 🧪 Testing Guide
Suggest testing strategies:
- Unit tests to write
- Integration tests needed
- Test coverage goals

## 📝 Contributing
Guidelines for contributors.

## 📄 License & Credits
Standard sections.

---
> 📖 *This documentation was generated by VisualDocs AI - Powered by advanced code analysis*

IMPORTANT INSTRUCTIONS:
- Be SPECIFIC to the actual code provided, not generic
- Extract REAL function names, classes, and patterns from the code samples
- Provide ACTIONABLE insights based on what you see
- Use emojis for visual appeal
- Include actual code examples where helpful
- Make developers say "WOW, this is amazing documentation!"
- If you see middleware, auth, rate limiting, etc., explain them in detail`;

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
            .map(([lang, pct]) => `| ${lang} | ${pct}% | Primary |`)
            .join('\n');

        const frameworks = (analysis as any).frameworksDetected?.length 
            ? (analysis as any).frameworksDetected.map((f: string) => `| ${f} | Framework | Core functionality |`).join('\n')
            : '| Express.js | Framework | Web server (inferred) |';

        const recommendations = analysis.recommendations?.length
            ? analysis.recommendations.map((r, i) => `${i + 1}. **Priority ${i + 1}:** ${r}`).join('\n')
            : '1. **Priority 1:** Add comprehensive unit tests\n2. **Priority 2:** Implement error monitoring\n3. **Priority 3:** Add API documentation with Swagger';

        const avgComplexity = analysis.complexity?.average || 0;
        const totalComplexity = analysis.complexity?.total || 0;
        
        const complexityRating = avgComplexity < 5 ? 'Excellent ✅' : avgComplexity < 10 ? 'Good 👍' : avgComplexity < 20 ? 'Fair ⚠️' : 'Needs Improvement 🔴';
        const maintainability = avgComplexity < 10 ? 'High' : avgComplexity < 20 ? 'Medium' : 'Low';

        // Extract function names from code
        const functionNames = files.slice(0, 5).flatMap(f => {
            const matches = f.content.match(/(?:function|const|async)\s+(\w+)/g) || [];
            return matches.slice(0, 3);
        }).slice(0, 10);

        // Analyze dependencies for tech stack
        const deps = analysis.dependencies?.external || [];
        const hasExpress = deps.includes('express');
        const hasJWT = deps.includes('jsonwebtoken');
        const hasHelmet = deps.includes('helmet');
        const hasCors = deps.includes('cors');
        const hasMulter = deps.includes('multer');
        const hasRateLimit = deps.includes('express-rate-limit');

        return `# 📋 ${projectName} - Complete Documentation

> ${projectDescription || '🚀 A professionally architected software project with enterprise-grade features'}

![Project Stats](https://img.shields.io/badge/Files-${analysis.totalFiles}-blue)
![Lines of Code](https://img.shields.io/badge/Lines-${analysis.totalLinesOfCode.toLocaleString()}-green)
![Complexity](https://img.shields.io/badge/Complexity-${avgComplexity.toFixed(1)}-${avgComplexity < 10 ? 'brightgreen' : avgComplexity < 20 ? 'yellow' : 'red'})

---

## 🎯 Executive Summary

This project represents a ${analysis.totalFiles > 20 ? 'large-scale' : analysis.totalFiles > 5 ? 'medium-sized' : 'focused'} ${Object.keys(analysis.languageDistribution || {})[0] || 'TypeScript'} application designed with modern software engineering practices. With **${analysis.totalLinesOfCode.toLocaleString()} lines of code** across **${analysis.totalFiles} files**, it demonstrates a well-organized architecture ${hasExpress ? 'built on Express.js' : 'using modern frameworks'}.

The codebase features **${analysis.functionCount} functions**${analysis.classCount > 0 ? `, **${analysis.classCount} classes**,` : ''} and maintains ${avgComplexity < 10 ? 'excellent' : 'reasonable'} code complexity (${avgComplexity.toFixed(2)} average), indicating ${maintainability.toLowerCase()} maintainability. ${hasJWT ? 'The application implements JWT-based authentication for secure access control.' : ''} ${hasRateLimit ? 'Rate limiting is implemented to prevent abuse.' : ''} ${hasHelmet ? 'Security headers are properly configured using Helmet.' : ''}

---

## 🏗️ Architecture Overview

### System Design

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    ${projectName.toUpperCase()}                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Middleware │──│  Controllers│──│  Services/Logic     │  │
│  │  Layer      │  │  Layer      │  │  Layer              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│         ▼                ▼                    ▼              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Security   │  │  Validation │  │  Data Access        │  │
│  │  (Auth/CORS)│  │  & Parsing  │  │  Layer              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Design Patterns Detected

${hasExpress ? '- **Middleware Pattern**: Request processing pipeline with composable middleware' : ''}
${hasJWT ? '- **Token-Based Auth**: Stateless JWT authentication for API security' : ''}
${hasRateLimit ? '- **Rate Limiting**: Protection against brute force and DDoS attacks' : ''}
${hasMulter ? '- **File Upload Handling**: Multipart form data processing' : ''}
- **Modular Architecture**: Separation of concerns with dedicated modules
- **Error Handling**: Centralized error management

---

## ✨ Key Features

${hasJWT ? '### 🔐 Authentication & Authorization\n- JWT token generation and validation\n- Secure password handling\n- Protected route middleware\n' : ''}
${hasRateLimit ? '### 🛡️ Rate Limiting\n- Request throttling to prevent abuse\n- Configurable limits per endpoint\n- IP-based tracking\n' : ''}
${hasHelmet ? '### 🔒 Security Headers\n- XSS protection\n- Content Security Policy\n- HSTS enforcement\n' : ''}
${hasCors ? '### 🌐 CORS Configuration\n- Cross-origin request handling\n- Configurable allowed origins\n' : ''}
${hasMulter ? '### 📁 File Upload\n- Multipart file handling\n- File validation and storage\n- Size limits and type checking\n' : ''}

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
${languages || '| TypeScript | 100% | Primary Language |'}
${frameworks}
${hasJWT ? '| jsonwebtoken | Library | JWT Authentication |' : ''}
${hasHelmet ? '| helmet | Library | Security Headers |' : ''}
${hasCors ? '| cors | Library | CORS Handling |' : ''}
${hasMulter ? '| multer | Library | File Upload |' : ''}
${hasRateLimit ? '| express-rate-limit | Library | Rate Limiting |' : ''}

---

## 📁 Project Structure

\`\`\`
${projectName}/
${files.slice(0, 15).map(f => `├── 📄 ${f.path || f.name}`).join('\n')}
${files.length > 15 ? `└── ... (${files.length - 15} more files)` : ''}
\`\`\`

### File Responsibilities

${files.slice(0, 8).map(f => {
    const name = f.name.replace(/\.(ts|js|tsx|jsx)$/, '');
    let description = 'Core module';
    if (name.includes('auth')) description = 'Authentication and authorization logic';
    else if (name.includes('error')) description = 'Error handling and responses';
    else if (name.includes('rate')) description = 'Rate limiting middleware';
    else if (name.includes('upload')) description = 'File upload handling';
    else if (name.includes('security')) description = 'Security configuration';
    else if (name.includes('database') || name.includes('db')) description = 'Database connection and queries';
    else if (name.includes('middleware')) description = 'Request processing middleware';
    else if (name.includes('index')) description = 'Module exports and initialization';
    else if (name.includes('logger')) description = 'Logging configuration';
    return `| \`${f.path || f.name}\` | ${description} |`;
}).join('\n')}

---

## 📊 Code Quality Analysis

### Metrics Dashboard

| Metric | Value | Assessment |
|--------|-------|------------|
| 📁 Total Files | ${analysis.totalFiles} | ${analysis.totalFiles > 50 ? 'Large project' : analysis.totalFiles > 20 ? 'Medium project' : 'Focused project'} |
| 📝 Lines of Code | ${analysis.totalLinesOfCode.toLocaleString()} | ${analysis.totalLinesOfCode > 10000 ? 'Enterprise scale' : analysis.totalLinesOfCode > 1000 ? 'Standard size' : 'Compact'} |
| ⚡ Functions | ${analysis.functionCount} | Well-decomposed |
| 🏛️ Classes | ${analysis.classCount} | ${analysis.classCount > 0 ? 'OOP patterns used' : 'Functional approach'} |
| 📋 Interfaces | ${analysis.interfaceCount} | ${analysis.interfaceCount > 0 ? 'Type-safe design' : 'Consider adding types'} |
| 🔄 Avg Complexity | ${avgComplexity.toFixed(2)} | ${complexityRating} |
| 📊 Total Complexity | ${totalComplexity} | ${complexityRating} |
| 🔧 Maintainability | ${maintainability} | ${maintainability === 'High' ? '✅ Easy to maintain' : maintainability === 'Medium' ? '⚠️ Moderate effort' : '🔴 Needs attention'} |

### Strengths Identified

${avgComplexity < 10 ? '✅ **Low Complexity**: Code is easy to understand and maintain\n' : ''}
${analysis.interfaceCount > 0 ? '✅ **Type Safety**: Interfaces ensure type-safe code\n' : ''}
${hasHelmet ? '✅ **Security Focus**: Security headers properly configured\n' : ''}
${hasJWT ? '✅ **Authentication**: Secure auth implementation\n' : ''}
${hasRateLimit ? '✅ **DDoS Protection**: Rate limiting prevents abuse\n' : ''}
✅ **Modular Design**: Code is organized into separate modules

---

## 🚀 Getting Started

### Prerequisites

\`\`\`bash
# Required
- Node.js >= 16.x
- npm >= 8.x or yarn >= 1.22
${deps.includes('prisma') ? '- PostgreSQL or MySQL database' : ''}
\`\`\`

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${projectName.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
\`\`\`

### Configuration

Create a \`.env\` file with the following variables:

\`\`\`env
PORT=3000
NODE_ENV=development
${hasJWT ? 'JWT_SECRET=your-secret-key\nJWT_EXPIRES_IN=7d' : ''}
${deps.includes('prisma') ? 'DATABASE_URL=postgresql://user:password@localhost:5432/db' : ''}
\`\`\`

### Running the Application

\`\`\`bash
# Development mode
npm run dev

# Production mode
npm run build
npm start

# Run tests
npm test
\`\`\`

---

## 🔐 Security Considerations

${hasHelmet ? '### ✅ Security Headers (Helmet)\n- XSS Protection enabled\n- Content-Type sniffing prevented\n- Clickjacking protection\n' : '### ⚠️ Security Headers\n- Consider adding Helmet for security headers\n'}

${hasJWT ? '### ✅ Authentication\n- JWT tokens for stateless auth\n- Token expiration configured\n- Secure token handling\n' : '### ⚠️ Authentication\n- Consider implementing JWT authentication\n'}

${hasRateLimit ? '### ✅ Rate Limiting\n- Brute force protection\n- DDoS mitigation\n' : '### ⚠️ Rate Limiting\n- Consider adding rate limiting\n'}

${hasCors ? '### ✅ CORS\n- Cross-origin requests properly configured\n' : '### ⚠️ CORS\n- Consider adding CORS configuration\n'}

---

## 📈 Recommendations

${recommendations}

---

## 🧪 Testing Guide

### Recommended Test Coverage

\`\`\`bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
\`\`\`

### Priority Test Cases

1. **Authentication flows** - Login, logout, token refresh
2. **API endpoints** - Request/response validation
3. **Middleware** - Error handling, rate limiting
4. **Data validation** - Input sanitization

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**📖 Generated by VisualDocs AI**

*Transforming code into comprehensive documentation*

![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red)
![Powered by AI](https://img.shields.io/badge/Powered%20by-AI-blue)

</div>
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

            // Get more code samples for better analysis
            const codeSample = files.slice(0, 8).map(f => ({
                name: f.name,
                content: f.content.substring(0, 800)
            }));

            // Extract dependencies
            const deps = analysis.dependencies?.external || [];
            const hasExpress = deps.includes('express');
            const hasJWT = deps.includes('jsonwebtoken');
            const hasDatabase = deps.some(d => ['prisma', 'mongoose', 'sequelize', 'typeorm', 'pg', 'mysql'].includes(d));

            const diagramPrompts: Record<string, string> = {
                architecture: `Create a STUNNING architecture diagram showing:
- All layers (Presentation, Business Logic, Data Access, External Services)
- Middleware chain (auth, validation, rate limiting, error handling)
- Database connections and caching layers
- External API integrations
- Security boundaries
- Use subgraphs to group related components
- Add icons/emojis in labels where appropriate
- Use gradient colors for visual appeal`,

                flowchart: `Create a COMPREHENSIVE flowchart showing:
- Complete request/response lifecycle
- All decision points with Yes/No branches
- Error handling paths
- Async operations
- Middleware processing steps
- Database operations
- Response formatting
- Use different shapes for different node types
- Add colors to indicate success/error/warning paths`,

                class: `Create a DETAILED class diagram showing:
- All classes, interfaces, and types found in the code
- Properties with types
- Methods with return types
- Inheritance relationships (extends)
- Implementation relationships (implements)
- Composition and aggregation
- Access modifiers (+public, -private, #protected)
- Abstract classes and interfaces`,

                sequence: `Create a DETAILED sequence diagram showing:
- All participants (Client, Server, Middleware, Controllers, Services, Database)
- Authentication flow
- Request validation
- Business logic execution
- Database queries
- Response formatting
- Error handling scenarios
- Use activation boxes
- Show async operations with proper notation`,

                er: `Create a COMPREHENSIVE ER diagram showing:
- All entities/tables
- Primary keys (PK) and Foreign keys (FK)
- All attributes with types
- Relationships (one-to-one, one-to-many, many-to-many)
- Cardinality notation
- Optional vs required relationships`,

                component: `Create a DETAILED component diagram showing:
- All major components/modules
- Interfaces between components
- Dependencies
- Data flow direction
- External systems
- Use nested subgraphs for complex systems`
            };

            const prompt = `You are an expert software architect and diagram designer. Create a PROFESSIONAL, VISUALLY STUNNING Mermaid diagram.

PROJECT: ${projectName}
TYPE: ${diagramType.toUpperCase()} DIAGRAM
FILES: ${analysis.totalFiles} files, ${analysis.totalLinesOfCode.toLocaleString()} lines of code
FUNCTIONS: ${analysis.functionCount}
CLASSES: ${analysis.classCount}
DEPENDENCIES: ${deps.join(', ') || 'Standard libraries'}

CODE SAMPLES TO ANALYZE:
${codeSample.map(s => `
━━━ ${s.name} ━━━
${s.content}
`).join('\n')}

${diagramPrompts[diagramType.toLowerCase()] || diagramPrompts.architecture}

CRITICAL REQUIREMENTS:
1. Extract REAL component names, function names, and class names from the code
2. Show ACTUAL relationships you can see in the code
3. Use professional styling with colors:
   - Primary components: fill:#6366f1 (indigo)
   - Secondary components: fill:#8b5cf6 (violet)
   - Data/DB: fill:#10b981 (emerald)
   - External services: fill:#f59e0b (amber)
   - Security: fill:#ef4444 (red)
   - Success paths: fill:#22c55e (green)
4. Add descriptive labels on connections
5. Use subgraphs to organize related components
6. Make it detailed but readable
7. Include at least 10-15 nodes for complexity

Return ONLY valid Mermaid syntax code. No markdown code blocks, no explanations.
Start directly with: graph, flowchart, classDiagram, sequenceDiagram, or erDiagram`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let diagram = response.text();
            
            // Clean up the response - remove markdown code blocks if present
            diagram = diagram.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();

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
        // Extract real names from files
        const fileNames = files.slice(0, 10).map(f => f.name.replace(/\.(ts|js|tsx|jsx)$/, ''));
        const deps = analysis.dependencies?.external || [];
        
        // Detect patterns
        const hasAuth = fileNames.some(n => n.toLowerCase().includes('auth'));
        const hasMiddleware = fileNames.some(n => n.toLowerCase().includes('middleware'));
        const hasDatabase = fileNames.some(n => n.toLowerCase().includes('database') || n.toLowerCase().includes('db'));
        const hasUpload = fileNames.some(n => n.toLowerCase().includes('upload'));
        const hasError = fileNames.some(n => n.toLowerCase().includes('error'));
        const hasSecurity = fileNames.some(n => n.toLowerCase().includes('security'));
        const hasRateLimit = fileNames.some(n => n.toLowerCase().includes('rate'));

        switch (diagramType.toLowerCase()) {
            case 'architecture':
                return `graph TB
    subgraph Client["🌐 Client Layer"]
        WEB["🖥️ Web Browser"]
        MOBILE["📱 Mobile App"]
        API_CLIENT["⚡ API Client"]
    end

    subgraph Gateway["🚪 API Gateway"]
        LB["⚖️ Load Balancer"]
        RATE["🛡️ Rate Limiter"]
    end

    subgraph Security["🔐 Security Layer"]
        ${hasAuth ? 'AUTH["🔑 Authentication\\n(JWT/OAuth)"]' : 'AUTH["🔑 Auth Middleware"]'}
        CORS["🌍 CORS Handler"]
        ${hasSecurity ? 'HELMET["🛡️ Security Headers\\n(Helmet)"]' : 'HELMET["🛡️ Security"]'}
    end

    subgraph Middleware["⚙️ Middleware Chain"]
        VALIDATE["✅ Request Validation"]
        PARSE["📋 Body Parser"]
        ${hasError ? 'ERROR["❌ Error Handler"]' : 'ERROR["❌ Error Handler"]'}
        LOG["📝 Request Logger"]
    end

    subgraph Business["💼 Business Logic"]
        CONTROLLER["🎮 Controllers"]
        SERVICE["⚡ Services"]
        ${hasUpload ? 'UPLOAD["📁 File Upload\\n(Multer)"]' : ''}
    end

    subgraph Data["💾 Data Layer"]
        ${hasDatabase ? 'ORM["🔄 ORM/Prisma"]' : 'ORM["🔄 Data Access"]'}
        DB[("🗄️ Database\\nPostgreSQL")]
        CACHE["⚡ Redis Cache"]
    end

    subgraph External["🌍 External Services"]
        EMAIL["📧 Email Service"]
        STORAGE["☁️ Cloud Storage"]
        THIRD["🔌 Third-party APIs"]
    end

    WEB --> LB
    MOBILE --> LB
    API_CLIENT --> LB
    LB --> RATE
    RATE --> AUTH
    AUTH --> CORS
    CORS --> HELMET
    HELMET --> VALIDATE
    VALIDATE --> PARSE
    PARSE --> LOG
    LOG --> CONTROLLER
    CONTROLLER --> SERVICE
    SERVICE --> ORM
    ORM --> DB
    SERVICE --> CACHE
    SERVICE --> EMAIL
    SERVICE --> STORAGE
    SERVICE --> THIRD
    CONTROLLER --> ERROR

    style WEB fill:#6366f1,stroke:#4f46e5,color:#fff
    style MOBILE fill:#6366f1,stroke:#4f46e5,color:#fff
    style API_CLIENT fill:#6366f1,stroke:#4f46e5,color:#fff
    style LB fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style RATE fill:#f59e0b,stroke:#d97706,color:#fff
    style AUTH fill:#ef4444,stroke:#dc2626,color:#fff
    style CORS fill:#ef4444,stroke:#dc2626,color:#fff
    style HELMET fill:#ef4444,stroke:#dc2626,color:#fff
    style CONTROLLER fill:#3b82f6,stroke:#2563eb,color:#fff
    style SERVICE fill:#3b82f6,stroke:#2563eb,color:#fff
    style DB fill:#10b981,stroke:#059669,color:#fff
    style CACHE fill:#10b981,stroke:#059669,color:#fff
    style ORM fill:#10b981,stroke:#059669,color:#fff
    style ERROR fill:#ef4444,stroke:#dc2626,color:#fff`;

            case 'flowchart':
                return `flowchart TD
    subgraph Request["📥 Incoming Request"]
        START(("🚀 Start"))
        REQ["📨 HTTP Request"]
    end

    subgraph Security["🔐 Security Checks"]
        RATE{"🛡️ Rate Limit\\nExceeded?"}
        AUTH{"🔑 Valid\\nToken?"}
        PERM{"👤 Has\\nPermission?"}
    end

    subgraph Validation["✅ Validation"]
        VALIDATE{"📋 Valid\\nInput?"}
        SANITIZE["🧹 Sanitize Data"]
    end

    subgraph Processing["⚡ Processing"]
        ROUTE["🛣️ Route Handler"]
        CONTROLLER["🎮 Controller"]
        SERVICE["💼 Business Logic"]
        DB_OP["💾 Database Operation"]
    end

    subgraph Response["📤 Response"]
        FORMAT["📦 Format Response"]
        SUCCESS["✅ 200 OK"]
        ERROR_400["⚠️ 400 Bad Request"]
        ERROR_401["🔒 401 Unauthorized"]
        ERROR_403["🚫 403 Forbidden"]
        ERROR_429["🛑 429 Too Many Requests"]
        ERROR_500["💥 500 Server Error"]
    end

    END(("🏁 End"))

    START --> REQ
    REQ --> RATE
    RATE -->|"Yes"| ERROR_429
    RATE -->|"No"| AUTH
    AUTH -->|"No"| ERROR_401
    AUTH -->|"Yes"| PERM
    PERM -->|"No"| ERROR_403
    PERM -->|"Yes"| VALIDATE
    VALIDATE -->|"No"| ERROR_400
    VALIDATE -->|"Yes"| SANITIZE
    SANITIZE --> ROUTE
    ROUTE --> CONTROLLER
    CONTROLLER --> SERVICE
    SERVICE --> DB_OP
    DB_OP -->|"Success"| FORMAT
    DB_OP -->|"Error"| ERROR_500
    FORMAT --> SUCCESS
    SUCCESS --> END
    ERROR_400 --> END
    ERROR_401 --> END
    ERROR_403 --> END
    ERROR_429 --> END
    ERROR_500 --> END

    style START fill:#22c55e,stroke:#16a34a,color:#fff
    style END fill:#ef4444,stroke:#dc2626,color:#fff
    style SUCCESS fill:#22c55e,stroke:#16a34a,color:#fff
    style ERROR_400 fill:#f59e0b,stroke:#d97706,color:#fff
    style ERROR_401 fill:#ef4444,stroke:#dc2626,color:#fff
    style ERROR_403 fill:#ef4444,stroke:#dc2626,color:#fff
    style ERROR_429 fill:#f59e0b,stroke:#d97706,color:#fff
    style ERROR_500 fill:#ef4444,stroke:#dc2626,color:#fff
    style SERVICE fill:#6366f1,stroke:#4f46e5,color:#fff
    style CONTROLLER fill:#6366f1,stroke:#4f46e5,color:#fff
    style DB_OP fill:#10b981,stroke:#059669,color:#fff`;

            case 'class':
                // Extract class/interface info from files
                const classes: string[] = [];
                const interfaces: string[] = [];
                
                files.forEach(f => {
                    const classMatches = f.content.match(/class\s+(\w+)/g) || [];
                    const interfaceMatches = f.content.match(/interface\s+(\w+)/g) || [];
                    classMatches.forEach(m => classes.push(m.replace('class ', '')));
                    interfaceMatches.forEach(m => interfaces.push(m.replace('interface ', '')));
                });

                const uniqueClasses = [...new Set(classes)].slice(0, 6);
                const uniqueInterfaces = [...new Set(interfaces)].slice(0, 4);

                return `classDiagram
    class BaseController {
        <<abstract>>
        #request: Request
        #response: Response
        +handleRequest()* void
        +sendSuccess(data) Response
        +sendError(error) Response
    }

    class AuthMiddleware {
        <<middleware>>
        -jwtSecret: string
        +authenticate(req, res, next) void
        +validateToken(token) boolean
        -decodeToken(token) Payload
    }

    class UserService {
        <<service>>
        -userRepository: Repository
        +findById(id) User
        +create(data) User
        +update(id, data) User
        +delete(id) void
    }

    class DatabaseService {
        <<singleton>>
        -connection: Connection
        -pool: Pool
        +getInstance() DatabaseService
        +query(sql) Result
        +transaction(fn) void
    }

    class ErrorHandler {
        <<middleware>>
        +handle(error, req, res) void
        +logError(error) void
        -formatError(error) ErrorResponse
    }

    class RateLimiter {
        <<middleware>>
        -windowMs: number
        -maxRequests: number
        +limit(req, res, next) void
        -checkLimit(ip) boolean
    }

    ${uniqueInterfaces.slice(0, 2).map(i => `
    class ${i} {
        <<interface>>
        +id: string
        +createdAt: Date
        +updatedAt: Date
    }`).join('\n')}

    BaseController <|-- UserController
    BaseController <|-- ProjectController
    UserService ..> DatabaseService : uses
    AuthMiddleware ..> UserService : validates
    ErrorHandler ..> BaseController : handles errors
    RateLimiter --> AuthMiddleware : before`;

            case 'sequence':
                return `sequenceDiagram
    autonumber
    
    actor User as 👤 User
    participant Client as 🌐 Client
    participant Gateway as 🚪 API Gateway
    participant Auth as 🔐 Auth Service
    participant API as ⚡ API Server
    participant Cache as ⚡ Redis Cache
    participant DB as 🗄️ Database
    participant Email as 📧 Email Service

    rect rgb(240, 253, 244)
        Note over User,Email: 🔐 Authentication Flow
        User->>+Client: Enter Credentials
        Client->>+Gateway: POST /api/auth/login
        Gateway->>+Auth: Validate Request
        Auth->>+DB: Find User
        DB-->>-Auth: User Data
        Auth->>Auth: Verify Password
        Auth->>Auth: Generate JWT
        Auth-->>-Gateway: JWT Token
        Gateway-->>-Client: 200 OK + Token
        Client->>Client: Store Token
        Client-->>-User: Login Success
    end

    rect rgb(254, 249, 195)
        Note over User,Email: 📊 Data Request Flow
        User->>+Client: Request Data
        Client->>+Gateway: GET /api/data (+ JWT)
        Gateway->>+Auth: Verify Token
        Auth-->>-Gateway: Token Valid
        Gateway->>+API: Forward Request
        API->>+Cache: Check Cache
        
        alt Cache Hit
            Cache-->>API: Cached Data
        else Cache Miss
            Cache-->>-API: Not Found
            API->>+DB: Query Data
            DB-->>-API: Result Set
            API->>Cache: Store in Cache
        end
        
        API-->>-Gateway: Response Data
        Gateway-->>-Client: 200 OK + Data
        Client-->>-User: Display Data
    end

    rect rgb(254, 226, 226)
        Note over User,Email: ❌ Error Handling
        User->>+Client: Invalid Request
        Client->>+Gateway: POST /api/action
        Gateway->>+API: Process Request
        API->>API: Validation Failed
        API-->>-Gateway: 400 Bad Request
        Gateway-->>-Client: Error Response
        Client-->>-User: Show Error Message
    end`;

            case 'erd':
            case 'er':
                return `erDiagram
    USER ||--o{ PROJECT : creates
    USER ||--o{ SESSION : has
    USER ||--o{ COMMENT : writes
    USER {
        uuid id PK "Primary Key"
        string email UK "Unique Email"
        string password_hash "Encrypted"
        string name "Display Name"
        string avatar_url "Profile Picture"
        enum role "USER|ADMIN"
        boolean is_verified "Email Verified"
        datetime created_at "Registration Date"
        datetime updated_at "Last Modified"
        datetime last_login "Last Login Time"
    }

    PROJECT ||--|{ CODE_FILE : contains
    PROJECT ||--o| ANALYSIS : has
    PROJECT ||--o{ DIAGRAM : has
    PROJECT ||--o{ COMMENT : has
    PROJECT {
        uuid id PK "Primary Key"
        uuid user_id FK "Owner Reference"
        string name "Project Name"
        text description "Project Description"
        enum status "ACTIVE|ARCHIVED|DELETED"
        enum visibility "PRIVATE|PUBLIC|TEAM"
        string github_url "GitHub Repository"
        int file_count "Total Files"
        datetime created_at "Creation Date"
        datetime updated_at "Last Modified"
    }

    CODE_FILE ||--o{ DIAGRAM : generates
    CODE_FILE {
        uuid id PK "Primary Key"
        uuid project_id FK "Project Reference"
        string name "File Name"
        string path "File Path"
        text content "File Content"
        string language "Programming Language"
        int size "File Size (bytes)"
        string hash "Content Hash"
        json ast "Abstract Syntax Tree"
        datetime created_at "Upload Date"
    }

    ANALYSIS {
        uuid id PK "Primary Key"
        uuid project_id FK UK "One per Project"
        int total_files "File Count"
        int total_loc "Lines of Code"
        int total_complexity "Complexity Score"
        float avg_complexity "Average Complexity"
        int function_count "Total Functions"
        int class_count "Total Classes"
        json language_dist "Language Distribution"
        json dependencies "Project Dependencies"
        datetime completed_at "Analysis Completion"
    }

    DIAGRAM {
        uuid id PK "Primary Key"
        uuid project_id FK "Project Reference"
        uuid code_file_id FK "Source File"
        enum type "ARCHITECTURE|FLOWCHART|CLASS|SEQUENCE|ER"
        string title "Diagram Title"
        text content "Mermaid Code"
        enum status "PENDING|GENERATING|COMPLETED|FAILED"
        int generation_time "Time in ms"
        datetime created_at "Creation Date"
    }

    SESSION {
        uuid id PK "Primary Key"
        uuid user_id FK "User Reference"
        uuid project_id FK "Active Project"
        string title "Session Name"
        boolean is_active "Currently Active"
        json collaborators "Active Users"
        datetime last_activity "Last Activity"
    }

    COMMENT {
        uuid id PK "Primary Key"
        uuid user_id FK "Author Reference"
        uuid project_id FK "Project Reference"
        text content "Comment Text"
        json position "Position on Diagram"
        datetime created_at "Post Date"
    }`;

            case 'component':
                return `graph TB
    subgraph Frontend["🖥️ Frontend Application"]
        subgraph Pages["📄 Pages"]
            DASHBOARD["📊 Dashboard"]
            PROJECTS["📁 Projects"]
            ANALYSIS["🔍 Analysis"]
            DIAGRAMS["📈 Diagrams"]
        end
        
        subgraph Components["🧩 Components"]
            NAV["🧭 Navigation"]
            SIDEBAR["📋 Sidebar"]
            MODAL["💬 Modals"]
            FORMS["📝 Forms"]
        end
        
        subgraph State["💾 State Management"]
            CONTEXT["🔄 React Context"]
            HOOKS["🪝 Custom Hooks"]
        end
    end

    subgraph Backend["⚡ Backend Services"]
        subgraph API["🔌 API Layer"]
            ROUTES["🛣️ Routes"]
            CONTROLLERS["🎮 Controllers"]
            MIDDLEWARE["⚙️ Middleware"]
        end
        
        subgraph Services["💼 Business Logic"]
            AUTH_SVC["🔐 Auth Service"]
            PROJECT_SVC["📁 Project Service"]
            ANALYSIS_SVC["🔍 Analysis Service"]
            AI_SVC["🤖 AI Service"]
        end
        
        subgraph Data["💾 Data Access"]
            PRISMA["🔄 Prisma ORM"]
            MODELS["📋 Models"]
        end
    end

    subgraph External["🌍 External Services"]
        GEMINI["🤖 Gemini AI"]
        GITHUB["🐙 GitHub API"]
        S3["☁️ Cloud Storage"]
        REDIS["⚡ Redis Cache"]
    end

    subgraph Database["🗄️ Database"]
        POSTGRES[("🐘 PostgreSQL")]
    end

    DASHBOARD --> CONTEXT
    PROJECTS --> CONTEXT
    CONTEXT --> ROUTES
    ROUTES --> CONTROLLERS
    CONTROLLERS --> MIDDLEWARE
    MIDDLEWARE --> AUTH_SVC
    CONTROLLERS --> PROJECT_SVC
    CONTROLLERS --> ANALYSIS_SVC
    ANALYSIS_SVC --> AI_SVC
    AI_SVC --> GEMINI
    PROJECT_SVC --> PRISMA
    PRISMA --> POSTGRES
    PROJECT_SVC --> GITHUB
    PROJECT_SVC --> S3
    AUTH_SVC --> REDIS

    style DASHBOARD fill:#6366f1,color:#fff
    style PROJECTS fill:#6366f1,color:#fff
    style CONTROLLERS fill:#8b5cf6,color:#fff
    style AI_SVC fill:#f59e0b,color:#fff
    style GEMINI fill:#10b981,color:#fff
    style POSTGRES fill:#3b82f6,color:#fff`;

            default:
                return `graph LR
    subgraph "${projectName}"
        A["📱 Client"] --> B["🚪 Gateway"]
        B --> C["🔐 Auth"]
        C --> D["⚡ API"]
        D --> E["💼 Services"]
        E --> F[("💾 Database")]
    end
    
    style A fill:#6366f1,color:#fff
    style B fill:#8b5cf6,color:#fff
    style C fill:#ef4444,color:#fff
    style D fill:#3b82f6,color:#fff
    style E fill:#10b981,color:#fff
    style F fill:#f59e0b,color:#fff`;
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
