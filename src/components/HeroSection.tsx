import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBanner1 from '@/assets/hero-banner.png';
import heroBanner2 from '@/assets/hero-banner-2.png';
import heroBanner3 from '@/assets/hero-banner-3.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { CartDrawer } from './CartDrawer';

const heroImages = [
  { src: heroBanner1, alt: 'BV Cosmatics - مجموعة العناية الفاخرة' },
  { src: heroBanner2, alt: 'BV Cosmatics - سيروم فاخر للبشرة' },
  { src: heroBanner3, alt: 'BV Cosmatics - كريمات ترطيب فاخرة' },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, isRTL, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-0 md:pt-24">
      {/* Mobile Header - Integrated into Hero */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-30 p-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white hover:text-primary transition-colors bg-black/30 backdrop-blur-sm rounded-full"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <a href="/" className="font-display text-xl font-semibold tracking-tight text-white drop-shadow-lg">
            BV-Cosmatics
          </a>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 p-2 text-white hover:text-primary transition-colors bg-black/30 backdrop-blur-sm rounded-full"
            >
              <Globe size={18} />
            </button>

            {/* Cart */}
            <div className="bg-black/30 backdrop-blur-sm rounded-full">
              <CartDrawer />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="mt-4 p-4 bg-background/95 backdrop-blur-md rounded-2xl shadow-elevated animate-fade-in">
            <div className="flex flex-col gap-4">
              <a 
                href="#products" 
                className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('Products', 'المنتجات')}
              </a>
              <a 
                href="#bundles" 
                className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('Sets', 'المجموعات')}
              </a>
              <a 
                href="#testimonials" 
                className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('Reviews', 'التقييمات')}
              </a>
            </div>
          </nav>
        )}
      </div>

      <div className="container-custom relative md:pt-0">
        {/* Hero Banner - Wide Rectangle on Desktop, Tall on Mobile */}
        <div className="relative w-full overflow-hidden rounded-none md:rounded-3xl shadow-elevated">
          {/* Navigation Arrows */}
          <button 
            onClick={isRTL ? nextSlide : prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-background/80 backdrop-blur-sm rounded-full shadow-soft flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={isRTL ? prevSlide : nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-background/80 backdrop-blur-sm rounded-full shadow-soft flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          {/* Banner Images Slider - Taller on Mobile (75vh) */}
          <div className="relative h-[75vh] md:h-auto md:aspect-[1300/600] w-full overflow-hidden">
            {heroImages.map((image, index) => (
              <img 
                key={index}
                src={image.src} 
                alt={image.alt}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            {/* Gradient overlay for mobile readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 md:hidden" />
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-background w-6' 
                    : 'bg-background/50 hover:bg-background/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button - Below Banner */}
        <div className="flex justify-center mt-6">
          <Button 
            onClick={scrollToProducts}
            size="lg"
            className="btn-gold gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-gold animate-fade-up"
          >
            <ShoppingBag size={20} />
            {t('Shop Now', 'تسوقي الآن')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
