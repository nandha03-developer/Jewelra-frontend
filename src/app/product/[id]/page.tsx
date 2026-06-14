import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/utils/api';
import ProductImages from '@/components/product/ProductImages';
import ProductDetails from '@/components/product/ProductDetails';
import ProductReviews from '@/components/product/ProductReviews';
import RelatedProducts from '@/components/product/RelatedProducts';
import RecentlyViewed from '@/components/product/RecentlyViewed';
import RecentlyViewedTracker from '@/components/product/RecentlyViewedTracker';
import { Icon } from '@iconify/react';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((item) => item._id === id || item.slug === id);

  if (!product) {
    return {
      title: 'Product Not Found | Jewelra',
      description: 'The requested product could not be found.'
    };
  }

  const categoryName = typeof product.category === 'object' ? (product.category as any).name : 'Jewellery';
  const description = product.description || `Exquisite ${product.name} from our ${categoryName} collection at Jewelra.`;
  const mainImage = product.image || product.images?.[0] || '';
  
  // Optimize Cloudinary image for Social Media (1200x630 is recommended for FB/WA)
  const getOgImage = (url: string) => {
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/w_1200,h_630,c_fill,g_auto,q_auto,f_auto/');
    }
    return url;
  };

  const ogImage = getOgImage(mainImage);

  return {
    title: `${product.name} | Jewelra`,
    description: description,
    openGraph: {
      title: product.name,
      description: description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((item) => item._id === id || item.slug === id);

  if (!product) {
    console.error(`Product not found for ID/Slug: ${id}`);
    notFound();
  }

  const getSubCatId = (p: any) => typeof p.subcategory === 'object' && p.subcategory !== null ? p.subcategory._id || p.subcategory : p.subcategory;
  const getCatId = (p: any) => typeof p.category === 'object' && p.category !== null ? p.category._id || p.category : p.category;

  const currentSubId = getSubCatId(product);
  const currentCatId = getCatId(product);

  let related = products.filter((item) => {
    if (item._id === id) return false;
    const itemSubId = getSubCatId(item);
    if (currentSubId && itemSubId) {
      return itemSubId === currentSubId;
    }
    const itemCatId = getCatId(item);
    if (currentCatId && itemCatId) {
      return itemCatId === currentCatId;
    }
    return false;
  });

  // If not enough items in exact subcategory, fallback to same category, then any
  if (related.length < 4) {
    const extra = products.filter(item => item._id !== id && !related.some(r => r._id === item._id));
    related = [...related, ...extra];
  }
  
  const finalRelated = related.slice(0, 4);
  const categoryName = typeof product.category === 'object' ? (product.category as any).name : 'Jewellery';

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#787373]">
          <Link href="/" className="hover:text-[#2a1310] transition-colors">Home</Link>
          <Icon icon="mdi:chevron-right" />
          <Link href="/shop" className="hover:text-[#2a1310] transition-colors">Shop</Link>
          <Icon icon="mdi:chevron-right" />
          <span className="text-[#2a1310]">{product.name}</span>
        </div>
      </div>
      <RecentlyViewedTracker product={product} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-20">
        <div className="grid gap-12 lg:gap-20 lg:grid-cols-2">
          {/* Left: Image Gallery */}
          <div>
            <ProductImages product={product} />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product._id} />

         {/* Related Products Section */}
        <section className="mt-24 lg:mt-32 pt-20 border-t border-[#f0e8e0]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#fcf9f6] px-4 py-1.5 rounded-full border border-[#f0e8e0] mb-4">
                <Icon icon="basil:diamond-outline" className="text-[#D4B996]" width="14" />
                <span className="text-[10px] font-bold text-[#787373] uppercase tracking-widest">Recommended</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif text-[#2a1310]">You May Also Love</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-[#751A20] flex items-center gap-2 hover:gap-3 transition-all">
              View All Collection <Icon icon="mdi:arrow-right" />
            </Link>
          </div>
          <RelatedProducts products={finalRelated} />
        </section>

        {/* Brand Promise Section */}
        <section className="mt-24 lg:mt-32 p-10 lg:p-20 bg-[#fcf9f6] rounded-[3rem] border border-[#f0e8e0] text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#E5D5C6]/20 rounded-full blur-[100px] -z-0" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4B996]/10 rounded-full blur-[100px] -z-0" />
           
           <div className="relative z-10 max-w-2xl mx-auto">
             <Icon icon="lucide:sparkles" className="mx-auto text-[#D4B996] mb-6" width="40" />
             <h3 className="text-2xl lg:text-3xl font-serif text-[#2a1310] mb-6">The Jewelra Excellence</h3>
             <p className="text-[#787373] leading-relaxed mb-10">Every piece in our collection is a testament to extraordinary craftsmanship and timeless design. We believe that true luxury lies in the details, ensuring each creation is as unique as the woman who wears it.</p>
             <div className="flex flex-wrap items-center justify-center gap-10">
               <div className="flex flex-col items-center gap-2">
                 <span className="text-3xl font-serif text-[#2a1310]">100%</span>
                 <span className="text-[10px] font-bold text-[#787373] uppercase tracking-widest">Natural Stones</span>
               </div>
               <div className="h-10 w-px bg-gray-200 hidden md:block" />
               <div className="flex flex-col items-center gap-2">
                 <span className="text-3xl font-serif text-[#2a1310]">BIS</span>
                 <span className="text-[10px] font-bold text-[#787373] uppercase tracking-widest">Hallmarked Gold</span>
               </div>
               <div className="h-10 w-px bg-gray-200 hidden md:block" />
               <div className="flex flex-col items-center gap-2">
                 <span className="text-3xl font-serif text-[#2a1310]">Life-Full</span>
                 <span className="text-[10px] font-bold text-[#787373] uppercase tracking-widest">Guarantee</span>
               </div>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
}
