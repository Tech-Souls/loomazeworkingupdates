import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function PlatformCategoriesLuxury({ settings, isCustomDomain }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        if (settings) fetchPlatformHomeCategories();
    }, [settings]);

    const fetchPlatformHomeCategories = () => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_HOST}/platform/home/fetch-categories?sellerID=${settings?.sellerID}`)
            .then((res) => {
                if (res.status === 200) setCategories(res.data?.categories);
            })
            .catch((err) => console.error("Frontend GET error", err.message))
            .finally(() => setLoading(false));
    };

    return (
        <section className="section-categories py-14">
            <div className="main-container mx-auto px-4 relative">

                <h2 className="font-bold text-2xl text-center mb-8">Shop by Category</h2>

                {loading && <p className="text-gray-500">Loading...</p>}

                {!loading && categories.length === 0 && (
                    <p className="text-red-500">No category found!</p>
                )}

                {!loading && categories.length > 0 && (
                    <>
                        {categories.length > 4 ? (
                            <div className="relative">
                                {/* LEFT ARROW */}
                                <button
                                    ref={prevRef}
                                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
                                >
                                    <ChevronLeft size={20} className="text-gray-700" />
                                </button>

                                {/* RIGHT ARROW */}
                                <button
                                    ref={nextRef}
                                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
                                >
                                    <ChevronRight size={20} className="text-gray-700" />
                                </button>

                                <Swiper
                                    modules={[Navigation]}
                                    slidesPerView={2}
                                    speed={500}
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
                                    loop={true}
                                    breakpoints={{
                                        1024: { slidesPerView: 5 },
                                        767: { slidesPerView: 4 },
                                        599: { slidesPerView: 3 },
                                    }}
                                >
                                    {categories.map((cat) => (
                                        <SwiperSlide key={cat._id}>
                                            <div className="p-2">
                                                <a
                                                    href={
                                                        isCustomDomain
                                                            ? `/products/${cat.name}`
                                                            : `/brand/${settings?.brandSlug}/products/${cat.name}`
                                                    }
                                                    target="_blank"
                                                    className="block group cursor-pointer"
                                                >
                                                    <div className="w-full aspect-square overflow-hidden">
                                                        <img
                                                            src={`${cat.imageURL}`}
                                                            alt={cat.name}
                                                            loading="lazy"
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:-translate-y-3"
                                                        />
                                                    </div>

                                                    {settings.layout.showCategoriesText && (
                                                        <h3 className="font-bold text-sm p-3 text-center capitalize transition-all duration-300 ease-out group-hover:text-[var(--secondary)] group-hover:border-b-2">
                                                            {cat.name}
                                                        </h3>
                                                    )}
                                                </a>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                        ) : (
                            /* -------- GRID VIEW -------- */
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                {categories.map((cat) => (
                                    <a
                                        key={cat._id}
                                        href={
                                            isCustomDomain
                                                ? `/products/${cat.name}`
                                                : `/brand/${settings?.brandSlug}/products/${cat.name}`
                                        }
                                        target="_blank"
                                        className="block group cursor-pointer"
                                    >
                                        <div className="w-full aspect-square overflow-hidden">
                                            <img
                                                src={`${cat.imageURL}`}
                                                alt={cat.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {settings.layout.showCategoriesText && (
                                            <h3 className="head font-bold p-3 text-center text-[var(--text)] capitalize">
                                                {cat.name}
                                            </h3>
                                        )}
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}