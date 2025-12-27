import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LocalProduct } from '@/lib/products';

export interface CartItem {
  product: LocalProduct;
  variantId: string;
  variantTitle: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  createWhatsAppCheckout: () => string;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// WhatsApp number for checkout
const WHATSAPP_NUMBER = '201000000000'; // Replace with actual number

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setLoading: (isLoading) => set({ isLoading }),

      createWhatsAppCheckout: () => {
        const { items, getTotalPrice } = get();
        if (items.length === 0) return '';

        // Build WhatsApp message
        const productLines = items.map(item => 
          `• ${item.product.title} (${item.variantTitle}) x${item.quantity} - ${item.price * item.quantity} EGP`
        ).join('\n');

        const total = getTotalPrice();
        
        const message = encodeURIComponent(
          `🛒 *طلب جديد*\n\n` +
          `${productLines}\n\n` +
          `💰 *المجموع: ${total} EGP*\n\n` +
          `الرجاء تأكيد الطلب وإرسال تفاصيل الشحن.`
        );

        return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'bv-cosmatics-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
