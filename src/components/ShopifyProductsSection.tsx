import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const PRODUCTS_PER_PAGE = 8;

// Star Rating Component
const StarRating = ({ rating = 4.5 }: { rating?: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={`${
            star <= Math.floor(rating)
              ? 'fill-primary text-primary'
              : star <= rating
              ? 'fill-primary/50 text-primary'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ms-1">({rating})</span>
    </div>
  );
};

const ShopifyProductCard = ({ product }: { product: ShopifyProduct }) => {
  const { t } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const node = product.node;
  const firstVariant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;

  // Calculate savings
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

      <div className="p-5">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-display text-lg font-medium text-foreground mb-1 leading-tight hover:text-primary transition-colors line-clamp-1">
            {node.title}
          </h3>
        </Link>
        
        {/* Star Rating */}
        <div className="mb-2">
          <StarRating rating={4 + Math.random()} />
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-body text-lg font-semibold text-foreground">
              {currentPrice.toFixed(0)} {t('EGP', 'ج.م')}
            </span>
            {compareAtPrice && compareAtPrice > currentPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {compareAtPrice.toFixed(0)} {t('EGP', 'ج.م')}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={!firstVariant?.availableForSale}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ShopifyProductsSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchShopifyProducts(50); // Fetch more for pagination
      setProducts(fetchedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const displayedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <section id="products" className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="label-subtle mb-3 block">{t('Discover', 'اكتشفي')}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {t('BV Cosmatics Products', 'منتجات BV Cosmatics')}
            </h2>
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
          <div className="text-center mb-12">
            <span className="label-subtle mb-3 block">{t('Discover', 'اكتشفي')}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {t('BV Cosmatics Products', 'منتجات BV Cosmatics')}
            </h2>
          </div>
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              {t('No products found', 'لا توجد منتجات')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('Products will appear here once added to your Shopify store.', 'ستظهر المنتجات هنا بمجرد إضافتها إلى متجر Shopify الخاص بك.')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="label-subtle mb-3 block">{t('Discover', 'اكتشفي')}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
            {t('BV Cosmatics Products', 'منتجات BV Cosmatics')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product, index) => (
            <div 
              key={product.node.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ShopifyProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => goToPage(page)}
                className={`rounded-full w-10 h-10 ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>
        )}

        {/* View All Button */}
        {products.length > PRODUCTS_PER_PAGE && currentPage < totalPages && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => goToPage(currentPage + 1)}
              className="gap-2"
            >
              {t('View More Products', 'عرض المزيد من المنتجات')}
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopifyProductsSection;
