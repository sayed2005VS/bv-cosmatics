import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShopifyMetafield } from '@/lib/shopify';

interface ProductTabsProps {
  description: string;
  metafields?: Array<ShopifyMetafield | null>;
}

const ProductTabs = ({ description, metafields }: ProductTabsProps) => {
  const { t, isRTL, language } = useLanguage();

  // Extract metafield values
  const getMetafieldValue = (key: string): string | null => {
    if (!metafields) return null;
    const field = metafields.find(m => m?.key === key);
    return field?.value || null;
  };

  // Get translated metafield with fallback
  const getTranslatedMetafield = (baseKey: string): string | null => {
    const primaryKey = `${baseKey}_${language}`;
    const fallbackKey = `${baseKey}_${language === 'ar' ? 'en' : 'ar'}`;
    return getMetafieldValue(primaryKey) || getMetafieldValue(fallbackKey);
  };

  const ingredients = getTranslatedMetafield('ingredients');
  const usageInstructions = getTranslatedMetafield('usage_instructions');

  // Parse multiline text into array
  const parseLines = (text: string | null): string[] => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim());
  };

  const ingredientsList = parseLines(ingredients);
  const usageSteps = parseLines(usageInstructions);

  // Check which tabs should be visible
  const hasIngredients = ingredientsList.length > 0;
  const hasUsage = usageSteps.length > 0;

  return (
    <Tabs defaultValue="description" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <TabsList className="w-full justify-center bg-secondary/50 rounded-xl p-1.5 h-auto flex-wrap gap-1">
        <TabsTrigger 
          value="description" 
          className="rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          {t('product.description')}
        </TabsTrigger>
        {hasIngredients && (
          <TabsTrigger 
            value="ingredients" 
            className="rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            {t('product.ingredients')}
          </TabsTrigger>
        )}
        {hasUsage && (
          <TabsTrigger 
            value="usage" 
            className="rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            {t('product.howToUse')}
          </TabsTrigger>
        )}
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

      {hasIngredients && (
        <TabsContent value="ingredients" className="mt-6 animate-fade-in">
          <div className="space-y-4 text-muted-foreground">
            <ul className={`space-y-2 text-sm ${isRTL ? 'pr-4' : 'pl-4'}`}>
              {ingredientsList.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      )}

      {hasUsage && (
        <TabsContent value="usage" className="mt-6 animate-fade-in">
          <div className="space-y-3 text-muted-foreground">
            <ol className={`space-y-3 text-sm leading-relaxed ${isRTL ? 'pr-4' : 'pl-4'}`}>
              {usageSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </TabsContent>
      )}

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
