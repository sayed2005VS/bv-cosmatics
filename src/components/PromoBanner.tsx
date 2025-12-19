import promoProduct from '@/assets/promo-product.png';
import { useLanguage } from '@/contexts/LanguageContext';

const PromoBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={promoProduct} 
          alt="Radiance Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-charcoal/80 via-charcoal/50 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div className="py-16 md:py-24 max-w-xl">
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            {t('Limited Edition', 'إصدار محدود')}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-background mb-4 leading-tight">
            {t('Discover Our New', 'اكتشفي مجموعتنا')}
            <br />
            <span className="text-gradient-gold">{t('Radiance Collection', 'الجديدة المشرقة')}</span>
          </h2>
          <p className="font-body text-background/70 text-lg mb-8 max-w-md">
            {t('Advanced formulas for luminous, healthy-looking skin.', 'تركيبات متقدمة لبشرة مشرقة وصحية.')}
          </p>
          <button className="btn-gold">
            {t('Explore Collection', 'استكشفي المجموعة')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
