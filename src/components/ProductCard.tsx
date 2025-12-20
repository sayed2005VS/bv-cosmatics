import { Plus } from 'lucide-react';
import type { Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { language } = useLanguage();

  return (
    <div className="card-product group">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
        {product.badge && (
          <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            {language === 'ar' ? product.badgeAr : product.badge}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img 
            src={product.image} 
            alt={language === 'ar' ? product.nameAr : product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-medium text-foreground mb-1 leading-tight">
          {language === 'ar' ? product.nameAr : product.name}
        </h3>
        {product.size && (
          <p className="text-sm text-muted-foreground mb-3">{product.size}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-body text-lg font-semibold text-foreground">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
