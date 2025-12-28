import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/stores/cartStore';
import { storefrontApiRequest, ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';
import { Loader2, Plus, Percent } from 'lucide-react';
import { CategoryBundle, calculateBundlePrice } from '@/data/bundles';

interface CategoryBundleSectionProps {
  bundle: CategoryBundle;
}

// Dynamic GraphQL query builder for bundle products
const buildBundleQuery = (handles: string[]) => {
  const productFields = `
    id
    title
    description
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 1) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
  `;

  const queryParts = handles.map((_, index) => 
    `product${index + 1}: productByHandle(handle: $handle${index + 1}) { ${productFields} }`
  ).join('\n');

  const variables = handles.map((_, index) => `$handle${index + 1}: String!`).join(', ');

  return `query GetBundleProducts(${variables}) { ${queryParts} }`;
};

// Bundle Product Card Component
const BundleProductCard = ({ 
  product, 
  onAddToCart 
}: { 
  product: ShopifyProduct; 
  onAddToCart: (product: ShopifyProduct) => void;
}) => {
  const { t } = useLanguage();
  const node = product.node;
  const image = node.images.edges[0]?.node;
  const currentPrice = parseFloat(node.priceRange.minVariantPrice.amount);

  return (
    <div className="card-product group relative flex-shrink-0 w-36 md:w-auto">
      <Link to={`/product/${node.handle}`} className="block">
        <div className="relative aspect-[4/5] bg-secondary overflow-hidden rounded-t-lg">
          {image && (
            <img 
              src={image.url} 
              alt={image.altText || node.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
      </Link>

      <div className="p-2 md:p-3 bg-background rounded-b-lg">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-display text-xs font-medium text-foreground mb-1 leading-tight hover:text-primary transition-colors line-clamp-2">
            {node.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <span className="font-body text-xs font-semibold text-foreground">
            {currentPrice.toFixed(0)} {t('EGP', 'ج.م')}
          </span>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryBundleSection = ({ bundle }: CategoryBundleSectionProps) => {
  const { language, t } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBundleProducts = async () => {
      if (bundle.productHandles.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const query = buildBundleQuery(bundle.productHandles);
        const variables: Record<string, string> = {};
        bundle.productHandles.forEach((handle, index) => {
          variables[`handle${index + 1}`] = handle;
        });

        const data = await storefrontApiRequest(query, variables);
        
        if (data?.data) {
          const fetchedProducts: ShopifyProduct[] = [];
          bundle.productHandles.forEach((_, index) => {
            const product = data.data[`product${index + 1}`];
            if (product) {
              fetchedProducts.push({ node: product });
            }
          });
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Failed to load bundle products:', error);
      }
      setLoading(false);
    };

    loadBundleProducts();
  }, [bundle.productHandles]);

  const handleAddSingleProduct = (product: ShopifyProduct) => {
    const firstVariant = product.node.variants.edges[0]?.node;
    if (firstVariant) {
      addItem({
        product,
        variantId: firstVariant.id,
        variantTitle: firstVariant.title,
        price: firstVariant.price,
        quantity: 1,
        selectedOptions: firstVariant.selectedOptions || [],
      });
      
      toast.success(t('Added to cart', 'تمت الإضافة للسلة'), {
        description: product.node.title,
        position: 'top-center',
      });
    }
  };

  const handleAddBundleToCart = () => {
    if (products.length === 0) return;

    products.forEach(product => {
      const firstVariant = product.node.variants.edges[0]?.node;
      if (firstVariant) {
        addItem({
          product,
          variantId: firstVariant.id,
          variantTitle: firstVariant.title,
          price: firstVariant.price,
          quantity: 1,
          selectedOptions: firstVariant.selectedOptions || [],
        });
      }
    });
    
    toast.success(t('Bundle added to cart!', 'تمت إضافة المجموعة للسلة!'), {
      description: t('All products have been added', 'تمت إضافة جميع المنتجات'),
      position: 'top-center',
    });
  };

  // Calculate prices
  const originalTotal = products.reduce(
    (sum, p) => sum + parseFloat(p.node.priceRange.minVariantPrice.amount),
    0
  );
  const { bundlePrice, savings } = calculateBundlePrice(originalTotal, bundle.discountPercentage);

  // Don't render if no products loaded
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-16 py-8 md:py-12 bg-secondary/50 rounded-2xl">
      <div className="px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                <Percent size={12} />
                {bundle.discountPercentage}% {t('OFF', 'خصم')}
              </span>
            </div>
            <h3 className="font-display text-xl md:text-2xl font-medium text-foreground">
              {language === 'ar' ? bundle.titleAr : bundle.titleEn}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'ar' ? bundle.descriptionAr : bundle.descriptionEn}
            </p>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden overflow-x-auto scrollbar-none pb-4 -mx-4 px-4">
              <div className="flex gap-3">
                {products.map((product) => (
                  <BundleProductCard 
                    key={product.node.id} 
                    product={product} 
                    onAddToCart={handleAddSingleProduct}
                  />
                ))}
              </div>
            </div>
            
            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <BundleProductCard 
                  key={product.node.id} 
                  product={product} 
                  onAddToCart={handleAddSingleProduct}
                />
              ))}
            </div>

            {/* Bundle Price & CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-background rounded-xl border border-border">
              <div className="text-center sm:text-start">
                <p className="text-xs text-muted-foreground mb-1">
                  {t('Bundle Price', 'سعر المجموعة')}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap justify-center sm:justify-start">
                  <span className="font-display text-xl md:text-2xl font-semibold text-foreground">
                    {Math.round(bundlePrice)} {t('EGP', 'ج.م')}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {Math.round(originalTotal)} {t('EGP', 'ج.م')}
                  </span>
                  <span className="text-xs font-medium text-primary">
                    {language === 'ar' 
                      ? `وفري ${Math.round(savings)} ج.م` 
                      : `Save ${Math.round(savings)} EGP`}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleAddBundleToCart}
                disabled={products.length === 0}
                className="btn-gold whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('Add Bundle to Cart', 'أضيفي المجموعة للسلة')}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryBundleSection;
