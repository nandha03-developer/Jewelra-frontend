'use client';

import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { getUserOrders, getProducts } from '@/utils/api';
import { toast } from 'sonner';

export default function PremiumTrackHub() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'list' | 'tracking'>('list');

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token || !user?._id) {
        if (!token) setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const [orderData, allProducts] = await Promise.all([
          getUserOrders(),
          getProducts()
        ]);

        const dataArr: any[] = Array.isArray(orderData) ? orderData : 
                               (orderData && typeof orderData === 'object' && (orderData as any).orders) ? (orderData as any).orders : [];
        
        const productMap = new Map(allProducts.map(p => [(p as any)._id || (p as any).id, p]));

        const enriched = dataArr.map(o => {
          const rawItems = o.products || o.items || [];
          const enrichedItems = rawItems.map((item: any) => {
             const productId = item.product?._id || item.product || item.id;
             const fullProduct = productMap.get(productId);
             return {
                ...item,
                displayName: fullProduct?.name || item.name || 'Handcrafted Jewel',
                displayImage: fullProduct?.image || fullProduct?.images?.[0] || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1599643477874-ce4eb87fe016?w=600&q=80'
             };
          });
          return { ...o, enrichedItems };
        });

        const finalOrders = enriched.filter(o => {
          const orderUserId = o.user?._id || o.user;
          return orderUserId === user._id;
        });
        
        setOrders(finalOrders);
      } catch (err) {
        console.error('Data sync failed:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [token, user?._id]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId || !Array.isArray(orders)) return null;
    return orders.find(o => (o._id || o.orderId) === selectedOrderId);
  }, [selectedOrderId, orders]);

  const handleTrackById = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchError(null);

    if (!searchId.trim()) {
      setSearchError('Please enter an ID to begin tracking.');
      return;
    }

    setLoading(true);
    const normalizedId = searchId.trim().toUpperCase();

    const foundOrder = orders.find(o => 
      (o.orderId && o.orderId.toUpperCase() === normalizedId) || 
      (o._id && o._id.toUpperCase() === normalizedId) ||
      (o._id && o._id.slice(-8).toUpperCase() === normalizedId)
    );

    setTimeout(() => {
      if (foundOrder) {
        setSelectedOrderId(foundOrder._id || foundOrder.orderId);
        setViewState('tracking');
      } else {
        setSearchError(`We couldn't find a record for "${normalizedId}". Please verify and try again.`);
      }
      setLoading(false);
    }, 600);
  };

  const statusSteps = [
    { label: 'Confirmed', description: 'Order verified & craftsman assigned.', icon: 'solar:verified-check-bold' },
    { label: 'Crafting', description: 'Hand-setting your precious stones.', icon: 'solar:magic-stick-3-bold' },
    { label: 'Polishing', description: 'Final luxury finish & quality audit.', icon: 'solar:star-ring-bold' },
    { label: 'Transit', description: 'Securely dispatched via global logistics.', icon: 'solar:box-minimalistic-bold' },
    { label: 'Delivered', description: 'Arrived at your elegant doorstep.', icon: 'solar:home-smile-bold' },
  ];

  const getStatusIndex = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'shipped') return 3;
    if (s === 'qc' || s === 'polishing') return 2;
    if (s === 'crafting') return 1;
    return 0;
  };

  return (
    <div className="min-h-screen bg-[#fdfaf8] font-[inter] text-[#2a1310] pb-24">
      
      {/* 1. Header with Breadcrumb */}
      <div className="max-w-[1100px] mx-auto px-6 pt-10">
         <nav className="flex items-center gap-2 text-[9px] font-black text-[#2a1310] mb-6 uppercase tracking-widest">
            <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-[#751A20] transition-colors">
               <Icon icon="solar:home-2-linear" width="12" />
               Home
            </Link>
            <Icon icon="solar:alt-arrow-right-linear" width="8" className="text-gray-300" />
            <span>Track Journey</span>
         </nav>

         <div className="w-full bg-white rounded-3xl border border-[#f0e8e0] p-8 text-center shadow-sm relative overflow-hidden">
            <h1 className="text-2xl font-serif mb-2">Order Tracking</h1>
            <p className="text-gray-400 text-[11px] font-medium max-w-xs mx-auto mb-4">Experience the transformation of raw elegance into your personal masterpiece.</p>
            <div className="inline-flex items-center gap-4 text-[8px] font-black text-[#751A20] border-t border-[#fcfaf8] pt-3 uppercase tracking-[0.3em] font-[serif]">
               SECURE ARCHIVE • {new Date().getFullYear()}
            </div>
         </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 mt-10">
        <AnimatePresence mode="wait">
          {viewState === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
              <div className="max-w-xl mx-auto space-y-4">
                 <form onSubmit={handleTrackById} className={`relative flex items-center bg-white rounded-full p-2 border ${searchError ? 'border-red-200 shadow-red-500/5' : 'border-[#f0e8e0] shadow-sm'} focus-within:shadow-md transition-all duration-500`}>
                    <input type="text" placeholder="Enter Order ID" value={searchId} onChange={(e) => { setSearchId(e.target.value); if (searchError) setSearchError(null); }} className="flex-1 px-8 py-2.5 bg-transparent outline-none text-[#979bb3] text-[12px] font-bold placeholder:text-gray-300" />
                    <button type="submit" className="h-10 px-10 bg-[#751A20] text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#751A20]/10 active:scale-95 transition-all">Track</button>
                 </form>
                 <AnimatePresence>
                   {searchError && (
                     <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2 px-8 text-[10px] font-bold text-red-400">
                        <Icon icon="solar:info-circle-bold" width="12" /> {searchError}
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:gap-6 max-w-4xl mx-auto">
                 {!user ? (
                   <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-[#f0e8e0]">
                      <Icon icon="solar:user-bold-duotone" width="30" className="mx-auto mb-3 text-[#751A20]" />
                      <p className="text-xs font-serif italic text-gray-400">Authentication Required</p>
                      <Link href="/auth/login" className="text-[#751A20] text-[8px] font-black uppercase tracking-widest mt-4 inline-block border-b border-[#751A20]/20 pb-0.5">Login Now</Link>
                   </div>
                 ) : loading ? (
                   [1, 2].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-[#f0e8e0] animate-pulse" />)
                 ) : !orders.length ? (
                   <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-[#f0e8e0] border-dashed">
                      <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-none">Catalogue Empty</p>
                   </div>
                 ) : (
                   orders.map((order, idx) => (
                     <motion.div key={order._id || order.orderId} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-3xl border border-[#f0e8e0] p-4 shadow-sm hover:shadow-xl hover:shadow-[#751A20]/5 transition-all duration-500 flex flex-col gap-4 border-b-[3px] border-b-[#751A20]/5 group">
                        <div className="flex gap-5 items-start">
                           <div className="w-24 h-24 lg:w-28 lg:h-28 bg-[#fcfaf8] rounded-2xl border border-[#f0e8e0] overflow-hidden flex-shrink-0">
                              <img src={order.enrichedItems?.[0]?.displayImage} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643477874-ce4eb87fe016?w=200&q=80'; }} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                           </div>
                           <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                              <div>
                                 <p className="text-[7px] font-black text-[#751A20] uppercase tracking-[0.3em] mb-1">LUXURY UNIT</p>
                                 <h3 className="text-lg font-serif text-[#2a1310] truncate">{order.orderId || order._id?.slice(-8).toUpperCase()}</h3>
                              </div>
                              <div className="mt-2 space-y-1">
                                 <p className="text-[9px] font-bold text-gray-500 line-clamp-1">{order.enrichedItems?.[0]?.displayName}</p>
                                 <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-[#751A20] uppercase tracking-wider">
                                    <span className="w-1 h-1 rounded-full bg-[#751A20] animate-pulse" /> {order.status || 'Active'}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <button onClick={() => { setSelectedOrderId(order._id || order.orderId); setViewState('tracking'); }} className="w-full h-10 bg-[#751A20] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#5b1419] transition-all shadow-md group/btn">View Journey <Icon icon="solar:arrow-right-linear" width="12" className="transition-transform group-hover/btn:translate-x-0.5" /></button>
                     </motion.div>
                   ))
                 )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="tracking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
              <button onClick={() => setViewState('list')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#751A20] transition-colors group">
                <Icon icon="solar:alt-arrow-left-outline" width="14" className="group-hover:-translate-x-1 transition-transform" /> Back to History
              </button>

              <div className="grid lg:grid-cols-[1.3fr,1fr] gap-8 items-start">
                 
                 {/* 1. Main Timeline - SHRUNK DESIGN */}
                 <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-[#f0e8e0] shadow-sm relative overflow-hidden">
                    <div className="mb-10 text-center lg:text-left">
                       <p className="text-[8px] font-black text-[#751A20] uppercase tracking-[0.3em] mb-2 font-[serif]">ESTABLISHED STATUS</p>
                       <h2 className="text-3xl font-serif text-[#2a1310] italic leading-tight mb-4">{selectedOrder?.status || 'Processing'}</h2>
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fcfaf8] rounded-lg border border-[#f0e8e0]">
                          <span className="text-[9px] font-bold text-gray-400">ID:</span>
                          <span className="text-[9px] font-black text-[#751A20]">{selectedOrderId?.toUpperCase()}</span>
                       </div>
                    </div>

                    <div className="space-y-6 relative ml-2">
                       {/* CORRECTED LINE CENTER ACCURATE */}
                       <div className="absolute left-[23px] top-6 bottom-6 w-[1px] bg-gray-100" />
                       <div className="absolute left-[23.5px] top-6 w-[0.5px] bg-[#751A20]/30 transition-all duration-1000" style={{ height: `${(getStatusIndex(selectedOrder?.status || 'processing') / 4) * 100}%` }} />

                       {statusSteps.map((step, i) => {
                         const currentIdx = getStatusIndex(selectedOrder?.status || 'processing');
                         const done = i <= currentIdx;
                         const active = i === currentIdx;
                         return (
                           <div key={i} className={`flex gap-6 relative items-center transition-all ${!done && !active ? 'opacity-30' : ''}`}>
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 transition-all ${active ? 'bg-[#751A20] text-white shadow-xl shadow-[#751A20]/20 active-step-glow' : done ? 'bg-[#fcfaf8] text-[#751A20] border border-[#f0e8e0]' : 'bg-white text-gray-100 border border-gray-100'}`}>
                                 <Icon icon={step.icon} width={active ? 22 : 18} />
                                 {done && !active && <Icon icon="solar:check-read-bold" className="absolute -right-1 -bottom-1 text-[#D4B996] bg-white rounded-full p-0.5" width="12" />}
                              </div>
                              <div className="flex-1">
                                 <h4 className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-[#751A20]' : 'text-[#2a1310]'}`}>{step.label}</h4>
                                 <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 italic">{step.description}</p>
                              </div>
                           </div>
                         );
                       })}
                    </div>
                 </div>

                 <div className="space-y-6">
                    {/* 2. Order Manifest - NEAT LIST */}
                    <div className="bg-white rounded-3xl p-6 border border-[#f0e8e0] shadow-sm">
                       <h5 className="text-[8px] font-black text-[#D4B996] uppercase tracking-[0.3em] mb-6 pb-2 border-b border-[#fcfaf8]">ORDER SUMMARY</h5>
                       <div className="space-y-4">
                          {(selectedOrder?.enrichedItems || []).map((item: any, i: number) => (
                             <div key={i} className="flex gap-4 group/item">
                                <div className="w-14 h-14 bg-[#fcfaf8] rounded-xl border border-[#f0e8e0] overflow-hidden flex-shrink-0">
                                   <img src={item.displayImage} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643477874-ce4eb87fe016?w=200&q=80'; }} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" alt="" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                   <p className="text-[12px] font-bold text-[#2a1310] leading-tight truncate">{item.displayName}</p>
                                   <p className="text-[9px] text-[#D4B996] mt-1 font-black uppercase tracking-widest leading-none italic">Premium Jewel</p>
                                </div>
                             </div>
                          ))}
                       </div>
                       <div className="mt-8 pt-6 border-t border-[#fcfaf8] flex justify-between items-baseline">
                          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Investment</p>
                          <p className="text-xl font-bold text-[#751A20]">₹{(selectedOrder?.totalAmount || 0).toLocaleString()}</p>
                       </div>
                    </div>

                    {/* 3. LIGHT THEME CONCIERGE CARD */}
                    <div className="bg-[#fdf9f6] rounded-3xl p-8 border border-[#f0e8e0] shadow-sm group/concierge relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-[#751A20]/5 rounded-full blur-3xl" />
                       <div className="relative z-10 space-y-6">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#f0e8e0] flex items-center justify-center shadow-sm">
                             <Icon icon="solar:chat-round-call-bold" width="18" className="text-[#D4B996]" />
                          </div>
                          <div>
                            <h4 className="text-xl font-serif text-[#2a1310] mb-2">Artisan Concierge</h4>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-medium">Your dedicated expert is available 24/7 for updates on your masterpiece.</p>
                          </div>
                          <Link href="/contact" className="h-11 w-full flex items-center justify-center bg-[#751A20] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#5b1419] transition-all shadow-lg shadow-[#751A20]/10">
                             Contact Support
                          </Link>
                       </div>
                    </div>
                 </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .active-step-glow {
            animation: pulse-glow 2s infinite ease-in-out;
        }
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 0 rgba(117, 26, 32, 0); }
            50% { box-shadow: 0 0 25px rgba(117, 26, 32, 0.4); }
        }
      `}</style>
    </div>
  );
}
