import React from 'react';
import { MarketingNavbar } from '@/components/marketing/MarketingNavbar';
import { HeroSection } from '@/components/marketing/HeroSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { PricingSection } from '@/components/marketing/PricingSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
    </div>
  );
};
