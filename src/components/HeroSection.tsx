import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBanner1 from '@/assets/hero-banner.png';
import heroBanner2 from '@/assets/hero-banner-2.png';
import heroBanner3 from '@/assets/hero-banner-3.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const heroImages = [
  { src: heroBanner1, alt: 'BV Cosmatics - مجموعة العناية الفاخرة' },
  { src: heroBanner2, alt: 'BV Cosmatics - سيروم فاخر للبشرة' },
  { src: heroBanner3, alt: 'BV Cosmatics - كريمات ترطيب فاخرة' },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isRTL, t } = useLanguage();

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
    <section className="relative pt-20 md:pt-24">
      <div className="container-custom relative">
        {/* Hero Banner - Wide Rectangle */}
        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-elevated">
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

          {/* Banner Images Slider */}
          <div className="relative aspect-[16/6] md:aspect-[1300/600] w-full overflow-hidden">
            {heroImages.map((image, index) => (
              <img 
                key={index}
                src={image.src} 
                alt={image.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            
            {/* CTA Overlay */}
            <div className="absolute inset-0 flex items-end justify-center pb-12 md:pb-16 z-10">
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
      </div>
    </section>
  );
};

export default HeroSection;
