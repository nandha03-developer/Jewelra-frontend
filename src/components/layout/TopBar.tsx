'use client';

import MetalRates from './MetalRates';

export default function TopBar() {
  return (
    <div className="border-b border-[#f0e9df] bg-[#fff9f1] px-4 py-2 text-sm text-text shadow-sm sm:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-end">
        <div className="flex items-center gap-4">
          <MetalRates />
        </div>
      </div>
    </div>
  );
}
