import { MetadataRoute } from 'next';
import { getCategories, getProducts } from '@/utils/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jewelra.shop';

  // Fetch dynamic data
  const categories = await getCategories();
  const products = await getProducts();

  const categoryUrls = categories.map((cat: any) => ({
    url: `${baseUrl}/shop/${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productUrls = products.slice(0, 100).map((prod: any) => ({
    url: `${baseUrl}/product/${prod._id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    '',
    '/auth/login',
    '/auth/signup',
    '/contact',
    '/faq',
    '/services',
    '/store-locator',
    '/wishlist',
    '/cart',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('monthly' as const),
    priority: route === '' ? 1 : 0.5,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
