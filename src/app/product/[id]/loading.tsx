import { Icon } from '@iconify/react';

export default function ProductDetailsLoading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs Skeleton */}
      <div className="border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-2">
          <div className="h-4 w-12 bg-[#f4f0e8] animate-pulse rounded" />
          <Icon icon="mdi:chevron-right" className="text-gray-200" width="14" />
          <div className="h-4 w-12 bg-[#f4f0e8] animate-pulse rounded" />
          <Icon icon="mdi:chevron-right" className="text-gray-200" width="14" />
          <div className="h-4 w-40 bg-[#f4f0e8] animate-pulse rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-20">
        <div className="grid gap-12 lg:gap-20 lg:grid-cols-2">
          {/* Left: Image Gallery Skeleton */}
          <div className="space-y-4">
             <div className="aspect-square w-full bg-[#f4f0e8] animate-pulse rounded-[3rem]" />
             <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-24 h-24 flex-shrink-0 bg-[#f4f0e8] animate-pulse rounded-2xl" />
                ))}
             </div>
          </div>

          {/* Right: Product Details Skeleton */}
          <div className="flex flex-col gap-8">
            <div className="space-y-6">
              <div className="h-4 w-32 bg-[#f4f0e8] animate-pulse rounded" />
              <div className="h-12 w-full bg-[#f4f0e8] animate-pulse rounded-xl" />
              <div className="flex gap-4">
                <div className="h-6 w-32 bg-[#f4f0e8] animate-pulse rounded-full" />
                <div className="h-6 w-32 bg-[#f4f0e8] animate-pulse rounded-full" />
              </div>
            </div>

            <div className="h-10 w-48 bg-[#f4f0e8] animate-pulse rounded-xl" />
            
            <div className="space-y-3">
              <div className="h-4 w-full bg-[#f4f0e8] animate-pulse rounded" />
              <div className="h-4 w-full bg-[#f4f0e8] animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-[#f4f0e8] animate-pulse rounded" />
            </div>

            <div className="pt-8 border-t border-[#f0e8e0] space-y-6">
               <div className="flex gap-4">
                 <div className="h-12 w-32 bg-[#f4f0e8] animate-pulse rounded-full" />
                 <div className="h-12 w-12 bg-[#f4f0e8] animate-pulse rounded-full" />
                 <div className="h-12 w-12 bg-[#f4f0e8] animate-pulse rounded-full" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="h-14 bg-[#f4f0e8] animate-pulse rounded-2xl" />
                 <div className="h-14 bg-[#f4f0e8] animate-pulse rounded-2xl" />
                 <div className="h-14 bg-[#f4f0e8] animate-pulse rounded-2xl col-span-2" />
               </div>
            </div>

            <div className="flex gap-8 border-b border-[#f0e8e0] pt-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-8 w-20 bg-[#f4f0e8] animate-pulse rounded-t-lg" />
               ))}
            </div>
            
            <div className="h-32 w-full bg-[#fcf9f6] animate-pulse rounded-2xl border border-[#f0e8e0]" />
          </div>
        </div>
      </div>
    </div>
  );
}
