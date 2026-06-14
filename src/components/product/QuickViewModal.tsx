'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product._id));
  const user = useAuthStore((state) => state.user);
  
  const handleWishlistToggle = () => {
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

  const handleAddToCart = () => {
    if (useCartStore.getState().isInCart(product._id)) {
      toast.error('Product already in bag');
      return;
    }
    addToCart(product);
    toast.success('Added to bag');
  };

  const [selectedImage, setSelectedImage] = useState(product.image);

  // Sync selected image if product changes
  useEffect(() => {
    setSelectedImage(product.image);
  }, [product.image]);

  const allImages = useMemo(() => {
    const imgs = product.images || [];
    if (product.image && !imgs.includes(product.image)) {
      return [product.image, ...imgs];
    }
    return imgs.length > 0 ? imgs : [product.image];
  }, [product.images, product.image]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-full max-w-[440px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-8 border-b border-gray-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#751A20]">Quick Overview</span>
                <h2 className="text-2xl font-serif text-[#2a1310] font-medium leading-tight">{product.name}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-[#751A20] hover:text-white transition-all duration-300"
              >
                <Icon icon="mdi:close" width="22" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide">
              {/* Image Section - Compact full-fit design */}
              <div className="space-y-4">
                <div className="relative h-[320px] w-full rounded-2xl bg-[#fafafa] overflow-hidden border border-gray-100 shadow-inner">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={selectedImage || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80'}
                    alt={product.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000"
                  />
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                          ${selectedImage === img ? 'border-[#751A20]' : 'border-gray-100 opacity-60 hover:opacity-100'}
                        `}
                      >
                        <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Description */}
              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-sans font-bold text-[#2a1310]">₹{product.price.toLocaleString()}</span>
                  {product.discount && (
                    <span className="text-lg text-gray-400 line-through">₹{(product.price + product.discount).toLocaleString()}</span>
                  )}
                </div>

                <p className="text-[15px] leading-relaxed text-gray-600 font-sans text-justify">
                  {product.description || 'A masterpiece of elegance and craftsmanship, this luxurious piece is designed to celebrate your most precious moments.'}
                </p>
              </div>

              {/* Specifications Card */}
              <div className="rounded-2xl border border-gray-100 bg-[#fffcf7]/50 p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3 mb-2">Specifications</h4>

                {[
                  { label: 'Material', value: typeof product.material === 'object' ? product.material.name : product.material || 'Gold' },
                  { label: 'Purity', value: product.purity ? (typeof product.purity === 'object' ? (product.purity.value || product.purity.name) : product.purity) : '22K' },
                  { label: 'Category', value: typeof product.category === 'object' ? product.category.name : product.category },
                  { label: 'Weight', value: product.weight ? `${product.weight}g` : 'N/A' }
                ].map((spec, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1">
                    <span className="text-gray-400">{spec.label}</span>
                    <span className="font-semibold text-[#2a1310]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-8 border-t border-gray-100 bg-white space-y-4 shadow-[0_-15px_30px_rgba(0,0,0,0.02)]">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="h-14 bg-[#751A20] text-white rounded-2xl font-bold text-[11px] tracking-widest uppercase shadow-xl shadow-[#751A20]/20 hover:bg-[#5b1419] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:cart-outline" width="18" />
                  Add To Bag
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`h-14 rounded-2xl border border-gray-100 flex items-center justify-center gap-2 font-bold text-[11px] tracking-widest uppercase transition-all
                    ${isWishlisted ? 'bg-[#751A20] border-[#751A20] text-white shadow-lg shadow-[#751A20]/20' : 'text-[#2a1310] hover:bg-gray-50'}
                  `}
                >
                  <Icon icon={isWishlisted ? 'mdi:heart' : 'mdi:heart-outline'} width="18" />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
              </div>
              
              <button
                onClick={() => {
                   onClose();
                   import('next/navigation').then(({ useRouter }) => {
                     window.location.href = `/product/${product._id}`;
                   });
                }}
                className="w-full py-4 rounded-2xl border border-dashed border-gray-200 text-[#751A20] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#fdfaf5] hover:border-[#751A20] transition-all flex items-center justify-center gap-2"
              >
                View Full Product Details
                <Icon icon="mdi:arrow-right" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
