import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { PageWrapper } from '@/components/app/PageWrapper';
import { EmptyState } from '@/components/app/LoadingStates';
import {
  Workflow,
  Sparkles,
  Download,
  Share,
  RefreshCw,
  Eye,
  Settings,
  Plus,
  GitBranch,
  Database,
  Network,
  Layers,
  Box,
  Zap
} from 'lucide-react';

const diagramTypes = [
  {
    id: 'architecture',
    name: 'System Architecture',
    description: 'High-level system components and relationships',
    icon: Layers,
    color: 'from-blue-500 to-blue-600',
    estimatedTime: '2-3 minutes',
    complexity: 'Medium'
  },
  {
    id: 'flow',
    name: 'Data Flow',
    description: 'How data moves through your application',
    icon: GitBranch,
    color: 'from-green-500 to-green-600',
    estimatedTime: '1-2 minutes',
    complexity: 'Low'
  },
  {
    id: 'database',
    name: 'Database Schema',
    description: 'Entity relationships and database structure',
    icon: Database,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '3-4 minutes',
    complexity: 'High'
  },
  {
    id: 'api',
    name: 'API Structure',
    description: 'REST endpoints and service interactions',
    icon: Network,
    color: 'from-orange-500 to-orange-600',
    estimatedTime: '2-3 minutes',
    complexity: 'Medium'
  },
  {
    id: 'component',
    name: 'Component Tree',
    description: 'React/Vue component hierarchy',
    icon: Box,
    color: 'from-cyan-500 to-cyan-600',
    estimatedTime: '1-2 minutes',
    complexity: 'Low'
  },
  {
    id: 'sequence',
    name: 'Sequence Diagram',
    description: 'Process flow and interaction sequences',
    icon: Zap,
    color: 'from-pink-500 to-pink-600',
    estimatedTime: '2-4 minutes',
    complexity: 'Medium'
  }
];

const generatedDiagrams = [
  {
    id: '1',
    type: 'architecture',
    name: 'Main System Architecture',
    description: 'Overview of the entire system architecture',
    createdAt: '2 hours ago',
    status: 'completed',
    preview: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=System+Architecture'
  },
  {
    id: '2',
    type: 'flow',
    name: 'User Authentication Flow',
    description: 'Login and registration process flow',
    createdAt: '1 day ago',
    status: 'completed',
    preview: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Data+Flow'
  },
  {
    id: '3',
    type: 'database',
    name: 'User Database Schema',
    description: 'User-related database tables and relationships',
    createdAt: '3 days ago',
    status: 'completed',
    preview: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Database+Schema'
  }
];

export const Diagrams: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery'>('generate');

  const handleGenerate = async (typeId: string) => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setActiveTab('gallery');
    }, 3000);
  };

  return (
    <PageWrapper
      title="AI Diagrams"
      description="Generate beautiful architecture diagrams from your code"
      actions={
        <>
          <Button variant="outline" icon={<Share className="w-4 h-4" />}>
            Share Gallery
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            Custom Diagram
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-1">
          <Button
            variant={activeTab === 'generate' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('generate')}
            className="flex-1"
          >
            Generate New
          </Button>
          <Button
            variant={activeTab === 'gallery' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('gallery')}
            className="flex-1"
          >
            Gallery ({generatedDiagrams.length})
          </Button>
        </div>

        {activeTab === 'generate' ? (
          <div className="space-y-8">
            {/* AI Generation Status */}
            {isGenerating && (
              <Card variant="elevated" className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                        AI is analyzing your code...
                      </h3>
                      <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        Creating a beautiful {diagramTypes.find(t => t.id === selectedType)?.name} diagram
                      </p>
                      <div className="mt-2 w-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Diagram Type Selection */}
            <div>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
                Choose Diagram Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diagramTypes.map((type) => (
                  <Card
                    key={type.id}
                    variant="elevated"
                    hover
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedType === type.id
                        ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : ''
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-light-text dark:text-dark-text mb-2">
                            {type.name}
                          </h3>
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            {type.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            <span>⏱️ {type.estimatedTime}</span>
                            <span>📊 {type.complexity}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Generation Options */}
            {selectedType && (
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Generation Options</CardTitle>
                  <CardDescription>
                    Customize your {diagramTypes.find(t => t.id === selectedType)?.name} diagram
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                        Style
                      </label>
                      <select className="w-full px-3 py-2 border app-border rounded-md bg-white dark:bg-dark-bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="modern">Modern (Recommended)</option>
                        <option value="minimal">Minimal</option>
                        <option value="detailed">Detailed</option>
                        <option value="flowchart">Flowchart Style</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                        Complexity Level
                      </label>
                      <select className="w-full px-3 py-2 border app-border rounded-md bg-white dark:bg-dark-bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="high">High Detail</option>
                        <option value="medium">Medium Detail (Recommended)</option>
                        <option value="low">Overview Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Focus Areas (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Authentication', 'Database', 'API Routes', 'Frontend', 'Services', 'External APIs'].map((area) => (
                        <button
                          key={area}
                          className="px-3 py-1 text-sm border app-border rounded-full hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-colors"
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t app-border">
                    <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Estimated generation time: {diagramTypes.find(t => t.id === selectedType)?.estimatedTime}
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline">
                        Preview Settings
                      </Button>
                      <Button
                        icon={<Sparkles className="w-4 h-4" />}
                        onClick={() => handleGenerate(selectedType)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Generate Diagram'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generated Diagrams Gallery */}
            {generatedDiagrams.length === 0 ? (
              <EmptyState
                icon={<Workflow className="w-12 h-12" />}
                title="No diagrams yet"
                description="Generate your first AI-powered diagram to get started"
                action={
                  <Button
                    icon={<Sparkles className="w-4 h-4" />}
                    onClick={() => setActiveTab('generate')}
                  >
                    Generate First Diagram
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedDiagrams.map((diagram) => (
                  <Card key={diagram.id} variant="elevated" hover>
                    <CardContent className="p-0">
                      {/* Diagram Preview */}
                      <div className="aspect-video bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-t-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center">
                          <div className="text-center">
                            <Workflow className="w-12 h-12 text-primary-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                              {diagramTypes.find(t => t.id === diagram.type)?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Diagram Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-light-text dark:text-dark-text">
                            {diagram.name}
                          </h3>
                          <span className="text-xs text-success-600 bg-success-50 dark:bg-success-900/20 px-2 py-1 rounded-full">
                            Completed
                          </span>
                        </div>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                          {diagram.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            Created {diagram.createdAt}
                          </span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <Share className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
