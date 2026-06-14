'use client';

import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import ProductCard from './ProductCard';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface RecentlyViewedProps {
  excludeId?: string;
}

export default function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const { items, clearAll } = useRecentlyViewedStore();
  
  // Filter out the current product being viewed
  const displayItems = excludeId ? items.filter(i => i._id !== excludeId) : items;

  if (displayItems.length === 0) return null;

  return (
    <section id="recently-viewed" className="mt-24 lg:mt-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#fcf9f6] px-4 py-1.5 rounded-full border border-[#f0e8e0]">
            <Icon icon="solar:history-bold" className="text-[#D4B996]" width="14" />
            <span className="text-[10px] font-bold text-[#787373] uppercase tracking-widest">Your History</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif text-[#2a1310]">Treasures You noticed</h2>
          <p className="text-[#787373] text-sm max-w-lg">Revisit the designs that caught your eye. These pieces are waiting for another look.</p>
        </div>
        
        <button 
          onClick={clearAll}
          className="text-[10px] font-extrabold uppercase tracking-widest text-[#787373] hover:text-[#751A20] transition-colors flex items-center gap-2 group pb-1 border-b border-transparent hover:border-[#751A20]"
        >
          Clear History 
          <Icon icon="solar:trash-bin-trash-linear" width="16" className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayItems.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
