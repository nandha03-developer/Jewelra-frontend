'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface CartState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  setItems: (items: Product[]) => void;
  isInCart: (id: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set((state) => {
        const giftQty = product.quantity || 1;
        const exists = state.items.find((item) => item._id === product._id);
        if (exists) {
          return state;
        }
        return { items: [...state.items, { ...product, quantity: giftQty }] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item._id !== id) })),
      clearCart: () => set({ items: [] }),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) => item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item)
      })),
      setItems: (items) => set({ items }),
      isInCart: (id) => get().items.some((item) => item._id === id)
    }),
    {
      name: 'jewelra-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
);
