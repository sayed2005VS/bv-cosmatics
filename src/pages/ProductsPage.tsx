import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { fetchProducts, LocalProduct } from '@/lib/products';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductCard = ({ product }: { product: LocalProduct }) => {
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

const ProductsPage = () => {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="label-subtle mb-3 block">{t('Discover', 'اكتشفي')}</span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {t('All Products', 'جميع المنتجات')}
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                {t('No products found', 'لا توجد منتجات')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
