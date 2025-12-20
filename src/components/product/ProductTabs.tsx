import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductTabsProps {
  description: string;
}

const ProductTabs = ({ description }: ProductTabsProps) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start bg-secondary/50 rounded-xl p-1 h-auto flex-wrap">
        <TabsTrigger 
          value="description" 
          className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          {t('Description', 'الوصف')}
        </TabsTrigger>
        <TabsTrigger 
          value="ingredients" 
          className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          {t('Ingredients', 'المكونات')}
        </TabsTrigger>
        <TabsTrigger 
          value="usage" 
          className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          {t('How to Use', 'طريقة الاستخدام')}
        </TabsTrigger>
        <TabsTrigger 
          value="shipping" 
          className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          {t('Shipping & Returns', 'الشحن والإرجاع')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-4 animate-fade-in">
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
          {description || t('No description available', 'لا يوجد وصف متاح')}
        </div>
      </TabsContent>

      <TabsContent value="ingredients" className="mt-4 animate-fade-in">
        <div className="space-y-3 text-muted-foreground">
          <p className="text-sm leading-relaxed">
            {t(
              'Our products are formulated with high-quality ingredients that are gentle on your skin.',
              'منتجاتنا مصنوعة من مكونات عالية الجودة ولطيفة على بشرتك.'
            )}
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>{t('Hyaluronic Acid', 'حمض الهيالورونيك')}</li>
            <li>{t('Vitamin E', 'فيتامين E')}</li>
            <li>{t('Natural Extracts', 'مستخلصات طبيعية')}</li>
            <li>{t('Aloe Vera', 'الصبار')}</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="usage" className="mt-4 animate-fade-in">
        <div className="space-y-3 text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed">
            <li>{t('Cleanse your face thoroughly', 'نظفي وجهك جيداً')}</li>
            <li>{t('Apply a small amount to your face', 'ضعي كمية صغيرة على وجهك')}</li>
            <li>{t('Massage gently in circular motions', 'دلكي بلطف بحركات دائرية')}</li>
            <li>{t('Use morning and night for best results', 'استخدميه صباحاً ومساءً للحصول على أفضل النتائج')}</li>
          </ol>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="mt-4 animate-fade-in">
        <div className="space-y-4 text-muted-foreground text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-1">{t('Shipping', 'الشحن')}</h4>
            <ul className="space-y-1">
              <li>• {t('Free shipping on orders over 500 EGP', 'شحن مجاني للطلبات فوق 500 جنيه')}</li>
              <li>• {t('Delivery within 2-5 business days', 'التوصيل خلال 2-5 أيام عمل')}</li>
              <li>• {t('Same day delivery in Cairo', 'توصيل في نفس اليوم في القاهرة')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">{t('Returns', 'الإرجاع')}</h4>
            <ul className="space-y-1">
              <li>• {t('14 days return policy', 'سياسة إرجاع 14 يوم')}</li>
              <li>• {t('Product must be unopened', 'يجب أن يكون المنتج مغلقاً')}</li>
              <li>• {t('Full refund or exchange', 'استرداد كامل أو استبدال')}</li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
