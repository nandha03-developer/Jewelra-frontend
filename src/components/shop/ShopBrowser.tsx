'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { useDebounce } from '@/hooks/useDebounce';
import { getProducts } from '@/utils/api';
import type { Product } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import SkeletonCard from '@/components/common/SkeletonCard';
import Link from 'next/link';

interface ShopBrowserProps {
  products: Product[];
  title: string;
  subtitle: string;
  initialCategory?: string;
  initialSubCategory?: string;
}

const sortOptions = [
  { value: 'latest', label: 'Best Matches' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' }
];

export default function ShopBrowser({ products: initialProducts, title, subtitle, initialCategory, initialSubCategory }: ShopBrowserProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [apiPage, setApiPage] = useState(1);
  const [hasMoreApi, setHasMoreApi] = useState(initialProducts.length >= 100);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState(sortOptions[0].value);
  const [openFilters, setOpenFilters] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useDebounce(search, 200);

  const categories = useMemo(() => {
    const all = products.map((product) => {
      if (typeof product.category === 'object' && product.category !== null) return (product.category as any).name;
      return product.category;
    });
    return Array.from(new Set(all.map(c => c?.trim()).filter(Boolean) as string[]));
  }, [products]);

  const subCategories = useMemo(() => {
    const all = products.map((product) => {
      if (typeof product.subcategory === 'object' && product.subcategory !== null) return (product.subcategory as any).name;
      return product.subcategory;
    });
    return Array.from(new Set(all.map(s => s?.trim()).filter(Boolean) as string[]));
  }, [products]);

  const priceBounds = useMemo(() => {
    const prices = products.map((product) => product.price).filter((price) => typeof price === 'number');
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 0)
    };
  }, [products]);

  const [minPrice, setMinPrice] = useState(priceBounds.min);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);

  const filteredProducts = useMemo(() => {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    return products
      .filter((product) => {
        // Initial Subcategory/Category filtering (from URL)
        if (initialCategory || initialSubCategory) {
          const targetCat = normalize(initialCategory || '');
          const targetSub = normalize(initialSubCategory || '');
          
          const cat = product.category as any;
          const sub = product.subcategory as any;
          if (!cat || !sub) return false;

          const matchesCat = (typeof cat === 'object') ? (
            cat._id === targetCat || normalize(cat.slug || '') === targetCat || normalize(cat.name || '') === targetCat
          ) : (normalize(cat) === targetCat);
          
          if (initialCategory && !matchesCat) return false;

          const matchesSub = (typeof sub === 'object') ? (
            sub._id === targetSub || normalize(sub.slug || '').includes(targetSub) || normalize(sub.name || '').includes(targetSub)
          ) : (normalize(sub).includes(targetSub));
          
          const nameMatch = normalize(product.name).includes(targetSub);
          
          if (initialSubCategory && !(matchesSub || nameMatch)) return false;
        }

        const debouncedNormalized = normalize(debouncedSearch);
        const matchesSearch = !debouncedSearch || 
          normalize(product.name).includes(debouncedNormalized) || 
          normalize(product.description || '').includes(debouncedNormalized);

        const catName = normalize(typeof product.category === 'object' ? (product.category as any).name : product.category || '');
        const subName = normalize(typeof product.subcategory === 'object' ? (product.subcategory as any).name : product.subcategory || '');
        
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => normalize(c) === catName);
        const matchesSubCategory = selectedSubCategories.length === 0 || selectedSubCategories.some(s => normalize(s) === subName);
        const matchesRating = rating === 0 || (product.rating || 0) >= rating;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesSubCategory && matchesRating && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, debouncedSearch, selectedCategories, selectedSubCategories, rating, minPrice, maxPrice, sortBy, initialCategory, initialSubCategory]);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 360);
    return () => window.clearTimeout(timer);
  }, [debouncedSearch, selectedCategories, selectedSubCategories, rating, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    setVisibleCount(12);
  }, [filteredProducts.length]);

  const loadMoreFromApi = async () => {
    if (loadingMore || !hasMoreApi) return;
    setLoadingMore(true);
    try {
      const nextPage = apiPage + 1;
      const newProducts = await getProducts(nextPage, 100); 
      if (newProducts.length === 0) {
        setHasMoreApi(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setApiPage(nextPage);
        if (newProducts.length < 100) setHasMoreApi(false); // No more after this batch
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (visibleCount < filteredProducts.length) {
          setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length));
        } else if (hasMoreApi && !loadingMore) {
          loadMoreFromApi();
        }
      }
    }, { rootMargin: '400px' });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredProducts.length, visibleCount, hasMoreApi, loadingMore]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedMaterials([]);
    setRating(0);
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setSortBy(sortOptions[0].value);
  };

  const toggleSelection = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section from Image 3 */}
      <div className="px-4 py-8 md:px-8 lg:px-20 max-w-[1600px] mx-auto">
        <nav className="flex items-center gap-2 text-[13px] text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-gold transition">Home</Link>
          <Icon icon="mdi:chevron-right" width="16" />
          <span className="text-[#751A20] font-semibold">{title}</span>
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[#2a1310] font-medium">
            {title} <span className="text-xl md:text-2xl text-gray-400 font-sans ml-1 text-[20px]">({filteredProducts.length} results)</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-gray-100 pb-8 mb-10 gap-4 sm:gap-0">
          <button
            type="button"
            onClick={() => setOpenFilters(true)}
            className="flex items-center justify-center sm:justify-start gap-3 rounded-full border border-gray-200 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-gray-800 hover:border-[#751A20] hover:bg-[#fffcf7] transition-all"
          >
            <Icon icon="mdi:filter-outline" width="20" />
            <span>Filter</span>
            <Icon icon="mdi:chevron-down" width="18" className="text-gray-400" />
          </button>

          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center justify-between gap-3 rounded-full border border-gray-200 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-gray-800 hover:border-[#751A20] hover:bg-[#fffcf7] transition-all cursor-pointer w-full sm:min-w-[240px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-normal">Sort By:</span>
                <span className="text-[#2a1310]">{sortOptions.find((o) => o.value === sortBy)?.label}</span>
              </div>
              <Icon icon="mdi:chevron-down" width="18" className={`text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-[80]" onClick={() => setIsSortOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-full min-w-[240px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-[90] animate-in fade-in zoom-in-95 duration-200">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-6 py-3.5 text-sm transition-colors ${
                        sortBy === option.value 
                          ? 'bg-[#751A20]/5 text-[#751A20] font-bold' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.value && <Icon icon="mdi:check" className="text-[#751A20]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Grid Section */}
        {loading && products.length === 0 ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (<SkeletonCard key={i} />))}
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts.slice(0, visibleCount)} />
            ) : !hasMoreApi ? (
              <div className="py-20 text-center">
                <h2 className="text-2xl font-serif text-[#2a1310] mb-2">No items matching your selection</h2>
                <p className="text-gray-500 mb-8">Try adjusting your filters to see more results.</p>
                <button onClick={resetFilters} className="bg-[#751A20] text-white px-10 py-4 rounded-full font-bold hover:bg-[#5b1419] transition shadow-lg">Clear All Filters</button>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-[#751A20]/20 border-t-[#751A20] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-serif italic">Searching for more pieces in our collection...</p>
              </div>
            )}
            
            {/* Infinite Scroll Trigger & Loading State */}
            <div ref={loadMoreRef} className="py-12 flex flex-col items-center justify-center min-h-[100px]">
              {loadingMore && filteredProducts.length > 0 && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#751A20]/20 border-t-[#751A20] rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gray-400 animate-pulse">Loading more exquisite pieces...</p>
                </div>
              )}
              {!hasMoreApi && visibleCount >= filteredProducts.length && filteredProducts.length > 0 && (
                <p className="text-gray-400 font-serif italic">You've reached the end of our curated collection</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Filter Modal from Image 2 */}
      {openFilters && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpenFilters(false)} />
          <div className="relative w-full max-w-[420px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-8 border-b border-gray-100">
              <h2 className="text-2xl font-serif text-[#2a1310] font-bold mx-auto">Filter By</h2>
              <button onClick={() => setOpenFilters(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <Icon icon="mdi:close" width="20" />
              </button>
            </div>

            {/* Accordion List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <Accordion title="Price" icon="mdi:currency-inr">
                  <div className="p-6 space-y-4 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Min" />
                      <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Max" />
                    </div>
                  </div>
                </Accordion>
                <Accordion title="Jewellery Type" icon="mdi:ring">
                   <div className="p-4 grid gap-2">
                     {categories.map(cat => (
                       <button key={cat} onClick={() => toggleSelection(cat, selectedCategories, setSelectedCategories)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${selectedCategories.includes(cat) ? 'bg-[#751A20] text-white font-bold' : 'hover:bg-gray-50 text-gray-700'}`}>
                         <span>{cat}</span>
                         {selectedCategories.includes(cat) && <Icon icon="mdi:check" />}
                       </button>
                     ))}
                   </div>
                </Accordion>
                <Accordion title="Product" icon="mdi:necklace">
                  <div className="p-4 grid gap-2">
                     {subCategories.map(sub => (
                       <button key={sub} onClick={() => toggleSelection(sub, selectedSubCategories, setSelectedSubCategories)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${selectedSubCategories.includes(sub) ? 'bg-[#751A20] text-white font-bold' : 'hover:bg-gray-50 text-gray-700'}`}>
                         <span>{sub}</span>
                         {selectedSubCategories.includes(sub) && <Icon icon="mdi:check" />}
                       </button>
                     ))}
                  </div>
                </Accordion>
                <Accordion title="Rating" icon="mdi:star">
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {[4, 3, 2, 1].map(v => (
                       <button key={v} onClick={() => setRating(v === rating ? 0 : v)} className={`px-4 py-3 rounded-xl text-sm transition-all border ${rating === v ? 'bg-[#751A20] border-[#751A20] text-white font-bold' : 'border-gray-100 text-gray-600'}`}>{v}+ Stars</button>
                    ))}
                  </div>
                </Accordion>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-4">
              <button 
                onClick={resetFilters} 
                className="flex items-center justify-center gap-2 rounded-full border border-[#751A20] px-6 py-4 text-sm font-bold text-[#751A20] hover:bg-[#fdf2f2] transition"
              >
                Clear Filters
                <Icon icon="mdi:chevron-right" />
              </button>
              <button 
                onClick={() => setOpenFilters(false)} 
                className="flex items-center justify-center gap-2 rounded-full bg-[#751A20] px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#5b1419] transition"
              >
                Show Result ({filteredProducts.length})
                <Icon icon="mdi:chevron-right" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Accordion({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-50 last:border-0 bg-white">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <Icon icon={icon} className="text-gray-400" width="22" />
          <span className="text-[17px] font-semibold text-[#2a1310]">{title}</span>
        </div>
        <Icon 
          icon="mdi:chevron-down" 
          width="20" 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}
