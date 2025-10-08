import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from './components/app/ErrorBoundary';
import { ProtectedRoute } from '@/components/app/ProtectedRoute';
import { AppLayout } from '@/components/app/AppLayout';
import { CollaborationProvider } from '@/components/collaboration/CollaborationProvider';
import { LiveCursors } from '@/components/collaboration/UserPresence';

// Marketing Pages
import PremiumLanding from './pages/PremiumLanding';
import NewLanding from './pages/NewLanding';
import SplitLogin from './pages/auth/SplitLogin';
import SplitRegister from './pages/auth/SplitRegister';
import { ForgotPassword } from './pages/ForgotPassword';

// App Pages
import Dashboard from '@/pages/app/Dashboard';
import { ProjectDetail } from '@/pages/app/ProjectDetail';
import { Diagrams } from './pages/Diagrams';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<NewLanding />} />
            <Route path="/old" element={<PremiumLanding />} />
            <Route path="/login" element={<SplitLogin />} />
            <Route path="/register" element={<SplitRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Dashboard - Standalone with its own layout */}
            <Route path="/app/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
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
              <Route path="projects/:id" element={
                <CollaborationProvider projectId="default">
                  <LiveCursors />
                  <ProjectDetail />
                </CollaborationProvider>
              } />
              <Route path="diagrams" element={<Diagrams />} />
              <Route path="settings" element={<Settings />} />
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
