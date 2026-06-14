'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { type Route } from 'next';

const DiamondHighlight = () => {
    return (
        <section className="w-full pt-12 pb-24 md:pt-16 md:pb-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">

                    {/* Left: Ultra Clean Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
                    >
                        {/* Elegant Pill Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#FBF9F7] px-5 py-2 rounded-full border border-[#E5D5C6]/60 mb-6 shadow-sm">
                            <Icon icon="basil:diamond-outline" className="text-[#D4B996]" width="16" />
                            <span className="text-[#787373] tracking-[0.2em] uppercase text-[10px] font-semibold">
                                High Jewellery
                            </span>
                        </div>

                        <h2 className="text-3xl lg:text-5xl font-serif text-[#2D1B1B] leading-tight mb-4 tracking-wide">
                            Pure Brilliance, <br />
                            <span className="italic text-[#787373]">Simply Elegant.</span>
                        </h2>

                        <p className="text-[#787373] text-sm lg:text-base leading-relaxed font-light mb-8 max-w-md">
                            Experience the true essence of luxury. Our diamond collection is crafted with neat precision, focusing purely on the stone's flawless clarity.
                        </p>

                        <Link href={'/diamonds' as any}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-[#2D1B1B] text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#D4B996] hover:text-white transition-colors duration-300 flex items-center gap-2 shadow-lg"
                                suppressHydrationWarning
                            >
                                Shop Diamonds <Icon icon="lucide:arrow-right" className="text-lg" />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Right: Shorter, Wider Clean Image with Overlap */}
                    <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="relative w-[90%] md:w-[85%] max-w-[450px] h-[300px] md:h-[350px] lg:h-[400px] rounded-[1.5rem] overflow-hidden shadow-[0_15px_40px_rgba(45,27,27,0.08)] z-10 ml-auto"
                        >
                            <Image
                                src="https://res.cloudinary.com/dtusyew0a/image/upload/v1775546263/2102Q-guaranteed-one-gram-micro-gold-plated-ad-marquise-motif-round-stone-jewellery-set-sasitrends-online_cb92ecaf-2532-4d21-9dd6-20f8870b0824-Photoroom_dbbba8.png"
                                alt="Elegant Diamond Necklace"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover hover:scale-105 transition-transform duration-[2s]"
                            />
                        </motion.div>

                        {/* Overlapping Small Image with Animation */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="absolute -bottom-8 md:-bottom-12 left-0 w-[140px] md:w-[180px] lg:w-[220px] aspect-[4/5] md:aspect-square z-20 cursor-pointer"
                        >
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-2xl"
                            >
                                <Image
                                    src="https://res.cloudinary.com/dtusyew0a/image/upload/v1775549513/wmremove-transformed-Picsart-AiImageEnhancer_kcuoev.jpg"
                                    alt="Diamond Detail Image"
                                    fill
                                    sizes="(max-width: 768px) 140px, 220px"
                                    className="object-cover hover:scale-110 transition-transform duration-700"
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DiamondHighlight;
