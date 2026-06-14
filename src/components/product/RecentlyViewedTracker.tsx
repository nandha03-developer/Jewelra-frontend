'use client';

import { useEffect } from 'react';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useAuthStore } from '@/store/authStore';
import type { Product } from '@/types';

export default function RecentlyViewedTracker({ product }: { product: Product }) {
  const addItem = useRecentlyViewedStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (product && user) {
      addItem(product);
    }
  }, [product, addItem, user]);

  return null;
}
