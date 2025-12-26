import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import MobileBottomNav from '@/components/MobileBottomNav';

// Category name mapping for localization
const categoryNameMap: Record<string, { en: string; ar: string }> = {
  'serums': { en: 'Serums', ar: 'سيروم' },
  'moisturizers': { en: 'Moisturizers', ar: 'مرطبات' },
  'cleansers': { en: 'Cleansers', ar: 'منظفات' },
  'sun-care': { en: 'Sun Care', ar: 'واقي شمس' },
  'night-care': { en: 'Night Care', ar: 'عناية ليلية' },
  'natural': { en: 'Natural', ar: 'طبيعي' },
  'hair-care': { en: 'Hair Care', ar: 'العناية بالشعر' },
  'skin-care': { en: 'Skin Care', ar: 'العناية بالبشرة' },
  'body-care': { en: 'Body Care', ar: 'العناية بالجسم' },
};

const getCategoryName = (slug: string, language: 'ar' | 'en'): string => {
  const category = categoryNameMap[slug.toLowerCase()];
  if (category) {
    return language === 'ar' ? category.ar : category.en;
  }
  // Fallback: capitalize the slug
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const CategoryProductCard = ({ product }: { product: ShopifyProduct }) => {
  const { t } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const node = product.node;
  const firstVariant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;

  const currentPrice = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice?.amount 
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount) 
    : null;

  const handleAddToCart = () => {
    if (!firstVariant) return;

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    toast.success(t('Added to cart', 'تمت الإضافة للسلة'), {
      description: node.title,
      position: 'top-center',
    });
  };

  return (
    <div className="card-product group relative">
      <Link to={`/product/${node.handle}`} className="block">
        <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
          {image && (
            <img 
              src={image.url} 
              alt={image.altText || node.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-display text-sm font-medium text-foreground mb-1 leading-tight hover:text-primary transition-colors line-clamp-2">
            {node.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-body text-sm font-semibold text-foreground">
              {currentPrice.toFixed(0)} {t('EGP', 'ج.م')}
            </span>
            {compareAtPrice && compareAtPrice > currentPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {compareAtPrice.toFixed(0)}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={!firstVariant?.availableForSale}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = slug ? getCategoryName(slug, language) : '';

  useEffect(() => {
    const loadProducts = async () => {
      if (!slug) return;
      setLoading(true);
      // Fetch products - in a real scenario, you'd filter by category/collection
      const fetchedProducts = await fetchShopifyProducts(20);
      setProducts(fetchedProducts);
      setLoading(false);
    };

    loadProducts();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="pt-24 md:pt-32">
        <div className="container-custom section-padding">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  {t('Home', 'الرئيسية')}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/collections" className="hover:text-foreground transition-colors">
                  {t('Categories', 'الأقسام')}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">{categoryName}</li>
            </ol>
          </nav>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {categoryName}
            </h1>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {t('No products found in this category', 'لا توجد منتجات في هذا القسم')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {products.map((product, index) => (
                <div 
                  key={product.node.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CategoryProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default CategoryPage;
