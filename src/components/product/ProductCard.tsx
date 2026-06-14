'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import type { Product } from '@/types';
import QuickViewModal from '@/components/product/QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product._id));
  const toggleCompare = useCompareStore((state) => state.toggleItem);
  const isCompared = useCompareStore((state) => state.isCompared(product._id));
  const addToCart = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);
  
  const [quickOpen, setQuickOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success('Added to wishlist');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to compare masterpieces', {
        description: 'Sign in to access your curated comparisons and premium features.',
        icon: <Icon icon="solar:user-block-bold-duotone" className="text-[#751A20] w-5 h-5" />,
      });
      return;
    }
    toggleCompare(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (useCartStore.getState().isInCart(product._id)) {
      toast.error('Product already in bag');
      return;
    }
    addToCart(product);
    toast.success('Added to bag');
  };

  const price = useMemo(() => (product.discount ? product.price - product.discount : product.price), [product]);

  return (
    <>
      <motion.div 
        className="group relative bg-white border border-[#f2f2f2] rounded-xl overflow-hidden flex flex-col items-start transition-all duration-500 hover:shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
      >
        
        {/* Image Container with ALL 4 Slide-in Actions */}
        <div className="relative w-full aspect-square bg-[#fafafa] flex items-center justify-center overflow-hidden">
          <Link href={`/product/${product._id}`} className="block h-full w-full relative">
            <Image
              src={product.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'}
              alt={product.name}
              fill
              className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
            />
          </Link>


          
          {/* Action Sidebar - Top Right */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute right-3 top-3 flex flex-col gap-2 z-40"
              >
                {[
                  { icon: isWishlisted ? 'mdi:heart' : 'mdi:heart-outline', label: 'Wishlist', action: handleWishlistToggle, active: isWishlisted },
                  { icon: 'mdi:cart-outline', label: 'Add to Cart', action: handleAddToCart, active: false },
                  { icon: isCompared ? 'mdi:compare' : 'mdi:compare-horizontal', label: 'Compare', action: handleCompareToggle, active: isCompared },
                  { icon: 'mdi:eye-outline', label: 'Quick View', action: (e: React.MouseEvent) => { e.preventDefault(); setQuickOpen(true); }, active: false }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="relative px-1"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <motion.button
                      initial={{ x: 15, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={item.action}
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-300 
                        ${item.active 
                          ? 'bg-[#751A20] text-white shadow-[#751A20]/30 scale-105' 
                          : 'bg-white/95 text-[#2a1310] hover:bg-[#751A20] hover:text-white'
                        }`}
                    >
                      <Icon icon={item.icon} width="18" />
                    </motion.button>
                    
                    {/* Tooltip - Using Framer Motion for 100% reliability */}
                    <AnimatePresence>
                      {hoveredIdx === idx && (
                        <motion.div 
                          initial={{ opacity: 0, x: 10, y: '-50%' }}
                          animate={{ opacity: 1, x: 0, y: '-50%' }}
                          exit={{ opacity: 0, x: 10, y: '-50%' }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-full mr-3 top-1/2 px-2.5 py-1.5 bg-[#2a1310] text-white text-[11px] font-medium rounded-md pointer-events-none whitespace-nowrap shadow-2xl z-[60]"
                        >
                          {item.label}
                          {/* Tooltip Arrow */}
                          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent border-l-[5px] border-l-[#2a1310]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Area - Multi-line Title Support */}
        <div className="w-full px-5 py-6 space-y-4">
          <Link href={`/product/${product._id}`} className="block">
            <h3 className="text-[17px] font-serif text-[#2a1310] hover:text-gold transition-colors leading-relaxed min-h-[3rem]">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between gap-4 w-full">
            <p className="text-[18px] font-sans font-semibold text-gray-900 whitespace-nowrap">
              ₹ {price.toLocaleString()}
            </p>
            {product.stock && product.stock < 10 && (
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#751A20] animate-pulse">
                <span className="w-1 h-1 rounded-full bg-[#751A20]" />
                Only {product.stock} left
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      <QuickViewModal product={product} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </>
  );
}
