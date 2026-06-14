'use client';

import Image from 'next/image';
import React from "react";
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const cards = [
    {
        title: "Wedding",
        category: "Bridal Collection",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/q_auto/f_auto/v1775491761/download_raxkiy.png",
        className: "md:col-span-2 md:row-span-2",
        delay: 0.1,
    },
    {
        title: "Ear Piercing",
        category: "Special Occasion",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775484661/earring_os5mn0.jpg",
        className: "md:col-span-1 md:row-span-2",
        delay: 0.2,
    },
    {
        title: "Daily Wear",
        category: "Everyday Glow",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775462874/Daily_Wear_r8uu18.jpg",
        className: "md:col-span-1 md:row-span-2",
        delay: 0.3,
    },
    {
        title: "Engagement",
        category: "Timeless Bonds",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775462874/Engagement_zda3ka.jpg",
        className: "md:col-span-1 md:row-span-2",
        delay: 0.4,
    },
    {
        title: "Birthday",
        category: "Vibrant Gifts",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775462876/birthday_znqvd2.png",
        className: "md:col-span-1 md:row-span-2",
        delay: 0.5,
    },
    {
        title: "Traditional Events",
        category: "Timeless Heritage",
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775490166/download_2_-Picsart-AiImageEnhancer_urcosh.jpg",
        className: "md:col-span-2 md:row-span-2",
        delay: 0.6,
    },
];

const Celebration = () => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center py-20 px-4 md:px-12 ">
            {/* Background Texture/Accent */}
            <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E5D5C6]/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-[#E5D5C6]/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header Section - Synced with VideoSlider style */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16 relative z-10"
            >
                <div className="flex flex-col items-center gap-6">
                    <div className="inline-flex flex-col items-center">
                        <div className="bg-[#E5D5C6]/30 px-8 py-3 rounded-full border border-[#E5D5C6]/50 backdrop-blur-sm shadow-sm">
                            <h1 className="italic font-serif normal-case tracking-normal text-3xl text-[#787373]">
                                Celebration Jewellery
                            </h1>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-6">
                            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-[#2D1B1B]/20 to-transparent"></div>
                            <Icon icon="basil:diamond-outline" className="text-[#2D1B1B]/40" width="18" height="18" />
                            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-[#2D1B1B]/20 to-transparent"></div>
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Bento Grid Layout */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: card.delay }}
                        viewport={{ once: true }}
                        className={`${card.className} relative group overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-[#D4B996]/20 transition-all duration-700 cursor-pointer bg-white`}
                    >
                        {/* Image Content */}
                        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#FBF9F7]">
                            <Image
                                src={card.imageUrl}
                                alt={card.title}
                                fill
                                quality={100}
                                className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>

                        {/* Modern Gallery Right-Aligned Design */}
                        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Interactive UI Overlay */}
                        <div className="absolute inset-0 p-4 flex justify-between items-end">
                            {/* Explore Icon - Left Bottom */}
                            <div className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-700 delay-150 backdrop-blur-sm shadow-xl">
                                <Icon icon="lucide:arrow-right" width="18" className="text-white" />
                            </div>

                            {/* Text content - Absolute Bottom Right */}
                            <div className="text-right flex flex-col items-end gap-0 transform translate-y-2 group-hover:translate-y-0 transition-all duration-700 pb-1 pr-2">
                                {/* Category - Minimal Upper Style */}
                                <span className="text-[9px] md:text-[10px] font-bold text-white/60 uppercase tracking-[0.4em] block drop-shadow-sm mb-0">
                                    {card.category}
                                </span>

                                <div className="flex flex-col items-end relative">
                                    {/* Main Title - Elegant Serif touching bottom */}
                                    <h2 className="text-2xl md:text-4xl font-serif text-white leading-none drop-shadow-xl relative z-10 m-0 p-0 transform translate-y-1">
                                        {card.title}
                                    </h2>

                                    {/* Gold Hover Accent Line - Now underneath */}
                                    <div className="w-0 h-[2px] bg-[#E5D5C6] group-hover:w-full transition-all duration-700 delay-100 self-end shadow-[0_0_8px_rgba(229,213,198,0.5)] transform translate-y-0.5" />
                                </div>
                            </div>
                        </div>

                        {/* Invisible Border Glow */}
                        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-[2rem] transition-colors duration-500 pointer-events-none" />
                    </motion.div>
                ))}
            </div>


        </div>
    );
};

export default Celebration;
