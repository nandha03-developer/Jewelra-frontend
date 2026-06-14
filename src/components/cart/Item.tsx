'use client';

import { Icon } from '@iconify/react';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import type { Product } from '@/types';
import Link from 'next/link';

interface CartItemProps {
  item: Product;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [hoverMinus, setHoverMinus] = useState(false);
  const [hoverPlus, setHoverPlus] = useState(false);

  const quantity = item.quantity || 1;

  return (
    <div className="group flex items-center gap-5 rounded-[24px] border border-[#f0e8e0] bg-white p-4 transition-all duration-300 hover:border-[#751A20]/20 hover:shadow-lg hover:shadow-[#751A20]/5">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] bg-[#fcf9f6] border border-gray-50">
        <img 
          src={item.image || 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80'} 
          alt={item.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col justify-between self-stretch py-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[#751A20] transition-colors leading-tight line-clamp-2">
              {item.name}
            </h3>
            <p className="mt-1 text-[11px] font-medium tracking-wide text-gray-400 italic">
              {typeof item.material === 'object' ? (item.material as any).name : item.material || 'Premium Material'}
            </p>
          </div>
          
          <button 
            type="button" 
            onClick={() => removeItem(item._id)} 
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 text-gray-300 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-90"
            title="Remove item"
          >
            <Icon icon="solar:trash-bin-minimalistic-linear" className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-3 gap-y-2">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#f0e8e0] bg-[#fafafa] p-1 shrink-0">
            <button 
              type="button" 
              onClick={() => updateQuantity(item._id, Math.max(1, quantity - 1))} 
              onMouseEnter={() => setHoverMinus(true)}
              onMouseLeave={() => setHoverMinus(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-black transition-all hover:bg-[#751A20] disabled:opacity-10 disabled:pointer-events-none"
              disabled={quantity <= 1}
            >
              <Icon 
                icon="ic:round-minus" 
                className={`h-4 w-4 stroke-2 transition-colors ${hoverMinus ? 'text-white' : 'text-black'}`} 
              />
            </button>
            <span className="min-w-[24px] text-center text-xs font-bold text-gray-700">
              {quantity}
            </span>
            <button 
              type="button" 
              onClick={() => updateQuantity(item._id, quantity + 1)} 
              onMouseEnter={() => setHoverPlus(true)}
              onMouseLeave={() => setHoverPlus(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-black transition-all hover:bg-[#751A20]"
            >
              <Icon 
                icon="ic:round-plus" 
                className={`h-4 w-4 stroke-2 transition-colors ${hoverPlus ? 'text-white' : 'text-black'}`} 
              />
            </button>
          </div>
 
          <div className="text-right ml-auto">
            <p className="text-[16px] font-bold text-[#751A20] whitespace-nowrap">
              ₹{(item.price * quantity).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
