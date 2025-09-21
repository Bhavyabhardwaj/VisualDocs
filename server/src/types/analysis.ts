export interface FileAnalysisResult {
    fileId: string;
    fileName: string;
    language: string;
    linesOfCode: number;
    functions: string[];
    classes: string[];
    interfaces: string[];
    imports: string[];
    complexity: number;
}

export interface ProjectAnalysisResult {
    id: string;
    projectId: string;
    totalFiles: number;
    totalLinesOfCode: number;
    functionCount: number;
    classCount: number;
    interfaceCount: number;
    complexity: {
        total: number;
        average: number;
        distribution: {
            low: number;
            medium: number;
            high: number;
            critical: number;
        };
    };
    languageDistribution: Record<string, number>;
    dependencies: {
        internal: string[];
        external: string[];
    };
    recommendations: string[];
    completedAt: Date;
}
