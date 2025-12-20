import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StockIndicatorProps {
  isAvailable: boolean;
  lowStock?: boolean;
}

const StockIndicator = ({ isAvailable, lowStock = false }: StockIndicatorProps) => {
  const { t } = useLanguage();

  if (!isAvailable) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <XCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{t('Out of Stock', 'نفذ المخزون')}</span>
      </div>
    );
  }

  if (lowStock) {
    return (
      <div className="flex items-center gap-2 text-amber-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{t('Low Stock - Order Soon!', 'المخزون قليل - اطلب الآن!')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-emerald-600">
      <CheckCircle className="w-4 h-4" />
      <span className="text-sm font-medium">{t('In Stock', 'متوفر')}</span>
    </div>
  );
};

export default StockIndicator;
