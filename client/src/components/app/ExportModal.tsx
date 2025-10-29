import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Download,
  FileText,
  Image,
  Code,
  Share,
  Mail,
  X,
  Check,
  Copy
} from 'lucide-react';
import { analysisApi } from '@/lib/api';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  title: string;
  type: 'analysis' | 'diagram';
}

const exportFormats = {
  analysis: [
    { id: 'pdf', name: 'PDF Report', icon: FileText, description: 'Complete analysis report' },
    { id: 'json', name: 'JSON Data', icon: Code, description: 'Raw analysis data' },
    { id: 'csv', name: 'CSV Export', icon: FileText, description: 'Metrics in spreadsheet format' }
  ],
  diagram: [
    { id: 'png', name: 'PNG Image', icon: Image, description: 'High-resolution image' },
    { id: 'svg', name: 'SVG Vector', icon: Code, description: 'Scalable vector format' },
    { id: 'pdf', name: 'PDF Document', icon: FileText, description: 'Printable document' }
  ]
};

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, projectId, title, type }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl] = useState(`${window.location.origin}/shared/${projectId}`);
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    if (!selectedFormat) {
      toast.error('Please select an export format');
      return;
    }

    setIsExporting(true);
    
    try {
      // Map format to backend format parameter
      let format: 'json' | 'pdf' | 'markdown' = 'json';
      if (selectedFormat === 'pdf') format = 'pdf';
      else if (selectedFormat === 'csv') format = 'markdown'; // CSV not yet supported, use markdown
      else if (selectedFormat === 'json') format = 'json';
      
      const response = await analysisApi.export(projectId, format);
      
      if (response.success && response.data) {
        // Create download link
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${format}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success(`Export completed successfully`);
        onClose();
      } else {
        throw new Error(response.error || 'Export failed');
      }
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || 'Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b app-border">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
            Export & Share: {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
              Download
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {exportFormats[type].map((format) => (
                <div
                  key={format.id}
                  className={`p-4 text-center rounded-lg border-2 cursor-pointer transition-all ${
                    selectedFormat === format.id 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                      : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <format.icon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-medium text-zinc-900 mb-1">
                    {format.name}
                  </h4>
                  <p className="text-xs text-zinc-600">
                    {format.description}
                  </p>
                </div>
              ))}
            </div>
            
            {selectedFormat && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Exporting...' : `Export ${selectedFormat.toUpperCase()}`}
                </Button>
              </div>
            )}
          </div>

          {/* Share Section */}
          <div className="pt-6 border-t app-border">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
              Share Link
            </h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-1 px-3 py-2 bg-zinc-50 rounded-md border border-zinc-200 font-mono text-sm">
                {shareUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className={`gap-2 ${copied ? 'text-green-600' : ''}`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:?subject=${title}&body=Check out this analysis: ${shareUrl}`)}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Share className="w-4 h-4" />
                More Options
              </Button>
            </div>
          </div>

          {/* Permissions */}
          <div className="pt-6 border-t app-border">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
              Access Permissions
            </h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input type="radio" name="access" className="text-primary-500" defaultChecked />
                <span className="text-sm">Anyone with the link can view</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="radio" name="access" className="text-primary-500" />
                <span className="text-sm">Only team members can view</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="radio" name="access" className="text-primary-500" />
                <span className="text-sm">Password protected</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t app-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
