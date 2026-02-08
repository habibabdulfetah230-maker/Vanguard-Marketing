import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { GrowthSystem } from "@/components/home/GrowthSystem";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";
import { FAQ } from "@/components/home/FAQ";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesPreview />
      <GrowthSystem />
      <PortfolioPreview />
      <Testimonials />
      <FAQ />
      <NewsletterSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
