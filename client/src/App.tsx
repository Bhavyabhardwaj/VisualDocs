import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from './components/app/ErrorBoundary';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { AppLayout } from '@/components/app/AppLayout';
import { CollaborationProvider } from '@/components/collaboration/CollaborationProvider';
import { LiveCursors } from '@/components/collaboration/UserPresence';

// Marketing Pages
import NewLanding from './pages/NewLanding';
import LandingLogin from './pages/auth/LandingLogin';
import LandingRegister from './pages/auth/LandingRegister';
import { ForgotPassword } from './pages/ForgotPassword';

// App Pages
import { ShadcnDashboard } from '@/pages/app/ShadcnDashboard';
import { ShadcnProjectDetail } from '@/pages/app/ShadcnProjectDetail';
import PremiumDashboard from '@/pages/app/PremiumDashboard';
import ModernDashboard from '@/pages/app/ModernDashboard';
import { Dashboard as RedesignedDashboard } from '@/pages/app/RedesignedDashboard';
import { PremiumRedesignedDashboard } from '@/pages/app/PremiumRedesignedDashboard';
import { VSCodeStyleProjectDetail } from '@/pages/app/VSCodeStyleProjectDetail';
import PremiumProjectDetail from '@/pages/app/PremiumProjectDetail';
import AnalyticsDashboard from '@/pages/app/Analytics';
import TeamManagement from '@/pages/app/Team';
import { Diagrams } from './pages/Diagrams';
import { DiagramGenerator } from '@/pages/app/DiagramGenerator';
import { Settings } from '@/pages/app/Settings';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<NewLanding />} />
            <Route path="/login" element={<LandingLogin />} />
            <Route path="/register" element={<LandingRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Dashboard - Shadcn Professional Dashboard */}
            <Route path="/app/dashboard" element={
              <ProtectedRoute>
                <ShadcnDashboard />
              </ProtectedRoute>
            } />
            
            {/* Alternative Dashboards (for reference) */}
            <Route path="/app/dashboard-premium" element={
              <ProtectedRoute>
                <PremiumRedesignedDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/app/dashboard-v2" element={
              <ProtectedRoute>
                <RedesignedDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/app/dashboard-modern" element={
              <ProtectedRoute>
                <ModernDashboard />
              </ProtectedRoute>
            } />
            
            {/* Old Dashboard (keep for reference) */}
            <Route path="/app/dashboard-old" element={
              <ProtectedRoute>
                <PremiumDashboard />
              </ProtectedRoute>
            } />
            
            {/* Project Detail - Shadcn Professional UI */}
            <Route path="/app/projects/:id" element={
              <ProtectedRoute>
                <ShadcnProjectDetail />
              </ProtectedRoute>
            } />
            
            {/* Old Project Detail - VSCode Style */}
            <Route path="/app/projects/:id/vscode" element={
              <ProtectedRoute>
                <VSCodeStyleProjectDetail />
              </ProtectedRoute>
            } />
            
            {/* Old Project Detail with collaboration */}
            <Route path="/app/projects/:id/collab" element={
              <ProtectedRoute>
                <CollaborationProvider projectId="default">
                  <LiveCursors />
                  <PremiumProjectDetail />
                </CollaborationProvider>
              </ProtectedRoute>
            } />
            
            {/* Analytics */}
            <Route path="/app/analytics" element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            
            {/* Team */}
            <Route path="/app/team" element={
              <ProtectedRoute>
                <TeamManagement />
              </ProtectedRoute>
            } />
            
            {/* Settings - Standalone with its own layout */}
            <Route path="/app/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/app/settings/:section" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Diagram Generator - Standalone */}
            <Route path="/app/diagrams" element={
              <ProtectedRoute>
                <DiagramGenerator />
              </ProtectedRoute>
            } />
            
            {/* Protected App Routes with Layout */}
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="projects" element={<Navigate to="/app/dashboard" replace />} />
            </Route>
            
            {/* Legacy routes - redirect to /app */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/projects" element={<Navigate to="/app/projects" replace />} />
            <Route path="/projects/:id" element={<Navigate to="/app/projects/:id" replace />} />
            <Route path="/diagrams" element={<Navigate to="/app/diagrams" replace />} />
            <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
            
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
