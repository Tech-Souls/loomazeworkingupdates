import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from 'axios';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function PlatformCategoriesFashion({ settings, isCustomDomain }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        if (settings) fetchPlatformHomeCategories();
    }, [settings]);

    const fetchPlatformHomeCategories = () => {
        setLoading(true);
        axios.get(
            `${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`
        )
            .then(res => {
                if (res.status === 200) setCategories(res.data?.categories);
            })
            .catch(err => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };

    return (
        <section className="section-categories py-14">
            <div className="main-container mx-auto px-4">
                <h2 className="font-bold text-2xl text-center mb-8">
                    Top Categories
                </h2>

                {loading ? (
                    <p>Loading...</p>
                ) : categories.length > 0 ? (
                    <div className="relative">

                        {/* Custom Prev Button */}
                        <button
                            ref={prevRef}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                            <ChevronLeft className="text-gray-700" size={20} />
                        </button>

                        {/* Custom Next Button */}
                        <button
                            ref={nextRef}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                            <ChevronRight className="text-gray-700" size={20} />
                        </button>

                        <Swiper
                            modules={[Navigation, Autoplay]}
                            slidesPerView={2}
                            autoplay={
                                settings.visibility.autoplayCategories
                                    ? {
                                        delay: settings.visibility.autoplayCategoriesSpeed * 1000,
                                        disableOnInteraction: false,
                                    }
                                    : false
                            }
                            onInit={(swiper) => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                                swiper.navigation.init();
                                swiper.navigation.update();
                            }}
                            loop={true}
                            breakpoints={{
                                1024: { slidesPerView: 4 },
                                599: { slidesPerView: 3 },
                            }}
                        >
                            {categories.map(cat => (
                                <SwiperSlide key={cat._id}>
                                    <div className="px-2 sm:px-3">
                                        <a
                                            href={
                                                isCustomDomain
                                                    ? `/products/${cat.name}`
                                                    : `/brand/${settings?.brandSlug}/products/${cat.name}`
                                            }
                                            target="_blank"
                                            className="flex flex-col md:flex-row group bg-[#f7f7f7] cursor-pointer"
                                        >
                                            <div className="w-full md:w-28 h-[100px] sm:h-[150px] md:h-[100px] overflow-hidden">
                                                <img
                                                    src={`${cat.imageURL}`}
                                                    alt={cat.name}
                                                    loading='lazy'
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {settings.layout.showCategoriesText && (
                                                <p className="flex flex-1 justify-center items-center text-black font-semibold capitalize py-3 sm:py-4 md:py-0">
                                                    {cat.name}
                                                </p>
                                            )}
                                        </a>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    <p>No categories found!</p>
                )}
            </div>
        </section>
    );
}