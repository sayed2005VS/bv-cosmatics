import { bundle } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';

const BundleSection = () => {
  const { language, t } = useLanguage();

  return (
    <section id="bundles" className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Visual */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            {/* Products overlapping display */}
            <div className="relative w-full max-w-md aspect-square">
              {/* Product 1 - Back left */}
              <div className="absolute top-8 left-4 md:left-8 w-32 h-44 md:w-40 md:h-52 bg-gradient-to-b from-background to-cream rounded-2xl shadow-card transform -rotate-6 z-10 overflow-hidden p-3">
                <div className="absolute -top-1 -left-1 rtl:-left-auto rtl:-right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm shadow-gold z-20">
                  1
                </div>
                <img 
                  src={bundle.products[0].image} 
                  alt={language === 'ar' ? bundle.products[0].nameAr : bundle.products[0].name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product 2 - Center front */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-48 md:w-44 md:h-56 bg-gradient-to-b from-background to-cream rounded-2xl shadow-elevated z-30 overflow-hidden p-4">
                <div className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm shadow-gold z-20">
                  2
                </div>
                <img 
                  src={bundle.products[1].image} 
                  alt={language === 'ar' ? bundle.products[1].nameAr : bundle.products[1].name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product 3 - Back right */}
              <div className="absolute bottom-8 right-4 md:right-8 w-28 h-40 md:w-36 md:h-48 bg-gradient-to-b from-background to-cream rounded-2xl shadow-card transform rotate-6 z-20 overflow-hidden p-3">
                <div className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm shadow-gold z-20">
                  3
                </div>
                <img 
                  src={bundle.products[2].image} 
                  alt={language === 'ar' ? bundle.products[2].nameAr : bundle.products[2].name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Background glow */}
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="text-center lg:text-start order-1 lg:order-2">
            <span className="label-subtle mb-4 block">
              {language === 'ar' ? bundle.labelAr : bundle.label}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-8 leading-tight">
              {language === 'ar' ? bundle.headlineAr : bundle.headline}
            </h2>

            {/* Product List */}
            <div className="space-y-4 mb-10">
              {bundle.products.map((product, index) => (
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
                    <span className="font-body font-semibold text-foreground">${product.price}</span>
                    <span className="text-sm text-muted-foreground line-through ms-2">${product.originalPrice}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="text-center sm:text-start">
                <p className="text-sm text-muted-foreground mb-1">{t('Bundle Price', 'سعر المجموعة')}</p>
                <div className="flex items-baseline gap-2 flex-wrap justify-center sm:justify-start">
                  <span className="font-display text-3xl font-semibold text-foreground">${bundle.totalPrice}</span>
                  <span className="text-lg text-muted-foreground line-through">${bundle.originalTotal}</span>
                  <span className="text-sm font-medium text-primary">
                    {t(`Save $${bundle.originalTotal - bundle.totalPrice}`, `وفري $${bundle.originalTotal - bundle.totalPrice}`)}
                  </span>
                </div>
              </div>
              <button className="btn-gold whitespace-nowrap">
                {t('Add Bundle to Cart', 'أضيفي المجموعة للسلة')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
