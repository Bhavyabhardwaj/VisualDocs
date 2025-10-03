import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/app/ErrorBoundary';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { AppLayout } from '@/components/app/AppLayout';
import { CollaborationProvider } from '@/components/collaboration/CollaborationProvider';
import { LiveCursors } from '@/components/collaboration/UserPresence';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/app/Dashboard';
import { Projects } from '@/pages/app/Projects';
import { ProjectDetail } from '@/pages/app/ProjectDetail';
import { Analysis } from '@/pages/app/Analysis';
import { Diagrams } from '@/pages/app/Diagrams';
import { Settings } from '@/pages/app/Settings';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* App Routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <CollaborationProvider projectId="default">
                  <AppLayout />
                  <LiveCursors />
                </CollaborationProvider>
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="diagrams" element={<Diagrams />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
