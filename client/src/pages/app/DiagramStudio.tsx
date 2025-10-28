import { useState, useRef } from 'react';
import {
  Plus, Download, Save, Undo2, Redo2, ZoomIn, ZoomOut, Move,
  Square, Circle, ArrowRight, Type, Image, Sparkles, Layers,
  Grid3x3, AlignLeft, AlignCenter, Settings, Upload, FileText,
  Copy, Trash2, Lock, Unlock, Eye, EyeOff, ChevronDown, Palette
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PremiumLayout } from '@/components/layout/PremiumLayout';

interface DiagramNode {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
}

export const DiagramStudio = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [zoom, setZoom] = useState(100);
  const [nodes, setNodes] = useState<DiagramNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  const templates: Template[] = [
    { id: '1', name: 'System Architecture', description: 'Microservices architecture diagram', category: 'Architecture', thumbnail: '🏗️' },
    { id: '2', name: 'Data Flow', description: 'Data pipeline visualization', category: 'Data', thumbnail: '📊' },
    { id: '3', name: 'User Journey', description: 'User experience flow', category: 'UX', thumbnail: '🗺️' },
    { id: '4', name: 'Database Schema', description: 'Entity relationship diagram', category: 'Database', thumbnail: '🗄️' },
    { id: '5', name: 'API Structure', description: 'REST API endpoints', category: 'API', thumbnail: '🔌' },
    { id: '6', name: 'Component Tree', description: 'React component hierarchy', category: 'Frontend', thumbnail: '🌳' },
  ];

  const shapes = [
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 10));
  const handleZoomOut = () => setZoom(Math.max(50, zoom - 10));

  return (
    <PremiumLayout>
    <div className="h-screen bg-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">Diagram Studio</h1>
              <p className="text-xs text-neutral-600">Untitled Diagram</p>
            </div>
            
            <Separator orientation="vertical" className="h-8" />

            {/* File Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-50">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as SVG
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Edit Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-50">
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-50">
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-50" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1.5 bg-gray-50 rounded text-sm font-medium min-w-[60px] text-center">
                {zoom}%
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-50" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
              <Sparkles className="h-4 w-4" />
              AI Generate
            </Button>
            <Button size="sm" className="gap-2 bg-gray-900 hover:bg-gray-800">
              <Upload className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools & Shapes */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <Tabs defaultValue="shapes" className="flex-1 flex flex-col">
            <div className="px-4 pt-4 pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shapes" className="text-xs">Shapes</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="shapes" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Basic Shapes</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {shapes.map((shape) => {
                        const Icon = shape.icon;
                        return (
                          <button
                            key={shape.id}
                            onClick={() => setSelectedTool(shape.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                              selectedTool === shape.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs font-medium">{shape.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Icons</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {['🗄️', '☁️', '🔒', '📱', '💻', '🌐', '⚙️', '📊'].map((emoji, i) => (
                        <button
                          key={i}
                          className="aspect-square flex items-center justify-center text-2xl rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Colors</h3>
                    <div className="grid grid-cols-6 gap-2">
                      {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'].map((color) => (
                        <button
                          key={color}
                          className="aspect-square rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="templates" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{template.thumbnail}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {template.name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                            <Badge className="mt-2 bg-gray-50 text-gray-700 border-gray-200 text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Canvas Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTool === 'select' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool('select')}
                className={selectedTool === 'select' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}
              >
                <Move className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              {shapes.map((shape) => {
                const Icon = shape.icon;
                return (
                  <Button
                    key={shape.id}
                    variant={selectedTool === shape.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool(shape.id)}
                    className={selectedTool === shape.id ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showGrid ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={showGrid ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-gray-50">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-gray-50">
                <AlignCenter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto relative">
            <div
              ref={canvasRef}
              className="absolute inset-0"
              style={{
                backgroundImage: showGrid
                  ? 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)'
                  : 'none',
                backgroundSize: '20px 20px',
              }}
            >
              {/* Empty Canvas Message */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="border-gray-200 border-2 border-dashed bg-white max-w-md">
                    <CardContent className="p-8 text-center">
                      <div className="rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-4 w-16 h-16 mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Creating</h3>
                      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        Select a shape from the left toolbar or use AI to generate a diagram from your codebase.
                      </p>
                      <div className="flex items-center gap-3 justify-center">
                        <Button className="gap-2 bg-gray-900 hover:bg-gray-800">
                          <Sparkles className="h-4 w-4" />
                          AI Generate
                        </Button>
                        <Button variant="outline" className="gap-2 hover:bg-gray-50">
                          <Plus className="h-4 w-4" />
                          Choose Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Demo Diagram Elements */}
              <div className="absolute top-20 left-20">
                <div className="w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg p-4 text-white border-2 border-blue-400">
                  <div className="text-sm font-semibold mb-2">React Application</div>
                  <div className="text-xs opacity-90">Main entry point</div>
                </div>
              </div>

              <div className="absolute top-20 left-96">
                <div className="w-48 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-lg p-4 text-white border-2 border-emerald-400">
                  <div className="text-sm font-semibold mb-2">API Gateway</div>
                  <div className="text-xs opacity-90">RESTful endpoints</div>
                </div>
              </div>

              <div className="absolute top-60 left-60">
                <div className="w-48 h-32 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-lg p-4 text-white border-2 border-amber-400">
                  <div className="text-sm font-semibold mb-2">Database</div>
                  <div className="text-xs opacity-90">PostgreSQL</div>
                </div>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
                  </marker>
                </defs>
                <path
                  d="M 140 85 L 380 85"
                  stroke="#6b7280"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 260 155 L 300 225"
                  stroke="#6b7280"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties & Layers */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
          <Tabs defaultValue="properties" className="flex-1 flex flex-col">
            <div className="px-4 pt-4 pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
                <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="properties" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {selectedNode ? (
                    <>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                          Position
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="x" className="text-xs text-gray-600">X</Label>
                            <Input id="x" type="number" defaultValue="0" className="h-8 text-sm mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="y" className="text-xs text-gray-600">Y</Label>
                            <Input id="y" type="number" defaultValue="0" className="h-8 text-sm mt-1" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                          Size
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="width" className="text-xs text-gray-600">Width</Label>
                            <Input id="width" type="number" defaultValue="100" className="h-8 text-sm mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="height" className="text-xs text-gray-600">Height</Label>
                            <Input id="height" type="number" defaultValue="100" className="h-8 text-sm mt-1" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="label" className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                          Label
                        </Label>
                        <Input id="label" placeholder="Enter text..." className="h-8 text-sm" />
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                          Fill Color
                        </Label>
                        <div className="grid grid-cols-6 gap-2">
                          {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                            <button
                              key={color}
                              className="aspect-square rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-gray-50">
                          <Copy className="h-3.5 w-3.5" />
                          Duplicate
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-gray-50 text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="rounded-full bg-gray-50 p-4 w-16 h-16 mx-auto mb-3">
                        <Settings className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">Select an element to edit its properties</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="layers" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {[
                    { id: '1', name: 'React Application', type: 'Rectangle', visible: true, locked: false },
                    { id: '2', name: 'API Gateway', type: 'Rectangle', visible: true, locked: false },
                    { id: '3', name: 'Database', type: 'Rectangle', visible: true, locked: false },
                    { id: '4', name: 'Connection Line', type: 'Arrow', visible: true, locked: false },
                  ].map((layer) => (
                    <div
                      key={layer.id}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer group transition-colors"
                    >
                      <Layers className="h-4 w-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{layer.name}</div>
                        <div className="text-xs text-gray-500">{layer.type}</div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </PremiumLayout>
  );
};
