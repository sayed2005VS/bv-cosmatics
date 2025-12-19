import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Star } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const BestSellerCard = ({ product }: { product: ShopifyProduct }) => {
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
  const savings = compareAtPrice && compareAtPrice > currentPrice 
    ? Math.round(compareAtPrice - currentPrice) 
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
      {/* Best Seller Badge */}
      <div className="absolute top-3 start-3 z-10">
        <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-gold">
          <Star size={12} className="fill-current" />
          <span>{t('Best Seller', 'الأكثر مبيعاً')}</span>
        </div>
      </div>

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
          <h3 className="font-display text-lg font-medium text-foreground mb-1 leading-tight hover:text-primary transition-colors">
            {node.title}
          </h3>
        </Link>
        
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

const BestSellersSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchShopifyProducts(4);
      setProducts(fetchedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="label-subtle mb-3 block">{t('Top Picks', 'الأكثر طلباً')}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {t('Best Sellers', 'المنتجات الأكثر مبيعاً')}
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
    return null;
  }

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="label-subtle mb-3 block">{t('Top Picks', 'الأكثر طلباً')}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
            {t('Best Sellers', 'المنتجات الأكثر مبيعاً')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.node.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BestSellerCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
