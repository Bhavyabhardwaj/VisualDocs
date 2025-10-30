import { TopNavBar } from '../app/TopNavBar';
import { UnifiedSidebar } from '../app/UnifiedSidebar';

interface PremiumLayoutProps {
  children: React.ReactNode;
}

export const PremiumLayout = ({ children }: PremiumLayoutProps) => {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top Navigation Bar */}
      <TopNavBar />

      {/* Unified Sidebar */}
      <UnifiedSidebar />

      {/* Main Content with Sidebar and TopNav Offset */}
      <main className="ml-64 pt-16">
        {children}
      </main>
    </div>
  );
};
