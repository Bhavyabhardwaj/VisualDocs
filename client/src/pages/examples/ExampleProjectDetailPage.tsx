import { useState } from 'react';
import { TopNavBar } from '@/components/app/TopNavBar';
import { CollaborationBar } from '@/components/app/CollaborationBar';
import { ComprehensiveActivityFeed, useMockActivityData } from '@/components/app/ComprehensiveActivityFeed';
import { ShareModal } from '@/components/app/ShareModal';
import { ExportModal } from '@/components/app/ExportModal';
import { EmptyStateCard } from '@/components/app/EmptyStateCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Share2, Download, FolderOpen, Github, Upload } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Example Project Detail Page
 * 
 * Demonstrates integration of all new UI/UX components:
 * - Top Navigation Bar with search, notifications, user menu
 * - Collaboration Bar with live presence
 * - Share and Export modals
 * - Activity Feed
 * - Empty States
 * - Keyboard Shortcuts (⌘K, ⌘/, etc.)
 */

export const ExampleProjectDetailPage = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  
  // Mock data - replace with real API calls
  const projectId = '123';
  const projectName = 'VisualDocs Frontend';
  const hasProjects = true; // Set to false to see empty state
  const activities = useMockActivityData();

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const handleGitHubImport = () => {
    toast.info('GitHub import coming soon!', {
      description: 'Connect your repository to start',
    });
  };

  const handleUploadFiles = () => {
    toast.info('File upload coming soon!', {
      description: 'Drag and drop or browse files',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation - Includes search, notifications, user menu */}
      <TopNavBar />

      {/* Collaboration Bar - Shows active users, comments, call */}
      {hasProjects && (
        <CollaborationBar projectId={projectId} projectName={projectName} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {hasProjects ? (
          <>
            {/* Project Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
                    {projectName}
                  </h1>
                  <p className="text-sm text-zinc-600">
                    React TypeScript frontend application
                  </p>
                </div>

                {/* Action Buttons with Visual Hierarchy */}
                <div className="flex items-center gap-3">
                  {/* Secondary Action */}
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>

                  {/* Secondary Action */}
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>

                  {/* Primary Action */}
                  <Button className="bg-zinc-900 hover:bg-zinc-800 gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Files
                    <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 font-mono ml-2">
                      ⌘U
                    </kbd>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Files Analyzed', value: '156' },
                { label: 'Documentation', value: '87%' },
                { label: 'Code Quality', value: 'A+' },
                { label: 'Last Updated', value: '2h ago' },
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <p className="text-sm text-zinc-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold text-zinc-900">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-zinc-900">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ComprehensiveActivityFeed activities={activities} maxHeight="400px" />
              </CardContent>
            </Card>
          </>
        ) : (
          /* Empty State - Shows when no projects */
          <EmptyStateCard
            icon={FolderOpen}
            title="No projects yet"
            description="Get started by importing a repository from GitHub or uploading your codebase directly. Transform your code into beautiful documentation in minutes."
            action={{
              label: 'Import from GitHub',
              icon: Github,
              onClick: handleGitHubImport,
            }}
            secondaryAction={{
              label: 'Upload Files',
              icon: Upload,
              onClick: handleUploadFiles,
            }}
          />
        )}
      </div>

      {/* Modals */}
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        projectId={projectId}
        projectName={projectName}
      />

      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        projectId={projectId}
        projectName={projectName}
      />

      {/* 
        Keyboard Shortcuts (automatically available):
        - ⌘K / Ctrl+K - Open command palette
        - ⌘/ / Ctrl+/ - Show keyboard shortcuts
        - Esc - Close modals
      */}
    </div>
  );
};

/**
 * Usage Instructions:
 * 
 * 1. Import this component in your router:
 *    import { ExampleProjectDetailPage } from '@/pages/examples/ExampleProjectDetailPage';
 * 
 * 2. Add to your routes:
 *    <Route path="/examples/project-detail" element={<ExampleProjectDetailPage />} />
 * 
 * 3. Navigate to /examples/project-detail to see all features in action
 * 
 * 4. Test keyboard shortcuts:
 *    - Press ⌘K to open search
 *    - Press ⌘/ to view all shortcuts
 *    - Press Esc to close modals
 * 
 * 5. Replace mock data with real API calls:
 *    - activities from /api/activities/${projectId}
 *    - collaboration from WebSocket connection
 *    - share/export from respective endpoints
 */
