'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface CompareState {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCompare: () => void;
  isCompared: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const exists = get().items.some((item) => item._id === product._id);
        if (exists) {
          set({ items: get().items.filter((item) => item._id !== product._id) });
          import('sonner').then(({ toast }) => toast.success('Removed from compare list'));
          return;
        }
        if (get().items.length >= 3) {
          import('sonner').then(({ toast }) => toast.error('Selection limit reached. You can compare up to 3 items only.'));
          return;
        }
        set({ items: [...get().items, product] });
        import('sonner').then(({ toast }) => toast.success('Added to compare list'));
      },
      removeItem: (id) => set({ items: get().items.filter((item) => item._id !== id) }),
      clearCompare: () => set({ items: [] }),
      isCompared: (id) => get().items.some((item) => item._id === id),
    }),
    {
      name: 'jewelra-compare',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
