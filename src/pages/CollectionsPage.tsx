import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BundleSection from '@/components/BundleSection';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import MobileBottomNav from '@/components/MobileBottomNav';
import { fetchProducts, LocalProduct } from '@/lib/products';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const CollectionProductCard = ({ product }: { product: LocalProduct }) => {
  const { t, language } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const firstVariant = product.variants[0];
  const displayTitle = language === 'ar' ? product.titleAr : product.title;

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
      description: displayTitle,
      position: 'top-center',
    });
  };

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

// Group products by category
interface CategoryGroup {
  name: string;
  nameAr: string;
  products: LocalProduct[];
}

const CollectionSection = ({ category }: { category: CategoryGroup }) => {
  const { language } = useLanguage();
  
  if (category.products.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground">
          {language === 'ar' ? category.nameAr : category.name}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {category.products.map((product, index) => (
          <div 
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CollectionProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

const categoryNameMap: Record<string, { en: string; ar: string }> = {
  'serums': { en: 'Serums', ar: 'سيروم' },
  'moisturizers': { en: 'Moisturizers', ar: 'مرطبات' },
  'cleansers': { en: 'Cleansers', ar: 'منظفات' },
  'treatments': { en: 'Treatments', ar: 'علاجات' },
  'hair-care': { en: 'Hair Care', ar: 'العناية بالشعر' },
};

const CollectionsPage = () => {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const allProducts = await fetchProducts();
      
      // Group products by category
      const grouped: Record<string, LocalProduct[]> = {};
      allProducts.forEach(product => {
        const cat = product.category;
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
        grouped[cat].push(product);
      });

      // Convert to CategoryGroup array
      const categoryGroups: CategoryGroup[] = Object.entries(grouped).map(([key, products]) => ({
        name: categoryNameMap[key]?.en || key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        nameAr: categoryNameMap[key]?.ar || key,
        products,
      }));

      setCategories(categoryGroups);
      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <main className="pt-24">
        <div className="container-custom section-padding">
          {/* Page Header */}
          <div className="text-center mb-12">
            <span className="label-subtle mb-3 block">{t('Browse', 'تصفحي')}</span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {t('Collections', 'الأقسام')}
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {t('No collections found', 'لا توجد أقسام')}
              </p>
            </div>
          ) : (
            <div>
              {categories.map((category) => (
                <CollectionSection key={category.name} category={category} />
              ))}
            </div>
          )}
        </div>

        {/* Set Offer Section - Fixed at bottom */}
        <BundleSection />
      </main>
      <Footer />
      <WhatsAppWidget />
      <MobileBottomNav />
    </div>
  );
};

export default CollectionsPage;
