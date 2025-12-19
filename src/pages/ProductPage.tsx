import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { fetchProductByHandle, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

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

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            {t('Back to Products', 'العودة للمنتجات')}
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary/50 rounded-2xl overflow-hidden">
                {images[selectedImage]?.node ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                  {product.title}
                </h1>
                <p className="text-2xl font-semibold text-primary">
                  {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                </p>
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Variants */}
              {product.options && product.options.length > 0 && product.options[0].values.length > 1 && (
                <div className="space-y-4">
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
                              className={`px-4 py-2 rounded-lg border transition-colors ${
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : isAvailable
                                    ? 'border-border hover:border-primary'
                                    : 'border-border/50 text-muted-foreground/50 cursor-not-allowed'
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
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Quantity', 'الكمية')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!currentVariant?.availableForSale}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                {currentVariant?.availableForSale
                  ? t('Add to Cart', 'أضف للسلة')
                  : t('Out of Stock', 'نفذ المخزون')}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
