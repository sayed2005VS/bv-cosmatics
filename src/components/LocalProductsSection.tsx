import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts, LocalProduct } from '@/lib/products';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const LocalProductCard = ({ product }: { product: LocalProduct }) => {
  const { t, language } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const firstVariant = product.variants[0];

  const handleAddToCart = () => {
    if (!firstVariant) return;

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
    });

    toast.success(t('Added to cart', 'تمت الإضافة للسلة'), {
      description: language === 'ar' ? product.titleAr : product.title,
      position: 'top-center',
    });
  };

  const displayTitle = language === 'ar' ? product.titleAr : product.title;

  return (
    <div className="card-product group relative">
      <Link to={`/product/${product.handle}`} className="block">
        <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
          {product.images[0] && (
            <img 
              src={product.images[0]} 
              alt={displayTitle}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link to={`/product/${product.handle}`}>
          <h3 className="font-display text-sm font-medium text-foreground mb-1 leading-tight hover:text-primary transition-colors line-clamp-1">
            {displayTitle}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-body text-sm font-semibold text-foreground">
              {product.price} {t('EGP', 'ج.م')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {product.compareAtPrice}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const LocalProductsSection = () => {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchProducts(10);
      setProducts(fetchedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount) * (isRTL ? -1 : 1);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section id="products" className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="label-subtle mb-3 block">{t('Discover', 'اكتشفي')}</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
                {t('BV Cosmatics Products', 'منتجات BV Cosmatics')}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="products" className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="label-subtle mb-3 block">{t('Discover', 'اكتشفي')}</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
                {t('BV Cosmatics Products', 'منتجات BV Cosmatics')}
              </h2>
            </div>
          </div>
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              {t('No products found', 'لا توجد منتجات')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section-padding bg-background">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="label-subtle mb-3 block">{t('Discover', 'اكتشفي')}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {t('BV Cosmatics Products', 'منتجات BV Cosmatics')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <Link to="/products">
              <Button variant="outline" size="sm">
                {t('View All', 'عرض الكل')}
              </Button>
            </Link>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-none"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] md:w-[calc(25%-9px)] lg:w-[calc(20%-10px)] animate-fade-up"
              style={{ 
                animationDelay: `${index * 50}ms`,
                scrollSnapAlign: 'start'
              }}
            >
              <LocalProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalProductsSection;
