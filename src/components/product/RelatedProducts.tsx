import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { fetchProducts, LocalProduct } from '@/lib/products';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface RelatedProductsProps {
  currentProductId: string;
}

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const allProducts = await fetchProducts(8);
      // Filter out the current product
      const filtered = allProducts.filter(p => p.id !== currentProductId);
      setProducts(filtered.slice(0, 4));
      setLoading(false);
    };
    loadProducts();
  }, [currentProductId]);

  const handleAddToCart = (product: LocalProduct) => {
    const variant = product.variants[0];
    if (!variant) return;

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
    });

    toast.success(t('Added to cart', 'تمت الإضافة للسلة'), {
      description: language === 'ar' ? product.titleAr : product.title,
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
          const displayTitle = language === 'ar' ? product.titleAr : product.title;

          return (
            <div key={product.id} className="group">
              <Link to={`/product/${product.handle}`}>
                <div className="aspect-square bg-secondary/50 rounded-xl overflow-hidden mb-3 relative">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {displayTitle}
                </h3>
                <p className="text-primary font-semibold text-sm">
                  {product.currency} {product.price}
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
