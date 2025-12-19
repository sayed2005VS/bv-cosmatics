import { Star } from 'lucide-react';
import type { Testimonial } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      {/* Customer Image with Product */}
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        <img 
          src={testimonial.customerImage} 
          alt={testimonial.customerName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < testimonial.rating ? 'fill-primary text-primary' : 'fill-muted text-muted'}
            />
          ))}
        </div>

        {/* Review */}
        <p className="font-body text-foreground mb-4 leading-relaxed">
          "{language === 'ar' ? testimonial.reviewAr : testimonial.review}"
        </p>

        {/* Customer Name */}
        <p className="text-sm font-medium text-muted-foreground mb-4">
          — {testimonial.customerName}
        </p>

        {/* Product Reference */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="font-body font-medium text-foreground text-sm">
              {language === 'ar' ? testimonial.productNameAr : testimonial.productName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {testimonial.productType === 'bundle' 
                ? t('Complete Set', 'مجموعة كاملة') 
                : t('Single Product', 'منتج فردي')}
            </p>
          </div>
          
          {/* CTA */}
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
            {t('Shop', 'تسوق')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
