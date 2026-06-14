'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';

export default function RecentlyViewedDrawer() {
  const { historyDrawerOpen, closeHistoryDrawer } = useUIStore();
  const { items, clearAll } = useRecentlyViewedStore();
  const user = useAuthStore((state) => state.user);

  // If user is not logged in, we don't show the drawer content
  if (!user) return null;

  return (
    <>
      {/* Side Drawer */}
      <AnimatePresence>
        {historyDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeHistoryDrawer}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#f0e8e0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fcf9f6] border border-[#f0e8e0] flex items-center justify-center">
                    <Icon icon="solar:history-bold" className="text-[#D4B996]" width="20" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#2a1310]">History</h3>
                    <p className="text-[10px] text-[#787373] uppercase tracking-widest font-bold">Your discoveries ({items.length})</p>
                  </div>
                </div>
                <button 
                  onClick={closeHistoryDrawer}
                  className="w-10 h-10 rounded-full bg-[#fcf9f6] flex items-center justify-center hover:bg-[#751A20] hover:text-white transition-colors"
                >
                  <Icon icon="mdi:close" width="20" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <Icon icon="solar:history-bold" width="48" className="mb-4" />
                    <p className="text-sm font-serif">Your history is currently empty.</p>
                  </div>
                ) : (
                  items.map((product) => (
                    <Link 
                      key={product._id} 
                      href={`/product/${product._id}`}
                      onClick={closeHistoryDrawer}
                      className="flex gap-4 group"
                    >
                      <div className="relative w-20 h-20 rounded-xl bg-[#fcf9f6] border border-[#f0e8e0] overflow-hidden flex-shrink-0 transition-all group-hover:border-[#D4B996]">
                        <Image
                          src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b'}
                          alt={product.name}
                          fill
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="text-sm font-serif text-[#2a1310] group-hover:text-[#751A20] transition-colors line-clamp-2 leading-tight mb-1">
                          {product.name}
                        </h4>
                        <p className="text-xs font-bold text-gray-900">
                          ₹ {product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {items.length > 0 && (
                 <div className="p-4 border-t border-[#f0e8e0] bg-[#fcf9f6]/30">
                 <button
                   onClick={() => {
                     clearAll();
                   }}
                   className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl border border-[#751A20]/40 text-[#751A20] font-bold text-[9px] uppercase tracking-[0.2em] hover:bg-[#751A20] hover:text-white hover:border-[#751A20] transition-all duration-300 active:scale-[0.98] group"
                 >
                   <Icon icon="solar:trash-bin-trash-linear" width="14" />
                   Clear History Now
                 </button>
               </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
