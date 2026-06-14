import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface RecentlyViewedState {
  items: Product[];
  addItem: (product: Product) => void;
  clearAll: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          // Remove if already exists to move it to the front
          const filtered = state.items.filter((item) => item._id !== product._id);
          // Prepend the new product and keep top 8
          const updated = [product, ...filtered].slice(0, 8);
          return { items: updated };
        });
      },
      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);
