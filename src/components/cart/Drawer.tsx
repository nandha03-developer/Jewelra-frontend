'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import CartItem from '@/components/cart/Item';

export default function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartDrawerOpen = useUIStore((state) => state.cartDrawerOpen);
  const closeCartDrawer = useUIStore((state) => state.closeCartDrawer);

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
          />

          {/* Drawer Container */}
          <motion.aside
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 1, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[110] flex h-full w-full max-w-[450px] flex-col bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)]"
          >
            {/* Header section matching screenshot */}
            <div className="flex items-center justify-between border-b border-[#f0e8e0] px-8 py-8">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase">Your Cart</p>
                <h2 className="text-3xl font-serif text-gray-900 font-medium">Shopping bag</h2>
              </div>
              <button
                onClick={closeCartDrawer}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 transition-colors hover:border-[#751A20] hover:bg-[#751A20]/5 active:scale-90"
              >
                <Icon icon="solar:close-circle-linear" className="h-6 w-6 text-gray-400 group-hover:text-[#751A20]" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
              {items.length > 0 ? (
                <div className="space-y-6">
                  {items.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}

                  {/* Summary Card */}
                  <div className="mt-10 rounded-[40px] border border-[#f5ece4] bg-[#fdfaf8] p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">Subtotal</span>
                        <span className="text-gray-900 font-bold text-lg">₹{total.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                        <span>Items Count</span>
                        <span>{items.length} units</span>
                      </div>
                    </div>

                    <button
                      onClick={clearCart}
                      className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-xs font-bold text-gray-900 transition-all hover:bg-gray-50 active:scale-95 hover:text-[#751A20]"
                    >
                      <Icon icon="solar:trash-bin-2-linear" className="w-4 h-4" />
                      Clear Shopping Bag
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state matching screenshot exactly */
                <div className="flex h-full flex-col justify-start pt-10 px-2">
                  <div className="rounded-[45px] border border-[#f2e7dc] bg-[#fef9f1] p-12 py-16 text-center shadow-sm">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-inner">
                      <Icon icon="solar:cart-large-minimalistic-linear" className="h-10 w-10 text-[#5a151a]" />
                    </div>
                    <p className="text-2xl font-serif font-medium text-gray-900">Your cart is empty</p>
                    <p className="mt-4 text-[13px] leading-relaxed text-gray-500 max-w-[200px] mx-auto">
                      Add premium pieces to start shopping.
                    </p>
                    <button
                      onClick={closeCartDrawer}
                      className="mt-10 inline-flex items-center justify-center rounded-full bg-[#5a151a] px-8 py-3.5 text-xs font-bold text-white transition-all hover:bg-[#b59245] hover:scale-105 active:scale-95 shadow-lg shadow-[#c8a452]/20"
                    >
                      Continue browsing
                    </button>
                  </div>


                </div>
              )}
            </div>

            {/* Footer Checkout Area (only visible when cart has items) */}
            {items.length > 0 && (
              <div className="border-t border-[#f0e8e0] p-8 bg-white">
                <Link
                  href="/cart"
                  onClick={closeCartDrawer}
                  className="group mx-auto flex w-fit items-center justify-center gap-2.5 rounded-full bg-[#751A20] px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#751A20]/20 transition-all hover:-translate-y-0.5 hover:bg-[#5a151a] whitespace-nowrap"
                >
                  <Icon icon="solar:bag-bold" className="h-4 w-4" />
                  Proceed to Checkout
                  <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
