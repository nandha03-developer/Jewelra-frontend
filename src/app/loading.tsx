"use client";

import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../Loading.json';

export default function Loading() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a blank screen while hydrating to prevent SSR mismatches and hide the ugly spinner
    return <div className="fixed inset-0 z-[9999] bg-white"></div>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="flex items-center justify-center w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
        <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
      </div>
    </div>
  );
}
