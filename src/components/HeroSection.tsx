import { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingBag } from 'lucide-react';
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isDragging]);

  // Sync scroll position with current slide
  useEffect(() => {
    if (sliderRef.current && !isDragging) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth',
      });
    }
  }, [currentSlide, isDragging]);

  // Handle scroll end to sync slide indicator
  const handleScroll = useCallback(() => {
    if (sliderRef.current && !isDragging) {
      const slideWidth = sliderRef.current.offsetWidth;
      const newSlide = Math.round(sliderRef.current.scrollLeft / slideWidth);
      if (newSlide !== currentSlide && newSlide >= 0 && newSlide < heroImages.length) {
        setCurrentSlide(newSlide);
      }
    }
  }, [currentSlide, isDragging]);

  // Touch/Mouse drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Snap to nearest slide
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      const newSlide = Math.round(sliderRef.current.scrollLeft / slideWidth);
      setCurrentSlide(Math.max(0, Math.min(newSlide, heroImages.length - 1)));
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative -mt-16 md:-mt-20">
      {/* Hero Banner - Full width, immersive height */}
      <div className="relative w-full overflow-hidden">
        {/* Touch-friendly Slider */}
        <div
          ref={sliderRef}
          className="flex h-[calc(75vh+4rem)] md:h-[calc(90vh+5rem)] pt-16 md:pt-20 overflow-x-auto scrollbar-hide touch-slider cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onMouseMove={handleDragMove}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onTouchMove={handleDragMove}
          onScroll={handleScroll}
        >
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full relative"
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
            </div>
          ))}
        </div>

        {/* Slide Indicators - Minimal dots at bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 w-1.5 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CTA Button - Below Banner */}
      <div className="flex justify-center -mt-12 relative z-10">
        <Button 
          onClick={scrollToProducts}
          size="lg"
          className="btn-gold gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-gold animate-fade-up"
        >
          <ShoppingBag size={20} />
          {t('Shop Now', 'تسوقي الآن')}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
