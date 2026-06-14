'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import type { Category, SubCategory } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useCompareStore } from '@/store/compareStore';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import Image from "next/image";

interface NavbarProps {
  categories: Category[];
  subcategories: SubCategory[];
}

const CATEGORY_ICONS: Record<string, string> = {
  'all jewellery': 'mdi:necklace',
  gold: 'bx:coin-stack',
  diamond: 'mdi:diamond-outline',
  earrings: 'mdi:earbuds-outline',
  rings: 'mdi:ring',
  'daily wear': 'mdi:clock-outline',
  gemstone: 'mdi:octagram-outline',
  wedding: 'mdi:account-group-outline',
  gifting: 'mdi:gift-outline',
  more: 'mdi:filter-variant',
};

const PROMO_IMAGES = [
  "https://images.unsplash.com/photo-1599643477874-ce4eb87fe016?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop"
];

export default function Navbar({ categories, subcategories }: NavbarProps) {
  const [shadow, setShadow] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [arrowRightOffset, setArrowRightOffset] = useState(68);
  const [isListening, setIsListening] = useState(false);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cartCount = useCartStore((state) => state.items.length);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { openCartDrawer, openHistoryDrawer } = useUIStore();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const { user, logout, token, setUser } = useAuthStore();

  // 1. Initial Data Fetching (Products & Hydration)
  useEffect(() => {
    import('@/utils/api').then(api => {
      api.getProducts().then(setProducts);
    });
    setIsHydrated(true);
  }, []);

  // 2. Luxury Profile Synchronization (Session Recovery)
  useEffect(() => {
    const recoverSession = async () => {
      if (!isHydrated || !token) return;

      // If we have a token but either no user OR no avatar, force a profile refresh
      if (!user?._id || !user?.avatar) {
        // console.log('Navbar: Synchronizing luxury credentials...');
        try {
          const response = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            const profile = data.user || data;

            if (profile) {
              const updatedUser = {
                ...user,
                _id: profile._id || profile.id,
                id: profile.id || profile._id,
                name: profile.name || user?.name || 'Member',
                email: profile.email || user?.email || '',
                phone: profile.phone || user?.phone || '',
                avatar: profile.avatar || profile.image || profile.profileImage || user?.avatar,
                isAdmin: profile.isAdmin ?? user?.isAdmin
              };

              if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
                setUser(updatedUser as any);
                // console.log('Navbar: Luxury profile synchronized.');
              }
            }
          }
        } catch (error) {
          console.error('Navbar: Profile sync failed:', error);
        }
      }
    };

    recoverSession();
  }, [token, user?.avatar, user?._id, isHydrated, setUser]);

  const slugify = (str: string) => str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const lastUserRef = useRef<string | null>(null);

  // Handle user-specific data persistence (Cart & Wishlist)
  useEffect(() => {
    if (!isHydrated) return;

    const currentUserId = user?.email || 'guest';

    // When user switches (Login/Logout/Switch) or on Initial Mount
    if (lastUserRef.current !== currentUserId) {
      // 1. ARCHIVE the previous user's data ONLY if it wasn't a guest logging in AND not the initial mount
      if (lastUserRef.current !== null && lastUserRef.current !== 'guest') {
        const prevKey = `jewelra_user_data_${lastUserRef.current}`;
        localStorage.setItem(`${prevKey}_cart`, JSON.stringify(useCartStore.getState().items));
        localStorage.setItem(`${prevKey}_wishlist`, JSON.stringify(useWishlistStore.getState().items));
      }

      // 2. LOAD the current user's data
      const newKey = `jewelra_user_data_${currentUserId}`;
      const savedCart = localStorage.getItem(`${newKey}_cart`);
      const savedWishlist = localStorage.getItem(`${newKey}_wishlist`);

      if (currentUserId !== 'guest') {
        // If we found saved data for this specific user, load it
        if (savedCart) {
          try {
            const items = JSON.parse(savedCart);
            if (items.length > 0) useCartStore.getState().setItems(items);
          } catch (e) { }
        }
        if (savedWishlist) {
          try {
            const items = JSON.parse(savedWishlist);
            if (items.length > 0) useWishlistStore.getState().setItems(items);
          } catch (e) { }
        }
        // If NO saved data found or empty, we keep the guest items (Standard migration flow)
      } else if (lastUserRef.current !== null) {
        // If logging out to guest from a real user, clear the stores to start fresh for the next session
        useCartStore.getState().clearCart();
        useWishlistStore.getState().clearWishlist();
      }

      lastUserRef.current = currentUserId;
    }
  }, [user?.email, isHydrated]);

  useEffect(() => {
    const handleScroll = () => setShadow(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    setShowAuthModal(false);
    toast.success('Successfully logged out from Jewelra');
    router.push('/');
  };

  const getUserInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setShowSearchModal(true);
      toast.success(`Searching for "${transcript}"`);
    };

    recognition.onerror = () => {
      toast.error('Could not hear you. Please try again.');
      setIsListening(false);
    };

    recognition.start();
  };

  const handleImageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info('Analyzing image for visual match...', { icon: '🔍' });
      // In a real app, you'd upload this to an AI vision API
      setTimeout(() => {
        toast.success(`Found matching ${file.name.split('.')[0]} designs!`);
      }, 2000);
    }
  };

  // Ensure "All Jewellery" is handled
  const topCategories = useMemo(() => {
    const reversedCategories = [...categories].reverse();
    return reversedCategories.slice(0, 10);
  }, [categories]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${shadow ? 'shadow-md shadow-[#751A20]/5' : ''}`}
    >
      {/* --- TOP ROW: LOGO, SEARCH, ICONS --- */}
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 lg:px-8 py-3">
        {/* Left Section: Mobile Menu + Logo */}
        <div className="flex items-center gap-2 lg:gap-0">
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-[#751A20] mr-2"
            suppressHydrationWarning
          >
            <Icon icon={mobileOpen ? 'mdi:close' : 'mdi:menu'} className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href={"/" as any} className="flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dtusyew0a/image/upload/v1775636830/Gemini_Generated_Image_d3hdiid3hdiid3hd-Photoroom_dpe9mh.png"
              alt="Jewelra"
              className="h-10 lg:h-[72px] w-auto object-contain transform origin-left"
            />
          </Link>
        </div>

        {/* Search Bar - redesigned as per user request */}
        <div className={`hidden lg:flex flex-1 max-w-[500px] mx-8 relative transition-all duration-300 ${showSearchModal ? 'z-[200]' : 'z-10'}`}>
          <div className={`relative w-full flex items-center border border-[#e5d5d5] h-11 px-4 transition-all shadow-sm ${showSearchModal ? 'bg-white rounded-t-2xl border-b-white focus-within:ring-0' : 'bg-[#fcf9f6] rounded-full focus-within:ring-1 focus-within:ring-[#751A20] focus-within:bg-white'}`}>
            <Icon icon="mdi:magnify" className="w-5 h-5 text-[#751A20] mr-2" />
            <input
              type="text"
              placeholder="Search for gold necklace"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!showSearchModal) setShowSearchModal(true);
              }}
              onFocus={() => setShowSearchModal(true)}
              className="w-full h-full bg-transparent border-none !border-none outline-none shadow-none text-sm text-gray-800 placeholder-gray-400"
              suppressHydrationWarning
            />
            <div className="flex items-center gap-3 ml-2 border-l border-[#e5d5d5] pl-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSearch}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="hover:scale-110 transition-transform active:scale-95"
                title="Search by Image"
              >
                <Icon icon="solar:camera-linear" className="w-5 h-5 text-gray-400 hover:text-[#751A20]" />
              </button>
              <button
                onClick={handleVoiceSearch}
                className={`hover:scale-110 transition-transform active:scale-95 ${isListening ? 'animate-pulse text-[#751A20]' : ''}`}
                title="Voice Search"
              >
                <Icon icon={isListening ? "solar:microphone-bold" : "solar:microphone-linear"} className={`w-5 h-5 ${isListening ? 'text-[#751A20]' : 'text-gray-400 hover:text-[#751A20]'}`} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showSearchModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSearchModal(false)}
                  className="fixed inset-0 bg-transparent z-[99]"
                />
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  className="absolute left-0 top-full -mt-[1px] w-full bg-white border border-[#e5d5d5] border-t-0 shadow-2xl rounded-b-2xl overflow-hidden z-[100] flex flex-col"
                >
                  <div className="p-7 max-h-[70vh] overflow-y-auto">
                    {/* Section 1: Search Results */}
                    {searchTerm.length > 1 ? (
                      <div>
                        <h4 className="text-[13px] text-gray-500 mb-4 font-medium flex items-center justify-between">
                          Search Results
                          <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded-full">{products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length} items</span>
                        </h4>
                        <div className="space-y-4">
                          {products
                            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .slice(0, 6)
                            .map((prod) => (
                              <Link
                                key={prod._id}
                                href={`/product/${prod._id}`}
                                onClick={() => setShowSearchModal(false)}
                                className="flex items-center gap-4 group hover:bg-[#fffcf7] p-2 -m-2 rounded-2xl transition-all"
                              >
                                <div className="w-16 h-16 relative rounded-xl overflow-hidden border border-[#f0e8e0] shrink-0 bg-[#f9f9f9]">
                                  <img src={prod.image || prod.images?.[0]} alt={prod.name} className="object-contain w-full h-full transition-transform group-hover:scale-110 p-1" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#751A20] transition-colors truncate">{prod.name}</p>
                                  <p className="text-[12px] text-[#751A20] font-semibold">₹{prod.price.toLocaleString()}</p>
                                </div>
                                <Icon icon="mdi:chevron-right" className="text-gray-300 group-hover:text-[#751A20] transition-colors" />
                              </Link>
                            ))}
                          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                            <div className="text-center py-6">
                              <Icon icon="solar:sad-square-linear" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No matching designs found.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Section 1: Popular Searches */}
                        <div className="mb-8">
                          <h4 className="text-[13px] text-gray-500 mb-4 font-medium">Popular Jewelleries</h4>
                          <div className="flex flex-wrap gap-2.5">
                            {['Gold Necklace', 'Diamond Ring', 'Bangles', 'Earrings'].map((tag) => (
                              <button
                                key={tag}
                                onClick={() => setSearchTerm(tag)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#f0e8e0] rounded-xl text-[13px] text-gray-700 hover:border-[#751A20] hover:text-[#751A20] transition-all"
                              >
                                <Icon icon="mdi:magnify" className="w-4 h-4 text-gray-400" />
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Section 2: Trending Products */}
                        <div>
                          <h4 className="text-[13px] text-gray-500 mb-4 font-medium">Trending Masterpieces</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {products.filter(p => p.isPopular).slice(0, 3).length > 0 ? (
                              products.filter(p => p.isPopular).slice(0, 3).map((prod) => (
                                <Link
                                  key={prod._id}
                                  href={`/product/${prod._id}`}
                                  onClick={() => setShowSearchModal(false)}
                                  className="group"
                                >
                                  <div className="aspect-square relative rounded-2xl overflow-hidden mb-3 border border-[#f0e8e0] bg-[#f9f9f9]">
                                    <img src={prod.image} alt={prod.name} className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110 p-2" />
                                  </div>
                                  <p className="text-[12px] font-bold text-gray-800 leading-snug group-hover:text-[#751A20] transition-colors line-clamp-2">
                                    {prod.name}
                                  </p>
                                </Link>
                              ))
                            ) : (
                              products.slice(0, 3).map((prod) => (
                                <Link
                                  key={prod._id}
                                  href={`/product/${prod._id}`}
                                  onClick={() => setShowSearchModal(false)}
                                  className="group"
                                >
                                  <div className="aspect-square relative rounded-2xl overflow-hidden mb-3 border border-[#f0e8e0] bg-[#f9f9f9]">
                                    <img src={prod.image} alt={prod.name} className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110 p-2" />
                                  </div>
                                  <p className="text-[12px] font-bold text-gray-800 leading-snug group-hover:text-[#751A20] transition-colors line-clamp-2">
                                    {prod.name}
                                  </p>
                                </Link>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>


                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Right Icons: User, Wishlist, Cart, History, Store */}
        <div className="flex items-center gap-3.5 lg:gap-6 text-[#751A20]">
          {/* 1. USER ACCOUNT (FIRST) */}
          <div className="relative">
            <button
              ref={profileBtnRef}
              onClick={() => {
                if (profileBtnRef.current) {
                  const rect = profileBtnRef.current.getBoundingClientRect();
                  const btnCenter = rect.left + rect.width / 2;
                  const modalRightEdge = window.innerWidth - 16;
                  setArrowRightOffset(modalRightEdge - btnCenter);
                }
                setShowAuthModal(!showAuthModal);
              }}
              className="relative flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white border border-[#f4e8e7] shadow-sm ring-1 ring-[#751A20]/10 transition-transform duration-300 hover:scale-110"
              suppressHydrationWarning
            >
              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-[#fff4f4] to-transparent opacity-90 blur-sm" />
              {isHydrated && user ? (
                user.avatar ? (
                  <div className="relative z-10 w-7 h-7 lg:w-9 lg:h-9 rounded-full overflow-hidden border border-[#751A20]/20 bg-white shadow-sm shadow-[#751A20]/10">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative z-10 w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-[#fff5f5] flex items-center justify-center text-[#751A20] font-bold text-[10px] lg:text-[11px] border border-[#751A20]/15 shadow-sm shadow-[#751A20]/5">
                    {getUserInitials(user.name)}
                  </div>
                )
              ) : (
                <Icon icon="solar:user-linear" className="relative z-10 w-[20px] h-[20px] lg:w-[22px] lg:h-[22px] text-[#751A20]" />
              )}
            </button>

            <AnimatePresence>
              {showAuthModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAuthModal(false)}
                    className="fixed inset-0 z-[90] bg-black/20 lg:hidden"
                  />

                  {/* Mobile modal: fixed below navbar, centered on screen */}
                  <div
                    className="lg:hidden fixed z-[200]"
                    style={{ top: '118px', left: '16px', right: '16px' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      style={{ transformOrigin: 'top right' }}
                      className="relative rounded-[28px] border border-[#f0e8e0] bg-white p-6 shadow-2xl"
                    >
                      {/* Arrow on right side pointing to profile icon */}
                      <div className="absolute -top-2 h-4 w-4 rotate-45 bg-white border-l border-t border-[#f0e8e0]" style={{ right: `${arrowRightOffset - 8}px` }} />

                      {isHydrated && user ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fff4f4] to-[#f7eded] text-[#751A20] flex items-center justify-center border border-[#f7d6d7] overflow-hidden flex-shrink-0 shadow-[0_15px_30px_rgba(117,26,32,0.12)]">
                              {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                              ) : (
                                <span className="text-xl font-bold">{getUserInitials(user.name)}</span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                              <p className="text-[#751A20] text-[9px] font-bold tracking-[0.15em] mb-1">ACCOUNT</p>
                              <p className="text-gray-900 font-bold text-sm leading-tight truncate">{user.name}</p>
                              <p className="text-gray-400 text-[11px] mt-1 truncate">{user.email}</p>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#f0e8e0] to-transparent" />

                          <div className="space-y-2">
                            <Link
                              href="/profile"
                              onClick={() => setShowAuthModal(false)}
                              className="w-full h-10 bg-[#751A20] text-white flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#5a151a] hover:shadow-lg transition-all duration-300"
                            >
                              <Icon icon="mdi:user-circle-outline" className="w-4 h-4" />
                              View Profile
                            </Link>
                            <Link
                              href="/services/track-order"
                              onClick={() => setShowAuthModal(false)}
                              className="w-full h-10 bg-[#faf6f4] text-[#751A20] flex items-center justify-center gap-2 rounded-xl text-xs font-bold border border-[#f0e8e0] hover:bg-[#f0e8e0] transition-all"
                            >
                              <Icon icon="solar:delivery-bold" className="w-4 h-4" />
                              Track Orders
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full h-10 bg-[#faf6f4] text-[#751A20] flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#f0e8e0] hover:shadow-md transition-all duration-300"
                              suppressHydrationWarning
                            >
                              <Icon icon="mdi:logout" className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#fdf5f5] to-[#f7eded] text-[#751A20] rounded-2xl flex items-center justify-center border-2 border-[#751A20]/15 flex-shrink-0 shadow-sm">
                              <Icon icon="solar:user-circle-bold" className="w-8 h-8" />
                            </div>

                            <div className="flex-1 pt-1">
                              <p className="text-[#751A20] text-[9px] font-bold tracking-[0.15em] mb-1">SIGN IN</p>
                              <p className="text-gray-900 font-bold text-sm leading-tight">Jewelra Elite</p>
                              <p className="text-gray-400 text-[11px] mt-1">Exclusive collections await</p>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#f0e8e0] to-transparent" />

                          <div className="space-y-2">
                            <Link
                              href="/auth/login"
                              onClick={() => setShowAuthModal(false)}
                              className="w-full h-10 bg-[#751A20] text-white flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#5a151a] hover:shadow-lg transition-all duration-300"
                            >
                              <Icon icon="mdi:login" className="w-4 h-4" />
                              Sign In
                            </Link>
                            <Link
                              href="/auth/signup"
                              onClick={() => setShowAuthModal(false)}
                              className="w-full h-10 bg-[#faf6f4] text-[#751A20] flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#f0e8e0] hover:shadow-md transition-all duration-300 border border-[#eee]"
                            >
                              <Icon icon="mdi:account-plus" className="w-4 h-4" />
                              Sign Up
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Wrapper div: centers the modal horizontally under the profile icon button */}
                  <div
                    className="hidden lg:block absolute top-full mt-3 z-[100]"
                    style={{ left: '50%', transform: 'translateX(-50%)' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      style={{ transformOrigin: 'top center' }}
                      className="relative w-80 bg-gradient-to-br from-white to-[#fcf7f6] border border-[#f0e8e0] shadow-[0_30px_60px_rgba(117,26,32,0.16)] rounded-[32px] p-6 backdrop-blur-sm"
                    >
                      {/* Arrow centered under profile icon */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 bg-white border-l border-t border-[#f0e8e0] rotate-45" />

                      {isHydrated && user ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fdf5f5] to-[#f7eded] text-[#751A20] flex items-center justify-center border-2 border-[#751A20]/15 overflow-hidden flex-shrink-0 shadow-sm">
                              {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                              ) : (
                                <span className="text-xl font-bold">{getUserInitials(user.name)}</span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                              <p className="text-[#751A20] text-[9px] font-bold tracking-[0.15em] mb-1">ACCOUNT</p>
                              <p className="text-gray-900 font-bold text-sm leading-tight truncate">{user.name}</p>
                              <p className="text-gray-400 text-[11px] mt-1 truncate">{user.email}</p>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#f0e8e0] to-transparent" />

                          <div className="space-y-2">
                            <Link
                              href="/profile"
                              onClick={() => setShowAuthModal(false)}
                              className="w-full h-10 bg-[#751A20] text-white flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#5a151a] hover:shadow-lg transition-all duration-300"
                            >
                              <Icon icon="mdi:user-circle-outline" className="w-4 h-4" />
                              View Profile
                            </Link>
                            <Link
                              href="/services/track-order"
                              onClick={() => setShowAuthModal(false)}
                              className="w-full h-10 bg-white border border-[#f0e8e0] text-[#751A20] flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#faf6f4] transition-all"
                            >
                              <Icon icon="solar:delivery-bold" className="w-4 h-4" />
                              Track Orders
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full h-10 bg-[#faf6f4] text-[#751A20] flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#f0e8e0] hover:shadow-md transition-all duration-300"
                              suppressHydrationWarning
                            >
                              <Icon icon="mdi:logout" className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#fdf5f5] to-[#f7eded] text-[#751A20] rounded-2xl flex items-center justify-center border-2 border-[#751A20]/15 flex-shrink-0 shadow-sm">
                              <Icon icon="solar:user-circle-bold" className="w-8 h-8" />
                            </div>

                            <div className="flex-1 pt-1">
                              <p className="text-[#751A20] text-[9px] font-bold tracking-[0.15em] mb-1">SIGN IN</p>
                              <p className="text-gray-900 font-bold text-sm leading-tight">Jewelra Elite</p>
                              <p className="text-gray-400 text-[11px] mt-1">Exclusive collections await</p>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#f0e8e0] to-transparent" />

                          <div className="space-y-2">
                            <Link
                              href="/auth/login"
                              onClick={() => setShowAuthModal(false)}
                              className="w-full h-10 bg-[#751A20] text-white flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#5a151a] hover:shadow-lg transition-all duration-300"
                            >
                              <Icon icon="mdi:login" className="w-4 h-4" />
                              Sign In
                            </Link>
                            <Link
                              href="/auth/signup"
                              onClick={() => setShowAuthModal(false)}
                              className="w-full h-10 bg-[#faf6f4] text-[#751A20] flex items-center justify-center gap-2 rounded-xl text-xs font-bold hover:bg-[#f0e8e0] hover:shadow-md transition-all duration-300 border border-[#eee]"
                            >
                              <Icon icon="mdi:account-plus" className="w-4 h-4" />
                              Sign Up
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* 2. WISHLIST */}
          <button
            onClick={() => {
              if (user) {
                router.push('/wishlist');
              } else {
                setShowAuthModal(true);
              }
            }}
            className="flex items-center hover:scale-110 transition-transform relative cursor-pointer"
            suppressHydrationWarning
          >
            <Icon icon="solar:heart-linear" className="w-[22px] h-[22px] lg:w-[26px] lg:h-[26px]" />
            {isHydrated && user && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 lg:-top-1.5 lg:-right-2.5 bg-[#751A20] text-white text-[7px] lg:text-[9px] min-w-[14px] h-[14px] lg:min-w-[17px] lg:h-[17px] rounded-full flex items-center justify-center px-1 font-bold border-2 border-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 3. CART */}
          <button
            onClick={openCartDrawer}
            className="flex relative items-center hover:scale-110 transition-transform"
            suppressHydrationWarning
          >
            <Icon icon="clarity:shopping-bag-line" className="w-[22px] h-[22px] lg:w-[26px] lg:h-[26px]" />
            <span className="absolute -top-1 -right-1.5 lg:-top-1.5 lg:-right-2.5 bg-[#751A20] text-white text-[7px] lg:text-[9px] min-w-[14px] h-[14px] lg:min-w-[19px] lg:h-[19px] rounded-full flex items-center justify-center font-bold border-2 border-white">
              {cartCount}
            </span>
          </button>

          {/* 4. HISTORY (RECENTLY VIEWED) - LOGGED IN ONLY */}
          {isHydrated && user && (
            <button
              onClick={openHistoryDrawer}
              className="flex items-center hover:scale-110 transition-transform relative cursor-pointer"
              title="Recently Viewed"
            >
              <Icon icon="material-symbols-light:tab-recent-outline" className="w-[26px] h-[26px] lg:w-[30px] lg:h-[30px]" />
            </button>
          )}

          {/* 5. STORE LOCATOR (LAST) */}
          <Link
            href="/store-locator"
            className="hidden lg:flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 transition-all duration-300 hover:scale-110 group"
            title="Our Stores"
          >
            <Icon
              icon="solar:shop-2-linear"
              className="w-[22px] h-[22px] lg:w-[26px] lg:h-[26px] transition-colors duration-300 group-hover:text-[#9b2226]"
            />
          </Link>
        </div>
      </div>

      {/* End-to-end separator line */}
      <div className="hidden lg:block w-full border-b border-[#f0e8e0]" />

      {/* --- BOTTOM ROW: CATEGORIES --- */}
      <div className="hidden lg:flex mx-auto max-w-[1400px] w-full px-4 items-center justify-center gap-10 pt-2 pb-3 relative">
        {topCategories.map((cat, index) => {
          const iconName = CATEGORY_ICONS[cat.name.toLowerCase()] || 'mdi:diamond-stone';
          const isHovered = hoveredCategory === cat._id;

          // Use real subcategories if they match, else generate a fake rich layout
          const catSubs = subcategories?.filter(sub => {
            if (cat._id === 'all') return true;
            const subCatId = typeof sub.category === 'object' && sub.category !== null
              ? sub.category._id
              : sub.category;
            return subCatId === cat._id;
          }) || [];
          const defaultSubs = [
            { _id: `sub1-${cat._id}`, name: `All ${cat.name}`, image: undefined },
            { _id: `sub2-${cat._id}`, name: `${cat.name} Earrings`, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&q=80" },
            { _id: `sub3-${cat._id}`, name: `${cat.name} Rings`, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&q=80" },
            { _id: `sub4-${cat._id}`, name: `${cat.name} Nose Pins`, image: undefined },
            { _id: `sub5-${cat._id}`, name: `${cat.name} Bangles`, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&q=80" },
            { _id: `sub6-${cat._id}`, name: `${cat.name} Chains`, image: undefined },
            { _id: `sub7-${cat._id}`, name: `${cat.name} Engagement Rings`, image: undefined },
            { _id: `sub8-${cat._id}`, name: `${cat.name} Kadas`, image: undefined },
            { _id: `sub9-${cat._id}`, name: `${cat.name} Bracelets`, image: "https://images.unsplash.com/photo-1611085583191-a3b1588666f1?w=100&q=80" },
            { _id: `sub10-${cat._id}`, name: `${cat.name} Pendants`, image: undefined },
            { _id: `sub11-${cat._id}`, name: `${cat.name} Necklaces`, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&q=80" },
            { _id: `sub12-${cat._id}`, name: `${cat.name} Mangalsutras`, image: undefined },
          ];
          const displaySubs = catSubs.length >= 6 ? catSubs.slice(0, 12) : defaultSubs;

          return (
            <div
              key={cat._id}
              className="group static"
              onMouseEnter={() => setHoveredCategory(cat._id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >

              <Link
                href={(cat.name.toLowerCase() === 'home' ? '/' : `/shop/${slugify(cat.name)}`) as any}
                onClick={() => setHoveredCategory(null)}
                className={`flex items-center gap-2.5 pb-2 -mb-2 transition-colors ${isHovered
                  ? "text-[#751A20]"
                  : "text-gray-600 hover:text-[#751A20]"
                  }`}
              >
                {cat.image ? (
                  <div className={`w-[22px] h-[22px] relative flex items-center justify-center transition-transform ${isHovered ? 'scale-110' : ''}`}>
                    <Image
                      src={cat.image}
                      alt={cat.displayName || cat.name}
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Icon icon={iconName} className={`w-[22px] h-[22px] ${isHovered ? 'scale-110 transition-transform' : ''}`} />
                )}
                <div className="relative">
                  <span className="whitespace-nowrap text-[14px] font-medium tracking-tight">
                    {(cat.displayName || cat.name).charAt(0).toUpperCase() + (cat.displayName || cat.name).slice(1).toLowerCase()}
                  </span>
                  {isHovered && (
                    <motion.div layoutId="nav-line" className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#751A20]" />
                  )}
                </div>
              </Link>

              {/* MEGA MENU AS SHOWN IN IMAGE */}
              <AnimatePresence>
                {isHovered && index !== 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 w-full bg-white border border-[#f0e8e0] shadow-2xl z-50 flex"
                    style={{ minHeight: '440px' }}
                  >
                    {/* Left Content Area - Subcategories and Banner */}
                    <div className="w-full flex flex-col">
                      <div className="flex flex-1">
                        {/* Subcategories grid area */}
                        <div className="w-[70%] p-8 flex flex-col">
                          <div className="grid grid-cols-3 gap-y-4 pr-8 border-r border-[#f0e8e0] flex-1 min-h-[300px] relative items-center content-center">
                            {/* Vertical Lines for Columns - positioned at percentages for exact center */}
                            <div className="absolute left-[33.33%] top-4 bottom-4 w-[1px] bg-[#f0e8e0]" />
                            <div className="absolute left-[66.66%] top-4 bottom-4 w-[1px] bg-[#f0e8e0]" />

                            {displaySubs.map((sub) => (
                              <div key={sub._id} className="flex justify-center w-full px-6">
                                <Link
                                  href={`/shop/${slugify(cat.name)}/${slugify(sub.name)}` as any}
                                  onClick={() => setHoveredCategory(null)}
                                  className="flex items-center gap-4 group/item hover:bg-[#fffcf7] rounded-xl py-2 px-6 transition-all duration-300 w-[260px] h-[52px]"
                                >
                                  {/* 👉 image/icon circle */}
                                  <div className="w-[38px] h-[38px] rounded-full bg-white border border-transparent flex-shrink-0 flex items-center justify-center text-[#d1bfae] group-hover/item:border-2 group-hover/item:border-[#3d1a11] transition-all duration-300 overflow-hidden shadow-sm">
                                    {sub.image ? (
                                      <img
                                        src={sub.image}
                                        alt={sub.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                                      />
                                    ) : (
                                      <Icon
                                        icon={
                                          CATEGORY_ICONS[
                                          sub.name.split(" ").pop()?.toLowerCase() || ""
                                          ] || "mdi:ring"
                                        }
                                        className="w-[18px] h-[18px]"
                                      />
                                    )}
                                  </div>

                                  {/* 👉 text */}
                                  <span className="text-[14px] font-semibold text-gray-800 group-hover/item:text-[#751A20] transition-colors duration-300 whitespace-nowrap">
                                    {(sub as any).displayName || sub.name}
                                  </span>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right Side Promo Image Area */}
                        <div className="w-[30%] p-8 pl-0 flex flex-col">
                          <div className="relative flex-1 rounded-[24px] overflow-hidden group/promo cursor-pointer border border-[#f0e8e0]">
                            <img
                              src={
                                cat.name.toLowerCase().includes('gold')
                                  ? "https://res.cloudinary.com/dtusyew0a/image/upload/v1776004944/gold_nav_im3lr3.png"
                                  : cat.name.toLowerCase().includes('diamond')
                                    ? "https://res.cloudinary.com/dtusyew0a/image/upload/v1776007740/1737205084_72879403b5afb9423237_vbyehj.jpg"
                                    : cat.name.toLowerCase().includes('silver')
                                      ? "https://res.cloudinary.com/dtusyew0a/image/upload/v1776008401/silver-jewellery-set_k9vryw.jpg"
                                      : (cat.name.toLowerCase().includes('coin') || cat.name.toLowerCase().includes('bar'))
                                        ? "https://res.cloudinary.com/dtusyew0a/image/upload/v1776008718/1680026223-3258-Picsart-AiImageEnhancer_rctbtw.png"
                                        : cat.name.toLowerCase().includes('more')
                                          ? "https://res.cloudinary.com/dtusyew0a/image/upload/v1776009047/10-essential-jewellery-pieces_1_ohna0y.png"
                                          : PROMO_IMAGES[index % PROMO_IMAGES.length]
                              }
                              alt={`${cat.displayName || cat.name} masterpiece`}
                              className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 group-hover/promo:scale-110"
                            />
                            {/* Gradient Overlay for better text visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Image Content */}
                            <div className="absolute inset-x-0 bottom-0 p-8 pt-20 text-white flex flex-col justify-end">
                              <h3 className="text-[20px] font-serif font-bold leading-tight mb-4 drop-shadow-md">
                                {cat.name.toLowerCase().includes('gold')
                                  ? 'Timeless Heritage. Discover our handcrafted gold masterpieces for every occasion.'
                                  : cat.name.toLowerCase().includes('diamond')
                                    ? 'Brilliance Redefined. Exquisite diamond jewellery that captures your inner light.'
                                    : cat.name.toLowerCase().includes('silver')
                                      ? 'Elegant Simplicity. Contemporary silver designs that add a touch of grace.'
                                      : (cat.name.toLowerCase().includes('coin') || cat.name.toLowerCase().includes('bar'))
                                        ? 'Secure Your Future. Pure 24K gold coins and bars for lasting investment.'
                                        : cat.name.toLowerCase().includes('more')
                                          ? 'Your Everyday Sparkle. Explore our diverse collection of unique pieces.'
                                          : 'Intricately handcrafted masterpieces for the women who inspire new narratives.'
                                }
                              </h3>
                              <div className="flex items-center text-white text-sm font-medium border-b border-white max-w-fit pb-1 group-hover/promo:text-[#ebd5bd] group-hover/promo:border-[#ebd5bd] transition-colors">
                                Explore Now
                                <Icon icon="mdi:arrow-top-right" className="ml-1 w-4 h-4 transition-transform group-hover/promo:-translate-y-0.5 group-hover/promo:translate-x-0.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Mini Promotional Banner - Full Width */}
                      <div className="px-8 pb-8 pt-0">
                        <div className="mt-0 pt-6 border-t border-[#f0e8e0] w-full">
                          <div className="flex items-center justify-between bg-[#fdfaf5] rounded-[24px] p-4 border border-[#f0e8e0]">
                            <div className="flex items-center gap-5">
                              {/* Image stacks */}
                              <div className="flex pl-2">
                                <div className="w-[52px] h-[52px] bg-white rounded-xl shadow-sm text-center flex items-center justify-center rotate-[-5deg] border border-[#f2e6e6] z-10 hover:rotate-0 transition-transform">
                                  <Icon icon="mdi:ring" className="w-8 h-8 text-[#caa77a]" />
                                </div>
                                <div className="w-[52px] h-[52px] bg-[#2a1310] rounded-xl -ml-4 border-2 border-[#fdfaf5] text-center flex items-center justify-center rotate-[5deg] z-20 hover:rotate-0 transition-transform">
                                  <Icon icon="mdi:necklace" className="w-8 h-8 text-white" />
                                </div>
                              </div>
                              <div>
                                <p className="text-[15px] font-bold text-gray-900 mb-0.5">From Classic to Contemporary.</p>
                                <p className="text-[13px] text-gray-500 font-medium mb-0">Explore 6000+ Stunning Designs.</p>
                              </div>
                            </div>
                            <Link
                              href={`/shop/${slugify(cat.name)}` as any}
                              onClick={() => setHoveredCategory(null)}
                              className="bg-[#751A20] text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-[#5b1419] transition-colors shadow-sm"
                              suppressHydrationWarning
                            >
                              View All
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* --- MOBILE NAVIGATION PANEL --- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-[#f2e6e6] overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              <div className="relative mb-4">
                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-[#f8f5f1] border border-[#e5d5d5] rounded-full h-11 px-10 text-sm outline-none focus:border-[#751A20]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    if (user) {
                      router.push('/wishlist');
                    } else {
                      setShowAuthModal(true);
                    }
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 bg-[#f8f5f1] py-3.5 rounded-xl text-[12px] font-bold text-gray-800 transition-all active:scale-95 relative"
                >
                  <div className="relative">
                    <Icon icon="solar:heart-linear" className="w-5 h-5 text-[#751A20]" />
                    {isHydrated && user && wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-[#751A20] text-white text-[8px] min-w-[15px] h-[15px] rounded-full flex items-center justify-center font-bold border border-white">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  Wishlist
                </button>
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex flex-col items-center justify-center gap-1.5 bg-[#f8f5f1] py-3.5 rounded-xl text-[12px] font-bold text-gray-800 transition-all active:scale-95">
                  <Icon icon="solar:user-circle-linear" className="w-5 h-5 text-[#751A20]" />
                  Profile
                </Link>
                <Link href="/store-locator" onClick={() => setMobileOpen(false)} className="flex flex-col items-center justify-center gap-1.5 bg-[#f8f5f1] py-3.5 rounded-xl text-[12px] font-bold text-gray-800 transition-all active:scale-95">
                  <Icon icon="solar:shop-2-linear" className="w-5 h-5 text-[#751A20]" />
                  Stores
                </Link>
                {isHydrated && user && (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openHistoryDrawer();
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 bg-[#f8f5f1] py-3.5 rounded-xl text-[12px] font-bold text-gray-800 transition-all active:scale-95"
                  >
                    <Icon icon="solar:history-linear" className="w-5 h-5 text-[#751A20]" />
                    History
                  </button>
                )}
              </div>

              <div className="flex flex-col border border-[#f0e8e0] rounded-2xl overflow-hidden bg-white shadow-sm">
                {topCategories.map((cat, i) => {
                  const isExpanded = expandedMobileCategory === cat._id;
                  const catSubs = subcategories?.filter(sub => {
                    if (cat._id === 'all') return false;
                    const subCatId = typeof sub.category === 'object' && sub.category !== null
                      ? sub.category._id
                      : sub.category;
                    return subCatId === cat._id;
                  }) || [];

                  const hasSubs = catSubs.length > 0;

                  return (
                    <div key={cat._id} className={i !== topCategories.length - 1 ? 'border-b border-[#f0e8e0]' : ''}>
                      <div className="flex items-center justify-between">
                        <Link
                          href={cat.name.toLowerCase() === 'home' ? '/' : `/shop/${slugify(cat.name)}` as any}
                          onClick={() => setMobileOpen(false)}
                          className="flex-1 flex items-center gap-3 px-5 py-4 text-sm font-bold text-gray-800 transition-colors hover:bg-[#f8f5f1]"
                        >
                          {cat.image ? (
                            <Image
                              src={cat.image}
                              alt={cat.displayName || cat.name}
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          ) : (
                            <Icon icon={CATEGORY_ICONS[cat.name.toLowerCase()] || 'mdi:diamond-stone'} className="w-5 h-5 text-[#751A20]" />
                          )}
                          {cat.displayName || cat.name}
                        </Link>

                        {hasSubs && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setExpandedMobileCategory(isExpanded ? null : cat._id);
                            }}
                            className={`px-5 py-4 text-[#751A20] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          >
                            <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {isExpanded && hasSubs && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="bg-[#fcfaf8] overflow-hidden"
                          >
                            <div className="pb-3 border-t border-[#f0e8e0]/50">
                              {/* View All Option */}
                              <Link
                                href={`/shop/${slugify(cat.name)}` as any}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-12 py-3 text-[13px] font-bold text-[#751A20] hover:bg-[#f0e8e0]/30 transition-colors"
                              >
                                <Icon icon="mdi:view-grid-outline" className="w-4 h-4" />
                                View All {cat.displayName || cat.name}
                              </Link>

                              {/* Subcategories */}
                              <div className="grid grid-cols-1 gap-0.5">
                                {catSubs.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    href={`/shop/${slugify(cat.name)}/${slugify(sub.name)}` as any}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-12 py-2.5 text-[13px] font-medium text-gray-600 hover:text-[#751A20] hover:bg-[#f0e8e0]/30 transition-all group"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#751A20]/20 group-hover:bg-[#751A20] transition-colors" />
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
