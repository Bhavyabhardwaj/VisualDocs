export interface DiagramRequest {
    projectId: string;
    type: 'ARCHITECTURE' | 'FLOWCHART' | 'SEQUENCE' | 'CLASS' | 'ER' | 'COMPONENT';
    title?: string;
    description?: string;
    style: 'MODERN' | 'MINIMALIST' | 'DETAILED' | 'COLORFUL';
    codeFileIds?: string[]; // specific files to include    
    options?: {
        includeFiles?: string[]; // specific files to include
        focus?: string; // focus on a specific module or component
        customPrompt?: string; // custom prompt for AI generation
    };
};

export interface DiagramGenerationOptions {
  includeFiles?: string[];
  focus?: string;
  customPrompt?: string;
}