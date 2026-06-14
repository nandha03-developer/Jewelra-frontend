'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1, translateY: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[100] group"
          aria-label="Scroll to top"
        >
          {/* Main button with glassmorphism and brand color - Full Circle */}
          <div className="relative flex items-center justify-center w-11 h-11 bg-white/90 backdrop-blur-md border border-[#751A20]/25 rounded-full shadow-[0_8px_25px_rgba(117,26,32,0.12)] transition-all duration-300 group-hover:shadow-[0_12px_35px_rgba(117,26,32,0.2)] overflow-hidden">
            {/* Soft background tint */}
            <div className="absolute inset-0 bg-[#751A20]/5 group-hover:bg-[#751A20]/10 transition-colors duration-300" />

            {/* The Icon - Clean and Small */}
            <Icon
              icon="mdi:arrow-top"
              className="text-xl text-[#751A20] relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5"
            />

            {/* Animated border ring */}
            <div className="absolute inset-0 border border-[#751A20]/30 rounded-full scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
          </div>

          {/* Minimalist Tooltip */}
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#2a1310] text-white text-[9px] font-bold uppercase tracking-[0.15em] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
            Scroll Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
