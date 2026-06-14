'use client';

import { useState, type FormEvent } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import Link from 'next/link';
import { subscribeNewsletter } from '@/utils/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      await subscribeNewsletter(email);
      setEmail('');
      toast.success('Successfully joined our newsletter!', {
        description: 'You will receive our latest updates and offers soon.',
        position: 'top-right'
      });
    } catch (error: any) {
      toast.error(error.message || 'Unable to subscribe, please try again.', {
        position: 'top-right'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const footerSections = [
    {
      title: 'About',
      links: [
        { label: 'About Us', href: '/info/about-us' },
        { label: "FAQ's", href: '/info/faq' },
      ]
    },
    {
      title: 'Jewellery Guide',
      links: [
        { label: 'Jewellery Education', href: '/info/jewellery-education' },
        { label: 'Know Your Gold', href: '/info/know-your-gold' },
        { label: 'Know Your Diamond', href: '/info/know-your-diamond' },
        { label: 'Know Your Gemstone', href: '/info/know-your-gemstone' },
        { label: 'Know Your Silver', href: '/info/know-your-silver' },
        { label: 'Bangle Size Guide', href: '/info/bangle-size-guide' },
        { label: 'Ring Size Guide', href: '/info/ring-size-guide' },
        { label: 'Jewellery Care', href: '/info/jewellery-care' },
      ]
    },
    {
      title: 'Media',
      links: [
        { label: 'Our Blogs', href: '/info/blogs' },
        { label: 'Testimonials', href: '/info/testimonials' },
        { label: 'Video Campaign', href: '/info/video-campaign' },
        { label: 'Investor Relations', href: '/info/investor-relations' },
      ]
    },
    {
      title: 'Policies',
      links: [
        { label: 'Disclaimer', href: '/info/disclaimer' },
        { label: 'Privacy Policy', href: '/info/privacy-policy' },
        { label: 'Shipping Policy', href: '/info/shipping-policy' },
        { label: 'Terms & Conditions', href: '/info/terms-conditions' },
        { label: 'Return & Refund', href: '/info/return-refund' },
        { label: 'Cancellation Policy', href: '/info/cancellation-policy' },
        { label: 'Exchange', href: '/info/exchange' },
        { label: 'Buyback Policy', href: '/info/buyback-policy' },
      ]
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'Track My Order', href: '/services/track-order' },
        { label: 'Scheme Payments', href: '/services/scheme-payments' },
        { label: 'Buy Gift Card', href: '/services/gift-card' },
      ]
    }
  ];

  return (
    <footer className="relative bg-[#fdf6f0] pt-16 pb-0 px-4 sm:px-8 lg:px-12 font-[inter]">
      <div className="mx-auto max-w-[1400px]">
        {/* Top Header Row: Newsletter & Contact */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-gray-200/60">
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-serif text-gray-900">Join Our Newsletter Now!</h3>
            <p className="text-sm text-gray-500">Be the first to know about new designs, events, and more!</p>
          </div>

          <div className="flex-1 max-w-md">
            <form onSubmit={handleSubscribe} className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
                className="w-full h-12 bg-white border border-gray-200 rounded-3xl px-5 pr-12 text-sm outline-none focus:border-[#751A20] transition-colors"
                suppressHydrationWarning
              />
              <button
                type="submit"
                disabled={submitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#751A20] text-white rounded-3xl shadow-sm hover:bg-[#5b1419] hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                suppressHydrationWarning
              >
                {submitting ? (
                  <Icon icon="line-md:loading-twotone-loop" width="18" />
                ) : (
                  <Icon icon="solar:alt-arrow-right-linear" width="20" />
                )}
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#751A20]/5 flex items-center justify-center text-[#751A20]">
                <Icon icon="solar:phone-calling-linear" width="22" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Call Us</p>
                <p className="text-sm font-bold text-gray-800">+91 87549-49307</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#751A20]/5 flex items-center justify-center text-[#751A20]">
                <Icon icon="solar:letter-linear" width="22" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Us</p>
                <p className="text-sm font-bold text-gray-800">jewelra2026@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Body: Multi-column Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(5,1fr),1.4fr] gap-10 pt-12 pb-16">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-base font-serif text-gray-900 border-b border-[#751A20]/10 pb-2 w-fit">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href as any}
                        className="text-[13px] text-gray-500 hover:text-[#751A20] transition-colors relative group w-fit block"
                      >
                        {link.label}
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#751A20] transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}


          {/* Help Desk Column - Modified for centering on mobile */}
          {/* Help Desk Column - Hard alignment fix for Web Left-Align & Mobile Center */}
          <div className="space-y-6 col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
            <h4 className="text-base font-serif text-gray-900 border-b border-[#751A20]/10 pb-2 w-fit">Help Desk</h4>
            <div className="space-y-4 text-[13px] text-gray-600 leading-relaxed w-full flex flex-col items-center md:items-start font-[inter]">
              <p className=" text-center md:text-left"><span className="font-bold text-gray-800">Ph:</span> +91 98949-34429</p>
              <p className="italic text-gray-400 text-center md:text-left">(Mon To Saturday 10Am-7Pm)</p>
              <div className="w-full">
                <p className="flex items-center justify-center md:justify-start flex-wrap gap-1 whitespace-nowrap text-center md:text-left"><span className="font-bold text-gray-800">General:</span> <a href="mailto:jewelra2026@gmail.com" className="text-[#751A20] hover:underline">jewelra2026@gmail.com</a></p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center md:justify-start gap-3 pt-2 w-full">
              <Link href={"/contact" as any} className="px-3 sm:px-5 py-2 sm:py-2.5 bg-[#751A20] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#5b1419] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#751A20]/20 whitespace-nowrap flex-1 xs:flex-none">
                <Icon icon="solar:letter-linear" width="14" />
                Contact us
              </Link>
              <Link href={"/store-locator" as any} className="px-3 sm:px-5 py-2 sm:py-2.5 border border-[#751A20]/20 bg-white text-[#751A20] rounded-lg text-[10px] sm:text-xs font-bold hover:border-[#751A20] hover:bg-[#fcf9f6] transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-1 xs:flex-none">
                <Icon icon="solar:map-point-linear" width="14" />
                Find a Store
              </Link>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
              {[
                { icon: 'logos:facebook', color: 'bg-blue-50' },
                { icon: 'skill-icons:instagram', color: 'bg-pink-50' },
                { icon: 'devicon:twitter', color: 'bg-black' },
                { icon: 'logos:whatsapp-icon', color: 'bg-green-50' }
              ].map((social, i) => (
                <a key={i} href="#" className={`w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform ${social.color} bg-white shadow-sm border border-gray-100`}>
                  <Icon icon={social.icon} width="16" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright & Apps & Payments */}
        <div className="pt-8 border-t border-gray-200/60 flex flex-col items-center justify-center gap-6 pb-8">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:scale-105 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8" />
            </a>
            <a href="#" className="hover:scale-105 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" />
            </a>
          </div>
          
          <p className="text-[12px] text-gray-400 font-medium text-center">
            @Jewelra India Ltd. 2026. All rights reserved
          </p>
        </div>

          {/* <div className="flex items-center gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
            <Icon icon="logos:mastercard" width="30" />
            <Icon icon="logos:visa" width="30" />
            <Icon icon="logos:amex" width="30" />
            <Icon icon="logos:paypal" width="50" />
          </div> */}
        </div>

      {/* Floating Buttons */}
      {/* <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <button className="w-12 h-12 bg-white text-[#751A20] shadow-xl rounded-full flex items-center justify-center border border-[#751A20]/10 hover:scale-110 transition-transform group">
          <Icon icon="solar:alt-arrow-up-linear" width="24" className="group-hover:-translate-y-1 transition-transform" />
        </button>
        <button className="w-12 h-12 bg-[#25D366] text-white shadow-xl rounded-full flex items-center justify-center hover:scale-110 transition-transform">
          <Icon icon="logos:whatsapp-icon" width="24" />
        </button>
      </div> */}
    </footer>
  );
}
