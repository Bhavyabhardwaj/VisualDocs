import { PremiumSidebar } from './PremiumSidebar';

interface PremiumLayoutProps {
  children: React.ReactNode;
}

export const PremiumLayout = ({ children }: PremiumLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <PremiumSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
