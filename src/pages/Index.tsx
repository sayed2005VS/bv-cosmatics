import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ShopifyProductsSection from '@/components/ShopifyProductsSection';
import PromoBanner from '@/components/PromoBanner';
import BundleSection from '@/components/BundleSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ShopifyProductsSection />
        <PromoBanner />
        <BundleSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
