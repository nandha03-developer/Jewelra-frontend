'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import type { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((response) => response.json())
      .then((data) => {
        const matches = (data.data || []) as Product[];
        setResults(matches.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const router = useRouter();
  const suggestionList = useMemo(() => results.map((item) => item.name), [results]);

  return (
    <div className="px-4 py-10 md:px-8 lg:px-16">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="text-4xl font-semibold text-text">Live jewellery search</h1>
        <p className="mt-3 max-w-2xl text-muted">Search through premium jewellery, trending collections and curated designs.</p>
        <div className="mt-8 space-y-6">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  setActive((prev) => Math.min(prev + 1, suggestionList.length - 1));
                }
                if (e.key === 'ArrowUp') {
                  setActive((prev) => Math.max(prev - 1, 0));
                }
                if (e.key === 'Enter' && active >= 0 && results[active]) {
                  router.push(`/product/${results[active]._id}`);
                }
                if (e.key === 'Enter' && active === -1 && results[0]) {
                  router.push(`/product/${results[0]._id}`);
                }
              }}
              placeholder="Search for rings, earrings, necklaces..."
              className="w-full rounded-[1.5rem] border border-[#d7cebc] bg-white px-6 py-4 text-base text-text shadow-sm transition focus:border-gold"
            />
            {query && (
              <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-3xl border border-[#ece5dc] bg-white shadow-fade">
                {loading ? (
                  <div className="p-4 text-sm text-muted">Loading suggestions…</div>
                ) : suggestionList.length ? (
                  suggestionList.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      onClick={() => router.push(`/product/${results[index]._id}`)}
                      className={`cursor-pointer px-6 py-4 ${active === index ? 'bg-[#f8f2e9]' : ''}`}
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-muted">No matching jewellery found.</div>
                )}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Results</p>
            {loading ? (
              <div className="mt-6 text-muted">Loading products…</div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.length ? results.map((product) => <ProductCard key={product._id} product={product} />) : <div className="col-span-full rounded-[2rem] border border-[#ece5dc] bg-white p-8 text-muted">Start typing to see live suggestions and quick search results.</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
