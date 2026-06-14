'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

export interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  orderId: string;
  createdAt: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Completed';
  items: OrderItem[];
  total: number;
  shipping: number;
  tax: number;
  customer?: {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal?: string;
    country?: string;
  };
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      clearOrders: () => set({ orders: [] })
    }),
    {
      name: 'jewelra-orders',
      partialize: (state) => ({ orders: state.orders })
    }
  )
);
