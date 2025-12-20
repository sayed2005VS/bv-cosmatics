import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistItem {
  productId: string;
  productHandle: string;
  title: string;
  imageUrl: string;
  price: string;
  currencyCode: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        if (!items.find(i => i.productId === item.productId)) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'bv-cosmatics-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
