import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-background/80">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="font-display text-2xl font-semibold text-background mb-4 block">
              BV-Cosmatics
            </a>
            <p className="text-sm text-background/60 mb-6 max-w-xs">
              {t('Premium skincare crafted with care. For radiant, healthy skin every day.', 'عناية فاخرة بالبشرة مصنوعة بعناية. لبشرة مشرقة وصحية كل يوم.')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-background mb-4">{t('Shop', 'تسوق')}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('All Products', 'جميع المنتجات')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('Cleansers', 'المنظفات')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('Serums', 'السيروم')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('Moisturizers', 'المرطبات')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('Sets & Bundles', 'المجموعات')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold text-background mb-4">{t('Support', 'الدعم')}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('Contact Us', 'اتصل بنا')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('Shipping Info', 'معلومات الشحن')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('Returns & Exchanges', 'الإرجاع والاستبدال')}</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">{t('FAQ', 'الأسئلة الشائعة')}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body font-semibold text-background mb-4">{t('Stay Updated', 'ابقي على اطلاع')}</h4>
            <p className="text-sm text-background/60 mb-4">
              {t('Get exclusive offers and skincare tips.', 'احصلي على عروض حصرية ونصائح للعناية بالبشرة.')}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t('Your email', 'بريدك الإلكتروني')}
                className="flex-1 px-4 py-2.5 bg-background/10 border border-background/20 rounded-full text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-gold-light transition-colors">
                {t('Join', 'اشتركي')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2024 BV-Cosmatics. {t('All rights reserved.', 'جميع الحقوق محفوظة.')}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-background/50 hover:text-background transition-colors">{t('Privacy Policy', 'سياسة الخصوصية')}</a>
            <a href="#" className="text-sm text-background/50 hover:text-background transition-colors">{t('Terms of Service', 'شروط الخدمة')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
