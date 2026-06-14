import { Icon } from '@iconify/react';
import SkeletonCard from '@/components/common/SkeletonCard';

export default function ShopLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="px-4 py-8 md:px-8 lg:px-20 max-w-[1600px] mx-auto">
        {/* Breadcrumbs Skeleton */}
        <nav className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-[#f4f0e8] animate-pulse rounded" />
          <Icon icon="mdi:chevron-right" className="text-gray-200" width="16" />
          <div className="h-4 w-32 bg-[#f4f0e8] animate-pulse rounded" />
        </nav>

        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 md:w-80 bg-[#f4f0e8] animate-pulse rounded-xl" />
        </div>

        {/* Filter/Sort Buttons Skeleton */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-10">
          <div className="h-12 w-32 bg-[#f4f0e8] animate-pulse rounded-full" />
          <div className="h-12 w-60 bg-[#f4f0e8] animate-pulse rounded-full" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
