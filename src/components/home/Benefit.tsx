'use client'

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface Props {
    props?: string;
}

interface BenefitItem {
    title: string;
    description: string;
    imageUrl?: string;
    icon?: string;
}

const benefits: BenefitItem[] = [
    {
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775551233/plier_wjvhxn.png",
        title: "Handmade Jewellery",
        description: "Carefully crafted by skilled artisans."
    },
    {
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775551736/trademarks_vp0mgo.png",
        title: "916 HallMark",
        description: "Certified 916 hallmark gold jewelry."
    },
    {
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775552000/guarantee_gyfiho.png",
        title: "Our Guarantee",
        description: "100% satisfaction guaranteed."
    },
    {
        imageUrl: "https://res.cloudinary.com/dtusyew0a/image/upload/v1775552001/save_lyxeu6.png",
        title: "No GST",
        description: "Shop without additional GST charges."
    }
];

const Benefit: React.FC<Props> = ({ props = '' }) => {
    return (
        <div className={`w-full py-16 bg-[#FBF9F7] relative ${props}`}>
            {/* Elegant Gradient Borders */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 md:w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#E5D5C6]/50 to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 md:w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#E5D5C6]/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Desktop View: Polished Minimalist Grid */}
                <div className="hidden md:grid grid-cols-4 relative">
                    {benefits.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center px-4 md:px-8 relative group cursor-default"
                        >
                            {/* Graceful Gradient Divider between items */}
                            {index !== benefits.length - 1 && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-[#E5D5C6]/80 to-transparent"></div>
                            )}

                            {/* Polished Icon Container */}
                            <div className="w-[72px] h-[72px] rounded-full bg-white border border-[#E5D5C6]/40 shadow-sm flex items-center justify-center mb-5 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-[#E5D5C6] transition-all duration-500">
                                {item.imageUrl ? (
                                    <div className="relative w-9 h-9 transition-transform duration-500 group-hover:scale-110">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <Icon
                                        icon={item.icon!}
                                        width="32"
                                        className="text-[#2D1B1B] transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                            </div>

                            {/* Refined Typography */}
                            <h3 className="text-[#2D1B1B] font-serif text-[19px] mb-2 leading-tight">
                                {item.title}
                            </h3>
                            <p className="text-[#7D6E66] text-sm/relaxed max-w-[200px]">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View: Clean Slider with subtle card boundaries */}
                <div className="md:hidden">
                    <Swiper
                        slidesPerView={1.2}
                        spaceBetween={20}
                        centeredSlides={true}
                        loop={true}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2,
                                centeredSlides: false,
                            }
                        }}
                        modules={[Autoplay]}
                        className="py-4"
                    >
                        {benefits.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="flex flex-col items-center text-center p-6 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(229,213,198,0.15)] border border-[#E5D5C6]/30 mx-1">
                                    <div className="w-16 h-16 flex items-center justify-center bg-[#FBF9F7] rounded-full border border-[#E5D5C6]/40 mb-4 transition-transform duration-500 hover:scale-105">
                                        {item.imageUrl ? (
                                            <div className="relative w-8 h-8">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <Icon
                                                icon={item.icon!}
                                                width="30"
                                                className="text-[#2D1B1B]"
                                            />
                                        )}
                                    </div>
                                    <h3 className="text-[#2D1B1B] font-serif text-lg mb-2 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-[#7D6E66] text-xs leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </div>
    );
};

export default Benefit;