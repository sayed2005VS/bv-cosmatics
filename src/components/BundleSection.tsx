import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bundle } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/stores/cartStore';
import { fetchProducts, LocalProduct } from '@/lib/products';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

// Product Card Component for Bundle Items
const BundleProductCard = ({ product, onAddToCart }: { product: LocalProduct; onAddToCart: (product: LocalProduct) => void }) => {
  const { t, language } = useLanguage();
  const displayTitle = language === 'ar' ? product.titleAr : product.title;

  return (
    <div className="card-product group relative flex-shrink-0 w-40 md:w-auto">
      <Link to={`/product/${product.handle}`} className="block">
        <div className="relative aspect-[4/5] bg-secondary overflow-hidden rounded-t-lg">
          {product.images[0] && (
            <img 
              src={product.images[0]} 
              alt={displayTitle}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
      </Link>

      <div className="p-3 bg-background rounded-b-lg">
        <Link to={`/product/${product.handle}`}>
          <h3 className="font-display text-xs md:text-sm font-medium text-foreground mb-1 leading-tight hover:text-primary transition-colors line-clamp-2">
            {displayTitle}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-body text-xs md:text-sm font-semibold text-foreground">
              {product.price} {t('EGP', 'ج.م')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {product.compareAtPrice}
              </span>
            )}
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const BundleSection = () => {
  const { language, t } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBundleProducts = async () => {
      setLoading(true);
      const allProducts = await fetchProducts(3);
      setProducts(allProducts);
      setLoading(false);
    };
    loadBundleProducts();
  }, []);

  const handleAddSingleProduct = (product: LocalProduct) => {
    const firstVariant = product.variants[0];
    if (firstVariant) {
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
    }
  };

  const handleAddBundleToCart = () => {
    if (products.length > 0) {
      products.forEach(product => {
        const firstVariant = product.variants[0];
        if (firstVariant) {
          addItem({
            product,
            variantId: firstVariant.id,
            variantTitle: firstVariant.title,
            price: firstVariant.price,
            quantity: 1,
          });
        }
      });
      
      toast.success(t('Bundle added to cart!', 'تمت إضافة المجموعة للسلة!'), {
        description: t('All products have been added', 'تمت إضافة جميع المنتجات'),
        position: 'top-center',
      });
    }
  };

  const bundleTotalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const bundleOriginalTotal = products.reduce((sum, p) => sum + (p.compareAtPrice || p.price * 1.2), 0);

  return (
    <section id="bundles" className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="label-subtle mb-4 block">
            {language === 'ar' ? bundle.labelAr : bundle.label}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight">
            {language === 'ar' ? bundle.headlineAr : bundle.headline}
          </h2>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Mobile: Horizontal Scroll | Desktop: Grid */}
            <div className="md:hidden overflow-x-auto scrollbar-none pb-4 -mx-4 px-4">
              <div className="flex gap-3">
                {products.map((product) => (
                  <BundleProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddSingleProduct}
                  />
                ))}
              </div>
            </div>
            
            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {products.map((product) => (
                <BundleProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddSingleProduct}
                />
              ))}
            </div>

            {/* Bundle Total & CTA */}
            <div className="mt-8 md:mt-12 flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('Bundle Price', 'سعر المجموعة')}</p>
                <div className="flex items-baseline gap-2 flex-wrap justify-center">
                  <span className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                    {Math.round(bundleTotalPrice)} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                  <span className="text-base md:text-lg text-muted-foreground line-through">
                    {Math.round(bundleOriginalTotal)} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {language === 'ar' ? `وفري ${Math.round(bundleOriginalTotal - bundleTotalPrice)} ج.م` : `Save ${Math.round(bundleOriginalTotal - bundleTotalPrice)} EGP`}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleAddBundleToCart}
                disabled={loading || products.length === 0}
                className="btn-gold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t('Add Bundle to Cart', 'أضيفي المجموعة للسلة')
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('No products available', 'لا توجد منتجات متاحة')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BundleSection;
