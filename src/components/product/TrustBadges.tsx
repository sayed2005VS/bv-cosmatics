import { Truck, Shield, RefreshCw, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TrustBadges = () => {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Truck,
      title: t('Free Shipping', 'شحن مجاني'),
      description: t('On orders over 500 EGP', 'للطلبات فوق 500 جنيه'),
    },
    {
      icon: Shield,
      title: t('Secure Payment', 'دفع آمن'),
      description: t('100% secure checkout', 'دفع آمن 100%'),
    },
    {
      icon: RefreshCw,
      title: t('Easy Returns', 'إرجاع سهل'),
      description: t('14 days return policy', 'سياسة إرجاع 14 يوم'),
    },
    {
      icon: CreditCard,
      title: t('Cash on Delivery', 'الدفع عند الاستلام'),
      description: t('Pay when you receive', 'ادفع عند الاستلام'),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 py-4">
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <badge.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-foreground truncate">{badge.title}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
