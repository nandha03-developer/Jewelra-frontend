'use client';

export default function SkeletonCard() {
  return (
    <div className="bg-white border border-[#f2f2f2] rounded-xl overflow-hidden flex flex-col items-start shadow-sm animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative w-full aspect-square bg-[#fafafa]" />
      
      {/* Info Area Skeleton */}
      <div className="w-full px-5 py-6 space-y-4">
        {/* Title Lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#f4f0e8] rounded-full" />
          <div className="h-4 w-2/3 bg-[#f4f0e8] rounded-full" />
        </div>
        
        {/* Price and Stock area */}
        <div className="flex items-center justify-between gap-4 w-full pt-2">
          <div className="h-6 w-24 bg-[#f4f0e8] rounded-full" />
          <div className="h-3 w-16 bg-[#f4f0e8] rounded-full" />
        </div>
      </div>
    </div>
  );
}
