'use client'

import React from 'react'
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css/bundle';
import { useRouter } from 'next/navigation';
import { type Route } from 'next';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const ShopCategory = () => {
    const router = useRouter()

    const handleCategoryClick = (id: string) => {
        // Map current IDs to their proper shop subcategory slugs
        const slugMap: { [key: string]: string } = {
            'ring': 'rings',
            'chain': 'chains',
            'necklace': 'necklaces',
            'nosepin': 'nose-pins',
            'jhumka': 'jhumkas',
            'bracelet': 'bracelets',
            'pendant': 'pendants',
            'bangle': 'bangles',
            'mangalsutra': 'mangalsutras',
            'kada': 'kadas',
            'engagement': 'engagement-rings'
        };

        const slug = slugMap[id] || id;
        router.push(`/shop/gold-jewellery/${slug}` as Route);
    };

    const categories = [
        { id: 'ring', name: 'Ring', img: 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775540751/Ring_jzub3l.png' },
        { id: 'chain', name: 'Chain', img: 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775543097/Chain-Photoroom_gwydiq.png' },
        { id: 'necklace', name: 'Necklace', img: 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775543811/711gUVvYePL._SY625_-Photoroom_axhjem.png' },
        { id: 'nosepin', name: 'Nose Pin', img: 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775543097/NoisePin-Photoroom_bpevyt.png' },
        { id: 'jhumka', name: 'Jhumka', img: 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775543811/SJ_1111_1-Photoroom_tl0ejr.png' },
        { id: 'bracelet', name: 'Bracelet', img: 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775543097/Braclets-Photoroom_jdgia0.png' },
        { id: 'pendant', name: 'Pendant', img: 'https://res.cloudinary.com/dtusyew0a/image/upload/v1775543811/5g-gold-mangalsutra-pendant-1000x1000-Picsart-AiImageEnhancer-Photoroom_qvnun3.png' },
    ];

    return (
        <div className="w-full relative py-16 md:py-24 overflow-hidden bg-white">

            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#E5D5C6]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-8">

                {/* Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 relative z-10"
                >
                    <div className="inline-flex flex-col items-center">
                        <div className="bg-[#E5D5C6]/30 px-6 py-2.5 rounded-full border border-[#E5D5C6]/50 backdrop-blur-sm shadow-sm">
                            <h1 className="italic font-serif normal-case tracking-normal text-3xl text-[#787373]">
                                Shop By Category
                            </h1>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-6">
                            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-[#2D1B1B]/20 to-transparent"></div>
                            <Icon icon="basil:diamond-outline" className="text-[#2D1B1B]/40" width="18" height="18" />
                            <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-[#2D1B1B]/20 to-transparent"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Swiper Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="relative lg:px-6"
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .shop-category-swiper .swiper-button-next,
                        .shop-category-swiper .swiper-button-prev {
                            color: #2D1B1B;
                            background: rgba(255, 255, 255, 0.9);
                            border: 1px solid #E5D5C6;
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                            transition: all 0.3s ease;
                            opacity: 0;
                            transform: scale(0.9);
                        }
                        .shop-category-swiper:hover .swiper-button-next,
                        .shop-category-swiper:hover .swiper-button-prev {
                            opacity: 1;
                            transform: scale(1);
                        }
                        .shop-category-swiper .swiper-button-next:hover,
                        .shop-category-swiper .swiper-button-prev:hover {
                            background: #E5D5C6;
                            color: white;
                        }
                        .shop-category-swiper .swiper-button-next::after,
                        .shop-category-swiper .swiper-button-prev::after {
                            font-size: 18px;
                            font-weight: bold;
                        }
                    `}} />

                    <Swiper
                        spaceBetween={20}
                        slidesPerView={2.2}
                        navigation={true}
                        loop={false}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        modules={[Navigation, Autoplay]}
                        breakpoints={{
                            576: { slidesPerView: 3.2, spaceBetween: 24 },
                            768: { slidesPerView: 4, spaceBetween: 30 },
                            992: { slidesPerView: 5, spaceBetween: 40 },
                            1290: { slidesPerView: 6, spaceBetween: 40 },
                        }}
                        className='shop-category-swiper !py-8'
                    >
                        {categories.map((cat, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className="flex flex-col items-center justify-center cursor-pointer group"
                                    onClick={() => handleCategoryClick(cat.id)}
                                >
                                    <div className="relative w-[130px] h-[130px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] rounded-full p-2 border-2 border-transparent group-hover:border-[#D4B996] transition-colors duration-500">
                                        <div className="w-full h-full rounded-full overflow-hidden relative bg-[#FBF9F7] shadow-[0_4px_20px_rgba(45,27,27,0.04)] group-hover:shadow-[0_8px_30px_rgba(212,185,150,0.25)] transition-all duration-500">
                                            <Image
                                                src={cat.img}
                                                fill
                                                alt={cat.name}
                                                sizes="(max-width: 768px) 130px, 180px"
                                                priority={index < 4}
                                                className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                                            />
                                            {/* Inner Soft Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </div>

                                        {/* Golden floating icon indicator */}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-[#E5D5C6] shadow-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
                                            <Icon icon="lucide:arrow-right" className="text-[#D4B996] text-sm" />
                                        </div>
                                    </div>

                                    <div className="mt-8 text-center flex flex-col items-center">
                                        <span className="text-[#2D1B1B] font-serif text-lg md:text-xl tracking-wide group-hover:text-[#D4B996] transition-colors duration-300">
                                            {cat.name}
                                        </span>
                                        <div className="w-0 h-[1.5px] bg-[#D4B996] group-hover:w-10 transition-all duration-500 mt-2"></div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </div>
    )
}

export default ShopCategory;