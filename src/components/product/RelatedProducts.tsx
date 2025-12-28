import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface RelatedProductsProps {
  currentProductId: string;
}

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const allProducts = await fetchShopifyProducts(8);
      // Filter out the current product
      const filtered = allProducts.filter(p => p.node.id !== currentProductId);
      setProducts(filtered.slice(0, 4));
      setLoading(false);
    };
    loadProducts();
  }, [currentProductId]);

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });

    toast.success(t('Added to cart', 'تمت الإضافة للسلة'), {
      description: product.node.title,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-foreground">
          {t('You May Also Like', 'قد يعجبك أيضاً')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-secondary rounded-xl mb-3" />
              <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-foreground">
        {t('You May Also Like', 'قد يعجبك أيضاً')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          const image = product.node.images.edges[0]?.node;
          const price = product.node.priceRange.minVariantPrice;

          return (
            <div key={product.node.id} className="group">
              <Link to={`/product/${product.node.handle}`}>
                <div className="aspect-square bg-secondary/50 rounded-xl overflow-hidden mb-3 relative">
                  {image ? (
                    <img
                      src={image.url}
                      alt={image.altText || product.node.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {product.node.title}
                </h3>
                <p className="text-primary font-semibold text-sm">
                  {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                </p>
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full mt-2 py-2 text-xs bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
              >
                {t('Add to Cart', 'أضف للسلة')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
