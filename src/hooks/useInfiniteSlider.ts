import { useState, useRef, useCallback, useEffect } from 'react';

interface UseInfiniteSliderOptions {
  itemCount: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const useInfiniteSlider = ({
  itemCount,
  autoPlay = false,
  autoPlayInterval = 5000,
}: UseInfiniteSliderOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Auto-scroll for infinite loop (only for horizontal scroll sliders)
  useEffect(() => {
    if (!autoPlay || !containerRef.current || itemCount === 0) return;

    const container = containerRef.current;
    let animationId: number;
    let lastTime = 0;
    const speed = 0.5; // pixels per frame

    const animate = (time: number) => {
      if (!isDragging && container) {
        const delta = time - lastTime;
        if (delta > 16) { // ~60fps
          container.scrollLeft += speed;
          
          // Reset scroll when reaching the end
          const maxScroll = container.scrollWidth - container.clientWidth;
          if (container.scrollLeft >= maxScroll) {
            container.scrollLeft = 0;
          }
          lastTime = time;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [autoPlay, isDragging, itemCount]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  }, [isDragging, startX, scrollLeft]);

  return {
    containerRef,
    isDragging,
    handlers: {
      onMouseDown: handleDragStart,
      onMouseUp: handleDragEnd,
      onMouseLeave: handleDragEnd,
      onMouseMove: handleDragMove,
      onTouchStart: handleDragStart,
      onTouchEnd: handleDragEnd,
      onTouchMove: handleDragMove,
    },
  };
};
