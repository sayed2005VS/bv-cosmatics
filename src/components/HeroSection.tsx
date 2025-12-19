import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroProducts from '@/assets/hero-products.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { heroSlides } from '@/data/products';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative hero-gradient overflow-hidden pt-20 pb-8 md:pt-24 md:pb-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Subtle label */}
          <span 
            key={currentSlide}
            className="label-subtle mb-4 animate-fade-up"
          >
            {t(heroSlides[currentSlide].label, heroSlides[currentSlide].labelAr)}
          </span>

          {/* Product Display - Slider */}
          <div className="relative w-full max-w-lg mb-6">
            {/* Navigation Arrows */}
            <button 
              onClick={isRTL ? nextSlide : prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full shadow-soft flex items-center justify-center text-foreground hover:bg-background transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={isRTL ? prevSlide : nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full shadow-soft flex items-center justify-center text-foreground hover:bg-background transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            {/* Slide Image */}
            <div className="overflow-hidden rounded-2xl mx-10">
              <img 
                src={heroProducts} 
                alt="BV-Cosmatics Premium Skincare Collection" 
                className="w-full h-auto transition-transform duration-500"
              />
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary w-6' 
                      : 'bg-border hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button className="btn-ghost text-base">
            {t('Shop Now', 'تسوق الآن')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
