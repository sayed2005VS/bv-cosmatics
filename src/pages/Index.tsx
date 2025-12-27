import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LocalProductsSection from '@/components/LocalProductsSection';
import BestSellersSection from '@/components/BestSellersSection';
import CategoriesSection from '@/components/CategoriesSection';
import PromoBanner from '@/components/PromoBanner';
import BundleSection from '@/components/BundleSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import MobileBottomNav from '@/components/MobileBottomNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <main>
        <HeroSection />
        <BestSellersSection />
        <PromoBanner />
        <LocalProductsSection />
        <CategoriesSection />
        <BundleSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <WhatsAppWidget />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
