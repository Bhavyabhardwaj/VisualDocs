import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { AppLayout } from '@/components/app/AppLayout';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/app/Dashboard';
import { Projects } from '@/pages/app/Projects';
import { ProjectDetail } from '@/pages/app/ProjectDetail';
import { Analysis } from '@/pages/app/Analysis';
import { Diagrams } from '@/pages/app/Diagrams';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="diagrams" element={<Diagrams />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
