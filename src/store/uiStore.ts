'use client';

import { create } from 'zustand';

interface UIState {
  cartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  historyDrawerOpen: boolean; // Recently Viewed
  toggleHistoryDrawer: () => void;
  openHistoryDrawer: () => void;
  closeHistoryDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartDrawerOpen: false,
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  historyDrawerOpen: false,
  toggleHistoryDrawer: () => set((state) => ({ historyDrawerOpen: !state.historyDrawerOpen })),
  openHistoryDrawer: () => set({ historyDrawerOpen: true }),
  closeHistoryDrawer: () => set({ historyDrawerOpen: false })
}));
