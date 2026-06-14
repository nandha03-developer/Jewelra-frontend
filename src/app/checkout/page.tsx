'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';


export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);
  const { user, token } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(7); // Increased slightly to give time for invoice
  const [lastOrder, setLastOrder] = useState<any>(null);

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    postal: '',
    country: 'India'
  });
  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
    bankName: ''
  });

  // Pre-fill customer info if user is logged in
  useEffect(() => {
    if (user) {
      setCustomer(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone || ''
      }));
    }
  }, [user]);

  // session validation and recovery as a permanent fix for missing User IDs
  useEffect(() => {
    const recoverSession = async () => {
      if (token && (!user?._id && !user?.id)) {
        // console.log('Incomplete session detected. Recovering User ID...');
        try {
          const response = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            const profile = data.user || data;
            if (profile?._id || profile?.id) {
              const updatedUser = {
                ...user,
                _id: profile._id || profile.id,
                id: profile.id || profile._id,
                name: profile.name || user?.name || 'Member',
                email: profile.email || user?.email || '',
                phone: profile.phone || user?.phone || '',
                avatar: profile.avatar || profile.image || profile.profileImage || user?.avatar
              };
              useAuthStore.getState().setUser(updatedUser as any);
              //  console.log('User session successfully recovered.');
            }
          }
        } catch (error) {
          console.error('Session recovery failed:', error);
        }
      }
    };
    recoverSession();
  }, [token, user?._id, user?.id]);

  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0), [items]);
  const shippingFee = 299;
  const taxAmount = Math.round(total * 0.05);
  const grandTotal = total + shippingFee + taxAmount;

  // Countdown timer for redirection
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showSuccessModal && countdown === 0) {
      router.push('/');
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal, countdown, router]);

  const validateShipping = () => {
    if (!customer.name || !customer.email || !customer.address || !customer.city || !customer.state || !customer.country || !customer.postal || !customer.phone) {
      toast.error('Please complete all shipping fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (payment.method === 'card') {
      if (!payment.cardNumber || !payment.expiry || !payment.cvv) {
        toast.error('Please complete all card details.');
        return;
      }
    } else if (payment.method === 'upi') {
      if (!payment.upiId || !payment.upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. name@upi).');
        return;
      }
    } else if (payment.method === 'netbanking') {
      if (!payment.bankName) {
        toast.error('Please select your bank.');
        return;
      }
    }

    setSubmitting(true);
    try {
      // Map payment method to API expectations
      const methodMap: Record<string, string> = {
        card: 'credit_card',
        qr: 'upi',
        upi: 'upi',
        netbanking: 'net_banking'
      };

      const orderPayload: any = {
        user: user?._id || user?.id || (user as any)?.userId,
        products: items.map((item) => ({
          product: item._id,
          quantity: item.quantity || 1,
          price: item.price
        })),
        totalAmount: grandTotal,
        paymentMethod: methodMap[payment.method] || payment.method,
        shippingAddress: {
          street: customer.address,
          city: customer.city,
          state: customer.state,
          zipCode: customer.postal,
          country: customer.country
        }
      };

      if (!orderPayload.user || !orderPayload.products.length || !orderPayload.totalAmount || !orderPayload.paymentMethod || !orderPayload.shippingAddress.street) {
        console.error('Payload Validation Failed:', orderPayload);

        if (!orderPayload.user) {
          toast.error('Session error: Please log out and login again to confirm your identity.');
        } else {
          toast.error('Missing required order information. Please check your details.');
        }

        setSubmitting(false);
        return;
      }

      // console.log('Final Order Payload:', orderPayload);

      let response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      // Token Refresh Logic
      if (response.status === 401 && useAuthStore.getState().refreshToken) {
        // console.log('Token expired, attempting refresh...');
        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: useAuthStore.getState().refreshToken })
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData.token;
          const newRefreshToken = refreshData.refreshToken;

          // Update store
          useAuthStore.getState().setToken(newToken);
          if (newRefreshToken) useAuthStore.getState().setRefreshToken(newRefreshToken);

          // Retry order with new token
          response = await fetch('/api/order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`
            },
            body: JSON.stringify(orderPayload)
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Failed to place order');
      }

      const result = await response.json();

      const orderData = {
        orderId: result._id || `JWL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        status: 'Processing' as const,
        items: items.map((item) => ({ ...item, quantity: item.quantity || 1 })),
        total: grandTotal,
        shipping: shippingFee,
        tax: taxAmount,
        customer
      };

      setLastOrder(orderData);
      addOrder(orderData);
      clearCart();
      setShowSuccessModal(true);

      // Automatic download after a small delay
      setTimeout(() => {
        handleDownloadInvoice(orderData);
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Unable to place order right now.');
      console.error('Order Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadInvoice = async (orderInfo?: any) => {
    const data = orderInfo || lastOrder;
    if (!data) return;

    try {
      const { generateInvoicePDF } = await import('@/utils/InvoiceGenerator');
      await generateInvoicePDF({
        orderId: data.orderId,
        date: data.createdAt,
        customer: data.customer,
        items: data.items,
        subtotal: total,
        tax: data.tax,
        shipping: data.shipping,
        total: data.total
      });
      toast.success('Your invoice is being downloaded...');
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  if (items.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#f0e8e0]">
          <div className="w-20 h-20 bg-[#fef2f2] rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon icon="solar:cart-large-minimalistic-broken" width="40" className="text-[#751A20]" />
          </div>
          <h1 className="font-serif text-3xl text-[#2a1310] mb-4">Your bag is empty</h1>
          <p className="text-[#787373] mb-8">You haven't added any treasures to your bag yet.</p>
          <Link href="/shop" className="inline-flex items-center justify-center w-full bg-[#751A20] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#5a151a] transition-all">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf8] py-12 lg:py-20 font-[inter] relative">
      <div className="mx-auto max-w-[1300px] px-4 md:px-8">

        {/* Progress Navigation */}
        <div className="mb-16 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-[#751A20] text-white shadow-lg shadow-[#751A20]/20' : 'bg-white text-gray-400 border border-gray-100'}`}>
              {step > 1 ? <Icon icon="solar:check-read-bold" width="20" /> : '01'}
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= 1 ? 'text-[#751A20]' : 'text-gray-400'}`}>Shipping</span>
          </div>
          <div className="h-px w-16 bg-gray-200 mb-6" />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-[#751A20] text-white shadow-lg shadow-[#751A20]/20' : 'bg-white text-gray-400 border border-gray-100'}`}>
              02
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= 2 ? 'text-[#751A20]' : 'text-gray-400'}`}>Payment</span>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr,420px]">

          {/* Main Checkout Form */}
          <div className="space-y-8">
            <header>
              <h1 className="font-serif text-4xl md:text-5xl text-[#2a1310] mb-2">Secure Checkout</h1>
              <p className="text-[#787373] text-sm font-medium">Verify your details and complete the transaction.</p>
            </header>

            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#f0e8e0]">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-3 border-b border-[#fcfaf8] pb-6 mb-8">
                      <div className="w-10 h-10 bg-[#fcf9f6] rounded-2xl flex items-center justify-center text-[#D4B996]">
                        <Icon icon="solar:delivery-bold" width="22" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#2a1310]">Shipping Information</h2>
                        <p className="text-[10px] text-[#787373] uppercase tracking-wider font-medium">Where should we deliver your treasures?</p>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Full Name</label>
                        <input
                          value={customer.name}
                          onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Arabella Sterling"
                          className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Email Address</label>
                        <input
                          value={customer.email}
                          onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
                          type="email"
                          placeholder="your@email.com"
                          className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Phone Number</label>
                        <input
                          value={customer.phone}
                          onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 00000 00000"
                          className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Zip / Postal Code</label>
                        <input
                          value={customer.postal}
                          onChange={(e) => setCustomer((prev) => ({ ...prev, postal: e.target.value }))}
                          placeholder="600001"
                          className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Delivery Address</label>
                      <textarea
                        value={customer.address}
                        onChange={(e) => setCustomer((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="House No, Street, Landmark..."
                        rows={3}
                        className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">City / Region</label>
                        <input
                          value={customer.city}
                          onChange={(e) => setCustomer((prev) => ({ ...prev, city: e.target.value }))}
                          placeholder="Enter your city"
                          className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">State</label>
                        <input
                          value={customer.state}
                          onChange={(e) => setCustomer((prev) => ({ ...prev, state: e.target.value }))}
                          placeholder="e.g. Tamil Nadu"
                          className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Country</label>
                        <input
                          value={customer.country}
                          onChange={(e) => setCustomer((prev) => ({ ...prev, country: e.target.value }))}
                          placeholder="India"
                          className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => validateShipping() && setStep(2)}
                        className="group flex items-center justify-center gap-3 w-full bg-[#751A20] text-white py-3.5 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-[#751A20]/20 hover:bg-[#5a151a] transition-all active:scale-[0.98]"
                      >
                        Continue to Payment
                        <Icon icon="solar:arrow-right-bold" className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-3 border-b border-[#fcfaf8] pb-6 mb-8">
                      <div className="w-10 h-10 bg-[#fcf9f6] rounded-2xl flex items-center justify-center text-[#D4B996]">
                        <Icon icon="solar:card-2-bold" width="22" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#2a1310]">Payment Method</h2>
                        <p className="text-[10px] text-[#787373] uppercase tracking-wider font-medium">Safe & Encrypted Transaction</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                      {[
                        { id: 'card', icon: 'solar:card-bold', label: 'Card' },
                        { id: 'qr', icon: 'solar:qr-code-bold', label: 'QR Pay' },
                        { id: 'upi', icon: 'logos:upi', label: 'UPI' },
                        { id: 'netbanking', icon: 'solar:bank-bold', label: 'Bank' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setPayment(p => ({ ...p, method: m.id }))}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${payment.method === m.id ? 'bg-[#751A20] border-[#751A20] text-white' : 'bg-[#fcfaf8]/50 border-[#f0e8e0] text-[#787373] hover:border-[#D4B996]'}`}
                        >
                          <Icon icon={m.icon} width="20" className={m.id === 'upi' ? (payment.method === 'upi' ? '' : 'grayscale opacity-70') : ''} />
                          <span className="text-[9px] font-black uppercase tracking-wider">{m.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-6">
                      {payment.method === 'card' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Card Number</label>
                            <div className="relative">
                              <input
                                value={payment.cardNumber}
                                onChange={(e) => setPayment((prev) => ({ ...prev, cardNumber: e.target.value }))}
                                placeholder="0000 0000 0000 0000"
                                className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none pl-12"
                              />
                              <Icon icon="solar:card-send-linear" className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" width="18" />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Expiry Date</label>
                              <input
                                value={payment.expiry}
                                onChange={(e) => setPayment((prev) => ({ ...prev, expiry: e.target.value }))}
                                placeholder="MM/YY"
                                className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">CVV</label>
                              <input
                                value={payment.cvv}
                                onChange={(e) => setPayment((prev) => ({ ...prev, cvv: e.target.value }))}
                                type="password"
                                maxLength={4}
                                placeholder="***"
                                className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {payment.method === 'qr' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-4 bg-[#fcf9f6] rounded-2xl border border-dashed border-[#D4B996]/40">
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 group cursor-pointer hover:border-[#751A20] transition-all">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=jewelra@bank&pn=Jewelra&am=${grandTotal}&cu=INR`} alt="Payment QR" className="w-40 h-40" />
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#751A20]">Scan & Pay via any UPI App</p>
                            <p className="text-[9px] text-gray-400 mt-1">Order will be confirmed after payment detection</p>
                          </div>
                        </motion.div>
                      )}

                      {payment.method === 'upi' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Enter UPI ID</label>
                          <div className="relative">
                            <input
                              value={payment.upiId}
                              onChange={(e) => setPayment((prev) => ({ ...prev, upiId: e.target.value }))}
                              placeholder="username@bankid"
                              className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none pl-12"
                            />
                            <Icon icon="logos:upi" className="absolute left-5 top-1/2 -translate-y-1/2" width="18" />
                          </div>
                          <p className="text-[9px] text-[#787373] ml-4 italic">You will receive a collection request on your UPI app.</p>
                        </motion.div>
                      )}

                      {payment.method === 'netbanking' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-black text-[#787373] ml-4">Select your Bank</label>
                          <select
                            value={payment.bankName}
                            onChange={(e) => setPayment((prev) => ({ ...prev, bankName: e.target.value }))}
                            className="w-full rounded-xl border border-[#f0e8e0] bg-[#fcfaf8]/50 px-5 py-3.5 text-sm focus:bg-white focus:border-[#751A20] transition-all outline-none appearance-none"
                          >
                            <option value="">Select a Bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                          </select>
                        </motion.div>
                      )}
                    </div>

                    <div className="pt-8 flex flex-col gap-4">
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center justify-center gap-3 w-full bg-[#751A20] text-white py-3.5 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-[#751A20]/20 hover:bg-[#5a151a] disabled:opacity-50 transition-all active:scale-[0.98]"
                      >
                        {submitting ? (
                          <Icon icon="line-md:loading-twotone-loop" width="18" />
                        ) : (
                          <Icon icon="solar:shield-check-bold" width="16" />
                        )}
                        {submitting ? 'Confirming...' : `Place Order (₹${grandTotal.toLocaleString()})`}
                      </button>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[9px] uppercase tracking-widest font-bold text-[#787373] hover:text-[#751A20] transition-colors"
                      >
                        Back to Shipping Details
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-6 text-[#787373] opacity-30 grayscale active:grayscale-0 transition-all">
              <Icon icon="logos:visa" width="32" />
              <Icon icon="logos:mastercard" width="24" />
              <Icon icon="logos:pci-compliant" width="50" />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-8">
              <div className="bg-white rounded-[40px] p-8 border border-[#f0e8e0] shadow-[0_10px_40px_rgba(0,0,0,0.03)] font-[inter]">
                <h2 className="font-serif text-2xl text-[#2a1310] mb-8 pb-6 border-b border-[#fcfaf8]">Order Summary</h2>

                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8 space-y-5">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-4 group">
                      <div className="w-14 h-14 rounded-xl bg-[#fcfaf8] border border-[#f0e8e0] flex-shrink-0 overflow-hidden group-hover:border-[#D4B996] transition-colors">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center gap-1">
                        <p className="text-[11px] font-bold text-[#2a1310] leading-tight line-clamp-1">{item.name}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-[9px] text-[#787373] uppercase tracking-wider font-medium">Qty: {item.quantity}</p>
                          <p className="text-xs font-bold text-[#751A20]">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3.5 pt-6 border-t border-[#fcfaf8]">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-[#787373]">Subtotal</span>
                    <span className="text-[#2a1310]">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-[#787373]">Luxury Shipping</span>
                    <span className="text-[#2a1310]">₹{shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium pb-4">
                    <span className="text-[#787373]">VAT / GST (5%)</span>
                    <span className="text-[#2a1310]">₹{taxAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-end pt-5 border-t border-[#f0e8e0]">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#787373] mb-1">Total to Pay</p>
                      <p className="text-2xl font-bold text-[#751A20]">₹{grandTotal.toLocaleString()}</p>
                    </div>
                    <div className="text-[8px] bg-green-50 text-green-600 px-2 py-1 rounded font-black uppercase tracking-widest">Secured</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] bg-[#751A20]/5 p-6 border border-[#751A20]/10 border-dashed">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon icon="solar:chat-round-call-bold" className="text-[#751A20]" width="18" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-[#2a1310] mb-0.5">Need Assistance?</h4>
                    <p className="text-[9px] text-[#787373] leading-relaxed">Our concierge is available 24/7 for you.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#2a1310]/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[500px] bg-white rounded-[48px] p-10 md:p-14 text-center shadow-[0_30px_100px_rgba(0,0,0,0.25)] border border-[#f0e8e0] overflow-hidden"
            >
              {/* Decorative background circle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#751A20]/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 shadow-sm border border-green-100">
                  <Icon icon="solar:check-circle-bold" width="44" />
                </div>

                <h2 className="font-serif text-3xl md:text-4xl text-[#2a1310] mb-4">Payment Successful!</h2>
                <p className="text-[#787373] text-sm md:text-base leading-relaxed mb-8">
                  Thank you for choosing <span className="text-[#751A20] font-bold">Jewelra</span>. Your order of brilliance has been placed successfully and is being prepared with care.
                </p>

                <div className="p-6 bg-[#fcfaf8] rounded-3xl border border-[#f0e8e0] mb-10">
                  <p className="text-[10px] uppercase tracking-widest font-black text-[#D4B996] mb-1">Order Status</p>
                  <p className="text-sm font-bold text-[#2a1310]">Redirecting to Home in <span className="text-[#751A20]">{countdown}s</span></p>
                  <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-[#751A20]"
                    />
                  </div>
                </div>

                <Link href="/" className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#751A20] hover:scale-105 transition-transform">
                  Go to Home Right Now
                  <Icon icon="solar:arrow-right-bold" />
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                  <button
                    onClick={() => handleDownloadInvoice()}
                    className="flex items-center justify-center gap-3 w-full bg-[#751A20] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#5a151a] transition-all shadow-lg shadow-[#751A20]/20"
                  >
                    <Icon icon="solar:file-download-bold" width="18" />
                    Download PDF Invoice
                  </button>
                  <p className="text-[10px] text-gray-400 font-medium">Your formal receipt has been generated automatically.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
