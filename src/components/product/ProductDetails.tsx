'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Product } from '@/types';
import QuickViewModal from '@/components/product/QuickViewModal';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');
  const [quickOpen, setQuickOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const router = useRouter();
  
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product._id));

  const materialName = typeof product.material === 'object' ? (product.material as any).name : product.material || 'Gold';
  const purityValue = typeof product.purity === 'object' ? (product.purity as any).name : product.purity || '22K';

  const handleAddToCart = () => {
    if (useCartStore.getState().isInCart(product._id)) {
      toast.error('Product already in bag');
      return;
    }

    addItem({ ...product, quantity });
    toast.success(`Added ${quantity} ${product.name} to bag`, {
      icon: <Icon icon="clarity:shopping-bag-solid" className="text-[#751A20]" width="20" />,
      style: { borderRadius: '1rem', border: '1px solid #751A20/20' }
    });
  };

  const handleBuyNow = () => {
    if (!useCartStore.getState().isInCart(product._id)) {
      addItem({ ...product, quantity });
    }
    router.push('/cart');
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Header Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-[#D4B996]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4B996]">
              {typeof product.category === 'object' ? (product.category as any).name : 'Jewellery Collection'}
            </span>
          </div>
          
          <h1 className="font-serif text-4xl lg:text-5xl text-[#2a1310] leading-tight">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex text-[#D4B996]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon key={s} icon="mdi:star" width="18" className={s > (product.rating || 5) ? 'opacity-20' : ''} />
                ))}
              </div>
                <button 
                  onClick={() => document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm font-medium text-[#787373] hover:text-[#751A20] transition-colors"
                  suppressHydrationWarning
                >
                  (42 Reviews)
                </button>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 bg-[#fcf9f6] px-3 py-1 rounded-full border border-[#f0e8e0]">
              <Icon icon="mdi:check-decagram" className="text-[#751A20]" width="14" />
              <span className="text-[11px] font-bold text-[#751A20] uppercase tracking-wider">Certified Luxury</span>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-end gap-4">
          <span className="text-4xl font-bold text-[#751A20]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.discount && (
            <span className="text-xl font-medium text-[#787373] line-through decoration-[#751A20]/30 mb-1">
              ₹{(product.price + product.discount).toLocaleString('en-IN')}
            </span>
          )}
          <span className="mb-2 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded leading-none">
            Inclusive of all taxes
          </span>
        </div>

        {/* Description Snippet */}
        <p className="text-[#787373] leading-relaxed max-w-lg">
          {product.description || 'A masterpiece of elegance and craftsmanship. This exquisite design reflects the timeless beauty of pure luxury, perfect for making your special moments truly unforgettable.'}
        </p>

        {/* Interaction Controls */}
        <div className="space-y-6 pt-4 border-t border-[#f0e8e0]">
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-[#fcf9f6] rounded-full border border-[#f0e8e0] p-1 shadow-inner">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-[#2a1310] transition-all disabled:opacity-20"
                disabled={quantity <= 1}
              >
                <Icon icon="mdi:minus" />
              </button>
              <span className="w-12 text-center font-bold text-[#2a1310]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-[#2a1310] transition-all"
              >
                <Icon icon="mdi:plus" />
              </button>
            </div>
            
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 ${
                isWishlisted 
                ? 'bg-[#751A20] border-[#751A20] text-white shadow-lg' 
                : 'border-[#f0e8e0] text-[#787373] hover:border-[#751A20] hover:text-[#751A20]'
              }`}
            >
              <Icon icon={isWishlisted ? "mdi:heart" : "mdi:heart-outline"} width="22" />
            </button>

            <button
              onClick={() => setShareOpen(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-[#f0e8e0] text-[#787373] hover:border-[#2a1310] hover:text-[#2a1310] transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Icon icon="solar:share-bold" width="22" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full h-12 bg-[#751A20] text-white rounded-[12px] font-bold uppercase tracking-widest text-[11px] hover:bg-[#5a151a] hover:shadow-[0_10px_20_rgba(117,26,32,0.2)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon icon="clarity:shopping-bag-line" width="16" />
              Add to Cart
            </button>
            
            <button
              onClick={handleBuyNow}
              className="w-full h-12 bg-[#2a1310] text-white rounded-[12px] font-bold uppercase tracking-widest text-[11px] hover:bg-black hover:shadow-[0_10px_20_rgba(0,0,0,0.15)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon icon="solar:wallet-bold" width="16" />
              Buy Now
            </button>

            {/* Quick View */}
            <button
              onClick={() => setQuickOpen(true)}
              className="w-full h-12 bg-[#751A20] text-white rounded-[12px] font-bold uppercase tracking-widest text-[11px] hover:bg-[#5a151a] hover:shadow-[0_10px_20_rgba(117,26,32,0.2)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon icon="solar:eye-bold" width="16" />
              Quick View
            </button>
          </div>
        </div>

        {/* Information Tabs */}
        <div className="mt-4">
          <div className="flex gap-8 border-b border-[#f0e8e0]">
            {(['details', 'specs', 'shipping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? 'text-[#751A20]' : 'text-[#787373] hover:text-[#2a1310]'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="detail-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#751A20]" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8 min-h-[160px]">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-[#787373] leading-relaxed space-y-4"
                >
                  <p>Designed with meticulous attention to detail, this piece represents the pinnacle of our design philosophy. Each element is carefully chosen to ensure a perfect balance of luxury and wearability.</p>
                  <ul className="grid grid-cols-2 gap-y-3">
                    <li className="flex items-center gap-2"><Icon icon="mdi:check-circle" className="text-[#D4B996]" /> Ethical Sourcing</li>
                    <li className="flex items-center gap-2"><Icon icon="mdi:check-circle" className="text-[#D4B996]" /> Artisan Crafted</li>
                    <li className="flex items-center gap-2"><Icon icon="mdi:check-circle" className="text-[#D4B996]" /> Lifetime Polishing</li>
                    <li className="flex items-center gap-2"><Icon icon="mdi:check-circle" className="text-[#D4B996]" /> BIS Hallmarked</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 gap-x-12 gap-y-4"
                >
                  <div className="flex justify-between border-b border-[#f0e8e0] pb-2">
                    <span className="text-[10px] font-bold text-[#787373] uppercase tracking-wider">Material</span>
                    <span className="text-[11px] font-bold text-[#2a1310]">{materialName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#f0e8e0] pb-2">
                    <span className="text-[10px] font-bold text-[#787373] uppercase tracking-wider">Purity</span>
                    <span className="text-[11px] font-bold text-[#2a1310]">{purityValue}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#f0e8e0] pb-2">
                    <span className="text-[10px] font-bold text-[#787373] uppercase tracking-wider">Net Weight</span>
                    <span className="text-[11px] font-bold text-[#2a1310]">{product.weight}g</span>
                  </div>
                  <div className="flex justify-between border-b border-[#f0e8e0] pb-2">
                    <span className="text-[10px] font-bold text-[#787373] uppercase tracking-wider">Making Charges</span>
                    <span className="text-[11px] font-bold text-[#2a1310]">₹{product.makingCharge}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#f0e8e0] pb-2">
                    <span className="text-[10px] font-bold text-[#787373] uppercase tracking-wider">Product Code</span>
                    <span className="text-[11px] font-bold text-[#2a1310]">JR-{product._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#f0e8e0] pb-2">
                    <span className="text-[10px] font-bold text-[#787373] uppercase tracking-wider">Stock</span>
                    <span className="text-[11px] font-bold text-[#2a1310]">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-[#787373] leading-relaxed"
                >
                  <div className="flex items-center gap-4 bg-[#fcf9f6] p-4 rounded-xl border border-[#f0e8e0] mb-4">
                    <Icon icon="solar:delivery-bold" className="text-[#751A20]" width="32" />
                    <div>
                      <h4 className="text-[11px] font-bold text-[#2a1310] uppercase tracking-wider">Premium Express Delivery</h4>
                      <p className="text-[12px]">Complimentary shipping on all luxury purchases. Delivered in 3-5 business days.</p>
                    </div>
                  </div>
                  <p>We provide secure, insured packaging to ensure your jewellery arrives in perfect condition. All shipments require a signature upon delivery.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-[#f0e8e0]">
          {[
            { icon: 'solar:shield-check-linear', label: 'Insured Delivery' },
            { icon: 'solar:refresh-linear', label: '7-Day Return' },
            { icon: 'solar:verified-check-linear', label: 'BIS Hallmarked' }
          ].map((badge) => (
            <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#fcf9f6] border border-[#f0e8e0] flex items-center justify-center text-[#751A20]">
                <Icon icon={badge.icon} width="20" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#787373]">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <QuickViewModal product={product} open={quickOpen} onClose={() => setQuickOpen(false)} />
      <SocialShareModal 
        product={product} 
        isOpen={shareOpen} 
        onClose={() => setShareOpen(false)} 
      />
    </>
  );
}

function SocialShareModal({ 
  product, 
  isOpen, 
  onClose 
}: { 
  product: Product; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this beautiful ${product.name} from Jewelra!`;

  const platforms = [
    { 
      name: 'WhatsApp', 
      icon: 'logos:whatsapp-icon', 
      color: '#25D366',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
    },
    { 
      name: 'Facebook', 
      icon: 'logos:facebook', 
      color: '#1877F2',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    { 
      name: 'Pinterest', 
      icon: 'logos:pinterest', 
      color: '#BD081C',
      action: () => window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(product.images?.[0] || product.image)}&description=${encodeURIComponent(shareText)}`, '_blank')
    },
    { 
      name: 'Instagram', 
      icon: 'skill-icons:instagram', 
      color: '#E4405F',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied! Share it on your Instagram stories.');
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#D4B996]/20 relative"
          >
            <div className="p-6 md:p-10">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-[#787373] hover:text-[#751A20] transition-colors"
              >
                <Icon icon="mdi:close" width="20" />
              </button>

              <div className="flex items-center gap-6 mb-8 border-b border-[#f0e8e0] pb-6 mt-2">
                <div className="w-14 h-14 bg-[#fcf9f6] rounded-full border border-[#f0e8e0] flex items-center justify-center text-[#D4B996] flex-shrink-0">
                  <Icon icon="solar:share-circle-bold" width="28" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-serif text-[#2a1310]">Spread the Sparkle</h3>
                  <p className="text-[10px] font-bold text-[#787373] uppercase tracking-widest italic opacity-70">Share this masterpiece with your world</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                {platforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={platform.action}
                    className="group flex items-center justify-center w-14 h-14 rounded-2xl bg-[#fcf9f6] border border-[#f0e8e0] hover:border-[#2a1310] hover:bg-white transition-all duration-300 mx-auto"
                    title={platform.name}
                  >
                    <div className="transition-transform group-hover:scale-110">
                      <Icon icon={platform.icon} width="32" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Icon icon="solar:link-bold" className="text-[#D4B996]" width="16" />
                </div>
                <input 
                  readOnly 
                  value={shareUrl}
                  className="w-full h-12 pl-12 pr-14 bg-[#fcf9f6] border border-[#f0e8e0] rounded-xl text-xs text-[#787373] focus:outline-none focus:border-[#2a1310] transition-all truncate font-medium"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="absolute inset-y-1.5 right-1.5 w-10 flex items-center justify-center bg-[#2a1310] text-white rounded-lg hover:bg-black transition-all active:scale-90"
                  title="Copy Link"
                >
                  <Icon icon="solar:copy-bold" width="18" />
                </button>
              </div>
            </div>
            
            <div className="bg-[#fcf9f6] p-4 text-center border-t border-[#f0e8e0]">
               <p className="text-[9px] font-bold text-[#787373] uppercase tracking-widest">Jewelra • Timeless Elegance</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
