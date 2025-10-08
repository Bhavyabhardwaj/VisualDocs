import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { DashboardPreview } from '@/components/dashboard-preview';
import SmartSimpleBrilliant from '@/components/smart-simple-brilliant';
import { FeatureCards } from '@/components/feature-cards';
import NumbersThatSpeak from '@/components/numbers-that-speak';
import YourWorkInSync from '@/components/your-work-in-sync';
import EffortlessIntegrationUpdated from '@/components/effortless-integration-updated';
import DocumentationSection from '@/components/documentation-section';
import TestimonialsSection from '@/components/testimonials-section';
import PricingSection from '@/components/pricing-section';
import FaqSection from '@/components/faq-section';
import CtaSection from '@/components/cta-section';
import FooterSection from '@/components/footer-section';

export default function NewLanding() {
  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <Header />
      <main>
        <HeroSection />
        <DashboardPreview />
        <SmartSimpleBrilliant />
        <FeatureCards />
        <NumbersThatSpeak />
        <YourWorkInSync />
        <EffortlessIntegrationUpdated />
        <DocumentationSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
}
