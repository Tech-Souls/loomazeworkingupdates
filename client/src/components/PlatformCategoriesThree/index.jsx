import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PlatformCategoriesThree({ settings, isCustomDomain }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Refs for custom navigation buttons
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        if (settings) fetchPlatformHomeCategories();
    }, [settings]);

    const fetchPlatformHomeCategories = () => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`)
            .then(res => {
                if (res.status === 200) setCategories(res.data?.categories);
            })
            .catch(err => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };

    return (
        <section className="section-categories py-10 sm:py-14">
            <div className="main-container mx-auto px-4 relative">

                <div className="flex justify-center items-center mb-10 gap-4">
                    <h2 className="head font-bold text-xl sm:text-2xl md:text-3xl text-[var(--text)]">
                        SHOP BY CATEGORY
                    </h2>
                </div>

                {/* Custom Arrows */}
                <button
                    ref={prevRef}
                    className="absolute -left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg 
                    w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                    <ChevronLeft className="text-gray-700" size={20} />
                </button>

                <button
                    ref={nextRef}
                    className="absolute -right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg 
                    w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                    <ChevronRight className="text-gray-700" size={20} />
                </button>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }}
                    slidesPerView={2}
                    speed={600}
                    loop={true}
                    breakpoints={{
                        1024: { slidesPerView: 4 },
                        599: { slidesPerView: 3 },
                    }}
                    className="relative"
                >
                    {categories.map(cat => (
                        <SwiperSlide key={cat._id} className="px-2 sm:px-3">
                            <a
                                href={
                                    isCustomDomain
                                        ? `/products/${cat.name}`
                                        : `/brand/${settings?.brandSlug}/products/${cat.name}`
                                }
                                target="_blank"
                                className="block group cursor-pointer"
                            >
                                <div className="w-full aspect-square overflow-hidden rounded-3xl">
                                    <img
                                        src={`${cat.imageURL}`}
                                        alt={cat.name}
                                        loading='lazy'
                                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] 
                                        group-hover:scale-110 rounded-2xl overflow-hidden"
                                    />
                                </div>
                                {settings.layout.showCategoriesText && (
                                    <h3 className="font-bold p-3 text-center text-[var(--text)] capitalize">
                                        {cat.name}
                                    </h3>
                                )}
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}