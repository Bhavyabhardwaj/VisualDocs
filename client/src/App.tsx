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
import PremiumDashboard from '@/pages/app/PremiumDashboard';
import ModernDashboard from '@/pages/app/ModernDashboard';
import { Dashboard as RedesignedDashboard } from '@/pages/app/RedesignedDashboard';
import PremiumProjectDetail from '@/pages/app/PremiumProjectDetail';
import AnalyticsDashboard from '@/pages/app/Analytics';
import TeamManagement from '@/pages/app/Team';
import { Diagrams } from './pages/Diagrams';
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
            
            {/* Dashboard - Standalone with its own layout */}
            <Route path="/app/dashboard" element={
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
            
            {/* Project Detail - Standalone with collaboration */}
            <Route path="/app/projects/:id" element={
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
            
            {/* Protected App Routes with Layout */}
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="projects" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="diagrams" element={<Diagrams />} />
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
