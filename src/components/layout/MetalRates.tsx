'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Rates {
  gold: number;
  silver: number;
}

export default function MetalRates() {
  const [rates, setRates] = useState<Rates>({ gold: 14479, silver: 239 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/rates');
        if (response.ok) {
          const data = await response.json();
          if (data && data.gold > 0) {
            setRates(data);
          }
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence>
        {/* GOLD RATE */}
        <motion.div
           key="gold-rate-bubble"
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex items-center gap-2 rounded-full border border-[#751A20]/10 bg-white px-3 py-1 shadow-sm transition-all hover:bg-[#fff5f5]"
        >
          <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-[#751A20]/60 uppercase tracking-widest">Gold</span>
          <span className="text-[13px] font-bold text-gray-900">₹{rates.gold.toLocaleString()}</span>
        </motion.div>

        {/* SILVER RATE */}
        <motion.div
           key="silver-rate-bubble"
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="flex items-center gap-2 rounded-full border border-[#751A20]/10 bg-white px-3 py-1 shadow-sm transition-all hover:bg-[#fff5f5]"
        >
          <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-[#751A20]/60 uppercase tracking-widest">Silver</span>
          <span className="text-[13px] font-bold text-gray-900">₹{rates.silver.toLocaleString()}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
