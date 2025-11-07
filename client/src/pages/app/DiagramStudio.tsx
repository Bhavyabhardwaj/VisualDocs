import { useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import {
  Download, Save, Undo2, Redo2, ZoomIn, ZoomOut, Move,
  Square, Circle, ArrowRight, Type, Sparkles, Layers,
  Grid3x3, AlignLeft, AlignCenter, Settings, Upload, FileText,
  Copy, Trash2, ChevronDown
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { useToast } from '@/components/ui/use-toast';

interface DiagramNode {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
  rotation?: number;
  fontSize?: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
}

export const DiagramStudio = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [zoom, setZoom] = useState(100);
  const [nodes, setNodes] = useState<DiagramNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<DiagramNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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

  // Save to history for undo/redo
  const saveToHistory = (newNodes: DiagramNode[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNodes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setNodes(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setNodes(history[historyIndex + 1]);
    }
  };

  // Get mouse position relative to canvas
  const getCanvasPosition = (e: MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Check if point is inside node
  const isPointInNode = (x: number, y: number, node: DiagramNode): boolean => {
    if (node.type === 'circle') {
      const centerX = node.x + node.width / 2;
      const centerY = node.y + node.height / 2;
      const radius = node.width / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      return distance <= radius;
    } else {
      return (
        x >= node.x &&
        x <= node.x + node.width &&
        y >= node.y &&
        y <= node.y + node.height
      );
    }
  };

  // Mouse down handler
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const pos = getCanvasPosition(e);

    if (selectedTool === 'select') {
      // Check if clicking on existing node
      const clickedNode = [...nodes].reverse().find(node => isPointInNode(pos.x, pos.y, node));
      if (clickedNode) {
        setSelectedNode(clickedNode.id);
        setDraggedNode(clickedNode.id);
        setDragOffset({
          x: pos.x - clickedNode.x,
          y: pos.y - clickedNode.y,
        });
      } else {
        setSelectedNode(null);
      }
    } else if (selectedTool !== 'select') {
      // Start drawing new shape
      setIsDrawing(true);
      setStartPos(pos);
      setCurrentPos(pos);
    }
  };

  // Mouse move handler
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const pos = getCanvasPosition(e);

    if (draggedNode && selectedTool === 'select') {
      // Drag existing node - immediate update
      setNodes(prev =>
        prev.map(node =>
          node.id === draggedNode
            ? { ...node, x: pos.x - dragOffset.x, y: pos.y - dragOffset.y }
            : node
        )
      );
    } else if (isDrawing && selectedTool !== 'select') {
      // Update current position for preview
      setCurrentPos(pos);
    }
  };

  // Mouse up handler
  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (isDrawing && selectedTool !== 'select') {
      const pos = getCanvasPosition(e);
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      const absWidth = Math.abs(width);
      const absHeight = Math.abs(height);
      const x = Math.min(pos.x, startPos.x);
      const y = Math.min(pos.y, startPos.y);

      // Only create shape if it has some size
      if (absWidth > 10 && absHeight > 10) {
        const newNode: DiagramNode = {
          id: `node-${Date.now()}`,
          type: selectedTool as any,
          x: selectedTool === 'arrow' ? startPos.x : x,
          y: selectedTool === 'arrow' ? startPos.y : y,
          width: selectedTool === 'circle' ? Math.max(absWidth, absHeight) : (selectedTool === 'arrow' ? width : absWidth),
          height: selectedTool === 'circle' ? Math.max(absWidth, absHeight) : (selectedTool === 'arrow' ? height : absHeight),
          label: '',
          color: currentColor,
          fontSize: 16,
        };

        const updatedNodes = [...nodes, newNode];
        setNodes(updatedNodes);
        saveToHistory(updatedNodes);
        setSelectedNode(newNode.id);
        
        // Auto-switch to select tool after creating shape
        setSelectedTool('select');
        
        toast({
          title: "Shape Created",
          description: `${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} added to canvas`,
        });
      }

      setIsDrawing(false);
      setCurrentPos({ x: 0, y: 0 });
    }

    if (draggedNode) {
      saveToHistory(nodes);
      setDraggedNode(null);
    }
  };

  // Delete selected node
  const handleDelete = () => {
    if (selectedNode) {
      const updatedNodes = nodes.filter(n => n.id !== selectedNode);
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      setSelectedNode(null);
      toast({
        title: "Shape Deleted",
        description: "The selected shape has been removed",
      });
    }
  };

  // Duplicate selected node
  const handleDuplicate = () => {
    if (selectedNode) {
      const nodeToDuplicate = nodes.find(n => n.id === selectedNode);
      if (nodeToDuplicate) {
        const newNode = {
          ...nodeToDuplicate,
          id: `node-${Date.now()}`,
          x: nodeToDuplicate.x + 20,
          y: nodeToDuplicate.y + 20,
        };
        const updatedNodes = [...nodes, newNode];
        setNodes(updatedNodes);
        saveToHistory(updatedNodes);
        setSelectedNode(newNode.id);
        toast({
          title: "Shape Duplicated",
          description: "A copy has been created",
        });
      }
    }
  };

  // Update node property
  const updateNodeProperty = (property: keyof DiagramNode, value: any) => {
    if (selectedNode) {
      const updatedNodes = nodes.map(node =>
        node.id === selectedNode ? { ...node, [property]: value } : node
      );
      setNodes(updatedNodes);
    }
  };

  // Save diagram
  const handleSave = () => {
    localStorage.setItem('diagram-nodes', JSON.stringify(nodes));
    toast({
      title: "Diagram Saved",
      description: "Your diagram has been saved successfully",
    });
  };

  // Export as PNG
  const handleExportPNG = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || !canvasRef.current) return;

      // Calculate bounds
      const bounds = nodes.reduce((acc, node) => {
        return {
          minX: Math.min(acc.minX, node.x),
          minY: Math.min(acc.minY, node.y),
          maxX: Math.max(acc.maxX, node.x + node.width),
          maxY: Math.max(acc.maxY, node.y + node.height),
        };
      }, { minX: Infinity, minY: Infinity, maxX: 0, maxY: 0 });

      const padding = 40;
      canvas.width = bounds.maxX - bounds.minX + padding * 2;
      canvas.height = bounds.maxY - bounds.minY + padding * 2;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nodes
      nodes.forEach(node => {
        const x = node.x - bounds.minX + padding;
        const y = node.y - bounds.minY + padding;

        if (node.type === 'rectangle') {
          ctx.fillStyle = node.color;
          ctx.fillRect(x, y, node.width, node.height);
        } else if (node.type === 'circle') {
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(x + node.width / 2, y + node.width / 2, node.width / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw label
        if (node.label) {
          ctx.fillStyle = node.type === 'text' ? node.color : '#ffffff';
          ctx.font = `${node.fontSize || 16}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.label, x + node.width / 2, y + node.height / 2);
        }
      });

      // Download
      const link = document.createElement('a');
      link.download = `diagram-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Export Successful",
        description: "Your diagram has been exported as PNG",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export diagram",
        variant: "destructive",
      });
    }
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      setNodes([]);
      setSelectedNode(null);
      saveToHistory([]);
      toast({
        title: "Canvas Cleared",
        description: "All shapes have been removed",
      });
    }
  };

  // Load diagram on mount
  useEffect(() => {
    const saved = localStorage.getItem('diagram-nodes');
    if (saved) {
      try {
        const loadedNodes = JSON.parse(saved);
        setNodes(loadedNodes);
        saveToHistory(loadedNodes);
      } catch (error) {
        console.error('Failed to load diagram:', error);
      }
    }
  }, []);

  // Add icon to canvas
  const handleAddIcon = (emoji: string) => {
    const newNode: DiagramNode = {
      id: `node-${Date.now()}`,
      type: 'text',
      x: 100 + nodes.length * 20, // Offset each new icon
      y: 100 + nodes.length * 20,
      width: 60,
      height: 60,
      label: emoji,
      color: currentColor,
      fontSize: 32,
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    saveToHistory(updatedNodes);
    setSelectedNode(newNode.id);
    setSelectedTool('select');
    
    toast({
      title: "Icon Added",
      description: "Icon added to canvas",
    });
  };

  // Load template
  const handleLoadTemplate = (templateId: string) => {
    const templateNodes: Record<string, DiagramNode[]> = {
      '1': [ // System Architecture
        { id: 'node-1', type: 'rectangle', x: 100, y: 100, width: 180, height: 120, label: 'Frontend\nReact App', color: '#3b82f6', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 350, y: 100, width: 180, height: 120, label: 'API Gateway\nNode.js', color: '#10b981', fontSize: 16 },
        { id: 'node-3', type: 'rectangle', x: 600, y: 100, width: 180, height: 120, label: 'Auth Service\nJWT', color: '#8b5cf6', fontSize: 16 },
        { id: 'node-4', type: 'rectangle', x: 350, y: 280, width: 180, height: 120, label: 'Database\nPostgreSQL', color: '#f59e0b', fontSize: 16 },
        { id: 'arrow-1', type: 'arrow', x: 280, y: 160, width: 70, height: 0, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 530, y: 160, width: 70, height: 0, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-3', type: 'arrow', x: 440, y: 220, width: 0, height: 60, label: '', color: '#6b7280', fontSize: 16 },
      ],
      '2': [ // Data Flow
        { id: 'node-1', type: 'circle', x: 100, y: 150, width: 120, height: 120, label: 'Data\nSource', color: '#3b82f6', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 300, y: 100, width: 150, height: 80, label: 'Extract', color: '#10b981', fontSize: 16 },
        { id: 'node-3', type: 'rectangle', x: 300, y: 220, width: 150, height: 80, label: 'Transform', color: '#f59e0b', fontSize: 16 },
        { id: 'node-4', type: 'rectangle', x: 520, y: 160, width: 150, height: 80, label: 'Load', color: '#8b5cf6', fontSize: 16 },
        { id: 'node-5', type: 'circle', x: 740, y: 150, width: 120, height: 120, label: 'Data\nWarehouse', color: '#ec4899', fontSize: 16 },
        { id: 'arrow-1', type: 'arrow', x: 220, y: 160, width: 80, height: -20, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 375, y: 180, width: 0, height: 40, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-3', type: 'arrow', x: 450, y: 200, width: 70, height: 0, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-4', type: 'arrow', x: 670, y: 200, width: 70, height: 0, label: '', color: '#6b7280', fontSize: 16 },
      ],
      '3': [ // User Journey
        { id: 'node-1', type: 'circle', x: 100, y: 150, width: 100, height: 100, label: 'Start', color: '#10b981', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 250, y: 130, width: 140, height: 80, label: 'Login', color: '#3b82f6', fontSize: 16 },
        { id: 'node-3', type: 'rectangle', x: 440, y: 130, width: 140, height: 80, label: 'Dashboard', color: '#3b82f6', fontSize: 16 },
        { id: 'node-4', type: 'rectangle', x: 630, y: 130, width: 140, height: 80, label: 'Action', color: '#8b5cf6', fontSize: 16 },
        { id: 'node-5', type: 'circle', x: 820, y: 150, width: 100, height: 100, label: 'End', color: '#ec4899', fontSize: 16 },
        { id: 'arrow-1', type: 'arrow', x: 200, y: 170, width: 50, height: 0, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 390, y: 170, width: 50, height: 0, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-3', type: 'arrow', x: 580, y: 170, width: 50, height: 0, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-4', type: 'arrow', x: 770, y: 170, width: 50, height: 0, label: '', color: '#6b7280', fontSize: 16 },
      ],
      '4': [ // Database Schema
        { id: 'node-1', type: 'rectangle', x: 100, y: 100, width: 200, height: 150, label: 'Users\n───────\nid: INT\nname: VARCHAR\nemail: VARCHAR\npassword: HASH', color: '#3b82f6', fontSize: 14 },
        { id: 'node-2', type: 'rectangle', x: 400, y: 100, width: 200, height: 150, label: 'Projects\n───────\nid: INT\nuser_id: FK\nname: VARCHAR\ncreated_at: DATE', color: '#10b981', fontSize: 14 },
        { id: 'node-3', type: 'rectangle', x: 250, y: 320, width: 200, height: 150, label: 'Files\n───────\nid: INT\nproject_id: FK\nname: VARCHAR\nsize: INT', color: '#f59e0b', fontSize: 14 },
        { id: 'arrow-1', type: 'arrow', x: 300, y: 175, width: 100, height: 0, label: '', color: '#ec4899', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 500, y: 250, width: 0, height: 70, label: '', color: '#ec4899', fontSize: 16 },
      ],
      '5': [ // API Structure
        { id: 'node-1', type: 'rectangle', x: 300, y: 80, width: 200, height: 60, label: '/api/auth', color: '#3b82f6', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 150, y: 180, width: 180, height: 50, label: 'POST /login', color: '#10b981', fontSize: 14 },
        { id: 'node-3', type: 'rectangle', x: 370, y: 180, width: 180, height: 50, label: 'POST /register', color: '#10b981', fontSize: 14 },
        { id: 'node-4', type: 'rectangle', x: 590, y: 180, width: 180, height: 50, label: 'POST /logout', color: '#10b981', fontSize: 14 },
        { id: 'node-5', type: 'rectangle', x: 300, y: 280, width: 200, height: 60, label: '/api/projects', color: '#8b5cf6', fontSize: 16 },
        { id: 'node-6', type: 'rectangle', x: 150, y: 380, width: 180, height: 50, label: 'GET /projects', color: '#f59e0b', fontSize: 14 },
        { id: 'node-7', type: 'rectangle', x: 370, y: 380, width: 180, height: 50, label: 'POST /projects', color: '#f59e0b', fontSize: 14 },
        { id: 'node-8', type: 'rectangle', x: 590, y: 380, width: 180, height: 50, label: 'DELETE /:id', color: '#f59e0b', fontSize: 14 },
      ],
      '6': [ // Component Tree
        { id: 'node-1', type: 'rectangle', x: 350, y: 50, width: 150, height: 60, label: 'App', color: '#3b82f6', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 150, y: 150, width: 130, height: 50, label: 'Header', color: '#10b981', fontSize: 14 },
        { id: 'node-3', type: 'rectangle', x: 350, y: 150, width: 130, height: 50, label: 'Main', color: '#10b981', fontSize: 14 },
        { id: 'node-4', type: 'rectangle', x: 550, y: 150, width: 130, height: 50, label: 'Footer', color: '#10b981', fontSize: 14 },
        { id: 'node-5', type: 'rectangle', x: 280, y: 240, width: 110, height: 45, label: 'Sidebar', color: '#f59e0b', fontSize: 13 },
        { id: 'node-6', type: 'rectangle', x: 420, y: 240, width: 110, height: 45, label: 'Content', color: '#f59e0b', fontSize: 13 },
        { id: 'arrow-1', type: 'arrow', x: 425, y: 110, width: -210, height: 40, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 425, y: 110, width: 0, height: 40, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-3', type: 'arrow', x: 425, y: 110, width: 190, height: 40, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-4', type: 'arrow', x: 415, y: 200, width: -80, height: 40, label: '', color: '#6b7280', fontSize: 16 },
        { id: 'arrow-5', type: 'arrow', x: 415, y: 200, width: 60, height: 40, label: '', color: '#6b7280', fontSize: 16 },
      ],
    };

    const template = templateNodes[templateId];
    if (template) {
      setNodes(template);
      saveToHistory(template);
      setSelectedNode(null);
      toast({
        title: "Template Loaded",
        description: `${templates.find(t => t.id === templateId)?.name} template loaded successfully`,
      });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      // Delete selected node (only if not typing in input)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode && !isInputField) {
        e.preventDefault();
        handleDelete();
      }
      
      // Undo (only if not typing in input)
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey && !isInputField) {
        e.preventDefault();
        handleUndo();
      }
      
      // Redo (only if not typing in input)
      if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey)) && !isInputField) {
        e.preventDefault();
        handleRedo();
      }
      
      // Save (only if not typing in input)
      if (e.ctrlKey && e.key === 's' && !isInputField) {
        e.preventDefault();
        handleSave();
      }
      
      // Duplicate (only if not typing in input)
      if (e.ctrlKey && e.key === 'd' && selectedNode && !isInputField) {
        e.preventDefault();
        handleDuplicate();
      }
      
      // Select tool shortcuts (only if not typing in input)
      if (!isInputField) {
        if (e.key === 'v') {
          setSelectedTool('select');
        } else if (e.key === 'r') {
          setSelectedTool('rectangle');
        } else if (e.key === 'c') {
          setSelectedTool('circle');
        } else if (e.key === 't') {
          setSelectedTool('text');
        } else if (e.key === 'a') {
          setSelectedTool('arrow');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, historyIndex, history, nodes]);

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
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-50" onClick={handleSave}>
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
                  <DropdownMenuItem onClick={handleExportPNG}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Coming Soon", description: "SVG export will be available soon" })}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as SVG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Coming Soon", description: "PDF export will be available soon" })}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Edit Actions */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 hover:bg-gray-50"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 hover:bg-gray-50"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
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
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generate
            </Button>
            <Button size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools & Shapes */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <Tabs defaultValue="shapes" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shapes" className="text-xs">Shapes</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="shapes" className="flex-1 mt-0 overflow-hidden">
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
                      {['🗄️', '☁️', '🔒', '📱', '💻', '🌐', '⚙️', '📊', '🚀', '💡', '📝', '🎯'].map((emoji, i) => (
                        <button
                          key={i}
                          onClick={() => handleAddIcon(emoji)}
                          className="aspect-square flex items-center justify-center text-2xl rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-95"
                          title={`Click to add ${emoji} icon`}
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
                          onClick={() => setCurrentColor(color)}
                          className={`aspect-square rounded-lg border-2 shadow-sm hover:scale-110 transition-transform ${
                            currentColor === color ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2' : 'border-white'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="templates" className="flex-1 mt-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3 pb-20">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                      onClick={() => handleLoadTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{template.thumbnail}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {template.name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                            <Badge className="mt-2 bg-gray-50 text-gray-700 border-gray-200 text-xs group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200">
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
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <AlignCenter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto relative bg-gray-50">
            <div
              ref={canvasRef}
              className="relative w-full h-full min-h-[600px] cursor-crosshair"
              style={{
                backgroundImage: showGrid
                  ? 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)'
                  : 'none',
                backgroundSize: '20px 20px',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                setIsDrawing(false);
                setDraggedNode(null);
              }}
            >
              {/* Empty Canvas Message */}
              {nodes.length === 0 && !isDrawing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Card className="border-gray-200 border-2 border-dashed bg-white max-w-md">
                    <CardContent className="p-8 text-center">
                      <div className="rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-4 w-16 h-16 mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Creating</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        Select a shape from the toolbar and drag on the canvas to create it.
                      </p>
                      <div className="flex gap-2 text-xs text-gray-500 justify-center">
                        <Badge variant="outline">Click shapes to select</Badge>
                        <Badge variant="outline">Drag to move</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Live drawing preview */}
              {isDrawing && selectedTool !== 'select' && (() => {
                const width = Math.abs(currentPos.x - startPos.x);
                const height = Math.abs(currentPos.y - startPos.y);
                const x = Math.min(currentPos.x, startPos.x);
                const y = Math.min(currentPos.y, startPos.y);

                if (selectedTool === 'rectangle') {
                  return (
                    <div
                      className="absolute rounded-lg border-2 border-dashed border-blue-500 bg-blue-50 opacity-50 pointer-events-none"
                      style={{
                        left: x,
                        top: y,
                        width: width,
                        height: height,
                      }}
                    />
                  );
                }

                if (selectedTool === 'circle') {
                  const size = Math.max(width, height);
                  return (
                    <div
                      className="absolute rounded-full border-2 border-dashed border-blue-500 bg-blue-50 opacity-50 pointer-events-none"
                      style={{
                        left: x,
                        top: y,
                        width: size,
                        height: size,
                      }}
                    />
                  );
                }

                if (selectedTool === 'text') {
                  return (
                    <div
                      className="absolute border-2 border-dashed border-blue-500 bg-blue-50 opacity-50 pointer-events-none flex items-center justify-center"
                      style={{
                        left: x,
                        top: y,
                        width: width,
                        height: height,
                      }}
                    >
                      <Type className="h-6 w-6 text-blue-500" />
                    </div>
                  );
                }

                if (selectedTool === 'arrow') {
                  return (
                    <svg
                      className="absolute pointer-events-none"
                      style={{
                        left: Math.min(x, currentPos.x),
                        top: Math.min(y, currentPos.y),
                        width: Math.abs(currentPos.x - startPos.x),
                        height: Math.abs(currentPos.y - startPos.y),
                      }}
                    >
                      <defs>
                        <marker
                          id="preview-arrowhead"
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                        </marker>
                      </defs>
                      <line
                        x1={startPos.x < currentPos.x ? 0 : Math.abs(currentPos.x - startPos.x)}
                        y1={startPos.y < currentPos.y ? 0 : Math.abs(currentPos.y - startPos.y)}
                        x2={startPos.x < currentPos.x ? Math.abs(currentPos.x - startPos.x) : 0}
                        y2={startPos.y < currentPos.y ? Math.abs(currentPos.y - startPos.y) : 0}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        markerEnd="url(#preview-arrowhead)"
                      />
                    </svg>
                  );
                }

                return null;
              })()}

              {/* Render all nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode === node.id;
                
                if (node.type === 'rectangle') {
                  return (
                    <div
                      key={node.id}
                      className={`absolute rounded-lg shadow-lg transition-shadow ${
                        isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : 'hover:shadow-xl'
                      }`}
                      style={{
                        left: node.x,
                        top: node.y,
                        width: node.width,
                        height: node.height,
                        backgroundColor: node.color,
                        cursor: selectedTool === 'select' ? 'move' : 'default',
                      }}
                    >
                      {node.label && (
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                          <span className="text-white font-medium text-center break-words" style={{ fontSize: node.fontSize || 16 }}>
                            {node.label}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }

                if (node.type === 'circle') {
                  return (
                    <div
                      key={node.id}
                      className={`absolute rounded-full shadow-lg transition-shadow ${
                        isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : 'hover:shadow-xl'
                      }`}
                      style={{
                        left: node.x,
                        top: node.y,
                        width: node.width,
                        height: node.width,
                        backgroundColor: node.color,
                        cursor: selectedTool === 'select' ? 'move' : 'default',
                      }}
                    >
                      {node.label && (
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                          <span className="text-white font-medium text-center break-words" style={{ fontSize: node.fontSize || 16 }}>
                            {node.label}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }

                if (node.type === 'text') {
                  return (
                    <div
                      key={node.id}
                      className={`absolute transition-all ${
                        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20' : ''
                      }`}
                      style={{
                        left: node.x,
                        top: node.y,
                        cursor: selectedTool === 'select' ? 'move' : 'default',
                        padding: '4px 8px',
                      }}
                    >
                      <span 
                        className="font-medium break-words" 
                        style={{ 
                          fontSize: node.fontSize || 16,
                          color: node.color,
                        }}
                      >
                        {node.label || 'Double click to edit'}
                      </span>
                    </div>
                  );
                }

                if (node.type === 'arrow') {
                  return (
                    <svg
                      key={node.id}
                      className={`absolute pointer-events-none ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        left: Math.min(node.x, node.x + node.width),
                        top: Math.min(node.y, node.y + node.height),
                        width: Math.abs(node.width),
                        height: Math.abs(node.height),
                        cursor: selectedTool === 'select' ? 'move' : 'default',
                      }}
                    >
                      <defs>
                        <marker
                          id={`arrowhead-${node.id}`}
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3, 0 6" fill={node.color} />
                        </marker>
                      </defs>
                      <line
                        x1={node.width < 0 ? Math.abs(node.width) : 0}
                        y1={node.height < 0 ? Math.abs(node.height) : 0}
                        x2={node.width < 0 ? 0 : Math.abs(node.width)}
                        y2={node.height < 0 ? 0 : Math.abs(node.height)}
                        stroke={node.color}
                        strokeWidth="3"
                        markerEnd={`url(#arrowhead-${node.id})`}
                      />
                    </svg>
                  );
                }

                return null;
              })}
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
                      {(() => {
                        const node = nodes.find(n => n.id === selectedNode);
                        if (!node) return null;

                        return (
                          <>
                            <div>
                              <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                                Position
                              </Label>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor="x" className="text-xs text-gray-600">X</Label>
                                  <Input 
                                    id="x" 
                                    type="number" 
                                    value={Math.round(node.x)} 
                                    onChange={(e) => updateNodeProperty('x', parseFloat(e.target.value))}
                                    className="h-8 text-sm mt-1" 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="y" className="text-xs text-gray-600">Y</Label>
                                  <Input 
                                    id="y" 
                                    type="number" 
                                    value={Math.round(node.y)}
                                    onChange={(e) => updateNodeProperty('y', parseFloat(e.target.value))}
                                    className="h-8 text-sm mt-1" 
                                  />
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
                                  <Input 
                                    id="width" 
                                    type="number" 
                                    value={Math.round(node.width)}
                                    onChange={(e) => updateNodeProperty('width', parseFloat(e.target.value))}
                                    className="h-8 text-sm mt-1" 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="height" className="text-xs text-gray-600">Height</Label>
                                  <Input 
                                    id="height" 
                                    type="number" 
                                    value={Math.round(node.height)}
                                    onChange={(e) => updateNodeProperty('height', parseFloat(e.target.value))}
                                    className="h-8 text-sm mt-1" 
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="label" className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                                Label
                              </Label>
                              <Input 
                                id="label" 
                                placeholder="Enter text..." 
                                value={node.label}
                                onChange={(e) => updateNodeProperty('label', e.target.value)}
                                className="h-8 text-sm" 
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                                Fill Color
                              </Label>
                              <div className="grid grid-cols-6 gap-2">
                                {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => updateNodeProperty('color', color)}
                                    className={`aspect-square rounded border-2 shadow-sm hover:scale-110 transition-transform ${
                                      node.color === color ? 'border-neutral-900 ring-2 ring-neutral-900' : 'border-white'
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>

                            {node.type === 'text' && (
                              <div>
                                <Label htmlFor="fontSize" className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                                  Font Size
                                </Label>
                                <Input 
                                  id="fontSize" 
                                  type="number" 
                                  value={node.fontSize || 16}
                                  onChange={(e) => updateNodeProperty('fontSize', parseFloat(e.target.value))}
                                  className="h-8 text-sm" 
                                  min="8"
                                  max="72"
                                />
                              </div>
                            )}

                            <Separator />

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-gray-50" onClick={handleDuplicate}>
                                <Copy className="h-3.5 w-3.5" />
                                Duplicate
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-gray-50 text-red-600" onClick={handleDelete}>
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </div>
                          </>
                        );
                      })()}
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
                  {nodes.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="rounded-full bg-gray-50 p-4 w-16 h-16 mx-auto mb-3">
                        <Layers className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">No layers yet</p>
                      <p className="text-xs text-gray-500 mt-1">Add shapes to see them here</p>
                    </div>
                  ) : (
                    nodes.map((node, index) => {
                      const getIcon = () => {
                        switch (node.type) {
                          case 'rectangle': return Square;
                          case 'circle': return Circle;
                          case 'text': return Type;
                          case 'arrow': return ArrowRight;
                          default: return Layers;
                        }
                      };
                      const Icon = getIcon();
                      
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNode(node.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer group transition-all ${
                            selectedNode === node.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: node.color }}
                          />
                          <Icon className="h-4 w-4 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {node.label || `${node.type.charAt(0).toUpperCase() + node.type.slice(1)} ${index + 1}`}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">{node.type}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNode(node.id);
                                handleDuplicate();
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNode(node.id);
                                handleDelete();
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
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
