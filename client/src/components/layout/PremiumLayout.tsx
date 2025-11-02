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

      {/* Main Content with Sidebar and TopNav Offset - Mobile Responsive */}
      <main className="lg:ml-64 pt-14 sm:pt-16">
        {children}
      </main>
    </div>
  );
};
