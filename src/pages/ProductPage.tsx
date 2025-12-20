import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Loader2, Heart, Zap } from 'lucide-react';
import { fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import TrustBadges from '@/components/product/TrustBadges';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import SocialShare from '@/components/product/SocialShare';
import StickyAddToCart from '@/components/product/StickyAddToCart';
import StockIndicator from '@/components/product/StockIndicator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addToCartRef = useRef<HTMLButtonElement>(null);
  
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setLoading(true);
      const productData = await fetchProductByHandle(handle);
      setProduct(productData);
      if (productData?.variants?.edges?.[0]) {
        setSelectedVariant(productData.variants.edges[0].node.id);
      }
      setLoading(false);
    };
    loadProduct();
  }, [handle]);

  // Sticky bar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (addToCartRef.current) {
        const rect = addToCartRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const variant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
    if (!variant) return;

    addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions,
    });

    toast.success(t('Added to cart', 'تمت الإضافة للسلة'), {
      description: `${product.title} x ${quantity}`,
    });
  };

  const handleBuyNow = async () => {
    handleAddToCart();
    const checkoutUrl = await useCartStore.getState().createCheckout();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    const image = product.images?.edges?.[0]?.node?.url || '';
    const price = product.priceRange.minVariantPrice;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success(t('Removed from wishlist', 'تمت الإزالة من المفضلة'));
    } else {
      addToWishlist({
        productId: product.id,
        productHandle: product.handle,
        title: product.title,
        imageUrl: image,
        price: price.amount,
        currencyCode: price.currencyCode,
      });
      toast.success(t('Added to wishlist', 'تمت الإضافة للمفضلة'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-muted-foreground text-lg">{t('Product not found', 'المنتج غير موجود')}</p>
          <Link to="/" className="btn-gold">
            {t('Back to Home', 'العودة للرئيسية')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images?.edges || [];
  const currentVariant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
  const price = currentVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = currentVariant?.compareAtPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const discountPercentage = hasDiscount
    ? Math.round((1 - parseFloat(price.amount) / parseFloat(compareAtPrice.amount)) * 100)
    : 0;
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t('Home', 'الرئيسية')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t('Products', 'المنتجات')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <ProductImageGallery images={images} productTitle={product.title} />

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title & Share */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-3xl md:text-4xl text-foreground animate-fade-in">
                  {product.title}
                </h1>
                <SocialShare productTitle={product.title} productUrl={productUrl} />
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 animate-fade-in delay-100">
                <p className="text-2xl font-semibold text-primary">
                  {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                </p>
                {hasDiscount && (
                  <>
                    <p className="text-lg text-muted-foreground line-through">
                      {compareAtPrice.currencyCode} {parseFloat(compareAtPrice.amount).toFixed(2)}
                    </p>
                    <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded-full">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Indicator */}
              <StockIndicator isAvailable={currentVariant?.availableForSale ?? false} />

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground leading-relaxed animate-fade-in delay-200">
                  {product.description}
                </p>
              )}

              {/* Variants */}
              {product.options && product.options.length > 0 && product.options[0].values.length > 1 && (
                <div className="space-y-4 animate-fade-in delay-300">
                  {product.options.map((option) => (
                    <div key={option.name}>
                      <label className="block text-sm font-medium mb-2">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const matchingVariant = product.variants.edges.find(v =>
                            v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                          );
                          const isSelected = matchingVariant?.node.id === selectedVariant;
                          const isAvailable = matchingVariant?.node.availableForSale;

                          return (
                            <button
                              key={value}
                              onClick={() => matchingVariant && setSelectedVariant(matchingVariant.node.id)}
                              disabled={!isAvailable}
                              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground scale-105'
                                  : isAvailable
                                    ? 'border-border hover:border-primary hover:scale-105'
                                    : 'border-border/50 text-muted-foreground/50 cursor-not-allowed line-through'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="animate-fade-in delay-400">
                <label className="block text-sm font-medium mb-2">
                  {t('Quantity', 'الكمية')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 hover:scale-110 transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 hover:scale-110 transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in delay-500">
                <button
                  ref={addToCartRef}
                  onClick={handleAddToCart}
                  disabled={!currentVariant?.availableForSale}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={20} />
                  {currentVariant?.availableForSale
                    ? t('Add to Cart', 'أضف للسلة')
                    : t('Out of Stock', 'نفذ المخزون')}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!currentVariant?.availableForSale}
                  className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3 rounded-full font-medium transition-all duration-300 hover:bg-foreground/90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={20} />
                  {t('Buy Now', 'اشتري الآن')}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 ${
                    isInWishlist(product.id)
                      ? 'bg-destructive/10 border-destructive text-destructive'
                      : 'bg-secondary border-border hover:border-destructive hover:text-destructive'
                  }`}
                >
                  <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Trust Badges */}
              <TrustBadges />
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-12 animate-fade-in">
            <ProductTabs description={product.description} />
          </div>

          {/* Related Products */}
          <div className="mt-16 animate-fade-in">
            <RelatedProducts currentProductId={product.id} />
          </div>
        </div>
      </main>
      
      {/* Sticky Add to Cart */}
      <StickyAddToCart
        visible={showStickyBar}
        productTitle={product.title}
        price={price.amount}
        currencyCode={price.currencyCode}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
        isAvailable={currentVariant?.availableForSale ?? false}
      />
      
      <Footer />
    </div>
  );
};

export default ProductPage;
