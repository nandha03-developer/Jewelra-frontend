import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'sonner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/Drawer';
import RecentlyViewedDrawer from '@/components/product/RecentlyViewedDrawer';
import SplashScreen from '@/components/layout/SplashScreen';
import CompareBar from '@/components/product/CompareBar';
import ScrollToTop from '@/components/layout/ScrollToTop';
import Chatbot from '@/components/chat/Chatbot';
import { getCategories, getSubCategories } from '@/utils/api';

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', weight: ['400', '500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], display: 'swap' });
export const metadata: Metadata = {
  title: 'Jewelra | Exquisite Handmade Luxury Jewellery',
  description: 'Discover Jewelra\'s curated collection of premium handmade jewellery. From elegant gold necklaces to brilliant diamond rings, experience artisan craftsmanship at its finest.',
  keywords: ['jewelra', 'handmade jewellery', 'luxury gold jewellery', 'diamond rings', 'custom jewellery india', 'premium necklaces', 'bridal jewellery'],
  authors: [{ name: 'Jewelra' }],
  creator: 'Jewelra',
  publisher: 'Jewelra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://jewelra.shop'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Jewelra | Premium Handmade Jewellery Store',
    description: 'Explore our exquisite collections of luxury handmade jewellery. Crafted with passion, designed for elegance.',
    url: 'https://jewelra.shop',
    siteName: 'Jewelra',
    images: [
      {
        url: 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775493365/WomenJew_bl6zza.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelra Luxury Jewellery Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jewelra | Premium Handmade Jewellery',
    description: 'Stunning handmade jewellery for every occasion. Discover the Jewelra difference.',
    images: ['https://res.cloudinary.com/dtusyew0a/image/upload/v1775493365/WomenJew_bl6zza.jpg'],
    creator: '@jewelra',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'fashion',
};

export const viewport = {
  themeColor: '#751A20', // Using Jewelra's primary color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import AuthProvider from '@/components/auth/AuthProvider';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const subcategories = await getSubCategories();
  console.log("RootLayout: categories count=", categories?.length, "subcategories count=", subcategories?.length);

  return (
    <html lang="en" className={playfair.className} suppressHydrationWarning>
      <body className={`${inter.className} bg-page text-text`} suppressHydrationWarning>
        <AuthProvider>
          <SplashScreen />
          <div className="min-h-screen bg-page">
            <TopBar />
            <Navbar categories={categories} subcategories={subcategories} />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <RecentlyViewedDrawer />
            <CompareBar />
            <ScrollToTop />
            <Chatbot />
            <Toaster position="top-right" richColors />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
