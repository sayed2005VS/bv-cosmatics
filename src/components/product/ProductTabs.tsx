import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductTabsProps {
  description: string;
}

const ProductTabs = ({ description }: ProductTabsProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Tabs defaultValue="description" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <TabsList className="w-full justify-center bg-secondary/50 rounded-xl p-1.5 h-auto flex-wrap gap-1">
        <TabsTrigger 
          value="description" 
          className="rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          {t('product.description')}
        </TabsTrigger>
        <TabsTrigger 
          value="shipping" 
          className="rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          {t('product.shippingReturns')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6 animate-fade-in">
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
          {description || t('product.noDescription')}
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="mt-6 animate-fade-in">
        <div className="grid gap-6 sm:grid-cols-2 text-muted-foreground text-sm">
          <div className="space-y-3 p-4 rounded-xl bg-secondary/30">
            <h4 className="font-semibold text-foreground">{t('productTabs.shipping.title')}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {t('productTabs.shipping.free')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {t('productTabs.shipping.delivery')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {t('productTabs.shipping.sameDay')}
              </li>
            </ul>
          </div>
          <div className="space-y-3 p-4 rounded-xl bg-secondary/30">
            <h4 className="font-semibold text-foreground">{t('productTabs.returns.title')}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {t('productTabs.returns.policy')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {t('productTabs.returns.condition')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {t('productTabs.returns.refund')}
              </li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
