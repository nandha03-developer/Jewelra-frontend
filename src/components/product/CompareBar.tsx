'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useCompareStore } from '@/store/compareStore';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

export default function CompareBar() {
  const { items, removeItem, clearCompare } = useCompareStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Automatically clear comparison items when user logs out
    if (isHydrated && !user && items.length > 0) {
      clearCompare();
    }
  }, [isHydrated, user, items.length, clearCompare]);

  const isListPage = pathname?.startsWith('/shop') || pathname?.startsWith('/product');
  
  if (!isHydrated || !user || items.length === 0 || pathname === '/compare' || !isListPage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 150, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        exit={{ y: 150, opacity: 0, x: '-50%' }}
        className="fixed bottom-6 lg:bottom-10 left-1/2 z-[1000] w-[95%] sm:w-[90%] max-w-fit px-0 sm:px-8"
      >
        <div className="bg-white/95 dark:bg-[#121317]/95 backdrop-blur-3xl border border-[#751A20]/10 shadow-[0_25px_60px_-15px_rgba(117,26,32,0.3)] rounded-2xl lg:rounded-[2.5rem] px-3 py-3 lg:px-10 lg:py-5">
          <div className="flex items-center justify-between gap-3 sm:gap-8 lg:gap-16">
            
            {/* Left: Metadata - Hidden on mobile */}
            <div className="hidden sm:flex flex-col items-start gap-1 min-w-[120px]">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#751A20]">Compare</span>
              <p className="text-[12px] font-bold text-gray-400 whitespace-nowrap">{items.length} of 3 items</p>
            </div>

            {/* Center: Image Boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 flex-1">
              {items.map((product) => (
                <div key={product._id} className="relative group/item shrink-0">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl overflow-hidden border border-[#751A20]/10 bg-white shadow-sm transition-all duration-300 group-hover/item:scale-105 group-hover/item:border-[#751A20]/30 hover:shadow-md">
                    <img 
                      src={product.image || product.images?.[0]} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-1.5 sm:p-2.5"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(product._id)}
                    className="absolute -top-1.5 -right-1.5 bg-[#751A20] text-white rounded-full p-1.5 shadow-xl opacity-0 group-hover/item:opacity-100 transition-all duration-300 z-10 scale-75 hover:scale-100 hover:bg-black"
                  >
                    <Icon icon="solar:close-circle-bold" width="18" />
                  </button>
                </div>
              ))}
              
              {/* Placeholders */}
              {Array.from({ length: 3 - items.length }).map((_, i) => (
                <div key={`placeholder-${i}`} className="w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl border border-dashed border-gray-100 flex items-center justify-center text-gray-200">
                  <Icon icon="solar:add-circle-linear" className="w-5 h-5 sm:w-6 sm:h-6 opacity-30" />
                </div>
              ))}
            </div>

            {/* Right: Consolidated Actions */}
            <div className="flex items-center gap-3 sm:gap-6 lg:gap-10 shrink-0">
              <button
                onClick={clearCompare}
                className="hidden md:block text-[11px] font-black text-gray-400 hover:text-red-500 uppercase tracking-[0.15em] transition-all duration-300 border-b border-transparent hover:border-red-200"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    toast.error('Please login to compare masterpieces', {
                      description: 'Sign in to access your curated comparisons across devices.',
                      icon: <Icon icon="solar:user-block-bold-duotone" className="text-[#751A20] w-5 h-5" />,
                    });
                    return;
                  }
                  router.push('/compare');
                }}
                className="h-10 sm:h-12 lg:h-14 px-4 sm:px-8 lg:px-12 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#751A20] text-white text-[10px] sm:text-[11px] lg:text-[12px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] flex items-center justify-center gap-2 sm:gap-4 shadow-[0_15px_30px_rgba(117,26,32,0.3)] hover:bg-black hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <span className="hidden xs:inline sm:inline">Compare</span>
                <Icon icon="solar:arrow-right-up-linear" className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
