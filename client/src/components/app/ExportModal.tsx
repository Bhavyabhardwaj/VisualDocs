import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  Download,
  FileText,
  Image,
  Code,
  Share,
  Link,
  Mail,
  X,
  Check,
  Copy
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, title, type }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl] = useState('https://visualdocs.com/shared/abc123');
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 2000);
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
                <Card
                  key={format.id}
                  variant={selectedFormat === format.id ? 'elevated' : 'default'}
                  hover
                  className={`cursor-pointer ${
                    selectedFormat === format.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <CardContent className="p-4 text-center">
                    <format.icon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                    <h4 className="font-medium text-light-text dark:text-dark-text mb-1">
                      {format.name}
                    </h4>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {format.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedFormat && (
              <div className="mt-4 flex justify-end">
                <Button
                  icon={<Download className="w-4 h-4" />}
                  onClick={handleExport}
                  loading={isExporting}
                  disabled={isExporting}
                >
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
              <div className="flex-1 px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-md border app-border font-mono text-sm">
                {shareUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                onClick={copyToClipboard}
                className={copied ? 'text-success-600' : ''}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Mail className="w-4 h-4" />}
                onClick={() => window.open(`mailto:?subject=${title}&body=Check out this analysis: ${shareUrl}`)}
              >
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Share className="w-4 h-4" />}
              >
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
