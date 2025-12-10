import { useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import {
  Download, Save, Undo2, Redo2, ZoomIn, ZoomOut, Move,
  Square, Circle, ArrowRight, Type, Sparkles, Layers,
  Grid3x3, AlignLeft, AlignCenter, Settings, Upload, FileText,
  Copy, Trash2, ChevronDown, Lock, Unlock, 
  AlignRight, AlignJustify, ArrowUp, ArrowDown, Keyboard,
  Trash, Eye, Minus as MinusIcon, Map, Link2, Maximize2,
  LayoutGrid, Group, Ungroup, MousePointer2, Hand, MoreHorizontal,
  RotateCcw, Palette, Wand2, Timer
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DiagramNode {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'arrow' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
  rotation?: number;
  fontSize?: number;
  locked?: boolean;
  zIndex?: number;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  opacity?: number;
  groupId?: string;
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
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]); // Multi-select
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState('#a5d8ff'); // Excalidraw light blue
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<DiagramNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState<DiagramNode[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [canvasBackground, setCanvasBackground] = useState<'dots' | 'grid' | 'none'>('dots');
  const [diagramName, setDiagramName] = useState('Untitled Diagram');
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Advanced features - Senior Dev additions
  const [showMinimap, setShowMinimap] = useState(true);
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState({ x: 0, y: 0 });
  const [marqueeEnd, setMarqueeEnd] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string | null } | null>(null);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showConnectionMode, setShowConnectionMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Excalidraw's signature color palette - beautiful, muted, professional
  const excalidrawColors = [
    '#ffc9c9', // Soft coral
    '#ffec99', // Soft yellow
    '#b2f2bb', // Soft mint
    '#a5d8ff', // Soft blue
    '#d0bfff', // Soft purple
    '#ffa8a8', // Soft red
    '#ffd8a8', // Soft orange
    '#96f2d7', // Soft teal
    '#74c0fc', // Medium blue
    '#cc5de8', // Medium purple
    '#868e96', // Soft gray
    '#343a40', // Dark gray
  ];

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
    { id: 'line', icon: MinusIcon, label: 'Line' },
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
        // Don't allow dragging locked shapes
        if (clickedNode.locked) {
          setSelectedNode(clickedNode.id);
          toast({
            title: "Shape Locked",
            description: "Unlock this shape to move it (Ctrl+L)",
          });
          return;
        }
        
        // Multi-select with Shift key
        if (e.shiftKey) {
          if (selectedNodes.includes(clickedNode.id)) {
            setSelectedNodes(selectedNodes.filter(id => id !== clickedNode.id));
          } else {
            setSelectedNodes([...selectedNodes, clickedNode.id]);
          }
          return;
        }
        
        setSelectedNode(clickedNode.id);
        setSelectedNodes([]);
        setDraggedNode(clickedNode.id);
        setDragOffset({
          x: pos.x - clickedNode.x,
          y: pos.y - clickedNode.y,
        });
      } else {
        setSelectedNode(null);
        setSelectedNodes([]);
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
      // Drag existing node - immediate update with snap to grid
      const newX = snapToGridValue(pos.x - dragOffset.x);
      const newY = snapToGridValue(pos.y - dragOffset.y);
      
      setNodes(prev =>
        prev.map(node =>
          node.id === draggedNode
            ? { ...node, x: newX, y: newY }
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
          x: (selectedTool === 'arrow' || selectedTool === 'line') ? startPos.x : x,
          y: (selectedTool === 'arrow' || selectedTool === 'line') ? startPos.y : y,
          width: selectedTool === 'circle' ? Math.max(absWidth, absHeight) : ((selectedTool === 'arrow' || selectedTool === 'line') ? width : absWidth),
          height: selectedTool === 'circle' ? Math.max(absWidth, absHeight) : ((selectedTool === 'arrow' || selectedTool === 'line') ? height : absHeight),
          label: '',
          color: currentColor,
          fontSize: 16,
          strokeWidth: 3,
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

  // Copy to clipboard
  const handleCopy = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id))
      : selectedNode 
      ? [nodes.find(n => n.id === selectedNode)!]
      : [];
    
    if (selected.length > 0) {
      setClipboard(selected);
      toast({
        title: "Copied",
        description: `${selected.length} shape(s) copied to clipboard`,
      });
    }
  };

  // Paste from clipboard
  const handlePaste = () => {
    if (clipboard.length > 0) {
      const newNodes = clipboard.map(node => ({
        ...node,
        id: `node-${Date.now()}-${Math.random()}`,
        x: node.x + 30,
        y: node.y + 30,
      }));
      const updatedNodes = [...nodes, ...newNodes];
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      setSelectedNodes(newNodes.map(n => n.id));
      toast({
        title: "Pasted",
        description: `${newNodes.length} shape(s) pasted`,
      });
    }
  };

  // Lock/Unlock shape
  const handleToggleLock = () => {
    if (selectedNode) {
      const updatedNodes = nodes.map(node =>
        node.id === selectedNode ? { ...node, locked: !node.locked } : node
      );
      setNodes(updatedNodes);
      const isLocked = updatedNodes.find(n => n.id === selectedNode)?.locked;
      toast({
        title: isLocked ? "Locked" : "Unlocked",
        description: `Shape is now ${isLocked ? 'locked' : 'unlocked'}`,
      });
    }
  };

  // Bring to front
  const handleBringToFront = () => {
    if (selectedNode) {
      const maxZ = Math.max(...nodes.map(n => n.zIndex || 0));
      const updatedNodes = nodes.map(node =>
        node.id === selectedNode ? { ...node, zIndex: maxZ + 1 } : node
      );
      setNodes(updatedNodes);
      toast({ title: "Moved to Front" });
    }
  };

  // Send to back
  const handleSendToBack = () => {
    if (selectedNode) {
      const minZ = Math.min(...nodes.map(n => n.zIndex || 0));
      const updatedNodes = nodes.map(node =>
        node.id === selectedNode ? { ...node, zIndex: minZ - 1 } : node
      );
      setNodes(updatedNodes);
      toast({ title: "Moved to Back" });
    }
  };

  // Alignment functions
  const handleAlignLeft = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id))
      : selectedNode ? [nodes.find(n => n.id === selectedNode)!] : [];
    
    if (selected.length > 1) {
      const minX = Math.min(...selected.map(n => n.x));
      const updatedNodes = nodes.map(node =>
        selectedNodes.includes(node.id) ? { ...node, x: minX } : node
      );
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      toast({ title: "Aligned Left" });
    }
  };

  const handleAlignCenter = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id))
      : selectedNode ? [nodes.find(n => n.id === selectedNode)!] : [];
    
    if (selected.length > 1) {
      const avgX = selected.reduce((sum, n) => sum + n.x + n.width / 2, 0) / selected.length;
      const updatedNodes = nodes.map(node =>
        selectedNodes.includes(node.id) ? { ...node, x: avgX - node.width / 2 } : node
      );
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      toast({ title: "Aligned Center" });
    }
  };

  const handleAlignRight = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id))
      : selectedNode ? [nodes.find(n => n.id === selectedNode)!] : [];
    
    if (selected.length > 1) {
      const maxX = Math.max(...selected.map(n => n.x + n.width));
      const updatedNodes = nodes.map(node =>
        selectedNodes.includes(node.id) ? { ...node, x: maxX - node.width } : node
      );
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      toast({ title: "Aligned Right" });
    }
  };

  const handleAlignTop = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id))
      : selectedNode ? [nodes.find(n => n.id === selectedNode)!] : [];
    
    if (selected.length > 1) {
      const minY = Math.min(...selected.map(n => n.y));
      const updatedNodes = nodes.map(node =>
        selectedNodes.includes(node.id) ? { ...node, y: minY } : node
      );
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      toast({ title: "Aligned Top" });
    }
  };

  const handleAlignMiddle = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id))
      : selectedNode ? [nodes.find(n => n.id === selectedNode)!] : [];
    
    if (selected.length > 1) {
      const avgY = selected.reduce((sum, n) => sum + n.y + n.height / 2, 0) / selected.length;
      const updatedNodes = nodes.map(node =>
        selectedNodes.includes(node.id) ? { ...node, y: avgY - node.height / 2 } : node
      );
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      toast({ title: "Aligned Middle" });
    }
  };

  const handleAlignBottom = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id))
      : selectedNode ? [nodes.find(n => n.id === selectedNode)!] : [];
    
    if (selected.length > 1) {
      const maxY = Math.max(...selected.map(n => n.y + n.height));
      const updatedNodes = nodes.map(node =>
        selectedNodes.includes(node.id) ? { ...node, y: maxY - node.height } : node
      );
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      toast({ title: "Aligned Bottom" });
    }
  };

  // Distribute horizontally
  const handleDistributeHorizontal = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id)).sort((a, b) => a.x - b.x)
      : [];
    
    if (selected.length > 2) {
      const first = selected[0];
      const last = selected[selected.length - 1];
      const totalSpace = (last.x + last.width) - first.x;
      const totalWidth = selected.reduce((sum, n) => sum + n.width, 0);
      const gap = (totalSpace - totalWidth) / (selected.length - 1);
      
      let currentX = first.x + first.width + gap;
      const updatedNodes = nodes.map(node => {
        const idx = selected.findIndex(n => n.id === node.id);
        if (idx > 0 && idx < selected.length - 1) {
          const newNode = { ...node, x: currentX };
          currentX += node.width + gap;
          return newNode;
        }
        return node;
      });
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      toast({ title: "Distributed Horizontally" });
    }
  };

  // Distribute vertically
  const handleDistributeVertical = () => {
    const selected = selectedNodes.length > 0 
      ? nodes.filter(n => selectedNodes.includes(n.id)).sort((a, b) => a.y - b.y)
      : [];
    
    if (selected.length > 2) {
      const first = selected[0];
      const last = selected[selected.length - 1];
      const totalSpace = (last.y + last.height) - first.y;
      const totalHeight = selected.reduce((sum, n) => sum + n.height, 0);
      const gap = (totalSpace - totalHeight) / (selected.length - 1);
      
      let currentY = first.y + first.height + gap;
      const updatedNodes = nodes.map(node => {
        const idx = selected.findIndex(n => n.id === node.id);
        if (idx > 0 && idx < selected.length - 1) {
          const newNode = { ...node, y: currentY };
          currentY += node.height + gap;
          return newNode;
        }
        return node;
      });
      setNodes(updatedNodes);
      saveToHistory(updatedNodes);
      toast({ title: "Distributed Vertically" });
    }
  };

  // ========== SENIOR DEV FEATURES ==========

  // Zoom to Fit - Automatically adjust zoom and pan to show all shapes
  const handleZoomToFit = () => {
    if (nodes.length === 0) {
      setZoom(100);
      setCanvasPan({ x: 0, y: 0 });
      toast({ title: "Canvas is empty" });
      return;
    }

    const bounds = nodes.reduce((acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x + node.width),
      maxY: Math.max(acc.maxY, node.y + node.height),
    }), { minX: Infinity, minY: Infinity, maxX: 0, maxY: 0 });

    const canvasWidth = canvasRef.current?.clientWidth || 800;
    const canvasHeight = canvasRef.current?.clientHeight || 600;
    const contentWidth = bounds.maxX - bounds.minX + 100;
    const contentHeight = bounds.maxY - bounds.minY + 100;
    
    const scaleX = canvasWidth / contentWidth;
    const scaleY = canvasHeight / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, 1.5) * 100;
    
    setZoom(Math.round(Math.max(50, Math.min(150, newZoom))));
    setCanvasPan({ 
      x: -bounds.minX + 50, 
      y: -bounds.minY + 50 
    });
    toast({ title: "Zoomed to Fit" });
  };

  // Auto-layout - Arrange shapes in a clean grid
  const handleAutoLayout = () => {
    if (nodes.length === 0) return;
    
    const spacing = 40;
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const sortedNodes = [...nodes].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    const updatedNodes = sortedNodes.map((node, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      return {
        ...node,
        x: 100 + col * (180 + spacing),
        y: 100 + row * (120 + spacing),
      };
    });
    
    setNodes(updatedNodes);
    saveToHistory(updatedNodes);
    toast({ 
      title: "Auto Layout Applied", 
      description: `${nodes.length} shapes arranged in a grid` 
    });
  };

  // Group selected shapes
  const handleGroupShapes = () => {
    if (selectedNodes.length < 2) {
      toast({ 
        title: "Select Multiple Shapes", 
        description: "Select at least 2 shapes to group them" 
      });
      return;
    }
    
    const groupId = `group-${Date.now()}`;
    const updatedNodes = nodes.map(node =>
      selectedNodes.includes(node.id) ? { ...node, groupId } : node
    );
    
    setNodes(updatedNodes);
    saveToHistory(updatedNodes);
    toast({ 
      title: "Shapes Grouped", 
      description: `${selectedNodes.length} shapes grouped together` 
    });
  };

  // Ungroup shapes
  const handleUngroupShapes = () => {
    const selectedGroupIds = new Set(
      nodes.filter(n => selectedNodes.includes(n.id) || n.id === selectedNode)
        .map(n => n.groupId)
        .filter(Boolean)
    );
    
    if (selectedGroupIds.size === 0) {
      toast({ title: "No grouped shapes selected" });
      return;
    }
    
    const updatedNodes = nodes.map(node =>
      selectedGroupIds.has(node.groupId) ? { ...node, groupId: undefined } : node
    );
    
    setNodes(updatedNodes);
    saveToHistory(updatedNodes);
    toast({ title: "Shapes Ungrouped" });
  };

  // Connect two shapes with an arrow
  const handleConnectShapes = () => {
    if (selectedNodes.length !== 2) {
      toast({ 
        title: "Select Two Shapes", 
        description: "Select exactly 2 shapes to connect them" 
      });
      return;
    }
    
    const [node1, node2] = selectedNodes.map(id => nodes.find(n => n.id === id)!);
    
    // Calculate connection points (center of each shape)
    const startX = node1.x + node1.width / 2;
    const startY = node1.y + node1.height / 2;
    const endX = node2.x + node2.width / 2;
    const endY = node2.y + node2.height / 2;
    
    const newArrow: DiagramNode = {
      id: `arrow-${Date.now()}`,
      type: 'arrow',
      x: startX,
      y: startY,
      width: endX - startX,
      height: endY - startY,
      label: '',
      color: '#868e96',
      strokeWidth: 2,
    };
    
    const updatedNodes = [...nodes, newArrow];
    setNodes(updatedNodes);
    saveToHistory(updatedNodes);
    setSelectedNodes([]);
    toast({ title: "Shapes Connected" });
  };

  // Randomize colors for selected shapes
  const handleRandomizeColors = () => {
    const targetNodes = selectedNodes.length > 0 
      ? selectedNodes 
      : selectedNode ? [selectedNode] : [];
    
    if (targetNodes.length === 0) return;
    
    const updatedNodes = nodes.map(node => {
      if (targetNodes.includes(node.id)) {
        const randomColor = excalidrawColors[Math.floor(Math.random() * excalidrawColors.length)];
        return { ...node, color: randomColor };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    saveToHistory(updatedNodes);
    toast({ title: "Colors Randomized" });
  };

  // Reset all shape rotations
  const handleResetRotations = () => {
    const updatedNodes = nodes.map(node => ({ ...node, rotation: 0 }));
    setNodes(updatedNodes);
    saveToHistory(updatedNodes);
    toast({ title: "Rotations Reset" });
  };

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pos = getCanvasPosition(e as unknown as MouseEvent<HTMLDivElement>);
    const clickedNode = [...nodes].reverse().find(node => isPointInNode(pos.x, pos.y, node));
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId: clickedNode?.id || null,
    });
    
    if (clickedNode) {
      setSelectedNode(clickedNode.id);
    }
  };

  // Close context menu
  const closeContextMenu = () => setContextMenu(null);

  // Calculate minimap bounds
  const getMinimapBounds = () => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 800, maxY: 600 };
    
    return nodes.reduce((acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x + node.width),
      maxY: Math.max(acc.maxY, node.y + node.height),
    }), { minX: Infinity, minY: Infinity, maxX: 0, maxY: 0 });
  };

  // Get shapes statistics
  const getShapeStats = () => {
    const stats = {
      total: nodes.length,
      rectangles: nodes.filter(n => n.type === 'rectangle').length,
      circles: nodes.filter(n => n.type === 'circle').length,
      arrows: nodes.filter(n => n.type === 'arrow').length,
      text: nodes.filter(n => n.type === 'text').length,
      lines: nodes.filter(n => n.type === 'line').length,
    };
    return stats;
  };

  // ========== END SENIOR DEV FEATURES ==========

  // Helper to snap to grid
  const snapToGridValue = (value: number, gridSize: number = 20) => {
    return snapToGrid ? Math.round(value / gridSize) * gridSize : value;
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

  // Clear canvas with modern dialog
  const handleClearCanvas = () => {
    setShowClearConfirm(true);
  };

  const confirmClearCanvas = () => {
    setNodes([]);
    setSelectedNode(null);
    setSelectedNodes([]);
    saveToHistory([]);
    setShowClearConfirm(false);
    toast({
      title: "Canvas Cleared",
      description: "All shapes have been removed",
    });
  };

  // Export to JSON
  const handleExportJSON = () => {
    const data = {
      name: diagramName,
      nodes,
      version: '1.0',
      created: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exported",
      description: "Diagram exported as JSON",
    });
  };

  // Import from JSON
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.nodes && Array.isArray(data.nodes)) {
          setNodes(data.nodes);
          saveToHistory(data.nodes);
          if (data.name) setDiagramName(data.name);
          toast({
            title: "Imported",
            description: `Loaded ${data.nodes.length} shapes`,
          });
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid JSON file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (nodes.length > 0) {
        localStorage.setItem('diagram-nodes', JSON.stringify(nodes));
        localStorage.setItem('diagram-name', diagramName);
        localStorage.setItem('diagram-autosave', new Date().toISOString());
        setLastSaved(new Date());
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSave);
  }, [nodes, diagramName]);

  // Load diagram on mount
  useEffect(() => {
    const saved = localStorage.getItem('diagram-nodes');
    const savedName = localStorage.getItem('diagram-name');
    const savedTime = localStorage.getItem('diagram-autosave');
    if (saved) {
      try {
        const loadedNodes = JSON.parse(saved);
        setNodes(loadedNodes);
        saveToHistory(loadedNodes);
        if (savedTime) setLastSaved(new Date(savedTime));
      } catch (error) {
        console.error('Failed to load diagram:', error);
      }
    }
    if (savedName) {
      setDiagramName(savedName);
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
      '1': [ // System Architecture - Excalidraw colors
        { id: 'node-1', type: 'rectangle', x: 100, y: 100, width: 180, height: 120, label: 'Frontend\nReact App', color: '#a5d8ff', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 350, y: 100, width: 180, height: 120, label: 'API Gateway\nNode.js', color: '#b2f2bb', fontSize: 16 },
        { id: 'node-3', type: 'rectangle', x: 600, y: 100, width: 180, height: 120, label: 'Auth Service\nJWT', color: '#d0bfff', fontSize: 16 },
        { id: 'node-4', type: 'rectangle', x: 350, y: 280, width: 180, height: 120, label: 'Database\nPostgreSQL', color: '#ffec99', fontSize: 16 },
        { id: 'arrow-1', type: 'arrow', x: 280, y: 160, width: 70, height: 0, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 530, y: 160, width: 70, height: 0, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-3', type: 'arrow', x: 440, y: 220, width: 0, height: 60, label: '', color: '#868e96', fontSize: 16 },
      ],
      '2': [ // Data Flow - Excalidraw colors
        { id: 'node-1', type: 'circle', x: 100, y: 150, width: 120, height: 120, label: 'Data\nSource', color: '#74c0fc', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 300, y: 100, width: 150, height: 80, label: 'Extract', color: '#96f2d7', fontSize: 16 },
        { id: 'node-3', type: 'rectangle', x: 300, y: 220, width: 150, height: 80, label: 'Transform', color: '#ffd8a8', fontSize: 16 },
        { id: 'node-4', type: 'rectangle', x: 520, y: 160, width: 150, height: 80, label: 'Load', color: '#d0bfff', fontSize: 16 },
        { id: 'node-5', type: 'circle', x: 740, y: 150, width: 120, height: 120, label: 'Data\nWarehouse', color: '#ffc9c9', fontSize: 16 },
        { id: 'arrow-1', type: 'arrow', x: 220, y: 160, width: 80, height: -20, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 375, y: 180, width: 0, height: 40, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-3', type: 'arrow', x: 450, y: 200, width: 70, height: 0, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-4', type: 'arrow', x: 670, y: 200, width: 70, height: 0, label: '', color: '#868e96', fontSize: 16 },
      ],
      '3': [ // User Journey - Excalidraw colors
        { id: 'node-1', type: 'circle', x: 100, y: 150, width: 100, height: 100, label: 'Start', color: '#b2f2bb', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 250, y: 130, width: 140, height: 80, label: 'Login', color: '#a5d8ff', fontSize: 16 },
        { id: 'node-3', type: 'rectangle', x: 440, y: 130, width: 140, height: 80, label: 'Dashboard', color: '#74c0fc', fontSize: 16 },
        { id: 'node-4', type: 'rectangle', x: 630, y: 130, width: 140, height: 80, label: 'Action', color: '#d0bfff', fontSize: 16 },
        { id: 'node-5', type: 'circle', x: 820, y: 150, width: 100, height: 100, label: 'End', color: '#ffc9c9', fontSize: 16 },
        { id: 'arrow-1', type: 'arrow', x: 200, y: 170, width: 50, height: 0, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 390, y: 170, width: 50, height: 0, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-3', type: 'arrow', x: 580, y: 170, width: 50, height: 0, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-4', type: 'arrow', x: 770, y: 170, width: 50, height: 0, label: '', color: '#868e96', fontSize: 16 },
      ],
      '4': [ // Database Schema - Excalidraw colors
        { id: 'node-1', type: 'rectangle', x: 100, y: 100, width: 200, height: 150, label: 'Users\n───────\nid: INT\nname: VARCHAR\nemail: VARCHAR\npassword: HASH', color: '#a5d8ff', fontSize: 14 },
        { id: 'node-2', type: 'rectangle', x: 400, y: 100, width: 200, height: 150, label: 'Projects\n───────\nid: INT\nuser_id: FK\nname: VARCHAR\ncreated_at: DATE', color: '#b2f2bb', fontSize: 14 },
        { id: 'node-3', type: 'rectangle', x: 250, y: 320, width: 200, height: 150, label: 'Files\n───────\nid: INT\nproject_id: FK\nname: VARCHAR\nsize: INT', color: '#ffec99', fontSize: 14 },
        { id: 'arrow-1', type: 'arrow', x: 300, y: 175, width: 100, height: 0, label: '', color: '#ffa8a8', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 500, y: 250, width: 0, height: 70, label: '', color: '#ffa8a8', fontSize: 16 },
      ],
      '5': [ // API Structure - Excalidraw colors
        { id: 'node-1', type: 'rectangle', x: 300, y: 80, width: 200, height: 60, label: '/api/auth', color: '#74c0fc', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 150, y: 180, width: 180, height: 50, label: 'POST /login', color: '#96f2d7', fontSize: 14 },
        { id: 'node-3', type: 'rectangle', x: 370, y: 180, width: 180, height: 50, label: 'POST /register', color: '#96f2d7', fontSize: 14 },
        { id: 'node-4', type: 'rectangle', x: 590, y: 180, width: 180, height: 50, label: 'POST /logout', color: '#96f2d7', fontSize: 14 },
        { id: 'node-5', type: 'rectangle', x: 300, y: 280, width: 200, height: 60, label: '/api/projects', color: '#cc5de8', fontSize: 16 },
        { id: 'node-6', type: 'rectangle', x: 150, y: 380, width: 180, height: 50, label: 'GET /projects', color: '#ffd8a8', fontSize: 14 },
        { id: 'node-7', type: 'rectangle', x: 370, y: 380, width: 180, height: 50, label: 'POST /projects', color: '#ffd8a8', fontSize: 14 },
        { id: 'node-8', type: 'rectangle', x: 590, y: 380, width: 180, height: 50, label: 'DELETE /:id', color: '#ffd8a8', fontSize: 14 },
      ],
      '6': [ // Component Tree - Excalidraw colors
        { id: 'node-1', type: 'rectangle', x: 350, y: 50, width: 150, height: 60, label: 'App', color: '#a5d8ff', fontSize: 16 },
        { id: 'node-2', type: 'rectangle', x: 150, y: 150, width: 130, height: 50, label: 'Header', color: '#b2f2bb', fontSize: 14 },
        { id: 'node-3', type: 'rectangle', x: 350, y: 150, width: 130, height: 50, label: 'Main', color: '#b2f2bb', fontSize: 14 },
        { id: 'node-4', type: 'rectangle', x: 550, y: 150, width: 130, height: 50, label: 'Footer', color: '#b2f2bb', fontSize: 14 },
        { id: 'node-5', type: 'rectangle', x: 280, y: 240, width: 110, height: 45, label: 'Sidebar', color: '#ffd8a8', fontSize: 13 },
        { id: 'node-6', type: 'rectangle', x: 420, y: 240, width: 110, height: 45, label: 'Content', color: '#ffd8a8', fontSize: 13 },
        { id: 'arrow-1', type: 'arrow', x: 425, y: 110, width: -210, height: 40, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-2', type: 'arrow', x: 425, y: 110, width: 0, height: 40, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-3', type: 'arrow', x: 425, y: 110, width: 190, height: 40, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-4', type: 'arrow', x: 415, y: 200, width: -80, height: 40, label: '', color: '#868e96', fontSize: 16 },
        { id: 'arrow-5', type: 'arrow', x: 415, y: 200, width: 60, height: 40, label: '', color: '#868e96', fontSize: 16 },
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
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      // Delete selected node (only if not typing in input)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode && !isInputField) {
        e.preventDefault();
        handleDelete();
      }
      
      // Copy (Ctrl+C)
      if (e.ctrlKey && e.key === 'c' && !isInputField && (selectedNode || selectedNodes.length > 0)) {
        e.preventDefault();
        handleCopy();
      }
      
      // Paste (Ctrl+V)
      if (e.ctrlKey && e.key === 'v' && !isInputField && clipboard.length > 0) {
        e.preventDefault();
        handlePaste();
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
      
      // Lock/Unlock (Ctrl+L)
      if (e.ctrlKey && e.key === 'l' && selectedNode && !isInputField) {
        e.preventDefault();
        handleToggleLock();
      }
      
      // Bring to front (Ctrl+])
      if (e.ctrlKey && e.key === ']' && selectedNode && !isInputField) {
        e.preventDefault();
        handleBringToFront();
      }
      
      // Send to back (Ctrl+[)
      if (e.ctrlKey && e.key === '[' && selectedNode && !isInputField) {
        e.preventDefault();
        handleSendToBack();
      }
      
      // Select All (Ctrl+A)
      if (e.ctrlKey && e.key === 'a' && !isInputField) {
        e.preventDefault();
        setSelectedNodes(nodes.map(n => n.id));
        setSelectedNode(null);
      }
      
      // Deselect All (Escape)
      if (e.key === 'Escape' && !isInputField) {
        setSelectedNode(null);
        setSelectedNodes([]);
        setSelectedTool('select');
        closeContextMenu();
      }
      
      // Zoom to Fit (Ctrl+0)
      if (e.ctrlKey && e.key === '0' && !isInputField) {
        e.preventDefault();
        handleZoomToFit();
      }
      
      // Auto Layout (Ctrl+Shift+L)
      if (e.ctrlKey && e.shiftKey && e.key === 'L' && !isInputField) {
        e.preventDefault();
        handleAutoLayout();
      }
      
      // Group (Ctrl+G)
      if (e.ctrlKey && e.key === 'g' && !isInputField && selectedNodes.length > 1) {
        e.preventDefault();
        handleGroupShapes();
      }
      
      // Connect shapes (Ctrl+K)
      if (e.ctrlKey && e.key === 'k' && !isInputField && selectedNodes.length === 2) {
        e.preventDefault();
        handleConnectShapes();
      }
      
      // Select tool shortcuts (only if not typing in input)
      if (!isInputField && !e.ctrlKey) {
        if (e.key === 'v') {
          setSelectedTool('select');
        } else if (e.key === 'r') {
          setSelectedTool('rectangle');
        } else if (e.key === 'o') {
          setSelectedTool('circle');
        } else if (e.key === 't') {
          setSelectedTool('text');
        } else if (e.key === 'l') {
          setSelectedTool('arrow');
        } else if (e.key === 'm') {
          setShowMinimap(!showMinimap);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, selectedNodes, historyIndex, history, nodes, clipboard, showMinimap]);

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 10));
  const handleZoomOut = () => setZoom(Math.max(50, zoom - 10));

  return (
    <PremiumLayout>
      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>Master these shortcuts to work faster</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <h4 className="font-semibold mb-2">Tools</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Select</span><kbd className="px-2 py-1 bg-gray-100 rounded">V</kbd></div>
                <div className="flex justify-between"><span>Rectangle</span><kbd className="px-2 py-1 bg-gray-100 rounded">R</kbd></div>
                <div className="flex justify-between"><span>Circle</span><kbd className="px-2 py-1 bg-gray-100 rounded">O</kbd></div>
                <div className="flex justify-between"><span>Text</span><kbd className="px-2 py-1 bg-gray-100 rounded">T</kbd></div>
                <div className="flex justify-between"><span>Arrow</span><kbd className="px-2 py-1 bg-gray-100 rounded">L</kbd></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Actions</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Copy</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+C</kbd></div>
                <div className="flex justify-between"><span>Paste</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+V</kbd></div>
                <div className="flex justify-between"><span>Duplicate</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+D</kbd></div>
                <div className="flex justify-between"><span>Delete</span><kbd className="px-2 py-1 bg-gray-100 rounded">Del</kbd></div>
                <div className="flex justify-between"><span>Select All</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+A</kbd></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Edit</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Undo</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Z</kbd></div>
                <div className="flex justify-between"><span>Redo</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Y</kbd></div>
                <div className="flex justify-between"><span>Save</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+S</kbd></div>
                <div className="flex justify-between"><span>Lock</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+L</kbd></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Arrange</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Bring Forward</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+]</kbd></div>
                <div className="flex justify-between"><span>Send Backward</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+[</kbd></div>
                <div className="flex justify-between"><span>Deselect</span><kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">View & Layout</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Zoom to Fit</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+0</kbd></div>
                <div className="flex justify-between"><span>Auto Layout</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+Shift+L</kbd></div>
                <div className="flex justify-between"><span>Toggle Minimap</span><kbd className="px-2 py-1 bg-gray-100 rounded">M</kbd></div>
                <div className="flex justify-between"><span>Group Shapes</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+G</kbd></div>
                <div className="flex justify-between"><span>Connect Shapes</span><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+K</kbd></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Canvas Confirmation */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Canvas?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all shapes on the canvas. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearCanvas} className="bg-red-600 hover:bg-red-700">
              Clear Canvas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    <div className="h-screen bg-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-neutral-200 px-2 sm:px-4 py-2 sm:py-3 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max lg:min-w-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-neutral-900 truncate">Diagram Studio</h1>
              {isEditingName ? (
                <Input
                  value={diagramName}
                  onChange={(e) => setDiagramName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="h-6 text-xs w-32 sm:w-48 mt-0.5"
                  autoFocus
                />
              ) : (
                <p 
                  className="text-xs text-neutral-600 cursor-pointer hover:text-blue-600 truncate max-w-[100px] sm:max-w-none" 
                  onClick={() => setIsEditingName(true)}
                  title="Click to edit name"
                >
                  {diagramName}
                </p>
              )}
            </div>
            
            <Separator orientation="vertical" className="h-8 hidden sm:block" />

            {/* File Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 hover:bg-gray-50 px-2 sm:px-3" onClick={handleSave}>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              
              {/* Import JSON - Hidden on very small screens */}
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-50 hidden sm:flex" asChild>
                <label htmlFor="import-json" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span className="hidden md:inline">Import</span>
                </label>
              </Button>
              <input
                id="import-json"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJSON}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 hover:bg-gray-50 px-2 sm:px-3">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleExportPNG}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJSON}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as JSON
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

            <Separator orientation="vertical" className="h-8 hidden sm:block" />

            {/* Edit Actions */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-50"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-50"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8 hidden sm:block" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-50" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded text-xs sm:text-sm font-medium min-w-[48px] sm:min-w-[60px] text-center">
                {zoom}%
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-50" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-50 hidden sm:flex"
                onClick={handleZoomToFit}
                title="Zoom to Fit (Ctrl+0)"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Alignment Tools */}
            {(selectedNodes.length > 1 || selectedNode) && (
              <>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-50">
                        <AlignLeft className="h-4 w-4" />
                        Align
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={handleAlignLeft}>
                        <AlignLeft className="h-4 w-4 mr-2" />
                        Align Left
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleAlignCenter}>
                        <AlignCenter className="h-4 w-4 mr-2" />
                        Align Center
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleAlignRight}>
                        <AlignRight className="h-4 w-4 mr-2" />
                        Align Right
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleAlignTop}>
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Align Top
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleAlignMiddle}>
                        <AlignJustify className="h-4 w-4 mr-2" />
                        Align Middle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleAlignBottom}>
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Align Bottom
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDistributeHorizontal}>
                        Distribute Horizontally
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDistributeVertical}>
                        Distribute Vertically
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}

            {/* Arrange Tools */}
            {selectedNode && (
              <>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 hover:bg-gray-50"
                    onClick={handleBringToFront}
                    title="Bring to Front (Ctrl+])"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 hover:bg-gray-50"
                    onClick={handleSendToBack}
                    title="Send to Back (Ctrl+[)"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 hover:bg-gray-50"
                    onClick={handleToggleLock}
                    title="Lock/Unlock (Ctrl+L)"
                  >
                    {nodes.find(n => n.id === selectedNode)?.locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Advanced Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Wand2 className="h-4 w-4" />
                  Actions
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleZoomToFit}>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Zoom to Fit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAutoLayout}>
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Auto Layout
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleGroupShapes} disabled={selectedNodes.length < 2}>
                  <Group className="h-4 w-4 mr-2" />
                  Group Shapes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUngroupShapes}>
                  <Ungroup className="h-4 w-4 mr-2" />
                  Ungroup
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleConnectShapes} disabled={selectedNodes.length !== 2}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect Shapes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRandomizeColors}>
                  <Palette className="h-4 w-4 mr-2" />
                  Randomize Colors
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleResetRotations}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Rotations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Minimap Toggle */}
            <Button 
              variant={showMinimap ? "default" : "outline"} 
              size="sm" 
              className="gap-2"
              onClick={() => setShowMinimap(!showMinimap)}
            >
              <Map className="h-4 w-4" />
            </Button>

            {/* Background Pattern Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  {canvasBackground === 'dots' ? 'Dots' : canvasBackground === 'grid' ? 'Grid' : 'None'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCanvasBackground('dots')}>
                  Dot Pattern
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCanvasBackground('grid')}>
                  Grid Pattern
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCanvasBackground('none')}>
                  No Pattern
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Keyboard Shortcuts */}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowShortcuts(true)}
            >
              <Keyboard className="h-4 w-4" />
              Shortcuts
            </Button>

            {/* Clear Canvas */}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-red-600 hover:text-red-700 hover:border-red-600"
              onClick={handleClearCanvas}
            >
              <Trash className="h-4 w-4" />
              Clear
            </Button>

            {/* Snap to Grid Toggle */}
            <Button 
              variant={snapToGrid ? "default" : "outline"} 
              size="sm" 
              className="gap-1"
              onClick={() => setSnapToGrid(!snapToGrid)}
              title={snapToGrid ? 'Snap to Grid: On' : 'Snap to Grid: Off'}
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden xl:inline">{snapToGrid ? 'On' : 'Off'}</span>
            </Button>

            {/* Mobile Panel Toggles */}
            <div className="lg:hidden flex items-center gap-1 ml-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowLeftPanel(true)}
              >
                <Layers className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowRightPanel(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Overlay for Left Panel */}
        {showLeftPanel && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowLeftPanel(false)}
          />
        )}

        {/* Left Sidebar - Tools & Shapes */}
        <div className={`
          bg-white border-r border-gray-200 flex flex-col overflow-hidden
          fixed lg:relative inset-y-0 left-0 z-50 w-56
          transform transition-transform duration-300 lg:translate-x-0
          ${showLeftPanel ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile close button */}
          <div className="lg:hidden flex items-center justify-between p-3 border-b">
            <span className="font-medium text-sm">Tools</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowLeftPanel(false)}>
              <Trash2 className="h-4 w-4 rotate-45" />
            </Button>
          </div>
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
                    <div className="grid grid-cols-4 gap-2">
                      {excalidrawColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCurrentColor(color)}
                          className={`aspect-square rounded-lg border-2 shadow-sm hover:scale-110 transition-transform ${
                            currentColor === color ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
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
          <div 
            className="flex-1 overflow-auto relative bg-gray-50"
            onClick={() => contextMenu && closeContextMenu()}
          >
            <div
              ref={canvasRef}
              className="relative w-full h-full min-h-[600px] cursor-crosshair"
              style={{
                backgroundImage: canvasBackground === 'dots' 
                  ? 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)'
                  : canvasBackground === 'grid'
                  ? 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)'
                  : 'none',
                backgroundSize: canvasBackground === 'dots' ? '24px 24px' : '24px 24px',
                backgroundColor: canvasBackground === 'none' ? '#ffffff' : '#f8fafc',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                setIsDrawing(false);
                setDraggedNode(null);
              }}
              onContextMenu={handleContextMenu}
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

                if (selectedTool === 'arrow' || selectedTool === 'line') {
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
                      {selectedTool === 'arrow' && (
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
                      )}
                      <line
                        x1={startPos.x < currentPos.x ? 0 : Math.abs(currentPos.x - startPos.x)}
                        y1={startPos.y < currentPos.y ? 0 : Math.abs(currentPos.y - startPos.y)}
                        x2={startPos.x < currentPos.x ? Math.abs(currentPos.x - startPos.x) : 0}
                        y2={startPos.y < currentPos.y ? Math.abs(currentPos.y - startPos.y) : 0}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        markerEnd={selectedTool === 'arrow' ? "url(#preview-arrowhead)" : ''}
                      />
                    </svg>
                  );
                }

                return null;
              })()}

              {/* Render all nodes */}
              {nodes
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)) // Sort by z-index
                .map((node) => {
                const isSelected = selectedNode === node.id;
                
                if (node.type === 'rectangle') {
                  return (
                    <div
                      key={node.id}
                      className={`absolute rounded-lg shadow-lg transition-shadow ${
                        isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : 'hover:shadow-xl'
                      } ${node.locked ? 'pointer-events-none opacity-70' : ''}`}
                      style={{
                        left: node.x,
                        top: node.y,
                        width: node.width,
                        height: node.height,
                        backgroundColor: node.color,
                        opacity: node.opacity || 1,
                        border: `${node.strokeWidth || 0}px solid ${node.color}`,
                        cursor: selectedTool === 'select' && !node.locked ? 'move' : 'default',
                        zIndex: node.zIndex || 0,
                      }}
                    >
                      {node.label && (
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                          <span className="text-white font-medium text-center break-words" style={{ fontSize: node.fontSize || 16 }}>
                            {node.label}
                          </span>
                        </div>
                      )}
                      {node.locked && (
                        <div className="absolute top-1 right-1">
                          <Lock className="h-3 w-3 text-white opacity-70" />
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
                      } ${node.locked ? 'pointer-events-none opacity-70' : ''}`}
                      style={{
                        left: node.x,
                        top: node.y,
                        width: node.width,
                        height: node.width,
                        backgroundColor: node.color,
                        opacity: node.opacity || 1,
                        border: `${node.strokeWidth || 0}px solid ${node.color}`,
                        cursor: selectedTool === 'select' && !node.locked ? 'move' : 'default',
                        zIndex: node.zIndex || 0,
                      }}
                    >
                      {node.label && (
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                          <span className="text-white font-medium text-center break-words" style={{ fontSize: node.fontSize || 16 }}>
                            {node.label}
                          </span>
                        </div>
                      )}
                      {node.locked && (
                        <div className="absolute top-1 right-1">
                          <Lock className="h-3 w-3 text-white opacity-70" />
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

                if (node.type === 'arrow' || node.type === 'line') {
                  const strokeDasharray = node.strokeStyle === 'dashed' ? '10,5' : node.strokeStyle === 'dotted' ? '2,3' : '';
                  return (
                    <svg
                      key={node.id}
                      className={`absolute ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      } ${node.locked ? 'pointer-events-none opacity-70' : ''}`}
                      style={{
                        left: Math.min(node.x, node.x + node.width),
                        top: Math.min(node.y, node.y + node.height),
                        width: Math.abs(node.width),
                        height: Math.abs(node.height),
                        cursor: selectedTool === 'select' && !node.locked ? 'move' : 'default',
                        opacity: node.opacity || 1,
                        zIndex: node.zIndex || 0,
                      }}
                    >
                      {node.type === 'arrow' && (
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
                      )}
                      <line
                        x1={node.width < 0 ? Math.abs(node.width) : 0}
                        y1={node.height < 0 ? Math.abs(node.height) : 0}
                        x2={node.width < 0 ? 0 : Math.abs(node.width)}
                        y2={node.height < 0 ? 0 : Math.abs(node.height)}
                        stroke={node.color}
                        strokeWidth={node.strokeWidth || 3}
                        strokeDasharray={strokeDasharray}
                        markerEnd={node.type === 'arrow' ? `url(#arrowhead-${node.id})` : ''}
                      />
                      {node.locked && (
                        <foreignObject x="50%" y="0" width="20" height="20">
                          <div className="flex items-center justify-center">
                            <Lock className="h-3 w-3 text-gray-700 opacity-70" />
                          </div>
                        </foreignObject>
                      )}
                    </svg>
                  );
                }

                return null;
              })}
            </div>

            {/* Minimap Overlay */}
            {showMinimap && nodes.length > 0 && (
              <div className="absolute bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20">
                <div className="text-xs font-medium text-gray-600 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Map className="h-3 w-3" />
                    Minimap
                  </span>
                  <button 
                    onClick={() => setShowMinimap(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div 
                  className="relative bg-gray-50 rounded border border-gray-100"
                  style={{ width: 150, height: 100 }}
                >
                  {nodes.map(node => {
                    const bounds = getMinimapBounds();
                    const scaleX = 150 / (bounds.maxX - bounds.minX + 100);
                    const scaleY = 100 / (bounds.maxY - bounds.minY + 100);
                    const scale = Math.min(scaleX, scaleY, 0.15);
                    
                    return (
                      <div
                        key={node.id}
                        className="absolute rounded-sm"
                        style={{
                          left: (node.x - bounds.minX + 50) * scale,
                          top: (node.y - bounds.minY + 50) * scale,
                          width: Math.max(node.width * scale, 3),
                          height: Math.max(node.height * scale, 3),
                          backgroundColor: node.color,
                          border: selectedNode === node.id ? '1px solid #3b82f6' : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stats Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
              <Badge variant="secondary" className="bg-white/90 text-gray-700 border border-gray-200 shadow-sm">
                <Layers className="h-3 w-3 mr-1" />
                {nodes.length} shapes
              </Badge>
              {lastSaved && (
                <Badge variant="secondary" className="bg-white/90 text-gray-500 border border-gray-200 shadow-sm text-xs">
                  <Timer className="h-3 w-3 mr-1" />
                  Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Badge>
              )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
              <div 
                className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 min-w-[180px]"
                style={{ left: contextMenu.x, top: contextMenu.y }}
                onClick={closeContextMenu}
              >
                {contextMenu.nodeId ? (
                  <>
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => { handleDuplicate(); closeContextMenu(); }}
                    >
                      <Copy className="h-4 w-4" /> Duplicate
                    </button>
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => { handleCopy(); closeContextMenu(); }}
                    >
                      <Copy className="h-4 w-4" /> Copy
                    </button>
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => { handleToggleLock(); closeContextMenu(); }}
                    >
                      {nodes.find(n => n.id === contextMenu.nodeId)?.locked 
                        ? <><Unlock className="h-4 w-4" /> Unlock</>
                        : <><Lock className="h-4 w-4" /> Lock</>
                      }
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => { handleBringToFront(); closeContextMenu(); }}
                    >
                      <ArrowUp className="h-4 w-4" /> Bring to Front
                    </button>
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => { handleSendToBack(); closeContextMenu(); }}
                    >
                      <ArrowDown className="h-4 w-4" /> Send to Back
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      onClick={() => { handleDelete(); closeContextMenu(); }}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => { handlePaste(); closeContextMenu(); }}
                      disabled={clipboard.length === 0}
                    >
                      <Copy className="h-4 w-4" /> Paste
                    </button>
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => { handleZoomToFit(); closeContextMenu(); }}
                    >
                      <Maximize2 className="h-4 w-4" /> Zoom to Fit
                    </button>
                    <button 
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => { handleAutoLayout(); closeContextMenu(); }}
                    >
                      <LayoutGrid className="h-4 w-4" /> Auto Layout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Overlay for Right Panel */}
        {showRightPanel && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowRightPanel(false)}
          />
        )}

        {/* Right Sidebar - Properties & Layers */}
        <div className={`
          bg-white border-l border-gray-200 flex flex-col
          fixed lg:relative inset-y-0 right-0 z-50 w-64
          transform transition-transform duration-300 lg:translate-x-0
          ${showRightPanel ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile close button */}
          <div className="lg:hidden flex items-center justify-between p-3 border-b">
            <span className="font-medium text-sm">Properties</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowRightPanel(false)}>
              <Trash2 className="h-4 w-4 rotate-45" />
            </Button>
          </div>
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
                              <div className="grid grid-cols-4 gap-2">
                                {excalidrawColors.map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => updateNodeProperty('color', color)}
                                    className={`aspect-square rounded border-2 shadow-sm hover:scale-110 transition-transform ${
                                      node.color === color ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-1' : 'border-gray-300'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Stroke Width */}
                            {(node.type === 'arrow' || node.type === 'rectangle' || node.type === 'circle') && (
                              <div>
                                <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 block">
                                  Stroke Width: {node.strokeWidth || 3}px
                                </Label>
                                <Slider
                                  value={[node.strokeWidth || 3]}
                                  onValueChange={(v) => updateNodeProperty('strokeWidth', v[0])}
                                  min={1}
                                  max={10}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            )}

                            {/* Stroke Style */}
                            {(node.type === 'arrow' || node.type === 'rectangle' || node.type === 'circle') && (
                              <div>
                                <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                                  Stroke Style
                                </Label>
                                <Select 
                                  value={node.strokeStyle || 'solid'}
                                  onValueChange={(v) => updateNodeProperty('strokeStyle', v)}
                                >
                                  <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="solid">Solid</SelectItem>
                                    <SelectItem value="dashed">Dashed</SelectItem>
                                    <SelectItem value="dotted">Dotted</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Opacity */}
                            <div>
                              <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 block">
                                Opacity: {Math.round((node.opacity || 1) * 100)}%
                              </Label>
                              <Slider
                                value={[(node.opacity || 1) * 100]}
                                onValueChange={(v) => updateNodeProperty('opacity', v[0] / 100)}
                                min={10}
                                max={100}
                                step={5}
                                className="w-full"
                              />
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
    <Toaster />
    </PremiumLayout>
  );
};
