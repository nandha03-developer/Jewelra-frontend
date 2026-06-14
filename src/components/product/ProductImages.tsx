'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { Product } from '@/types';

interface ProductImagesProps {
  product: Product;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, px: 0, py: 0 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // Combine product.image and product.images robustly
  const images = (() => {
    let all = [product.image];
    if (Array.isArray(product.images)) {
      all = [...all, ...product.images];
    }
    all = all.filter(img => typeof img === 'string' && img.trim() !== '');
    const unique = Array.from(new Set(all));
    return unique.length > 0 
      ? unique 
      : ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'];
  })();

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsZoomed(true);
    const { width, height } = e.currentTarget.getBoundingClientRect();
    setContainerSize({ w: width, h: height });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - left;
    const py = e.clientY - top;
    const x = (px / width) * 100;
    const y = (py / height) * 100;
    setMousePos({ x, y, px, py });
    if (width !== containerSize.w) {
      setContainerSize({ w: width, h: height });
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6 md:items-start select-none">
      {/* Thumbnails Container */}
      {images.length > 1 && (
        <>
          {/* Mobile Horizontal Layout */}
          <div 
            className="flex md:hidden flex-row gap-3 overflow-x-auto w-full pt-1 pb-1 flex-shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {images.map((src, index) => (
              <button
                key={`mobile-${src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[16px] border-2 transition-all duration-300 transform outline-none ${
                  active === index 
                    ? 'border-[#751A20] shadow-md scale-105 z-10 bg-white' 
                    : 'border-[#f0e8e0] shadow-sm bg-[#faf8f5] opacity-70'
                }`}
                suppressHydrationWarning
              >
                <img src={src} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" draggable="false" />
              </button>
            ))}
          </div>

          {/* Desktop Vertical Layout (Left Side) */}
          <div className="hidden md:flex flex-col gap-4 flex-shrink-0 pt-2 w-auto">
            {images.map((src, index) => (
              <button
                key={`desktop-${src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`group relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[18px] border-2 transition-all duration-300 transform outline-none ${
                  active === index 
                    ? 'border-[#751A20] shadow-md scale-105 z-10 bg-white' 
                    : 'border-[#f0e8e0] shadow-sm bg-[#faf8f5] opacity-70 hover:opacity-100 hover:border-[#d4b996]'
                }`}
                suppressHydrationWarning
              >
                <img src={src} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" draggable="false" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Main Image Container */}
      <div className="relative w-full flex-1 group">
        <div 
          className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-[#fcf9f6] shadow-md border border-[#f0e8e0] lg:cursor-crosshair cursor-default"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Main Base Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={images[active]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              <img
                src={images[active]}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply select-none"
                draggable="false"
              />
            </motion.div>
          </AnimatePresence>

          {/* Circular Magnifying Lens */}
          <AnimatePresence>
            {isZoomed && containerSize.w > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:block absolute pointer-events-none rounded-full border-[3px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.3)] z-30 overflow-hidden bg-white"
                style={{
                  width: '240px',
                  height: '240px',
                  // Center the lens on the cursor
                  left: `calc(${mousePos.x}% - 120px)`,
                  top: `calc(${mousePos.y}% - 120px)`,
                }}
              >
                {/* Flawless Zoom Engine: Clones the main container to inherently map aspects and padding */}
                <div 
                  className="absolute"
                  style={{
                    width: `${containerSize.w}px`,
                    height: `${containerSize.h}px`,
                    left: `calc(120px - ${mousePos.px * 2.5}px)`,
                    top: `calc(120px - ${mousePos.py * 2.5}px)`,
                    transform: 'scale(2.5)',
                    transformOrigin: 'top left'
                  }}
                >
                  <img
                    src={images[active]}
                    className="w-full h-full object-contain mix-blend-multiply"
                    alt=""
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Luxury Overlay Badge */}
          <div className="absolute left-6 top-6 z-10 flex flex-col items-start gap-2">
            {product.isNew && (
              <span className="bg-[#751A20] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                New Arrival
              </span>
            )}
            {product.discount && (
              <span className="bg-[#caa77a] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Special Offer
              </span>
            )}
          </div>
        </div>

        {/* Decorative Ambient Accents */}
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#E5D5C6]/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#D4B996]/20 rounded-full blur-2xl -z-10 pointer-events-none" />
      </div>
    </div>
  );
}
