import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BundleSection from '@/components/BundleSection';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { fetchShopifyCollections, ShopifyCollection, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const CollectionProductCard = ({ product }: { product: ShopifyProduct }) => {
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
          <h3 className="font-display text-sm font-medium text-foreground mb-1 leading-tight hover:text-primary transition-colors line-clamp-1">
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

const CollectionSection = ({ collection }: { collection: ShopifyCollection }) => {
  const products = collection.node.products.edges;
  
  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground">
          {collection.node.title}
        </h2>
        {collection.node.description && (
          <p className="text-muted-foreground mt-2">{collection.node.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {products.map((product, index) => (
          <div 
            key={product.node.id}
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

const CollectionsPage = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true);
      const fetchedCollections = await fetchShopifyCollections(20);
      setCollections(fetchedCollections);
      setLoading(false);
    };

    loadCollections();
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
          ) : collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {t('No collections found', 'لا توجد أقسام')}
              </p>
            </div>
          ) : (
            <div>
              {collections.map((collection) => (
                <CollectionSection key={collection.node.id} collection={collection} />
              ))}
            </div>
          )}
        </div>

        {/* Set Offer Section - Fixed at bottom */}
        <BundleSection />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default CollectionsPage;
