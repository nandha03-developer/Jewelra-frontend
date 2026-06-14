'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AVAILABLE_COUPONS = [
  { code: 'JEWEL5', discount: 0.05, label: '5% OFF' },
  { code: 'JEWEL10', discount: 0.10, label: '10% OFF' },
];

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0), [items]);
  const shipping = 1000; 
  const taxes = Math.round(subtotal * 0.03); 
  
  const discountAmount = appliedDiscount ? Math.round(subtotal * appliedDiscount.percent) : 0;
  const total = subtotal + shipping + taxes - discountAmount;

  // Handle clicking a coupon from the list
  const handleCouponSelection = (code: string) => {
    // If clicking the currently applied coupon, remove it
    if (appliedDiscount && appliedDiscount.code === code) {
      removeCoupon();
      return;
    }
    
    // Otherwise, just populate the input field. DO NOT apply yet.
    setCouponInput(code);
    toast.info(`Coupon ${code} selected. Click Apply to use it.`, { duration: 2000 });
  };

  const handleApplyCoupon = () => {
    if (!couponInput) {
      toast.error('Please enter a coupon code');
      return;
    }

    const code = couponInput.toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code === code);
    
    if (coupon) {
      setAppliedDiscount({ code: coupon.code, percent: coupon.discount });
      toast.success(`Coupon ${coupon.code} applied! ₹${Math.round(subtotal * coupon.discount).toLocaleString()} saved.`, {
        icon: <Icon icon="solar:tag-bold" className="text-[#751A20]" />,
        style: { borderRadius: '1rem' }
      });
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(null);
    setCouponInput('');
    toast.info('Coupon removed. Returning to normal amount.');
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-12 lg:py-20">
      <div className="mx-auto max-w-[1300px] px-4 md:px-8">
        
        {/* Progress Steps */}
        <div className="mb-12 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span className="text-[#751A20] border-b-2 border-[#751A20] pb-1">01 Shopping Bag</span>
          <div className="h-px w-8 bg-gray-200" />
          <span className="text-gray-400">02 Checkout Details</span>
          <div className="h-px w-8 bg-gray-200" />
          <span className="text-gray-400">03 Order Success</span>
        </div>

        <header className="mb-12 flex flex-col items-center text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl text-[#2a1310]">Your Shopping Bag</h1>
          <p className="text-[#787373] max-w-md text-sm leading-relaxed">
            Review your exquisite selections. Experience luxury delivery with our flat-rate express shipping.
          </p>
        </header>

        {items.length > 0 ? (
          <div className="grid gap-12 lg:grid-cols-[1fr,400px]">
            
            {/* Cart Items List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#f0e8e0] pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#787373]">{items.length} exquisite items</span>
                <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest text-[#751A20] hover:underline">Continue Shopping</Link>
              </div>

              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative flex flex-col gap-6 rounded-[24px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f0e8e0] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#D4B996]/30 sm:flex-row"
                  >
                    <button 
                      onClick={() => removeItem(item._id)}
                      className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white border border-[#f0e8e0] text-gray-400 shadow-sm flex items-center justify-center transition-all hover:bg-[#751A20] hover:text-white hover:border-[#751A20] z-10 opacity-0 group-hover:opacity-100 sm:opacity-100"
                    >
                      <Icon icon="mdi:close" width="16" />
                    </button>

                    <Link href={`/product/${item._id}`} className="block h-32 w-32 flex-shrink-0 overflow-hidden rounded-[18px] bg-[#fafafa] border border-[#f0e8e0]">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80'} 
                        alt={item.name} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-serif text-xl text-[#2a1310] group-hover:text-[#751A20] transition-colors">
                            <Link href={`/product/${item._id}`}>{item.name}</Link>
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-[#787373] uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 border-r border-gray-200 pr-4">
                              <Icon icon="solar:medal-star-bold" className="text-[#D4B996]" />
                              {typeof item.material === 'object' ? (item.material as any).name : item.material || 'Gold'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Icon icon="solar:verified-check-bold" className="text-[#D4B996]" />
                              {typeof item.purity === 'object' ? (item.purity as any).name : item.purity || '22K'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-[#751A20]">₹{item.price.toLocaleString()}</p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center bg-[#fcf9f6] rounded-full border border-[#f0e8e0] p-1 shadow-inner">
                          <button
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-[#2a1310] transition-all disabled:opacity-20"
                            disabled={(item.quantity || 1) <= 1}
                          >
                            <Icon icon="mdi:minus" width="14" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-[#2a1310]">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-[#2a1310] transition-all"
                          >
                            <Icon icon="mdi:plus" width="14" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                           <span className="text-xs font-bold text-[#787373] uppercase tracking-widest">Subtotal:</span>
                           <span className="text-lg font-bold text-[#2a1310]">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="relative">
              <div className="sticky top-24 rounded-[32px] bg-white p-8 border border-[#f0e8e0] shadow-[0_10px_40px_rgba(0,0,0,0.04)] space-y-8 text-[#2a1310]">
                <h2 className="font-serif text-2xl border-b border-[#f0e8e0] pb-6">Bag Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#787373]">Subtotal ({items.length} items)</span>
                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#787373]">Express Shipping</span>
                    <span className="font-bold">₹{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-[#f0e8e0] pb-4">
                    <span className="text-[#787373]">Estimated GST (3%)</span>
                    <span className="font-bold">₹{taxes.toLocaleString()}</span>
                  </div>
                  
                  {appliedDiscount && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between text-sm text-[#751A20] pb-2"
                    >
                      <div className="flex items-center gap-2 font-black tracking-tight">
                        <Icon icon="solar:tag-price-bold" className="animate-pulse" />
                        <span>Discount ({appliedDiscount.code})</span>
                      </div>
                      <span className="font-black">-₹{discountAmount.toLocaleString()}</span>
                    </motion.div>
                  )}
                </div>

                {/* Coupon Section */}
                <div className="pt-2 space-y-5">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="PROMO CODE" 
                      className="flex-1 rounded-xl bg-[#fcf9f6] border border-[#f0e8e0] px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#751A20] transition-colors uppercase tracking-[0.2em]"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="px-6 rounded-xl bg-[#2a1310] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {/* Available Coupons UI */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4B996]">Available Offers</p>
                    <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_COUPONS.map((coupon) => {
                        const isSelected = couponInput.toUpperCase() === coupon.code;
                        const isApplied = appliedDiscount?.code === coupon.code;
                        
                        return (
                          <button
                            key={coupon.code}
                            onClick={() => handleCouponSelection(coupon.code)}
                            className={`group flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                              isApplied 
                              ? 'border-[#751A20] bg-[#751A20]/5' 
                              : isSelected
                                ? 'border-[#D4B996] bg-[#D4B996]/5 shadow-sm'
                                : 'border-[#f0e8e0] bg-white hover:border-[#D4B996]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isApplied ? 'bg-[#751A20] text-white' : 'bg-[#fcf9f6] text-[#D4B996]'}`}>
                                <Icon icon="solar:tag-bold" width="16" />
                              </div>
                              <div>
                                <p className="text-[11px] font-black uppercase tracking-widest">{coupon.code}</p>
                                <p className="text-[10px] text-[#787373] font-medium">{coupon.label} on your purchase</p>
                              </div>
                            </div>
                            {isApplied && (
                               <Icon icon="mdi:check-circle" className="text-[#751A20]" width="18" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-[#f0e8e0]">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#787373] mb-1">Grand Total</span>
                      <AnimatePresence mode="wait">
                        <motion.span 
                          key={total}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-3xl font-bold text-[#751A20]"
                        >
                          ₹{total.toLocaleString()}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded">Tax Included</span>
                  </div>

                  <div className="flex justify-center">
                    <Link href="/checkout" className="group relative w-full sm:w-[85%] flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#751A20] py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-[#5a151a] hover:shadow-[0_10px_25px_rgba(117,26,32,0.25)] active:scale-95">
                      <Icon icon="solar:lock-password-bold" width="16" />
                      Secure Checkout
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    </Link>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-4 text-gray-300">
                    <Icon icon="logos:visa" width="28" className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default" />
                    <Icon icon="logos:mastercard" width="20" className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default" />
                    <Icon icon="logos:upi" width="28" className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-[40px] bg-white p-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#f0e8e0] min-h-[400px]"
          >
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#fcfaf8] text-[#D4B996]/30">
              <Icon icon="solar:cart-large-minimalistic-linear" width="48" />
            </div>
            <h2 className="font-serif text-3xl text-[#2a1310] mb-3">Your Bag is Empty</h2>
            <Link href="/shop" className="inline-flex items-center gap-3 rounded-full bg-[#751A20] px-10 py-4 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#5a151a]">
              Browse Collections
              <Icon icon="solar:arrow-right-bold" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
