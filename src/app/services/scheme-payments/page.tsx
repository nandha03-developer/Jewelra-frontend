'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SchemePaymentsPage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Elegant entryway effect
    const timer = setTimeout(() => setIsOpen(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcf9f6] flex flex-col font-[inter]">
      
      {/* Breadcrumb Section */}
      <div className="max-w-[1200px] mx-auto w-full px-8 pt-10">
        <nav className="flex items-center gap-2 text-xs font-medium">
          <Link href="/" className="text-gray-400 hover:text-[#751A20] flex items-center gap-1 transition-colors">
            <Icon icon="solar:home-2-linear" width="14" />
            Home
          </Link>
          <Icon icon="solar:alt-arrow-right-linear" width="12" className="text-gray-300" />
          <span className="text-gray-900 font-bold">Scheme Payments</span>
        </nav>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center -mt-20">
         <div className="w-16 h-16 bg-[#751A20]/5 rounded-full flex items-center justify-center text-[#751A20] mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V9C22 7.89543 21.1046 7 20 7ZM20 9L12 13L4 9H20Z" />
            </svg>
         </div>
         <h1 className="text-2xl font-serif text-gray-900 mb-2 italic">Online Gold Schemes</h1>
         <p className="text-gray-500 text-sm max-w-sm">Secure and stress-free monthly payments for your future gold savings.</p>
         
         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-[0.35] pointer-events-none filter blur-[1px]">
            {[
              { label: 'Check Balance', icon: 'solar:wallet-2-linear' },
              { label: 'Pay Installment', icon: 'solar:card-2-linear' },
              { label: 'Scheme History', icon: 'solar:history-linear' }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-4">
                 <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <Icon icon={item.icon} width="20" />
                 </div>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300">{item.label}</span>
              </div>
            ))}
         </div>
         
         <button 
           onClick={() => setIsOpen(true)}
           className="mt-10 px-6 py-2.5 bg-white border border-[#751A20]/40 rounded-full text-[10px] font-bold text-[#751A20] uppercase tracking-widest flex items-center gap-2 hover:scale-105 hover:shadow-md hover:border-[#751A20] transition-all duration-300 group"
         >
           View Launch Status
           <Icon icon="solar:info-circle-bold-duotone" width="16" className="opacity-70 group-hover:opacity-100" />
         </button>
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#751A20]/20 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[4rem] p-12 shadow-2xl text-center overflow-hidden border border-gray-100"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 w-8 h-8 rounded-full bg-[#751A20]/5 flex items-center justify-center text-gray-400 hover:text-[#751A20] transition-all z-20"
              >
                <Icon icon="solar:close-circle-bold-duotone" width="22" />
              </button>

              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#751A20]/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="w-24 h-24 bg-[#fcf9f6] rounded-full flex items-center justify-center text-[#751A20] mx-auto border border-white shadow-xl">
                  {/* SOLID Wallert SVG for maximum visibility */}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#751A20" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V9C22 7.89543 21.1046 7 20 7ZM20 9L12 13L4 9H20Z" />
                  </svg>
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[#751A20] uppercase tracking-[0.2em] leading-none">The Future of Savings</p>
                  <h2 className="text-4xl font-serif text-gray-900 font-medium">Digital Schemes</h2>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed px-2">
                  Our <span className="text-gray-900 font-bold italic">Gold Savings Portal</span> is receiving its final security audit. Soon, you can manage your installments and watch your gold accumulate digitally—no office visits required.
                </p>

                <div className="space-y-4 pt-4 flex flex-col items-center">
                  <div 
                    role="button"
                    onClick={() => setIsOpen(false)}
                    style={{ 
                      backgroundColor: '#751A20', 
                      color: 'white',
                      cursor: 'pointer',
                    }}
                    className="w-fit px-12 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-[#751A20]/20 flex items-center justify-center gap-3"
                  >
                    <span>Get Early Access</span>
                    <Icon icon="solar:star-bold-duotone" width="16" />
                  </div>
                  <p className="text-[9px] text-gray-300 font-medium uppercase tracking-[0.1em]">Secured by Jewelra Digital Trust</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
