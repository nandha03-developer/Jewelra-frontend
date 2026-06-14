"use client";

import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../../Loading.json';

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fade out after 2.5 seconds
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 2500);

    // Completely remove from DOM after 3 seconds
    const timer2 = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex h-screen w-full flex-col items-center justify-center bg-white transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {mounted && (
        <div className="flex items-center justify-center w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
          <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
        </div>
      )}
    </div>
  );
}
