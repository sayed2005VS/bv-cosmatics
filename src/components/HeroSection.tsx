import { useState, useEffect } from 'react';
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
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Auto-advance slides (infinite loop)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isDragging]);

  // Touch/Mouse drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX);
    setDragOffset(0);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = window.innerWidth / 4;
    if (dragOffset < -threshold) {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    } else if (dragOffset > threshold) {
      setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    }
    setDragOffset(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setDragOffset(pageX - startX);
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative -mt-16 md:-mt-20">
      <div className="relative w-full overflow-hidden h-[calc(75vh+4rem)] md:h-[calc(90vh+5rem)]">
        {/* Static CTA Button - Overlaid on center */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <Button 
            onClick={scrollToProducts}
            size="lg"
            className="btn-gold gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-gold pointer-events-auto transform-gpu"
          >
            <ShoppingBag size={20} />
            {t('Shop Now', 'تسوقي الآن')}
          </Button>
        </div>

        {/* Slider with CSS transitions */}
        <div
          className="flex h-full pt-16 md:pt-20 cursor-grab active:cursor-grabbing touch-none select-none"
          style={{
            transform: `translate3d(calc(-${currentSlide * 100}% + ${dragOffset}px), 0, 0)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
            willChange: 'transform',
          }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onMouseMove={handleDragMove}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onTouchMove={handleDragMove}
        >
          {heroImages.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full relative">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
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
    </section>
  );
};

export default HeroSection;
