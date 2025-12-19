import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.png';
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

          {/* Banner Image */}
          <div className="relative aspect-[16/6] md:aspect-[1300/600] w-full">
            <img 
              src={heroBanner} 
              alt="BV-Cosmatics Premium Skincare Collection" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroSlides.map((_, index) => (
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
