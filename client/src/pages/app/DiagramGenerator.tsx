import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, GitBranch, Database, FileCode, Download, 
  RefreshCw, Settings, Maximize2, Code2, Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumLayout } from '@/components/layout/PremiumLayout';

interface DiagramType {
  id: string;
  name: string;
  description: string;
  icon: typeof Network;
}

export const DiagramGenerator = () => {
  const [selectedType, setSelectedType] = useState('architecture');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDiagram, setGeneratedDiagram] = useState<string | null>(null);

  const diagramTypes: DiagramType[] = [
    {
      id: 'architecture',
      name: 'Architecture',
      description: 'System architecture and component relationships',
      icon: Network,
    },
    {
      id: 'flowchart',
      name: 'Flow Chart',
      description: 'Code execution flow and logic paths',
      icon: GitBranch,
    },
    {
      id: 'database',
      name: 'Database Schema',
      description: 'Entity relationships and data models',
      icon: Database,
    },
    {
      id: 'class',
      name: 'Class Diagram',
      description: 'Object-oriented structure and inheritance',
      icon: FileCode,
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedDiagram('generated-diagram-url');
    setIsGenerating(false);
  };

  return (
    <PremiumLayout>
      <div className="flex h-full bg-white">
        {/* Left Panel - Diagram Types */}
        <div className="w-80 border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold mb-1">Diagram Generator</h2>
          <p className="text-sm text-neutral-600">
            AI-powered visual documentation
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {diagramTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <motion.button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all",
                  isSelected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-white border-neutral-200 hover:border-foreground/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">{type.name}</div>
                    <div className={cn(
                      "text-xs",
                      isSelected ? "text-background/70" : "text-neutral-600"
                    )}>
                      {type.description}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Generate Button */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Diagram
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel - Preview/Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-neutral-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Code2 className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm hover:bg-muted rounded transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          {isGenerating ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-neutral-600">Analyzing codebase...</p>
                <p className="text-xs text-neutral-600 mt-1">This may take a few seconds</p>
              </div>
            </div>
          ) : generatedDiagram ? (
            <div className="bg-muted rounded-lg p-8 min-h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-full max-w-4xl aspect-video bg-white border border-neutral-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-neutral-600">
                    <Network className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-sm">Generated {selectedType} diagram</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No diagram generated yet</h3>
                <p className="text-sm text-neutral-600 mb-6">
                  Select a diagram type and click "Generate Diagram" to create AI-powered visual documentation
                </p>
                <div className="flex flex-col gap-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Automatically analyzes your codebase
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Generates professional diagrams
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Export as SVG, PNG, or PDF
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </PremiumLayout>
  );
};

