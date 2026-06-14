'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistState {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isWishlisted: (id: string) => boolean;
  setItems: (items: Product[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const exists = get().items.some((item) => item._id === product._id);
        if (exists) {
          set({ items: get().items.filter((item) => item._id !== product._id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((item) => item._id !== id) }),
      clearWishlist: () => set({ items: [] }),
      isWishlisted: (id) => get().items.some((item) => item._id === id),
      setItems: (items) => set({ items })
    }),
    {
      name: 'jewelra-wishlist',
      partialize: (state) => ({ items: state.items })
    }
  )
);
