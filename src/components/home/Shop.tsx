'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const categories = [
    {
        title: "Women's",
        subtitle: "Elegance Redefined",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775493365/WomenJew_bl6zza.jpg",
        link: "#",
        delay: 0.1,
    },
    {
        title: "Men's",
        subtitle: "Bold & Classic",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775493365/MenJew_rlelws.webp",
        link: "#",
        delay: 0.2,
    },
    {
        title: "Kid's",
        subtitle: "Little Sparkles",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775494146/Children_in_traditional_Indian_attire_lte4wn.png",
        link: "#",
        delay: 0.3,
    }
];

const Shop = () => {
    return (
        <div className="w-full py-20 relative  overflow-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E5D5C6]/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-[#D4B996]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Premium Consistent Badge Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 relative z-10"
                >
                    <div className="inline-flex flex-col items-center">
                        <div className="bg-[#E5D5C6]/30 px-6 py-2.5 rounded-full border border-[#E5D5C6]/50 backdrop-blur-sm shadow-sm">
                            <h1 className="italic font-serif normal-case tracking-normal text-3xl text-[#787373]">
                                Shop By Gender
                            </h1>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-6">
                            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-[#2D1B1B]/20 to-transparent"></div>
                            <Icon icon="basil:diamond-outline" className="text-[#2D1B1B]/40" width="18" height="18" />
                            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-[#2D1B1B]/20 to-transparent"></div>
                        </div>


                    </div>
                </motion.div>

                {/* 3-Column Luxury Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                    {categories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: category.delay }}
                            viewport={{ once: true }}
                            className="relative group cursor-pointer"
                        >
                            <Link href={category.link as any}>
                                {/* Card Container */}
                                <div className="relative h-[320px] md:h-[380px] lg:h-[420px] w-full rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-[0_15px_35px_rgba(45,27,27,0.08)] transition-all duration-700 bg-[#FBF9F7]">

                                    {/* Cinematic Image Scaling */}
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.title}
                                        fill
                                        quality={100}
                                        className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />

                                    {/* Neater Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

                                    {/* Hover Arrow (Right Bottom) */}
                                    <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                                        <Icon icon="lucide:arrow-right" width="18" />
                                    </div>

                                    {/* Clean Text Box (Bottom Left) */}
                                    <div className="absolute bottom-6 left-6 right-20 flex flex-col justify-end transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="text-white/80 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold block mb-2 drop-shadow-sm">
                                            {category.subtitle}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <h3 className="text-white text-2xl md:text-3xl font-serif leading-none drop-shadow-md">
                                                {category.title}
                                            </h3>
                                        </div>

                                        {/* Minimal Hover Line */}
                                        <div className="w-0 h-[1.5px] bg-[#E5D5C6] group-hover:w-16 transition-all duration-700 delay-100 mt-3 opacity-80" />
                                    </div>

                                    {/* Invisible Border Glow */}
                                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-[2rem] transition-colors duration-500 pointer-events-none" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shop;