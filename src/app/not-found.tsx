'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Icon } from '@iconify/react';
import animationData from '../../404.json';

// Use dynamic import for Lottie to prevent SSR hydration mismatch errors
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function NotFound() {
    return (
        <div className="min-h-[85vh] w-full flex flex-col items-center justify-center bg-white px-4">
            
            {/* Fully focused Lottie Animation */}
            <div className="w-full max-w-2xl mx-auto flex justify-center items-center">
                <Lottie 
                    animationData={animationData} 
                    loop={true} 
                    autoplay={true}
                    className="w-full h-auto"
                />
            </div>

            {/* Back to Home Button */}
            <Link href={'/' as any} className="mt-8 z-10">
                <button className="bg-[#2D1B1B] text-white px-10 py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-[#D4B996] hover:text-[#2D1B1B] transition-all duration-300 flex items-center gap-3 shadow-lg">
                    <Icon icon="lucide:arrow-left" className="text-lg" /> Back to Home
                </button>
            </Link>

        </div>
    );
}
