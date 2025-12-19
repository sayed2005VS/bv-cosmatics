import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const ShopifyProductCard = ({ product }: { product: ShopifyProduct }) => {
  const { t } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const node = product.node;
  const firstVariant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;

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
    <div className="card-product group">
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
          <span className="font-body text-lg font-semibold text-foreground">
            {node.priceRange.minVariantPrice.currencyCode} {parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}
          </span>
          
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
  const { t } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchShopifyProducts(50);
      setProducts(fetchedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section id="products" className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="label-subtle mb-3 block">{t('Our Collection', 'مجموعتنا')}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {t('Premium Skincare', 'العناية الفاخرة بالبشرة')}
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
            <span className="label-subtle mb-3 block">{t('Our Collection', 'مجموعتنا')}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
              {t('Premium Skincare', 'العناية الفاخرة بالبشرة')}
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
          <span className="label-subtle mb-3 block">{t('Our Collection', 'مجموعتنا')}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
            {t('Premium Skincare', 'العناية الفاخرة بالبشرة')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div 
              key={product.node.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ShopifyProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopifyProductsSection;
