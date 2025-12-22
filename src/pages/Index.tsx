import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ShopifyProductsSection from '@/components/ShopifyProductsSection';
import BestSellersSection from '@/components/BestSellersSection';
import CategoriesSection from '@/components/CategoriesSection';
import PromoBanner from '@/components/PromoBanner';
import BundleSection from '@/components/BundleSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isTransparent />
      <main>
        <HeroSection />
        <ShopifyProductsSection />
        <PromoBanner />
        <BestSellersSection />
        <CategoriesSection />
        <BundleSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Index;
