import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StickyAddToCartProps {
  visible: boolean;
  productTitle: string;
  price: string;
  currencyCode: string;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  isAvailable: boolean;
}

const StickyAddToCart = ({
  visible,
  productTitle,
  price,
  currencyCode,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAvailable,
}: StickyAddToCartProps) => {
  const { t, language } = useLanguage();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border shadow-lg transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground truncate">{productTitle}</h4>
            <p className="text-primary font-semibold">
              {currencyCode} {parseFloat(price).toFixed(2)}
            </p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            disabled={!isAvailable}
            className="btn-gold flex items-center gap-2 py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">
              {isAvailable ? t('Add to Cart', 'أضف للسلة') : t('Out of Stock', 'نفذ المخزون')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyAddToCart;
