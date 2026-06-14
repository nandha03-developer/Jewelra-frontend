'use client';

import Link from 'next/link';
import { useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!user) {
      router.push('/');
      toast.error('Please login to view your wishlist');
    }
  }, [user, router]);

  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0), 0), [items]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf8f6] pt-10 pb-20">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-[13px]">
          <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-[#751A20] transition-colors">
            <Icon icon="solar:home-2-linear" className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Icon icon="mingcute:right-line" className="w-3 h-3 text-gray-300" />
          <span className="font-bold text-gray-800">Wishlist</span>
        </nav>

        {/* Hero Section - Matching the requested design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden mb-12"
        >
          <div className="relative rounded-[40px] bg-white border border-[#f0e8e0] shadow-sm py-16 px-6 text-center overflow-hidden">
            {/* Subtle background image/pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200"
                alt="background"
                className="w-full h-full object-cover grayscale"
              />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">Wishlist</h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 px-4">
                Curate your favorite pieces. They are saved here for whenever you're ready to make
                them yours. Your choice today is your luxury tomorrow.
              </p>

              {/* Decorative accent footer matching the image style */}
              <div className="flex items-center justify-center gap-3 py-4 border-t border-[#f0e8e0] mt-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#751A20]" />
                <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-[#751A20] uppercase">
                  OUR TRUE BRILLIANCE IS YOUR SMILE
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#751A20]" />
              </div>
            </div>

            {/* Floating count badge */}
            {items.length > 0 && (
              <div className="absolute top-8 right-8 bg-[#751A20] text-white px-4 py-1.5 rounded-full text-[11px] font-bold shadow-lg">
                {items.length} {items.length === 1 ? 'Piece' : 'Pieces'}
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {items.length > 0 ? (
            <div className="grid gap-10 lg:grid-cols-[1fr,360px]">

              {/* Left — Items List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2 mb-2">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Curated Selection</h2>
                </div>

                {items.map((item: Product, index) => (
                  <motion.div
                    layout
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative flex flex-col md:flex-row gap-6 p-6 bg-white rounded-3xl border border-[#f0e8e0] shadow-sm hover:shadow-xl hover:shadow-[#751A20]/5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Left gold accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#751A20] opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Image Area */}
                    <Link href={`/product/${(item as any).slug || item._id}`} className="relative h-64 md:h-44 w-full md:w-44 rounded-2xl overflow-hidden shrink-0 block bg-[#fcf9f6] border border-gray-50">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80'}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>

                    {/* Content Area */}
                    <div className="flex flex-col flex-1 py-1">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <Link href={`/product/${(item as any).slug || item._id}`}>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#751A20] transition-colors leading-tight line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => {
                            removeItem(item._id);
                            toast.success(`Removed ${item.name}`);
                          }}
                          className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all shrink-0 active:scale-90"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-auto">
                        <span className="text-[10px] font-bold text-[#caa77a] uppercase tracking-widest bg-[#fdfaf5] px-2.5 py-1 rounded-full border border-[#f5e5d5]">
                          {typeof item.material === 'object' ? (item.material as any).name : item.material || 'Premium Material'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#fcf9f6]">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </p>
                        <button
                          onClick={() => {
                            addToCart(item);
                            removeItem(item._id);
                            toast.success('Moved to cart! 🛍️');
                          }}
                          className="flex items-center gap-2 bg-[#751A20] hover:bg-[#5a151a] px-7 py-3 rounded-2xl text-xs font-bold text-white transition-all shadow-lg shadow-[#751A20]/20 active:scale-95 group/btn"
                        >
                          <Icon icon="solar:cart-large-minimalistic-bold" className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          Move to Bag
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right — Summary Card */}
              <div className="lg:sticky lg:top-32 h-fit space-y-6">
                <div className="rounded-[32px] border border-[#f0e8e0] bg-white p-8 shadow-sm relative overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#fdf5f5] rounded-full opacity-50 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8 border-b border-[#f0e8e0] pb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#751A20] to-[#b32d36] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#751A20]/30 transform rotate-3">
                        <Icon icon="solar:user-bold" className="w-6 h-6 -rotate-3" />
                      </div>
                      <div>
                        <h2 className="text-[17px] font-bold text-gray-900">{user.name}</h2>
                        <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10">
                      <div className="flex items-center justify-between text-sm group/item">
                        <span className="text-gray-500 font-medium flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#751A20]" />
                          Saved Pieces
                        </span>
                        <span className="text-gray-900 font-bold">{items.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm group/item">
                        <span className="text-gray-500 font-medium flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#751A20]" />
                          Total Value
                        </span>
                        <span className="text-[#751A20] font-bold text-2xl">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Summary actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          items.forEach(item => addToCart(item));
                          toast.success('All items added! 🛍️');
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#751A20] to-[#9b2226] text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-[#751A20]/20 hover:shadow-[#751A20]/40 transition-all hover:-translate-y-1 active:scale-95"
                      >
                        <Icon icon="solar:bag-bold" className="w-5 h-5" />
                        Move Everything to Bag
                      </button>
                      <Link
                        href="/shop"
                        className="w-full flex items-center justify-center gap-2 bg-[#fdf5f5] text-[#751A20] border border-[#f0ddd8] px-6 py-4 rounded-2xl text-sm font-bold hover:bg-[#751A20] hover:text-white transition-all duration-300 group/discover"
                      >
                        <Icon icon="solar:star-linear" className="w-4 h-4" />
                        Continue Discovery
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Secure Shopping Badge */}
                <div className="px-6 py-4 rounded-2xl bg-[#fdfbf9] border border-[#f5eeea] flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icon icon="solar:shield-check-linear" className="w-5 h-5 text-[#caa77a]" />
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    All prices are verified and <span className="text-gray-800 font-bold">Safe Shopping</span> guaranteed for your curation.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[40px] border border-dashed border-[#d5c5b5] max-w-2xl mx-auto shadow-sm"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-[#fdf5f5] rounded-full flex items-center justify-center text-[#751A20] shadow-inner ring-8 ring-[#fdfcfb]">
                  <Icon icon="pepicons-pop:list-off" className="w-12 h-12" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-[#caa77a] rounded-full flex items-center justify-center text-white text-[10px] shadow-lg border-2 border-white"
                >
                  <Icon icon="solar:star-bold" className="w-3 h-3" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-serif text-gray-900 mb-4">Your wishlist is lonely</h2>
              <p className="text-gray-500 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
                You haven't bookmarked any pieces yet. Explore our exquisite collections and find the perfect match for you.
              </p>
              <Link
                href="/shop"
                className="flex items-center gap-3 bg-[#751A20] hover:bg-[#5a151a] px-10 py-4 rounded-full text-sm font-bold text-white transition-all shadow-xl shadow-[#751A20]/30 hover:-translate-y-1 active:scale-95 group/btn"
              >
                <span>Find Your Sparkle</span>
                <Icon icon="solar:arrow-right-linear" className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
