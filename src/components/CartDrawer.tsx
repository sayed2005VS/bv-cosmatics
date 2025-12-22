import { useState } from "react";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { 
    items, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    createCheckout,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();
  
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    try {
      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        // Using noopener,noreferrer to prevent tabnabbing attacks
        const newWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
        setIsOpen(false);
      }
    } catch {
      // Silent fail - user sees loading state revert
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-foreground hover:text-primary transition-colors">
          <ShoppingBag size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-xl">
            {t('Shopping Cart', 'سلة التسوق')}
          </SheetTitle>
          <SheetDescription>
            {totalItems === 0 
              ? t('Your cart is empty', 'سلتك فارغة') 
              : t(`${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`, `${totalItems} منتج في سلتك`)}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('Your cart is empty', 'سلتك فارغة')}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable items area */}
              <div className="flex-1 overflow-y-auto pe-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 bg-secondary/50 rounded-xl">
                      <div className="w-16 h-16 bg-background rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.node.title}</h4>
                        {item.variantTitle !== 'Default Title' && (
                          <p className="text-xs text-muted-foreground">
                            {item.selectedOptions.map(option => option.value).join(' • ')}
                          </p>
                        )}
                        <p className="font-semibold text-sm mt-1">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                          <button
                            className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fixed checkout section */}
              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-border bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{t('Total', 'المجموع')}</span>
                  <span className="text-xl font-bold font-display">
                    {items[0]?.price.currencyCode || 'USD'} {totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="btn-gold w-full flex items-center justify-center gap-2"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('Creating Checkout...', 'جاري إنشاء الطلب...')}
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      {t('Checkout', 'إتمام الشراء')}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
