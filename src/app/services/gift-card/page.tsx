'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuyGiftCardPage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Beautiful entrance effect
    const timer = setTimeout(() => setIsOpen(true), 700);
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
          <span className="text-gray-900 font-bold">Buy Gift Card</span>
        </nav>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center -mt-20">
         <div className="w-16 h-16 bg-[#751A20]/5 rounded-full flex items-center justify-center text-[#751A20] mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 2H7C5.9 2 5 2.9 5 4V10H2V12C2 12.6 2.4 13 3 13H4V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V13H21C21.6 13 22 12.6 22 12V10H19V4C19 2.9 18.1 2H17ZM17 4V10H13V4H17ZM11 4V10H7V4H11ZM6 19V13H11V19H6ZM18 19H13V13H18V19Z" />
            </svg>
         </div>
         <h1 className="text-2xl font-serif text-gray-900 mb-2">Gift of Timeless Beauty</h1>
         <p className="text-gray-500 text-sm max-w-sm">Share the magic of Jewelra craftsmanship with our custom digital gift cards.</p>
         
         <div className="mt-14 w-full max-w-sm relative group opacity-40 pointer-events-none transition-transform">
            <div className="aspect-[1.6/1] w-full bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col p-8 items-start justify-between">
               <div className="space-y-1">
                  <h3 className="text-xl font-serif text-[#751A20]">JEWELRA</h3>
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Gift Card</p>
               </div>
               <div className="w-full flex items-center justify-between text-gray-200">
                  <span className="text-2xl font-serif">₹0,000</span>
                  <div className="w-10 h-10 border border-gray-100 rounded-full"></div>
               </div>
            </div>
         </div>
         
         <button 
           onClick={() => setIsOpen(true)}
           className="mt-12 px-8 py-2.5 bg-white border border-[#751A20]/40 rounded-full text-[10px] font-bold text-[#751A20] uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-[#751A20] flex items-center gap-2 group"
         >
           Check Availability
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
              className="absolute inset-0 bg-[#751A20]/25 backdrop-blur-xl"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[4rem] p-12 shadow-2xl text-center overflow-hidden border border-gray-50"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#751A20] hover:bg-[#751A20]/5 transition-all z-20"
              >
                <Icon icon="solar:close-circle-bold-duotone" width="22" />
              </button>

              <div className="absolute top-0 left-0 w-64 h-64 bg-[#751A20]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="w-20 h-20 bg-[#fcf9f6] rounded-full flex items-center justify-center text-[#751A20] mx-auto border-4 border-white shadow-2xl">
                  {/* SOLID Gift SVG for 100% visibility */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#751A20" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                    <path d="M17 2H7C5.9 2 5 2.9 5 4V10H2V12C2 12.6 2.4 13 3 13H4V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V13H21C21.6 13 22 12.6 22 12V10H19V4C19 2.9 18.1 2H17ZM17 4V10H13V4H17ZM11 4V10H7V4H11ZM6 19V13H11V19H6ZM18 19H13V13H18V19Z" />
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#751A20] uppercase tracking-widest">Share the Love</p>
                  <h2 className="text-3xl font-serif text-gray-900 font-medium">Coming Soon!</h2>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed italic">
                  "The most beautiful gifts are the ones we choose ourselves." 
                  <br /><br />
                  Our <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">E-Gift Portal</span> is arriving shortly. Soon, you can gift instant luxury from the comfort of your home.
                </p>

                <div className="space-y-4 pt-10 flex flex-col items-center">
                  <div 
                    role="button"
                    onClick={() => setIsOpen(false)}
                    style={{ 
                      backgroundColor: '#751A20', 
                      color: 'white',
                      cursor: 'pointer',
                    }}
                    className="w-fit px-12 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-[#751A20]/20 flex items-center justify-center gap-3"
                  >
                    <span>Set Reminder</span>
                    <Icon icon="solar:bell-bing-bold-duotone" width="16" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
