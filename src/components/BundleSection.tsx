import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bundle } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/stores/cartStore';
import { storefrontApiRequest, ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

// Product handles for the Xpresso bundle
const BUNDLE_PRODUCT_HANDLES = [
  'hair-mask-xpresso',
  'conditioner-xpresso',
  'shampoo-xpresso'
];

const BUNDLE_PRODUCTS_QUERY = `
  query GetBundleProducts($handle1: String!, $handle2: String!, $handle3: String!) {
    product1: productByHandle(handle: $handle1) {
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
    }
    product2: productByHandle(handle: $handle2) {
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
    }
    product3: productByHandle(handle: $handle3) {
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
    }
  }
`;

// Product Card Component for Bundle Items
const BundleProductCard = ({ product, onAddToCart }: { product: ShopifyProduct; onAddToCart: (product: ShopifyProduct) => void }) => {
  const { t } = useLanguage();
  const node = product.node;
  const image = node.images.edges[0]?.node;
  const currentPrice = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice?.amount 
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount) 
    : null;

  return (
    <div className="card-product group relative flex-shrink-0 w-40 md:w-auto">
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

      <div className="p-3 bg-background rounded-b-lg">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-display text-xs md:text-sm font-medium text-foreground mb-1 leading-tight hover:text-primary transition-colors line-clamp-2">
            {node.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-body text-xs md:text-sm font-semibold text-foreground">
              {currentPrice.toFixed(0)} {t('EGP', 'ج.م')}
            </span>
            {compareAtPrice && compareAtPrice > currentPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {compareAtPrice.toFixed(0)}
              </span>
            )}
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const BundleSection = () => {
  const { language, t } = useLanguage();
  const addItem = useCartStore(state => state.addItem);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBundleProducts = async () => {
      setLoading(true);
      try {
        const data = await storefrontApiRequest(BUNDLE_PRODUCTS_QUERY, {
          handle1: BUNDLE_PRODUCT_HANDLES[0],
          handle2: BUNDLE_PRODUCT_HANDLES[1],
          handle3: BUNDLE_PRODUCT_HANDLES[2],
        });
        
        if (data?.data) {
          const products: ShopifyProduct[] = [];
          if (data.data.product1) products.push({ node: data.data.product1 });
          if (data.data.product2) products.push({ node: data.data.product2 });
          if (data.data.product3) products.push({ node: data.data.product3 });
          setShopifyProducts(products);
        }
      } catch (error) {
        console.error('Failed to load bundle products:', error);
      }
      setLoading(false);
    };
    loadBundleProducts();
  }, []);

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
    if (shopifyProducts.length > 0) {
      shopifyProducts.forEach(product => {
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
    }
  };

  // Use Shopify products if available, otherwise fallback to local data
  const displayProducts = shopifyProducts.length > 0 
    ? shopifyProducts.slice(0, 3).map(p => ({
        id: p.node.id,
        name: p.node.title,
        nameAr: p.node.title,
        size: '50ml',
        price: parseFloat(p.node.priceRange.minVariantPrice.amount),
        originalPrice: p.node.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(p.node.compareAtPriceRange.minVariantPrice.amount)
          : parseFloat(p.node.priceRange.minVariantPrice.amount) * 1.2,
        image: p.node.images.edges[0]?.node.url || '',
      }))
    : bundle.products;

  const bundleTotalPrice = displayProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleOriginalTotal = displayProducts.reduce((sum, p) => sum + p.originalPrice, 0);

  return (
    <section id="bundles" className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="label-subtle mb-4 block">
            {language === 'ar' ? bundle.labelAr : bundle.label}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight">
            {language === 'ar' ? bundle.headlineAr : bundle.headline}
          </h2>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : shopifyProducts.length > 0 ? (
          <>
            {/* Mobile: Horizontal Scroll | Desktop: Grid */}
            <div className="md:hidden overflow-x-auto scrollbar-none pb-4 -mx-4 px-4">
              <div className="flex gap-3">
                {shopifyProducts.map((product) => (
                  <BundleProductCard 
                    key={product.node.id} 
                    product={product} 
                    onAddToCart={handleAddSingleProduct}
                  />
                ))}
              </div>
            </div>
            
            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {shopifyProducts.map((product) => (
                <BundleProductCard 
                  key={product.node.id} 
                  product={product} 
                  onAddToCart={handleAddSingleProduct}
                />
              ))}
            </div>

            {/* Bundle Total & CTA */}
            <div className="mt-8 md:mt-12 flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('Bundle Price', 'سعر المجموعة')}</p>
                <div className="flex items-baseline gap-2 flex-wrap justify-center">
                  <span className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                    {Math.round(bundleTotalPrice)} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                  <span className="text-base md:text-lg text-muted-foreground line-through">
                    {Math.round(bundleOriginalTotal)} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {language === 'ar' ? `وفري ${Math.round(bundleOriginalTotal - bundleTotalPrice)} ج.م` : `Save ${Math.round(bundleOriginalTotal - bundleTotalPrice)} EGP`}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleAddBundleToCart}
                disabled={loading || shopifyProducts.length === 0}
                className="btn-gold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t('Add Bundle to Cart', 'أضيفي المجموعة للسلة')
                )}
              </button>
            </div>
          </>
        ) : (
          // Fallback to static display if no Shopify products
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Visual */}
            <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-md aspect-square">
                {displayProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className={`absolute bg-gradient-to-b from-background to-cream rounded-2xl shadow-card overflow-hidden p-3 ${
                      index === 0 ? 'top-8 left-4 md:left-8 w-32 h-44 md:w-40 md:h-52 transform -rotate-6 z-10' :
                      index === 1 ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-48 md:w-44 md:h-56 z-30' :
                      'bottom-8 right-4 md:right-8 w-28 h-40 md:w-36 md:h-48 transform rotate-6 z-20'
                    }`}
                  >
                    <div className="absolute -top-1 -left-1 rtl:-left-auto rtl:-right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm shadow-gold z-20">
                      {index + 1}
                    </div>
                    <img 
                      src={product.image} 
                      alt={language === 'ar' ? product.nameAr : product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10" />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="text-center lg:text-start order-1 lg:order-2">
              <div className="space-y-4 mb-10">
                {displayProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-4 p-4 bg-background rounded-xl shadow-soft"
                  >
                    <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0 text-start">
                      <p className="font-body font-medium text-foreground truncate">
                        {language === 'ar' ? product.nameAr : product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{product.size}</p>
                    </div>
                    <div className="text-end flex-shrink-0">
                      <span className="font-body font-semibold text-foreground">{Math.round(product.price)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                      <span className="text-sm text-muted-foreground line-through ms-2">{Math.round(product.originalPrice)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="text-center sm:text-start">
                  <p className="text-sm text-muted-foreground mb-1">{t('Bundle Price', 'سعر المجموعة')}</p>
                  <div className="flex items-baseline gap-2 flex-wrap justify-center sm:justify-start">
                    <span className="font-display text-3xl font-semibold text-foreground">{Math.round(bundleTotalPrice)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                    <span className="text-lg text-muted-foreground line-through">{Math.round(bundleOriginalTotal)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                    <span className="text-sm font-medium text-primary">
                      {language === 'ar' ? `وفري ${Math.round(bundleOriginalTotal - bundleTotalPrice)} ج.م` : `Save ${Math.round(bundleOriginalTotal - bundleTotalPrice)} EGP`}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleAddBundleToCart}
                  disabled={loading}
                  className="btn-gold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('Add Bundle to Cart', 'أضيفي المجموعة للسلة')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BundleSection;
